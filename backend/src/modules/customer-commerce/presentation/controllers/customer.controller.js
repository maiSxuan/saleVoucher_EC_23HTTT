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

  async register(req, res) {
    try {
      const result = await this.customerService.register(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (e) {
      res.status(e.status || 400).json({ success: false, message: e.message });
    }
  }

  async verifyOtp(req, res) {
    try {
      const result = await this.customerService.verifyOtp(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (e) {
      res.status(e.status || 400).json({ success: false, message: e.message });
    }
  }

  async resendOtp(req, res) {
    try {
      const result = await this.customerService.resendOtp(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (e) {
      res.status(e.status || 400).json({ success: false, message: e.message });
    }
  }
}

module.exports = CustomerController;
