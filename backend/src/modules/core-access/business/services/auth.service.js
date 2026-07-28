/**
 * Purpose: Service xử lý logic authentication.
 * Đây là nơi chứa business rule cho login/register/logout.
 */
class AuthService {
  async login(payload) {
    return {
      message: "Login logic placeholder",
      payload,
    };
  }
}

module.exports = new AuthService();
