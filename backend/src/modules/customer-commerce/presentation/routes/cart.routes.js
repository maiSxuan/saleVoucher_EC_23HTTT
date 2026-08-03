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

router.get("/", controller.getCart.bind(controller));
router.post(
  "/items",
  authenticateMiddleware,
  controller.addItem.bind(controller),
);
module.exports = router;
