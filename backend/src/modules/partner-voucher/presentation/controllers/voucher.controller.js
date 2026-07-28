/**
 * Purpose: Controller cho các thao tác liên quan đến voucher.
 * Ví dụ: tạo voucher, cập nhật voucher, xem danh sách voucher.
 */
class VoucherController {
  constructor(voucherService) {
    this.voucherService = voucherService;
  }

  async list(req, res, next) {
    try {
      const result = await this.voucherService.listVouchers(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VoucherController;
