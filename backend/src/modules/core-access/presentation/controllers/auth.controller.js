/**
 * Controller handling Authentication HTTP requests
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

  async logout(req, res, next) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const result = await this.authService.logout(token);
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
}

module.exports = AuthController;
