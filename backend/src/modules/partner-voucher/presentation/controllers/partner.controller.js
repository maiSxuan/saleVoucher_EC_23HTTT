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

  async checkTaxCode(req, res, next) {
    try {
      const { mst } = req.query;
      await this.partnerService.checkTaxCodeUniqueness(mst);
      res.status(200).json({ success: true, message: "Mã số thuế hợp lệ." });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
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

  async registerAccount(req, res, next) {
    try {
      const result = await this.partnerService.registerAccount(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async requestRegisterOtp(req, res, next) {
    try {
      const result = await this.partnerService.requestRegisterOtp(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async verifyRegisterOtp(req, res, next) {
    try {
      const result = await this.partnerService.verifyRegisterOtp(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async resendRegisterOtp(req, res, next) {
    try {
      const result = await this.partnerService.resendRegisterOtp(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async create(req, res, next) {
    try {
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId;
      const result = await this.partnerService.createPartner(req.body, actorId);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res, next) {
    try {
      const result = await this.partnerService.updatePartner(req.params.id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async approve(req, res, next) {
    try {
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId;
      const result = await this.partnerService.approvePartner(req.params.id, req.body?.reason, actorId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId;
      const result = await this.partnerService.rejectPartner(req.params.id, req.body?.reason, actorId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async lock(req, res, next) {
    try {
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId;
      const isLocking = req.body.isLocking !== undefined ? req.body.isLocking : (req.body.isLocked !== undefined ? req.body.isLocked : true);
      const result = await this.partnerService.lockUnlockPartner(req.params.id, isLocking, req.body?.reason, actorId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async createProfileRequest(req, res, next) {
    try {
      const result = await this.partnerService.createProfileRequest(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getPendingProfileRequest(req, res, next) {
    try {
      const result = await this.partnerService.getPendingProfileRequest(req.params.partnerId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async approveProfileRequest(req, res, next) {
    try {
      const result = await this.partnerService.approveProfileRequest(req.params.reqId, req.body.adminId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async rejectProfileRequest(req, res, next) {
    try {
      const result = await this.partnerService.rejectProfileRequest(req.params.reqId, req.body.reason, req.body.adminId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const result = await this.partnerService.changePassword(req.params.id, oldPassword, newPassword, confirmPassword);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }
}

module.exports = PartnerController;