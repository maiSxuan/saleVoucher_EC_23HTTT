/**
 * Purpose: Route cho thanh toán đơn hàng.
 */
const express = require("express");
const PaymentController = require("../controllers/payment.controller");
const paymentService = require("../../business/services/payment.service");
const {
  authenticateMiddleware,
} = require("../../../../common/middleware/authenticate.middleware");

const router = express.Router();
const controller = new PaymentController(paymentService);

router.post(
  "/vnpay-return",
  authenticateMiddleware,
  controller.vnpayReturn.bind(controller),
);
router.get("/vnpay-ipn", controller.vnpayIpn.bind(controller));
router.post(
  "/paypal-return",
  authenticateMiddleware,
  controller.paypalReturn.bind(controller),
);
module.exports = router;
