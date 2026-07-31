/**
 * Purpose: Route cho authentication.
 * Các endpoint: POST /auth/login, POST /auth/register
 */
const express = require("express");
const AuthController = require("../controllers/auth.controller");
const authService = require("../../business/services/auth.service");

const router = express.Router();
const controller = new AuthController(authService);

router.post("/login", controller.login.bind(controller));
router.post("/forgot-password", controller.forgotPassword.bind(controller));
router.post("/login-with-otp", controller.loginWithOTP.bind(controller));

module.exports = router;
