/**
 * Purpose: Controller xử lý request liên quan đến partner.
 * Ví dụ: tạo partner, xem thông tin partner, cập nhật hồ sơ.
 */
class PartnerController {
  constructor(partnerService) {
    this.partnerService = partnerService;
  }

  async create(req, res, next) {
    try {
      const result = await this.partnerService.createPartner(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PartnerController;
