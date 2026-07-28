/**
 * Purpose: Controller cho việc phát hành voucher cho người dùng hoặc đối tác.
 * Đây là lớp presentation, chỉ nhận request và gọi service.
 */
class IssuedVoucherController {
  constructor(voucherIssuanceService) {
    this.voucherIssuanceService = voucherIssuanceService;
  }

  async issueVoucher(req, res, next) {
    try {
      const result = await this.voucherIssuanceService.issueVoucher(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = IssuedVoucherController;
