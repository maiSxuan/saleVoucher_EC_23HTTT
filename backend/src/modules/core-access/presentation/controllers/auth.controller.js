/**
 * Purpose: Controller xử lý các request liên quan đến authentication.
 * Ví dụ: login, register, refresh token, logout.
 */
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async login(req, res, next) {
    try {
      const result = await this.authService.login(req.body);
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
