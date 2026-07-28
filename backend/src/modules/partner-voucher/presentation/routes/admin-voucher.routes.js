/**
 * Purpose: Route dành cho admin/staff phê duyệt voucher.
 */
const express = require("express");
const VoucherApprovalController = require("../controllers/voucher-approval.controller");
const voucherApprovalService = require("../../business/services/voucher-approval.service");

const router = express.Router();
const controller = new VoucherApprovalController(voucherApprovalService);

router.post("/vouchers/approve", controller.approve.bind(controller));

module.exports = router;
