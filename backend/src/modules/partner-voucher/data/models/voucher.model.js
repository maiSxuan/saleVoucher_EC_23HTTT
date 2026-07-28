/**
 * Purpose: Model mẫu cho voucher do partner tạo.
 */
class VoucherModel {
  constructor({ id, partnerId, code, status }) {
    this.id = id;
    this.partnerId = partnerId;
    this.code = code;
    this.status = status;
  }
}

module.exports = VoucherModel;
