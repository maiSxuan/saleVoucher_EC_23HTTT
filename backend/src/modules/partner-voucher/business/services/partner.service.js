const partnerRepository = require("../../data/repositories/partner.repository");
const branchRepository = require("../../data/repositories/branch.repository");
const { sendOtpEmail } = require("../../../../common/utils/mailer");

const pendingPartnerRegistrations = new Map(); // key: email -> { email, sdt, password, ho_ten, otp, expiresAt, attempts, isVerified }
const OTP_TTL_MS = 5 * 60 * 1000;

function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

class PartnerService {
  async getPartners(query) {
    const partners = await partnerRepository.findAll(query);
    const result = await Promise.all(
      partners.map(async (p) => {
        const branches = await branchRepository.findByPartnerId(p.ma_hs);
        return { ...p, branches };
      })
    );
    return result;
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
      const err = new Error("Email hoặc tài khoản này đã được đăng ký trên hệ thống.");
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
      console.warn("[PartnerService] Direct mailer send failed, OTP available in log/console:", mailErr.message);
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
      const err = new Error("Không tìm thấy yêu cầu đăng ký tài khoản hoặc đã hết hạn.");
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
        const err = new Error("Nhập sai quá 3 lần. Vui lòng thực hiện đăng ký lại.");
        err.status = 400;
        throw err;
      }
      const err = new Error(`Mã OTP không chính xác (${pending.attempts}/3 lần).`);
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
      const err = new Error("Không tìm thấy thông tin đăng ký. Vui lòng điền lại thông tin tài khoản.");
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

  async createPartner(payload) {
    return await partnerRepository.create(payload);
  }

  async updatePartner(id, payload) {
    return await partnerRepository.update(id, payload);
  }

  async approvePartner(id, reason = "") {
    const updated = await partnerRepository.updateStatus(id, "Dang hoat dong");
    const branches = await branchRepository.findByPartnerId(id);
    await Promise.all(
      branches.map((b) => branchRepository.update(b.ma_chi_nhanh, { trang_thai: "Dang hoat dong" }))
    );
    return updated;
  }

  async rejectPartner(id, reason = "") {
    return await partnerRepository.updateStatus(id, "Tu choi", reason);
  }

  async lockUnlockPartner(id, isLocking, reason = "") {
    const status = isLocking ? "Tam khoa" : "Dang hoat dong";
    return await partnerRepository.updateStatus(id, status, reason);
  }

  /**
   * Tạo Yêu cầu Cập nhật Hồ sơ Doanh nghiệp mới trong yeu_cau_cap_nhat_hosodn
   */
  async createProfileRequest(payload) {
    const partnerProfileRequestRepo = require("../../data/repositories/partner-profile-request.repository");
    return await partnerProfileRequestRepo.create(payload);
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

    // 1. Ghi đè thông tin mới vào bảng gốc hosodn
    const updateHosodnFields = {};
    if (req.ten_dn_moi) updateHosodnFields.ten_dn = req.ten_dn_moi;
    if (req.ma_so_thue_moi) updateHosodnFields.ma_so_thue = req.ma_so_thue_moi;
    if (req.dia_chi_moi) updateHosodnFields.dia_chi = req.dia_chi_moi;
    if (req.giay_phep_kinh_doanh_moi) updateHosodnFields.giay_phep_kinh_doanh = req.giay_phep_kinh_doanh_moi;

    if (Object.keys(updateHosodnFields).length > 0) {
      await partnerRepository.update(req.ma_hs, updateHosodnFields);
    }

    // 2. Ghi đè thông tin người đại diện vào bảng nguoidung nếu có
    if (req.ho_ten_nguoi_dai_dien_moi || req.sdt_nguoi_dai_dien_moi || req.email_nguoi_dai_dien_moi || req.cccd_moi) {
      const partner = await partnerRepository.findById(req.ma_hs);
      const userId = req.id_nguoi_dai_dien_moi || partner?.ma_nguoi_dung;

      if (userId) {
        const supabase = require("../../../../config/supabase");
        const updateUserFields = {};
        if (req.ho_ten_nguoi_dai_dien_moi) updateUserFields.ho_ten = req.ho_ten_nguoi_dai_dien_moi;
        if (req.sdt_nguoi_dai_dien_moi) updateUserFields.sdt = req.sdt_nguoi_dai_dien_moi;
        if (req.email_nguoi_dai_dien_moi) updateUserFields.email = req.email_nguoi_dai_dien_moi;
        if (req.cccd_moi) updateUserFields.cccd = req.cccd_moi;

        try {
          await supabase.from("nguoidung").update(updateUserFields).eq("ma_nguoi_dung", userId);
        } catch (e) {
          console.warn("[PartnerService] Update nguoidung error:", e.message);
        }
      }
    }

    // 3. Đổi trạng thái yêu cầu thành 'Da duyet'
    return await partnerProfileRequestRepo.updateStatus(reqId, "Da duyet", null, adminId);
  }

  /**
   * Admin Từ chối Yêu cầu Cập nhật Hồ sơ Doanh nghiệp
   */
  async rejectProfileRequest(reqId, reason = "", adminId = null) {
    const partnerProfileRequestRepo = require("../../data/repositories/partner-profile-request.repository");
    return await partnerProfileRequestRepo.updateStatus(reqId, "Tu choi", reason, adminId);
  }
}

module.exports = new PartnerService();