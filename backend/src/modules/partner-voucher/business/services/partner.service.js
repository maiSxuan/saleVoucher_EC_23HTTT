const partnerRepository = require("../../data/repositories/partner.repository");
const branchRepository = require("../../data/repositories/branch.repository");
const auditLogService = require("../../../core-access/business/services/audit-log.service");
const { sendOtpEmail } = require("../../../../common/utils/mailer");
const supabase = require("../../../../config/supabase");

const pendingPartnerRegistrations = new Map(); // key: email -> { email, sdt, password, ho_ten, otp, expiresAt, attempts, isVerified }
const OTP_TTL_MS = 5 * 60 * 1000;

function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function uploadBase64ToSupabase(base64String, folder = "licenses") {
  if (
    !base64String ||
    typeof base64String !== "string" ||
    !base64String.startsWith("data:")
  ) {
    return base64String;
  }
  try {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return base64String;

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    let ext = "png";
    if (contentType.includes("jpeg") || contentType.includes("jpg"))
      ext = "jpg";
    else if (contentType.includes("pdf")) ext = "pdf";

    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("partner-documents")
      .upload(fileName, buffer, { contentType, upsert: true });

    if (error) {
      console.warn(
        "[PartnerService] Supabase storage upload warning:",
        error.message,
      );
      return base64String;
    }

    const { data: publicUrlData } = supabase.storage
      .from("partner-documents")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn(
      "[PartnerService] Failed to upload Base64 to Supabase Storage:",
      err.message,
    );
    return base64String;
  }
}

class PartnerService {
  async getPartners(query) {
    // findAll already loads and groups every branch in one bulk query.
    // Returning it directly avoids one extra Supabase request per partner.
    return partnerRepository.findAll(query);
  }

  async getPartnerById(id) {
    const partner = await partnerRepository.findById(id);
    if (!partner) return null;
    const branches = await branchRepository.findByPartnerId(id);
    return { ...partner, branches };
  }

  async registerAccount(payload) {
    return await partnerRepository.createAccount(payload);
  }

  /**
   * Bước 1.1: Yêu cầu gửi mã OTP xác thực tài khoản Đăng ký đối tác
   */
  async requestRegisterOtp({ email, sdt, password, ho_ten }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      const err = new Error("Địa chỉ email không đúng định dạng.");
      err.status = 400;
      throw err;
    }

    if (!password || password.length < 6) {
      const err = new Error("Mật khẩu phải có ít nhất 6 ký tự.");
      err.status = 400;
      throw err;
    }

    // Kiểm tra trùng lặp email/tài khoản trên hệ thống
    const isExisting = await partnerRepository.checkAccountExists(cleanEmail);
    if (isExisting) {
      const err = new Error(
        "Email hoặc tài khoản này đã được đăng ký trên hệ thống.",
      );
      err.status = 409;
      throw err;
    }

    const otp = genOtp();
    pendingPartnerRegistrations.set(cleanEmail, {
      email: cleanEmail,
      sdt: sdt || "",
      password,
      ho_ten: ho_ten || cleanEmail.split("@")[0],
      otp,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
      isVerified: false,
    });

    try {
      await sendOtpEmail(cleanEmail, otp, "register");
    } catch (mailErr) {
      console.warn("[PartnerService] Gửi email OTP thất bại:", mailErr.message);
      pendingPartnerRegistrations.delete(cleanEmail);
      throw mailErr;
    }

