class StaffController {
  constructor(staffService) {
    this.staffService = staffService;
  }

  async listByPartner(req, res, next) {
    try {
      const data = await this.staffService.getStaffsByPartner(req.params.partnerId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await this.staffService.createStaff(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await this.staffService.updateStaff(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await this.staffService.deleteStaff(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StaffController;
