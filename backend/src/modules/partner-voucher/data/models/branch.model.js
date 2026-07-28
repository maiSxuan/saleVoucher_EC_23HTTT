/**
 * Purpose: Model mẫu cho chi nhánh.
 */
class BranchModel {
  constructor({ id, partnerId, name }) {
    this.id = id;
    this.partnerId = partnerId;
    this.name = name;
  }
}

module.exports = BranchModel;
