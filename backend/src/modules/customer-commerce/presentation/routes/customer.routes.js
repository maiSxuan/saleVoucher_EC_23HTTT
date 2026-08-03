/**
 * Purpose: Route cho khách hàng xem profile và thông tin cá nhân.
 */
const express = require("express");
const CustomerController = require("../controllers/customer.controller");
const customerService = require("../../business/services/customer.service");

const router = express.Router();
const controller = new CustomerController(customerService);

// router.get("/profile", controller.getProfile.bind(controller));
router.post("/register", controller.register.bind(controller));
router.post("/register/verify-otp", controller.verifyOtp.bind(controller));
router.post("/register/resend-otp", controller.resendOtp.bind(controller));

module.exports = router;
