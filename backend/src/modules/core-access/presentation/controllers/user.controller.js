/**
 * Purpose: Controller cho các thao tác liên quan đến người dùng.
 * Ví dụ: lấy thông tin profile, cập nhật user, đổi role.
 */
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async getProfile(req, res, next) {
    try {
      const user = await this.userService.getProfile(req.user.id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
