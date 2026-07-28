/**
 * Purpose: Route cho partner quản lý voucher.
 */
const express = require("express");
const VoucherController = require("../controllers/voucher.controller");
const voucherService = require("../../business/services/voucher.service");

const router = express.Router();
const controller = new VoucherController(voucherService);

router.get("/vouchers", controller.list.bind(controller));

module.exports = router;
