/**
 * Purpose: Repository cho mối quan hệ voucher - chi nhánh.
 */
class VoucherBranchRepository {
  async list(query) {
    return { query, data: [] };
  }
}

module.exports = new VoucherBranchRepository();
