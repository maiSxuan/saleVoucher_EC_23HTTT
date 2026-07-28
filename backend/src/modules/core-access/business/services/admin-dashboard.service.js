/**
 * Purpose: Service cung cấp dữ liệu thống kê cho dashboard admin.
 */
class AdminDashboardService {
  async getSummary() {
    return {
      totalUsers: 0,
      totalIssuedVouchers: 0,
      totalRedemptions: 0,
      message: "Admin dashboard placeholder",
    };
  }
}

module.exports = new AdminDashboardService();
