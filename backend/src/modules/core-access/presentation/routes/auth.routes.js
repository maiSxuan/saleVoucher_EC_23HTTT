/**
 * Purpose: Route cho authentication.
 * Các endpoint: POST /auth/login, /auth/forgot-password, /auth/login-with-otp
 */
const express = require("express");
const AuthController = require("../controllers/auth.controller");
const authService = require("../../business/services/auth.service");
const { validateLoginRequest } = require("../validators/auth.validator");

const router = express.Router();
const controller = new AuthController(authService);

router.post("/login", validateLoginRequest, controller.login.bind(controller));
router.post("/forgot-password", controller.forgotPassword.bind(controller));
router.post("/login-with-otp", controller.loginWithOTP.bind(controller));

module.exports = router;
