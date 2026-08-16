class VoucherController {
  constructor(voucherService) {
    this.voucherService = voucherService;
  }

  async list(req, res, next) {
    try {
      const data = await this.voucherService.getVouchers(req.query);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async listByPartner(req, res, next) {
    try {
      const data = await this.voucherService.getVouchersByPartner(req.params.partnerId, req.query);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await this.voucherService.getVoucherById(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: "Voucher not found" });
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId;
      const actorRole = req.user?.vai_tro_he_thong || req.user?.role || req.user?.vai_tro;
      const result = await this.voucherService.createVoucher(req.body, actorId, actorRole);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId;
      const actorRole = req.user?.vai_tro_he_thong || req.user?.role || req.user?.vai_tro;
      const result = await this.voucherService.updateVoucher(req.params.id, req.body, actorId, actorRole);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async submit(req, res, next) {
    try {
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId;
      const actorRole = req.user?.vai_tro_he_thong || req.user?.role || req.user?.vai_tro;
      const result = await this.voucherService.submitForReview(req.params.id, actorId, actorRole);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId;
      const result = await this.voucherService.approveVoucher(req.params.id, req.body.isHidden, req.body.reason, actorId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId;
      const result = await this.voucherService.rejectVoucher(req.params.id, req.body.reason, actorId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const actorId = req.user?.ma_tk || req.user?.id || req.user?.ma_nguoi_dung || req.body?.actorId;
      const actorRole = req.user?.vai_tro_he_thong || req.user?.role || req.user?.vai_tro;
      const result = await this.voucherService.updateVoucherStatus(req.params.id, req.body.status, actorId, actorRole);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getCate(req, res, next) {
    try {
      const data = await this.voucherService.getCategories();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VoucherController;
