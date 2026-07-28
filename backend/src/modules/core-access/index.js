/**
 * Purpose: Entry point của module core-access.
 * File này tập hợp các service, controller và router của module để các phần khác import dễ dàng.
 */
const authService = require("./business/services/auth.service");
const userService = require("./business/services/user.service");
const voucherIssuanceService = require("./business/services/voucher-issuance.service");
const voucherVerificationService = require("./business/services/voucher-verification.service");
const voucherRedemptionService = require("./business/services/voucher-redemption.service");
const auditLogService = require("./business/services/audit-log.service");
const adminDashboardService = require("./business/services/admin-dashboard.service");
const authRoutes = require("./presentation/routes/auth.routes");

function registerModule(app) {
  app.use("/auth", authRoutes);
}

module.exports = {
  authService,
  userService,
  voucherIssuanceService,
  voucherVerificationService,
  voucherRedemptionService,
  auditLogService,
  adminDashboardService,
  registerModule,
};
