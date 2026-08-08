const voucherRepository = require("../../data/repositories/voucher.repository");
const voucherBranchRepository = require("../../data/repositories/voucher-branch.repository");
const auditLogService = require("../../../core-access/business/services/audit-log.service");

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

  async createVoucher(payload) {
    const voucher = await voucherRepository.create(payload);
    if (payload.ma_chi_nhanh && Array.isArray(payload.ma_chi_nhanh)) {
      await voucherBranchRepository.setBranchesForVoucher(voucher.ma_voucher, payload.ma_chi_nhanh);
    }

    if (payload.trang_thai === "Cho duyet") {
      try {
        await auditLogService.log({
          actorRole: "PARTNER",
          action: "SUBMIT_VOUCHER_REVIEW",
          targetType: "VOUCHER",
          targetId: voucher.ma_voucher,
          after: { ten_voucher: payload.ten_voucher, trang_thai: "Cho duyet" },
          result: "Thanh cong",
          reason: "Tạo mới và gửi chương trình Voucher chờ duyệt",
        });
      } catch (e) {
        console.warn("[VoucherService] Log submitVoucher failed:", e.message);
      }
    }

    return voucher;
  }

  async updateVoucher(id, payload) {
    const updated = await voucherRepository.update(id, payload);
    if (payload.ma_chi_nhanh && Array.isArray(payload.ma_chi_nhanh)) {
      await voucherBranchRepository.setBranchesForVoucher(id, payload.ma_chi_nhanh);
    }

    if (payload.trang_thai === "Cho duyet") {
      try {
        await auditLogService.log({
          actorRole: "PARTNER",
          action: "SUBMIT_VOUCHER_REVIEW",
          targetType: "VOUCHER",
          targetId: id,
          after: { ten_voucher: payload.ten_voucher, trang_thai: "Cho duyet" },
          result: "Thanh cong",
          reason: "Khắc phục/cập nhật thông tin và gửi lại Voucher chờ duyệt",
        });
      } catch (e) {
        console.warn("[VoucherService] Log resubmitVoucher failed:", e.message);
      }
    }

    return updated;
  }

  async submitForReview(id) {
    const res = await voucherRepository.updateStatus(id, "Cho duyet", "Cho duyet");
    try {
      await auditLogService.log({
        actorRole: "PARTNER",
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

  async approveVoucher(id, isHidden = false) {
    const status = isHidden ? "Tam ngung" : "Dang ban";
    const res = await voucherRepository.updateStatus(id, status, "Da duyet");

    try {
      await auditLogService.log(
        {
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

  async rejectVoucher(id, reason = "") {
    const res = await voucherRepository.updateStatus(id, "Tu choi", "Tu choi", reason);

    try {
      await auditLogService.log(
        {
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

  async updateVoucherStatus(id, status) {
    return await voucherRepository.update(id, { trang_thai: status });
  }

  async getCategories() {
    return await voucherRepository.getVoucherCategories();
  }
}

module.exports = new VoucherService();
