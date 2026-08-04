/**
 * Purpose: Route cho giỏ hàng của khách hàng.
 */
const express = require("express");
const CartController = require("../controllers/cart.controller");
const cartService = require("../../business/services/cart.service");

const {
  authenticateMiddleware,
} = require("../../../../common/middleware/authenticate.middleware");
const router = express.Router();
const controller = new CartController(cartService);

router.get("/", authenticateMiddleware, controller.getItems.bind(controller));
router.post(
  "/items",
  authenticateMiddleware,
  controller.addItem.bind(controller),
);
router.patch(
  "/items/:voucherId",
  authenticateMiddleware,
  controller.updateItem.bind(controller),
);

router.delete(
  "/items",
  authenticateMiddleware,
  controller.removeItems.bind(controller),
);

module.exports = router;
