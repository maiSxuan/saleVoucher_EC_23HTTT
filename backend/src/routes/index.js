const express = require("express");
const router = express.Router();

// Khai báo các module lớn từ server
const contentFeedbackModule = require("../modules/content-feedback");
const coreAccessModule = require("../modules/core-access");
const customerCommerceModule = require("../modules/customer-commerce");

// Khai báo các route partner-voucher
const partnerRoutes = require("../modules/partner-voucher/presentation/routes/partner.routes");
const branchRoutes = require("../modules/partner-voucher/presentation/routes/branch.routes");
const voucherRoutes = require("../modules/partner-voucher/presentation/routes/voucher.routes");
const staffRoutes = require("../modules/partner-voucher/presentation/routes/staff.routes");
const partnerReportRoutes = require("../modules/partner-voucher/presentation/routes/partner-report.routes");
const adminPartnerRoutes = require("../modules/partner-voucher/presentation/routes/admin-partner.routes");
const adminVoucherRoutes = require("../modules/partner-voucher/presentation/routes/admin-voucher.routes");

// Register modules
contentFeedbackModule.registerModule(router);
coreAccessModule.registerModule(router);
customerCommerceModule.registerModule(router);

// Register partner-voucher routes (App.js mounts under /api -> /api/partners, etc.)
router.use("/partners", partnerRoutes);
router.use("/branches", branchRoutes);
router.use("/vouchers", voucherRoutes);
router.use("/staffs", staffRoutes);
router.use("/reports", partnerReportRoutes);
router.use("/admin", adminPartnerRoutes);
router.use("/admin", adminVoucherRoutes);

module.exports = router;
