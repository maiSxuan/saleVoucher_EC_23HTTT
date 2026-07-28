/**
 * Purpose: Service xử lý logic chi nhánh của partner.
 */
class BranchService {
  async listBranches(query) {
    return {
      message: "Branch list placeholder",
      query,
    };
  }
}

module.exports = new BranchService();
