/**
 * Purpose: Route cho đặt hàng và xem đơn hàng.
 */
const express = require("express");
const OrderController = require("../controllers/order.controller");
const orderService = require("../../business/services/order.service");
const {
  authenticateMiddleware,
} = require("../../../../common/middleware/authenticate.middleware");

const router = express.Router();
const controller = new OrderController(orderService);

router.post("/", authenticateMiddleware, controller.create.bind(controller));
router.post(
  "/review",
  authenticateMiddleware,
  controller.review.bind(controller),
);

router.post(
  "/:id/cancel",
  authenticateMiddleware,
  controller.cancel.bind(controller),
);

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
