/**
 * Model cho bảng VOUCHER_CN (Liên kết N-N giữa Voucher và Chi nhánh)
 * Khớp 1-1 với schema database PostgreSQL trong database/create_tables.sql
 */
class VoucherBranchModel {
  constructor({ ma_voucher, ma_chi_nhanh }) {
    this.ma_voucher = ma_voucher;
    this.ma_chi_nhanh = ma_chi_nhanh;
  }
}

module.exports = VoucherBranchModel;
