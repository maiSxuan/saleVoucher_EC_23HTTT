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
      next(error);
    }
  }
}

module.exports = AuthController;
