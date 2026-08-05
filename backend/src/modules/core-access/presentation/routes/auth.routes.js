/**
 * Purpose: Route cho authentication.
 * Endpoints:
 *  POST /auth/login           → đăng nhập (trả accessToken + refreshToken)
 *  POST /auth/logout          → đăng xuất (revoke refreshToken)
 *  GET  /auth/me              → lấy thông tin phiên hiện tại
 *  POST /auth/refresh         → cấp lại accessToken bằng refreshToken
 *  POST /auth/forgot-password → gửi mã OTP quên mật khẩu
 *  POST /auth/login-with-otp  → đăng nhập bằng OTP
 */
const express = require("express");
const AuthController = require("../controllers/auth.controller");
const authService = require("../../business/services/auth.service");
const { validateLoginRequest } = require("../validators/auth.validator");

const router = express.Router();
const controller = new AuthController(authService);

router.post("/login", validateLoginRequest, controller.login.bind(controller));
router.post("/logout", controller.logout.bind(controller));
router.get("/me", controller.getMe.bind(controller));
router.post("/refresh", controller.refresh.bind(controller));
router.post("/forgot-password", controller.forgotPassword.bind(controller));
router.post("/login-with-otp", controller.loginWithOTP.bind(controller));
router.post("/verify-otp", controller.verifyOtp.bind(controller));
router.post("/reset-password", controller.resetPassword.bind(controller));

module.exports = router;
