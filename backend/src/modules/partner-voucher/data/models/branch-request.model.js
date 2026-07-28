/**
 * Purpose: Model mẫu cho yêu cầu mở chi nhánh.
 */
class BranchRequestModel {
  constructor({ id, partnerId, status }) {
    this.id = id;
    this.partnerId = partnerId;
    this.status = status;
  }
}

module.exports = BranchRequestModel;
