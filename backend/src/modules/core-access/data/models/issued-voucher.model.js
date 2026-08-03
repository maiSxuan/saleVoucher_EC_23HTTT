/**
 * Purpose: Model đại diện cho voucher đã được phát hành.
 */
class IssuedVoucherModel {
  constructor({ id, voucherId, userId, status }) {
    this.id = id;
    this.voucherId = voucherId;
    this.userId = userId;
    this.status = status;
  }
}

module.exports = IssuedVoucherModel;
