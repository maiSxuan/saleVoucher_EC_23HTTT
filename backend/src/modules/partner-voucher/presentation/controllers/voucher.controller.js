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
      const result = await this.voucherService.createVoucher(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await this.voucherService.updateVoucher(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async submit(req, res, next) {
    try {
      const result = await this.voucherService.submitForReview(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      const result = await this.voucherService.approveVoucher(req.params.id, req.body.isHidden);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const result = await this.voucherService.rejectVoucher(req.params.id, req.body.reason);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const result = await this.voucherService.updateVoucherStatus(req.params.id, req.body.status);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VoucherController;
