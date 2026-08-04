class PartnerController {
  constructor(partnerService) {
    this.partnerService = partnerService;
  }

  async list(req, res, next) {
    try {
      const data = await this.partnerService.getPartners(req.query);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await this.partnerService.getPartnerById(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: "Partner not found" });
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await this.partnerService.createPartner(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await this.partnerService.updatePartner(req.params.id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      const result = await this.partnerService.approvePartner(req.params.id, req.body.reason);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const result = await this.partnerService.rejectPartner(req.params.id, req.body.reason);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async lock(req, res, next) {
    try {
      const result = await this.partnerService.lockUnlockPartner(req.params.id, req.body.isLocking, req.body.reason);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PartnerController;
