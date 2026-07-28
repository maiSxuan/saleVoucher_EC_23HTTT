/**
 * Purpose: Route dành cho admin phê duyệt partner.
 */
const express = require("express");
const PartnerApprovalController = require("../controllers/partner-approval.controller");
const partnerApprovalService = require("../../business/services/partner-approval.service");

const router = express.Router();
const controller = new PartnerApprovalController(partnerApprovalService);

router.post("/partners/approve", controller.approve.bind(controller));

module.exports = router;
