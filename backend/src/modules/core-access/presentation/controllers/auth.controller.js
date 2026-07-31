/**
 * Controller handling Authentication HTTP requests
 */
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async login(req, res, next) {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || "Đăng nhập thất bại!",
      });
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const result = await this.authService.logout(token);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(200).json({ success: true, message: "Đã đăng xuất" });
    }
  }

  async getMe(req, res, next) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const user = await this.authService.getMe(token);
      res.status(200).json({ success: true, user });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({ success: false, message: error.message });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await this.authService.generateOTP(email);
      res.json({ 
        success: true, 
        message: 'Mã OTP đã được gửi đến email của bạn'
      });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({ success: false, message: error.message });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async loginWithOTP(req, res, next) {
    try {
      const result = await this.authService.loginWithOTP(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({ success: false, message: error.message });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = AuthController;
