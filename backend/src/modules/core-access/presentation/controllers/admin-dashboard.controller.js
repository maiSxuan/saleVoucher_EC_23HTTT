/**
 * Purpose: Controller cho dashboard quản trị.
 * Dùng để thống kê tổng quan về user, voucher, redemption.
 */
class AdminDashboardController {
  constructor(adminDashboardService) {
    this.adminDashboardService = adminDashboardService;
  }

  async getSummary(req, res, next) {
    try {
      const summary = await this.adminDashboardService.getSummary();
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminDashboardController;
