/**
 * Purpose: Controller cho quản lý chi nhánh của partner.
 * Dùng để thêm, sửa hoặc xem thông tin chi nhánh.
 */
class BranchController {
  constructor(branchService) {
    this.branchService = branchService;
  }

  async list(req, res, next) {
    try {
      const result = await this.branchService.listBranches(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BranchController;
