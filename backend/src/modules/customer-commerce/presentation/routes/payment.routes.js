/**
 * Purpose: Route cho thanh toán đơn hàng.
 */
const express = require("express");
const PaymentController = require("../controllers/payment.controller");
const paymentService = require("../../business/services/payment.service");

const router = express.Router();
const controller = new PaymentController(paymentService);

router.post("/payments", controller.pay.bind(controller));

module.exports = router;
