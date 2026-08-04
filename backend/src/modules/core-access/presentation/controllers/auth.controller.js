/**
 * Purpose: Controller xử lý các request liên quan đến authentication.
 * Ví dụ: login, register, refresh token, logout.
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
}

module.exports = AuthController;
