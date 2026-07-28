/**
 * Purpose: Repository cho thao tác trên chi nhánh.
 */
class BranchRepository {
  async list(query) {
    return { query, branches: [] };
  }
}

module.exports = new BranchRepository();
