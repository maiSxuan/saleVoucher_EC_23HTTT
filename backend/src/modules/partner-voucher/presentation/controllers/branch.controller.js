class BranchController {
  constructor(branchService) {
    this.branchService = branchService;
  }

  async getBranchesByPartner(req, res, next) {
    try {
      const data = await this.branchService.getBranchesByPartner(req.params.partnerId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getBranchRequestsByPartner(req, res, next) {
    try {
      const data = await this.branchService.getBranchRequestsByPartner(req.params.partnerId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async createBranchRequest(req, res, next) {
    try {
      const result = await this.branchService.createBranchRequest(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async approveBranchRequest(req, res, next) {
    try {
      const result = await this.branchService.approveBranchRequest(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async rejectBranchRequest(req, res, next) {
    try {
      const result = await this.branchService.rejectBranchRequest(req.params.id, req.body.adminNote);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BranchController;