    return {
      success: true,
      email: cleanEmail,
      message: "Mã OTP xác thực đã được gửi đến email của bạn.",
      demoOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
    };
  }

  /**
   * Bước 1.2: Xác thực mã OTP tài khoản
   */
  async verifyRegisterOtp({ email, otp }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const pending = pendingPartnerRegistrations.get(cleanEmail);

    if (!pending) {
      const err = new Error(
        "Không tìm thấy yêu cầu đăng ký tài khoản hoặc đã hết hạn.",
      );
      err.status = 400;
      throw err;
    }

    if (Date.now() > pending.expiresAt) {
      pendingPartnerRegistrations.delete(cleanEmail);
      const err = new Error("Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại mã.");
      err.status = 400;
      throw err;
    }

    if ((otp || "").trim() !== pending.otp) {
      pending.attempts += 1;
      if (pending.attempts >= 3) {
        pendingPartnerRegistrations.delete(cleanEmail);
        const err = new Error(
          "Nhập sai quá 3 lần. Vui lòng thực hiện đăng ký lại.",
        );
        err.status = 400;
        throw err;
      }
      const err = new Error(
        `Mã OTP không chính xác (${pending.attempts}/3 lần).`,
      );
      err.status = 400;
      throw err;
    }

    // OTP đúng -> Tạo tài khoản chính thức trong DB
    const userAccount = await partnerRepository.createAccount({
      email: pending.email,
      password: pending.password,
      ho_ten: pending.ho_ten,
      sdt: pending.sdt,
    });

    pendingPartnerRegistrations.delete(cleanEmail);

    // Ghi Audit Log Đăng ký tài khoản (SUC-PAR-01)
    try {
      await auditLogService.log({
        actorId: userAccount?.ma_tk || userAccount?.id,
        actorRole: "PARTNER",
        action: "REGISTER_PARTNER_ACCOUNT",
        targetType: "TAIKHOAN",
        targetId: userAccount?.ma_tk || userAccount?.id,
        after: {
          email: pending.email,
          ho_ten: pending.ho_ten,
          sdt: pending.sdt,
        },
        result: "Thanh cong",
        reason: "Xác thực OTP tạo tài khoản đối tác thành công",
      });
    } catch (e) {
      console.warn(
        "[PartnerService] Log REGISTER_PARTNER_ACCOUNT failed:",
        e.message,
      );
    }

    return {
      success: true,
      isVerified: true,
      message: "Xác thực tài khoản thành công!",
      userAccount,
    };
  }

  /**
   * Bước 1.3: Gửi lại mã OTP
   */
  async resendRegisterOtp({ email }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const pending = pendingPartnerRegistrations.get(cleanEmail);

    if (!pending) {
      const err = new Error(
        "Không tìm thấy thông tin đăng ký. Vui lòng điền lại thông tin tài khoản.",
      );
      err.status = 400;
      throw err;
    }

    const newOtp = genOtp();
    pending.otp = newOtp;
    pending.expiresAt = Date.now() + OTP_TTL_MS;
    pending.attempts = 0;
    pendingPartnerRegistrations.set(cleanEmail, pending);

    try {
      await sendOtpEmail(cleanEmail, newOtp, "register");
    } catch (mailErr) {
      console.warn("[PartnerService] Resend mailer error:", mailErr.message);
    }

    return {
      success: true,
      message: "Đã gửi lại mã OTP thành công!",
      demoOtp: process.env.NODE_ENV !== "production" ? newOtp : undefined,
    };
  }

  async checkTaxCodeUniqueness(mst) {
    return await partnerRepository.checkTaxCodeUniqueness(mst);
  }

  async createPartner(payload, actorId = null) {
    if (
      payload.giay_phep_kinh_doanh &&
      payload.giay_phep_kinh_doanh.startsWith("data:")
    ) {
      payload.giay_phep_kinh_doanh = await uploadBase64ToSupabase(
        payload.giay_phep_kinh_doanh,
        "licenses",
      );
    }
    if (
      payload.logo &&
      typeof payload.logo === "string" &&
      payload.logo.startsWith("data:")
    ) {
      payload.logo = await uploadBase64ToSupabase(payload.logo, "logos");
    }
    const partner = await partnerRepository.create(payload);
    try {
      await auditLogService.log({
        actorId: actorId || partner?.nguoi_dai_dien?.ma_nguoi_dung,
        actorRole: "PARTNER",
        action: "REGISTER_PARTNER_PROFILE",
        targetType: "HOSODN",
        targetId: partner?.ma_hs,
        after: {
          ten_dn: payload.ten_dn,
          ma_so_thue: payload.ma_so_thue,
          trang_thai: "Cho duyet",
        },
        result: "Thanh cong",
        reason: "Đăng ký hồ sơ doanh nghiệp ban đầu ở trạng thái Chờ duyệt",
      });
    } catch (e) {
      console.warn(
        "[PartnerService] Log REGISTER_PARTNER_PROFILE failed:",
        e.message,
      );
    }
    return partner;
  }

  async updatePartner(id, payload) {
    if (
      payload.giay_phep_kinh_doanh &&
      payload.giay_phep_kinh_doanh.startsWith("data:")
    ) {
      payload.giay_phep_kinh_doanh = await uploadBase64ToSupabase(
        payload.giay_phep_kinh_doanh,
        "licenses",
      );
    }
    return await partnerRepository.update(id, payload);
  }

  async approvePartner(id, reason = "", actorId = null) {
    const updated = await partnerRepository.updateStatus(id, "Dang hoat dong");
    const branches = await branchRepository.findByPartnerId(id);
    await Promise.all(
      branches.map((b) =>
        branchRepository.update(b.ma_chi_nhanh, {
          trang_thai: "Dang hoat dong",
        }),
      ),
    );

    // Ghi Audit Log Duyệt hồ sơ đối tác (BR-ADM-02)
    try {
      await auditLogService.log(
        {
          actorId: actorId,
          actorRole: "Admin kiem duyet",
          action: "APPROVE_PARTNER",
          targetType: "HOSODN",
          targetId: id,
          before: { trang_thai: "Cho duyet" },
          after: { trang_thai: "Dang hoat dong" },
          result: "Thanh cong",
          reason:
            reason ||
            "Admin phê duyệt hồ sơ đối tác sang trạng thái Đang hoạt động",
        },
        true,
      );
    } catch (e) {
      console.warn("[PartnerService] Log APPROVE_PARTNER failed:", e.message);
    }

    return updated;
  }

  async rejectPartner(id, reason = "", actorId = null) {
    const updated = await partnerRepository.updateStatus(id, "Tu choi", reason);

    // Ghi Audit Log Từ chối hồ sơ đối tác (BR-ADM-02)
    try {
      await auditLogService.log(
        {
          actorId: actorId,
          actorRole: "Admin kiem duyet",
          action: "REJECT_PARTNER",
          targetType: "HOSODN",
          targetId: id,
          before: { trang_thai: "Cho duyet" },
          after: { trang_thai: "Tu choi", ly_do_tu_choi: reason },
          result: "Thanh cong",
          reason: reason || "Admin từ chối duyệt hồ sơ đối tác",
        },
        true,
      );
    } catch (e) {
      console.warn("[PartnerService] Log REJECT_PARTNER failed:", e.message);
    }

    return updated;
  }

  async lockUnlockPartner(id, isLocking, reason = "", actorId = null) {
    const status = isLocking ? "Tam khoa" : "Dang hoat dong";
    const updated = await partnerRepository.updateStatus(id, status, reason);

    try {
      await auditLogService.log(
        {
          actorId: actorId,
          actorRole: "Admin kiem duyet",
          action: isLocking ? "LOCK_PARTNER" : "UNLOCK_PARTNER",
          targetType: "HOSODN",
          targetId: id,
          after: { trang_thai: status, ly_do_tu_choi: reason },
          result: "Thanh cong",
          reason:
            reason ||
            (isLocking ? "Admin tạm khóa đối tác" : "Admin mở khóa đối tác"),
        },
        true,
      );
    } catch (e) {
      console.warn(
        "[PartnerService] Log LOCK/UNLOCK_PARTNER failed:",
        e.message,
      );
    }

    return updated;
  }

  /**
   * Tạo Yêu cầu Cập nhật Hồ sơ Doanh nghiệp mới trong yeu_cau_cap_nhat_hosodn (SUC-PAR-04)
   */
  async createProfileRequest(payload, actorId = null) {
    const partnerProfileRequestRepo = require("../../data/repositories/partner-profile-request.repository");

    if (
      payload.giay_phep_kinh_doanh_moi &&
      payload.giay_phep_kinh_doanh_moi.startsWith("data:")
    ) {
      try {
        payload.giay_phep_kinh_doanh_moi = await uploadBase64ToSupabase(
          payload.giay_phep_kinh_doanh_moi,
          "licenses",
        );
      } catch (e) {
        console.warn("[PartnerService] Upload license file error:", e.message);
      }
    }

    const rawLogoNew = payload.logo_new || payload.logo_moi || payload.logo;
    if (
      rawLogoNew &&
      typeof rawLogoNew === "string" &&
      rawLogoNew.startsWith("data:")
    ) {
      try {
        payload.logo_new = await uploadBase64ToSupabase(rawLogoNew, "logos");
      } catch (e) {
        console.warn("[PartnerService] Upload logo file error:", e.message);
      }
    }

    const createdReq = await partnerProfileRequestRepo.create(payload);

    // Lấy thông tin đối tác hiện tại để log before/after
    const existingPartner = await partnerRepository.findById(payload.ma_hs);

    try {
      await auditLogService.log({
        actorId: actorId || payload.actorId || payload.ma_hs,
        actorRole: "PARTNER",
        action: "REQUEST_UPDATE_PARTNER_PROFILE",
        targetType: "HOSODN",
        targetId: payload.ma_hs,
        before: existingPartner
          ? {
              ten_dn: existingPartner.ten_dn,
              ma_so_thue: existingPartner.ma_so_thue,
              dia_chi: existingPartner.dia_chi,
              ho_ten_nguoi_dai_dien: existingPartner.nguoi_dai_dien?.ho_ten,
              sdt_nguoi_dai_dien: existingPartner.nguoi_dai_dien?.sdt,
            }
          : null,
        after: {
          ten_dn_moi: payload.ten_dn_moi,
          ma_so_thue_moi: payload.ma_so_thue_moi,
          dia_chi_moi: payload.dia_chi_moi,
          ho_ten_nguoi_dai_dien_moi: payload.ho_ten_nguoi_dai_dien_moi,
          sdt_nguoi_dai_dien_moi: payload.sdt_nguoi_dai_dien_moi,
        },
        result: "Thanh cong",
        reason:
          "Đối tác gửi Yêu cầu cập nhật thông tin hồ sơ doanh nghiệp đang chờ Admin duyệt",
      });
    } catch (e) {
      console.warn(
        "[PartnerService] Log REQUEST_UPDATE_PARTNER_PROFILE failed:",
        e.message,
      );
    }

    return createdReq;
  }

  /**
   * Lấy yêu cầu sửa hồ sơ đang chờ duyệt của đối tác
   */
  async getPendingProfileRequest(partnerId) {
    const partnerProfileRequestRepo = require("../../data/repositories/partner-profile-request.repository");
    return await partnerProfileRequestRepo.findPendingByPartnerId(partnerId);
  }

  /**
   * Admin Phê duyệt Yêu cầu Cập nhật Hồ sơ Doanh nghiệp:
   * Ghi đè thông tin mới vào CSDL gốc (hosodn & nguoidung) và chuyển trang_thai = 'Da duyet'
   */
  async approveProfileRequest(reqId, adminId = null) {
    const partnerProfileRequestRepo = require("../../data/repositories/partner-profile-request.repository");
    const req = await partnerProfileRequestRepo.findById(reqId);
    if (!req) {
      const err = new Error("Không tìm thấy yêu cầu cập nhật hồ sơ");
      err.status = 404;
      throw err;
    }

    if (!["Cho duyet", "Cho xu ly"].includes(req.trang_thai)) {
      const err = new Error("Yêu cầu cập nhật hồ sơ đã được xử lý trước đó");
      err.status = 409;
      throw err;
    }

    // 1. Ghi đè thông tin mới vào bảng gốc hosodn & nguoidung
    const updateHosodnFields = {};
    if (req.ten_dn_moi) updateHosodnFields.ten_dn = req.ten_dn_moi;
    if (req.ma_so_thue_moi) updateHosodnFields.ma_so_thue = req.ma_so_thue_moi;
    if (req.dia_chi_moi) updateHosodnFields.dia_chi = req.dia_chi_moi;
    if (req.giay_phep_kinh_doanh_moi)
      updateHosodnFields.giay_phep_kinh_doanh = req.giay_phep_kinh_doanh_moi;
    if (req.logo_new || req.logo_moi || req.logo)
      updateHosodnFields.logo = req.logo_new || req.logo_moi || req.logo;

    if (
      req.ho_ten_nguoi_dai_dien_moi ||
      req.sdt_nguoi_dai_dien_moi ||
      req.email_nguoi_dai_dien_moi ||
      req.cccd_moi ||
      req.ngay_sinh ||
      req.ngay_sinh_moi ||
      req.gioi_tinh ||
      req.gioi_tinh_moi
    ) {
      updateHosodnFields.nguoi_dai_dien = {
        ho_ten: req.ho_ten_nguoi_dai_dien_moi || undefined,
        sdt: req.sdt_nguoi_dai_dien_moi || undefined,
        email: req.email_nguoi_dai_dien_moi || undefined,
        cccd: req.cccd_moi || undefined,
        ngay_sinh: req.ngay_sinh || req.ngay_sinh_moi || undefined,
        gioi_tinh: req.gioi_tinh || req.gioi_tinh_moi || undefined,
      };
    }

    if (Object.keys(updateHosodnFields).length > 0) {
      await partnerRepository.update(req.ma_hs, updateHosodnFields);
    }

    // 3. Đổi trạng thái yêu cầu thành 'Da duyet'
    const res = await partnerProfileRequestRepo.updateStatus(
      reqId,
      "Da duyet",
      null,
      adminId,
    );

    // Ghi Audit Log Duyệt Yêu cầu Cập nhật Hồ sơ Doanh nghiệp
    try {
      await auditLogService.log({
        actorRole: "Admin kiem duyet",
        actorId: adminId,
        action: "APPROVE_PARTNER_PROFILE_REQUEST",
        targetType: "HOSODN",
        targetId: req.ma_hs,
        after: updateHosodnFields,
        result: "Thanh cong",
        reason: "Admin phê duyệt Yêu cầu cập nhật hồ sơ doanh nghiệp",
      });
    } catch (e) {
      console.warn(
        "[PartnerService] Log APPROVE_PARTNER_PROFILE_REQUEST failed:",
        e.message,
      );
    }

    return res;
  }

  /**
   * Admin Từ chối Yêu cầu Cập nhật Hồ sơ Doanh nghiệp
   */
  async rejectProfileRequest(reqId, reason = "", adminId = null) {
    const partnerProfileRequestRepo = require("../../data/repositories/partner-profile-request.repository");
    const req = await partnerProfileRequestRepo.findById(reqId);
    const res = await partnerProfileRequestRepo.updateStatus(
      reqId,
      "Tu choi",
      reason,
      adminId,
    );

    try {
      await auditLogService.log({
        actorRole: "Admin kiem duyet",
        actorId: adminId,
        action: "REJECT_PARTNER_PROFILE_REQUEST",
        targetType: "HOSODN",
        targetId: req?.ma_hs || reqId,
        after: { trang_thai: "Tu choi", ly_do_tu_choi: reason },
        result: "Thanh cong",
        reason: reason || "Admin từ chối Yêu cầu cập nhật hồ sơ doanh nghiệp",
      });
    } catch (e) {
      console.warn(
        "[PartnerService] Log REJECT_PARTNER_PROFILE_REQUEST failed:",
        e.message,
      );
    }

    return res;
  }

  async changePassword(partnerId, oldPassword, newPassword, confirmPassword) {
    if (!oldPassword) {
      const err = new Error("Vui lòng nhập mật khẩu hiện tại.");
      err.status = 400;
      throw err;
    }
    if (!newPassword || newPassword.length < 6) {
      const err = new Error("Mật khẩu mới phải có ít nhất 6 ký tự.");
      err.status = 400;
      throw err;
    }
    if (newPassword !== confirmPassword) {
      const err = new Error("Mật khẩu xác nhận không trùng khớp.");
      err.status = 400;
      throw err;
    }

    return await partnerRepository.changePassword(
      partnerId,
      oldPassword,
      newPassword,
    );
  }
}

module.exports = new PartnerService();
