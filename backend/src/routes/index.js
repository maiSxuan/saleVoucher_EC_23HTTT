const express = require("express");
const router = express.Router();

const contentFeedbackModule = require("../modules/content-feedback");
const authRoutes = require("../modules/core-access/presentation/routes/auth.routes");
const partnerRoutes = require("../modules/partner-voucher/presentation/routes/partner.routes");
const branchRoutes = require("../modules/partner-voucher/presentation/routes/branch.routes");
const voucherRoutes = require("../modules/partner-voucher/presentation/routes/voucher.routes");
const staffRoutes = require("../modules/partner-voucher/presentation/routes/staff.routes");

// Register content-feedback module
contentFeedbackModule.registerModule(router);

// Register core-access auth routes
router.use("/auth", authRoutes);
router.use("/api/auth", authRoutes);

// Register partner-voucher routes
router.use("/api/partners", partnerRoutes);
router.use("/api/branches", branchRoutes);
router.use("/api/vouchers", voucherRoutes);
router.use("/api/staffs", staffRoutes);

module.exports = router;
