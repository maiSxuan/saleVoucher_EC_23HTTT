/**
 * Purpose: Repository cho lưu dữ liệu yêu cầu mở chi nhánh.
 */
class BranchRequestRepository {
  async create(payload) {
    return payload;
  }
}

module.exports = new BranchRequestRepository();
