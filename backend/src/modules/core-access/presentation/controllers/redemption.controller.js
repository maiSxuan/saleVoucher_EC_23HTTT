/**
 * Purpose: Controller cho luồng xác thực và sử dụng voucher.
 * Thường dùng cho việc check mã voucher trước khi áp dụng.
 */
class RedemptionController {
  constructor(voucherVerificationService) {
    this.voucherVerificationService = voucherVerificationService;
  }

  async verify(req, res, next) {
    try {
      const result = await this.voucherVerificationService.verifyVoucher(
        req.body,
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RedemptionController;
