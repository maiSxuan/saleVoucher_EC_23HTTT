/**
 * Purpose: Service xử lý logic người dùng và profile.
 */
class UserService {
  async getProfile(userId) {
    return {
      id: userId,
      role: "customer",
      message: "User profile placeholder",
    };
  }
}

module.exports = new UserService();
