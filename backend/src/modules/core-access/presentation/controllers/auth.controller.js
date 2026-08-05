/**
 * Controller handling Authentication HTTP requests
 *
 * Endpoints:
 *  POST /auth/login           → login (trả accessToken + refreshToken)
 *  POST /auth/logout          → logout (revoke refreshToken)
 *  GET  /auth/me              → lấy thông tin phiên hiện tại
 *  POST /auth/refresh         → dùng refreshToken → cấp accessToken mới
 *  POST /auth/forgot-password → gửi OTP qua email
 *  POST /auth/login-with-otp  → đăng nhập bằng OTP
 *  POST /auth/verify-otp      → kiểm tra OTP hợp lệ (UC-BUS-05 Bước 11)
 *  POST /auth/reset-password  → đặt lại mật khẩu (UC-BUS-05 Bước 15-16)
 */
const { successResponse } = require('../../../../common/utils/response');

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async login(req, res, next) {
    try {
      const result = await this.authService.login(req.body);
      return successResponse(res, result, 'Đăng nhập thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/refresh
   * Body: { refreshToken: string }
   * Response: { accessToken, refreshToken }
   */
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshAccessToken(refreshToken);
      return successResponse(res, result, 'Cấp lại Access Token thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/logout
   * Body: { refreshToken: string } (tùy chọn)
   */
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body || {};
      const result = await this.authService.logout(refreshToken);
      return successResponse(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const user = await this.authService.getMe(token);
      return successResponse(res, user, 'Lấy thông tin phiên đăng nhập thành công');
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await this.authService.generateOTP(email);
      return successResponse(res, null, 'Mã OTP đã được gửi đến email của bạn');
    } catch (error) {
      next(error);
    }
  }

  async loginWithOTP(req, res, next) {
    try {
      const result = await this.authService.loginWithOTP(req.body);
      return successResponse(res, result, 'Đăng nhập bằng OTP thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/verify-otp
   * UC-BUS-05 Bước 11 / A11: Kiểm tra OTP hợp lệ mà không xóa.
   * Body: { email, otp }
   */
  verifyOtp(req, res, next) {
    try {
      const result = this.authService.verifyOtp(req.body);
      return successResponse(res, result, 'Mã OTP hợp lệ');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/reset-password
   * UC-BUS-05 Bước 15-16: Đặt lại mật khẩu sau khi OTP đã xác thực.
   * Body: { email, otp, newPassword, confirmPassword }
   */
  async resetPassword(req, res, next) {
    try {
      const result = await this.authService.resetPassword(req.body);
      return successResponse(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
