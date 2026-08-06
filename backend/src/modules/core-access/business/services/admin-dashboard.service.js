/**
 * FILE: backend/src/modules/core-access/business/services/admin-dashboard.service.js
 * PURPOSE: Business logic tổng hợp chỉ số, biểu đồ doanh thu, trạng thái đối tác & hàng đợi công việc (BR_ADM_06).
 */
const dashboardRepository = require('../../data/repositories/dashboard.repository');

class AdminDashboardService {
  async getSummary() {
    const metrics = await dashboardRepository.getAllMetrics();

    return {
      // Người dùng
      totalUsers: metrics.totalUsers,

      // Đối tác
      activePartners: metrics.activePartners,
      pendingPartners: metrics.pendingPartners,

      // Voucher
      activeVouchers: metrics.activeVouchers,
      pendingVouchers: metrics.pendingVouchers,

      // Đơn hàng chờ xử lí
      pendingOrders: metrics.pendingOrders,

      // Doanh thu (VND)
      totalRevenue: metrics.totalRevenue,

      // Biểu đồ dòng thời gian doanh thu (Ngày / Tháng / Năm)
      revenueTimeline: metrics.revenueTimeline || {
        daily: [],
        monthly: [],
        yearly: [],
      },

      // Phân bố trạng thái đối tác (cho biểu đồ cột nằm ngang)
      partnerDistribution: metrics.partnerDistribution || {
        total: 0,
        items: [],
      },

      // Hàng đợi công việc cần xử lý
      workQueue: metrics.workQueue || {
        totalPending: 0,
        pendingPartners: [],
        pendingBranches: [],
        pendingVouchers: [],
        refundOrders: [],
        failedGenOrders: [],
      },

      // Metadata
      generatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new AdminDashboardService();
