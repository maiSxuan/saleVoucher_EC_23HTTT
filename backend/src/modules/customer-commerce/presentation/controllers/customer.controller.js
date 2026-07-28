/**
 * Purpose: Controller cho các request liên quan đến khách hàng.
 * Ví dụ: xem profile, cập nhật thông tin, xem lịch sử giao dịch.
 */
class CustomerController {
  constructor(customerService) {
    this.customerService = customerService;
  }

  async getProfile(req, res, next) {
    try {
      const result = await this.customerService.getProfile(req.user?.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CustomerController;
