/**
 * Purpose: Entry point của module core-access.
 * Đăng ký toàn bộ routes và export service contracts.
 *
 * Routes được đăng ký:
 *  - POST /auth/login
 *  - GET  /admin/logs     (authenticate + Admin he thong only)
 *  - GET  /admin/dashboard (authenticate + Admin he thong only) — placeholder
 *  - GET  /users/profile  (authenticate)
 *  - POST /vouchers/issue (authenticate) — placeholder
 *  - POST /vouchers/verify (authenticate + partner roles)
 *  - POST /vouchers/redeem (authenticate + partner roles)
 *  - GET  /vouchers/usage-history
 *  - GET  /vouchers/sample-codes
 */
const authRoutes = require("./presentation/routes/auth.routes");
const auditLogRoutes = require("./presentation/routes/audit-log.routes");
const dashboardRoutes = require("./presentation/routes/dashboard.routes");
const userRoutes = require("./presentation/routes/user.routes");
const issuedVoucherRoutes = require("./presentation/routes/issued-voucher.routes");
const redemptionRoutes = require("./presentation/routes/redemption.routes");

// Services (export để module khác dùng theo contract)
const authService = require("./business/services/auth.service");
const userService = require("./business/services/user.service");
const auditLogService = require("./business/services/audit-log.service");
const voucherIssuanceService = require("./business/services/voucher-issuance.service");
const voucherVerificationService = require("./business/services/voucher-verification.service");
const voucherRedemptionService = require("./business/services/voucher-redemption.service");
const adminDashboardService = require("./business/services/admin-dashboard.service");

function registerModule(app) {
  // Auth: POST /auth/login
  app.use("/auth", authRoutes);
  // Admin Logs: GET /admin/logs
  app.use("/", auditLogRoutes);
  // Dashboard: GET /dashboard
  app.use("/", dashboardRoutes);
  // User/Profile: GET /profile
  app.use("/", userRoutes);
  // Redemption: POST /verify, /redeem, GET /usage-history, /sample-codes, /branches
  app.use("/", redemptionRoutes);
  // Issued Voucher: GET /vouchers/my, /order/:orderId, /issued/:issuedId, POST /issue
  app.use("/", issuedVoucherRoutes);
}

module.exports = {
  // Service contracts cho module khác
  authService,
  userService,
  auditLogService,
  voucherIssuanceService,
  voucherVerificationService,
  voucherRedemptionService,
  adminDashboardService,
  registerModule,
};
