/**
 * FILE: backend/src/modules/core-access/presentation/controllers/admin-dashboard.controller.js
 * PURPOSE: Controller cho Admin Dashboard — trả về chỉ số tổng quan (BR_ADM_06).
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
