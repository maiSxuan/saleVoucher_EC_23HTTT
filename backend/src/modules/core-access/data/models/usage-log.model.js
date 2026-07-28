/**
 * Purpose: Model đại diện cho log sử dụng voucher.
 */
class UsageLogModel {
  constructor({ id, issuedVoucherId, action, createdAt }) {
    this.id = id;
    this.issuedVoucherId = issuedVoucherId;
    this.action = action;
    this.createdAt = createdAt;
  }
}

module.exports = UsageLogModel;
