/**
 * Purpose: Route cho đặt hàng và xem đơn hàng.
 */
const express = require("express");
const OrderController = require("../controllers/order.controller");
const orderService = require("../../business/services/order.service");

const router = express.Router();
const controller = new OrderController(orderService);

router.post("/orders", controller.create.bind(controller));

module.exports = router;
