/**
 * Purpose: Route cho giỏ hàng của khách hàng.
 */
const express = require("express");
const CartController = require("../controllers/cart.controller");
const cartService = require("../../business/services/cart.service");

const {
  authenticateMiddleware,
} = require("../../../../common/middleware/authenticate.middleware");
const {
  authorizeMiddleware,
} = require("../../../../common/middleware/authorize.middleware");
const { JWT_ROLES } = require("../../../../common/constants/roles");

const router = express.Router();
const controller = new CartController(cartService);

router.get(
  "/",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  controller.getItems.bind(controller),
);
router.post(
  "/items",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  controller.addItem.bind(controller),
);
router.patch(
  "/items/:voucherId",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  controller.updateItem.bind(controller),
);

router.delete(
  "/items",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  controller.removeItems.bind(controller),
);

module.exports = router;
