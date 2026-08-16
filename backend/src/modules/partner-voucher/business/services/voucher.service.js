const voucherRepository = require("../../data/repositories/voucher.repository");
const voucherBranchRepository = require("../../data/repositories/voucher-branch.repository");
const auditLogService = require("../../../core-access/business/services/audit-log.service");
const supabase = require("../../../../config/supabase");

async function uploadBase64ToSupabase(base64String, folder = "vouchers") {
  if (!base64String || typeof base64String !== "string" || !base64String.startsWith("data:")) {
    return base64String;
  }
  try {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return base64String;

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    let ext = "png";
    if (contentType.includes("jpeg") || contentType.includes("jpg")) ext = "jpg";

    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("partner-documents")
      .upload(fileName, buffer, { contentType, upsert: true });

    if (error) {
      console.warn("[VoucherService] Supabase storage upload warning:", error.message);
      return base64String;
    }

    const { data: publicUrlData } = supabase.storage
      .from("partner-documents")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn("[VoucherService] Failed to upload Base64 to Supabase Storage:", err.message);
    return base64String;
  }
}

class VoucherService {
  async getVouchers(query) {
    return await voucherRepository.findAll(query);
  }

  async getVouchersByPartner(partnerId, query) {
    return await voucherRepository.findByPartnerId(partnerId, query);
  }

  async getVoucherById(id) {
    return await voucherRepository.findById(id);
  }

  async createVoucher(payload, actorId = null, actorRole = null) {
    if (payload.hinh_anh_url && payload.hinh_anh_url.startsWith("data:")) {
      payload.hinh_anh_url = await uploadBase64ToSupabase(payload.hinh_anh_url, "vouchers");
    }
    const voucher = await voucherRepository.create(payload);
    if (payload.ma_chi_nhanh && Array.isArray(payload.ma_chi_nhanh)) {
      await voucherBranchRepository.setBranchesForVoucher(voucher.ma_voucher, payload.ma_chi_nhanh);
    }

    // Always log voucher creation
    try {
      await auditLogService.log({
        actorId: actorId || payload.actorId || payload.ma_tk || payload.ma_hs,
        actorRole: actorRole || "PARTNER",
        action: payload.trang_thai === "Cho duyet" ? "SUBMIT_VOUCHER_REVIEW" : "CREATE_VOUCHER_DRAFT",
        targetType: "VOUCHER",
        targetId: voucher.ma_voucher,
        after: { ten_voucher: payload.ten_voucher, trang_thai: payload.trang_thai || "Nhap" },
        result: "Thanh cong",
        reason: payload.trang_thai === "Cho duyet" ? "Tạo mới và gửi chương trình Voucher chờ duyệt" : "Tạo mới bản nháp Voucher",
      });
    } catch (e) {
      console.warn("[VoucherService] Log createVoucher failed:", e.message);
    }

    return voucher;
  }

  async updateVoucher(id, payload, actorId = null, actorRole = null) {
    if (payload.hinh_anh_url && payload.hinh_anh_url.startsWith("data:")) {
      payload.hinh_anh_url = await uploadBase64ToSupabase(payload.hinh_anh_url, "vouchers");
    }
    const existing = await voucherRepository.findById(id);
    const updated = await voucherRepository.update(id, payload);
    if (payload.ma_chi_nhanh && Array.isArray(payload.ma_chi_nhanh)) {
      await voucherBranchRepository.setBranchesForVoucher(id, payload.ma_chi_nhanh);
    }

    try {
      const isSubmitReview = payload.trang_thai === "Cho duyet";
      await auditLogService.log({
        actorId: actorId || payload.actorId || payload.ma_tk || payload.ma_hs || id,
        actorRole: actorRole || "PARTNER",
        action: isSubmitReview ? "SUBMIT_VOUCHER_REVIEW" : "UPDATE_VOUCHER",
        targetType: "VOUCHER",
        targetId: id,
        before: existing ? { ten_voucher: existing.ten_voucher, trang_thai: existing.trang_thai } : null,
        after: { ten_voucher: payload.ten_voucher || existing?.ten_voucher, trang_thai: payload.trang_thai || existing?.trang_thai },
        result: "Thanh cong",
        reason: isSubmitReview
          ? "Khắc phục/cập nhật thông tin và gửi lại Voucher chờ duyệt"
          : "Cập nhật thông tin chi tiết chương trình Voucher",
      });
    } catch (e) {
      console.warn("[VoucherService] Log updateVoucher failed:", e.message);
    }

    return updated;
  }

