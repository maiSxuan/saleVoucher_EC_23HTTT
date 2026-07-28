/**
 * Purpose: Controller cho phê duyệt voucher từ admin hoặc staff.
 */
class VoucherApprovalController {
  constructor(voucherApprovalService) {
    this.voucherApprovalService = voucherApprovalService;
  }

  async approve(req, res, next) {
    try {
      const result = await this.voucherApprovalService.approve(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VoucherApprovalController;
