/**
 * FILE: backend/src/modules/core-access/presentation/controllers/admin-dashboard.controller.js
 * PURPOSE: Controller cho Admin Dashboard — trả về chỉ số tổng quan (BR_ADM_06).
 */
const { JWT_ROLES } = require('../../../../common/constants/roles');

function countPendingItems(queueGroup) {
  return Object.values(queueGroup?.counts || {}).reduce(
    (total, count) => total + (Number(count) || 0),
    0
  );
}

function selectSummaryByRole(summary, role) {
  const generatedAt = summary.generatedAt;

  if (role === JWT_ROLES.ADMIN_MODERATION) {
    const partnerManagement = summary.workQueue?.partnerManagement || {};
    return {
      pendingPartners: summary.pendingPartners,
      pendingVouchers: summary.pendingVouchers,
      workQueue: {
        totalPending: countPendingItems(partnerManagement),
        partnerManagement,
      },
      generatedAt,
    };
  }

  if (role === JWT_ROLES.ADMIN_OPERATION) {
    const customerRequests = summary.workQueue?.customerRequests || {};
    return {
      pendingOrders: summary.pendingOrders,
      complaintOrders: summary.complaintOrders,
      workQueue: {
        totalPending: countPendingItems(customerRequests),
        customerRequests,
      },
      generatedAt,
    };
  }

  if (role === JWT_ROLES.ADMIN_SYSTEM) {
    return {
      totalUsers: summary.totalUsers,
      activePartners: summary.activePartners,
      activeVouchers: summary.activeVouchers,
      totalRevenue: summary.totalRevenue,
      revenueTimeline: summary.revenueTimeline,
      partnerDistribution: summary.partnerDistribution,
      generatedAt,
    };
  }

  return { generatedAt };
}

class AdminDashboardController {
  constructor(adminDashboardService) {
    this.adminDashboardService = adminDashboardService;
  }

  async getSummary(req, res, next) {
    try {
      const summary = await this.adminDashboardService.getSummary();
      res.json({
        success: true,
        data: selectSummaryByRole(summary, req.user.role),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminDashboardController;
