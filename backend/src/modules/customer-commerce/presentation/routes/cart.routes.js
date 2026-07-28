/**
 * Purpose: Route cho giỏ hàng của khách hàng.
 */
const express = require("express");
const CartController = require("../controllers/cart.controller");
const cartService = require("../../business/services/cart.service");

const router = express.Router();
const controller = new CartController(cartService);

router.get("/cart", controller.getCart.bind(controller));

module.exports = router;
