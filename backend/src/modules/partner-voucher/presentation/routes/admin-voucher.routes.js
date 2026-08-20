/**
 * Purpose: Route dành cho admin/staff phê duyệt voucher.
 */
const express = require("express");
const VoucherApprovalController = require("../controllers/voucher-approval.controller");
const voucherApprovalService = require("../../business/services/voucher-approval.service");
const { authenticateMiddleware } = require("../../../../common/middleware/authenticate.middleware");
const { authorizeMiddleware } = require("../../../../common/middleware/authorize.middleware");
const { JWT_ROLES } = require("../../../../common/constants/roles");

const router = express.Router();
const controller = new VoucherApprovalController(voucherApprovalService);

router.post(
  "/vouchers/approve",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION),
  controller.approve.bind(controller),
);

module.exports = router;
