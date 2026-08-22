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
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId || req.body?.ma_hs;
      const result = await this.branchService.createBranchRequest(req.body, actorId);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async approveBranchRequest(req, res, next) {
    try {
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId || req.body?.adminId;
      const result = await this.branchService.approveBranchRequest(req.params.id, actorId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async rejectBranchRequest(req, res, next) {
    try {
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId || req.body?.adminId;
      const result = await this.branchService.rejectBranchRequest(req.params.id, req.body.adminNote, actorId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
  async updateBranchStatus(req, res, next) {
    try {
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId || req.body?.adminId;
      const { status } = req.body;
      const result = await this.branchService.updateBranchStatus(req.params.id, status, actorId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BranchController;
