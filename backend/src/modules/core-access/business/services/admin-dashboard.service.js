/**
 * FILE: backend/src/modules/core-access/business/services/admin-dashboard.service.js
 * PURPOSE: Business logic tổng hợp chỉ số, biểu đồ doanh thu, trạng thái đối tác & hàng đợi công việc (BR_ADM_06).
 */
const dashboardRepository = require('../../data/repositories/dashboard.repository');

const DASHBOARD_CACHE_TTL_MS = 10_000;
let cachedSummary = null;
let cachedSummaryExpiresAt = 0;
let summaryRequest = null;

class AdminDashboardService {
  async getSummary() {
    if (cachedSummary && Date.now() < cachedSummaryExpiresAt) {
      return cachedSummary;
    }

    if (summaryRequest) {
      return summaryRequest;
    }

    summaryRequest = this.buildSummary();
    try {
      const summary = await summaryRequest;
      cachedSummary = summary;
      cachedSummaryExpiresAt = Date.now() + DASHBOARD_CACHE_TTL_MS;
      return summary;
    } finally {
      summaryRequest = null;
    }
  }

  async buildSummary() {
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

      // Đơn hàng có khiếu nại đang chờ/đang xử lý
      complaintOrders: metrics.complaintOrders,

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
        partnerManagement: {
          counts: { pendingPartners: 0, branchChangeRequests: 0, profileChangeRequests: 0, pendingVouchers: 0 },
          pendingPartners: [],
          branchChangeRequests: [],
          profileChangeRequests: [],
          pendingVouchers: [],
        },
        customerRequests: {
          counts: { cancelRequests: 0, complaints: 0, refundOrders: 0, failedGenOrders: 0 },
          cancelRequests: [],
          complaints: [],
          refundOrders: [],
          failedGenOrders: [],
        },
      },

      // Metadata
      generatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new AdminDashboardService();