  async submitForReview(id, actorId = null, actorRole = null) {
    const res = await voucherRepository.updateStatus(id, "Cho duyet", "Cho duyet");
    try {
      await auditLogService.log({
        actorId: actorId || id,
        actorRole: actorRole || "PARTNER",
        action: "SUBMIT_VOUCHER_REVIEW",
        targetType: "VOUCHER",
        targetId: id,
        before: { trang_thai: "Nhap" },
        after: { trang_thai: "Cho duyet" },
        result: "Thanh cong",
        reason: "Gửi Voucher từ bản Nháp sang trạng thái Chờ duyệt",
      });
    } catch (e) {
      console.warn("[VoucherService] Log submitForReview failed:", e.message);
    }
    return res;
  }

  async approveVoucher(id, isHidden = false, reason = "", actorId = null) {
    const status = isHidden ? "Tam ngung" : "Dang ban";
    const res = await voucherRepository.updateStatus(id, status, "Da duyet");

    try {
      await auditLogService.log(
        {
          actorId: actorId,
          actorRole: "ADMIN",
          action: "APPROVE_VOUCHER",
          targetType: "VOUCHER",
          targetId: id,
          before: { trang_thai: "Cho duyet" },
          after: { trang_thai: status, trang_thai_kiem_duyet: "Da duyet" },
          result: "Thanh cong",
          reason: isHidden ? "Admin phê duyệt Voucher (Tạm ẩn công bố)" : "Admin phê duyệt Voucher mở bán chính thức",
        },
        true
      );
    } catch (e) {
      console.warn("[VoucherService] Log approveVoucher failed:", e.message);
    }

    return res;
  }

  async rejectVoucher(id, reason = "", actorId = null) {
    const res = await voucherRepository.updateStatus(id, "Tu choi", "Tu choi", reason);

    try {
      await auditLogService.log(
        {
          actorId: actorId,
          actorRole: "ADMIN",
          action: "REJECT_VOUCHER",
          targetType: "VOUCHER",
          targetId: id,
          before: { trang_thai: "Cho duyet" },
          after: { trang_thai: "Tu choi", ly_do_tu_choi: reason },
          result: "Thanh cong",
          reason: reason || "Admin từ chối phê duyệt Voucher",
        },
        true
      );
    } catch (e) {
      console.warn("[VoucherService] Log rejectVoucher failed:", e.message);
    }

    return res;
  }

  async updateVoucherStatus(id, status, actorId = null, actorRole = null) {
    const existing = await voucherRepository.findById(id);
    const updated = await voucherRepository.update(id, { trang_thai: status });
    try {
      await auditLogService.log({
        actorId: actorId || id,
        actorRole: actorRole || "PARTNER",
        action: status === "Tam ngung" ? "PAUSE_VOUCHER" : "RESUME_VOUCHER",
        targetType: "VOUCHER",
        targetId: id,
        before: existing ? { trang_thai: existing.trang_thai } : null,
        after: { trang_thai: status },
        result: "Thanh cong",
        reason: `Cập nhật trạng thái voucher sang ${status}`,
      });
    } catch (e) {
      console.warn("[VoucherService] Log updateVoucherStatus failed:", e.message);
    }
    return updated;
  }

  async getCategories() {
    return await voucherRepository.getVoucherCategories();
  }
}

module.exports = new VoucherService();
