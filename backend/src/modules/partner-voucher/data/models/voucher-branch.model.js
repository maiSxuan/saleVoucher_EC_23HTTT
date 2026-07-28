/**
 * Purpose: Model mẫu cho mối quan hệ voucher và chi nhánh.
 */
class VoucherBranchModel {
  constructor({ id, voucherId, branchId }) {
    this.id = id;
    this.voucherId = voucherId;
    this.branchId = branchId;
  }
}

module.exports = VoucherBranchModel;
