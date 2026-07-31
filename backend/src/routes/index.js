const express = require("express");
const router = express.Router();

// Khai báo các module lớn từ server (Đảm bảo không bị lỗi sập server phía dưới)
const contentFeedbackModule = require("../modules/content-feedback");
const coreAccessModule = require("../modules/core-access");
const customerCommerceModule = require("../modules/customer-commerce");

// Khai báo các route lẻ từ nhánh local của bạn
const authRoutes = require("../modules/core-access/presentation/routes/auth.routes");
const partnerRoutes = require("../modules/partner-voucher/presentation/routes/partner.routes");
const branchRoutes = require("../modules/partner-voucher/presentation/routes/branch.routes");
const voucherRoutes = require("../modules/partner-voucher/presentation/routes/voucher.routes");
const staffRoutes = require("../modules/partner-voucher/presentation/routes/staff.routes");

// Register content-feedback module
contentFeedbackModule.registerModule(router);
coreAccessModule.registerModule(router);
customerCommerceModule.registerModule(router);

// Register core-access auth routes
router.use("/auth", authRoutes);
router.use("/api/auth", authRoutes);

// Register partner-voucher routes
router.use("/api/partners", partnerRoutes);
router.use("/api/branches", branchRoutes);
router.use("/api/vouchers", voucherRoutes);
router.use("/api/staffs", staffRoutes);

module.exports = router;
