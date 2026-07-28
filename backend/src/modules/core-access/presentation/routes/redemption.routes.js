/**
 * Purpose: Route cho xác thực và sử dụng voucher.
 */
const express = require("express");
const RedemptionController = require("../controllers/redemption.controller");
const voucherVerificationService = require("../../business/services/voucher-verification.service");

const router = express.Router();
const controller = new RedemptionController(voucherVerificationService);

router.post("/verify", controller.verify.bind(controller));

module.exports = router;
