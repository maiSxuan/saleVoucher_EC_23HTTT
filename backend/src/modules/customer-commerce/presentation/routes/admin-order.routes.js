/**
 * Purpose: Route cho admin xem và quản lý đơn hàng.
 */
const express = require("express");
const AdminOrderController = require("../controllers/admin-order.controller");
const adminOrderService = require("../../business/services/admin-order.service");

const router = express.Router();
const controller = new AdminOrderController(adminOrderService);

router.get("/admin/orders", controller.list.bind(controller));

module.exports = router;
