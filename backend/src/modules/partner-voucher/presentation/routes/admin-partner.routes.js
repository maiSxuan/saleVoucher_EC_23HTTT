/**
 * Purpose: Route dành cho admin phê duyệt partner.
 */
const express = require("express");
const PartnerApprovalController = require("../controllers/partner-approval.controller");
const partnerApprovalService = require("../../business/services/partner-approval.service");
const { authenticateMiddleware } = require("../../../../common/middleware/authenticate.middleware");
const { authorizeMiddleware } = require("../../../../common/middleware/authorize.middleware");
const { JWT_ROLES } = require("../../../../common/constants/roles");

const router = express.Router();
const controller = new PartnerApprovalController(partnerApprovalService);

router.post(
  "/partners/approve",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION),
  controller.approve.bind(controller),
);

module.exports = router;
