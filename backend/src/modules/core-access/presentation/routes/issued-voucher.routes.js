/**
 * Purpose: Route cho phát hành voucher.
 */
const express = require("express");
const IssuedVoucherController = require("../controllers/issued-voucher.controller");
const voucherIssuanceService = require("../../business/services/voucher-issuance.service");

const router = express.Router();
const controller = new IssuedVoucherController(voucherIssuanceService);

router.post("/issue", controller.issueVoucher.bind(controller));

module.exports = router;
