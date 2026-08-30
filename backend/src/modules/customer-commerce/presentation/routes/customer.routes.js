const express = require("express");
const CustomerController = require("../controllers/customer.controller");
const customerService = require("../../business/services/customer.service");
const {
  authenticateMiddleware,
} = require("../../../../common/middleware/authenticate.middleware");
const {
  authorizeMiddleware,
} = require("../../../../common/middleware/authorize.middleware");
const { JWT_ROLES } = require("../../../../common/constants/roles");

const router = express.Router();
const controller = new CustomerController(customerService);

router.post("/register", controller.register.bind(controller));
router.post("/register/verify-otp", controller.verifyOtp.bind(controller));
router.post("/register/resend-otp", controller.resendOtp.bind(controller));

router.get(
  "/profile",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  controller.getProfile.bind(controller),
);
router.patch(
  "/profile",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  controller.updateProfile.bind(controller),
);
router.patch(
  "/profile/password",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  controller.changePassword.bind(controller),
);

module.exports = router;
