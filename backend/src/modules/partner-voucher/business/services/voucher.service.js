const voucherRepository = require("../../data/repositories/voucher.repository");
const voucherBranchRepository = require("../../data/repositories/voucher-branch.repository");

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
    return voucher;
  }

  async updateVoucher(id, payload) {
    const updated = await voucherRepository.update(id, payload);
    if (payload.ma_chi_nhanh && Array.isArray(payload.ma_chi_nhanh)) {
      await voucherBranchRepository.setBranchesForVoucher(id, payload.ma_chi_nhanh);
    }
    return updated;
  }

  async submitForReview(id) {
    return await voucherRepository.updateStatus(id, "Cho duyet", "Cho duyet");
  }

  async approveVoucher(id, isHidden = false) {
    const status = isHidden ? "Tam ngung" : "Dang ban";
    return await voucherRepository.updateStatus(id, status, "Da duyet");
  }

  async rejectVoucher(id, reason = "") {
    return await voucherRepository.updateStatus(id, "Tu choi", "Tu choi", reason);
  }

  async updateVoucherStatus(id, status) {
    return await voucherRepository.update(id, { trang_thai: status });
  }
}

module.exports = new VoucherService();
