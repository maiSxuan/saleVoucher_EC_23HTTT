class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // -----------------------------------------------------------------------
  // GET /admin/users — Lấy danh sách người dùng (Admin only)
  // Query params: page, limit, search (tên hoặc email), role, status
  // -----------------------------------------------------------------------
  async listUsers(req, res, next) {
    try {
      // Đọc query params từ URL: ?page=1&limit=20&search=nguyen&role=Khach+hang
      const { page, limit, search, role, status } = req.query;

      // Gọi service — service sẽ query Supabase và áp dụng bộ lọc
      const result = await this.userService.listUsers({ page, limit, search, role, status });

      // Trả về response chuẩn: success + data + pagination
      res.json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      // Chuyển lỗi cho error middleware xử lý (error.middleware.js)
      next(error);
    }
  }

  // -----------------------------------------------------------------------
  // GET /admin/users/:userId — Xem chi tiết người dùng (Admin only)
  // -----------------------------------------------------------------------
  async getUserById(req, res, next) {
    try {
      // Lấy userId từ URL params: /admin/users/:userId
      const { userId } = req.params;

      const user = await this.userService.getUserById(userId);

      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  // -----------------------------------------------------------------------
  // PATCH /admin/users/:userId/lock — Khóa tài khoản (Admin only)
  // Body: { reason: string }
  // -----------------------------------------------------------------------
  async lockUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { reason } = req.body;

      // req.user.id = UUID của admin đang thực hiện (từ JWT token)
      // KHÔNG lấy actorId từ body vì không được tin client truyền vào (skills.md §8.2)
      const actorId = req.user.id;
      const actorAccountId = req.user.accountId;
      const actorRole = req.user.role;

      const updated = await this.userService.lockUser({
        actorId,      // Ai đang thực hiện (từ token)
        actorAccountId,
        actorRole,    // Role của người thực hiện (từ token)
        targetUserId: userId,  // Ai Tạm khóa (từ URL)
        reason,
      });

      res.json({ success: true, message: 'Khóa tài khoản thành công', data: updated });
    } catch (error) {
      next(error);
    }
  }

  // -----------------------------------------------------------------------
  // PATCH /admin/users/:userId/unlock — Mở khóa tài khoản (Admin only)
  // Body: { reason: string }
  // -----------------------------------------------------------------------
  async unlockUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { reason } = req.body;

      const actorId = req.user.id;
      const actorAccountId = req.user.accountId;
      const actorRole = req.user.role;

      const updated = await this.userService.unlockUser({
        actorId,
        actorAccountId,
        actorRole,
        targetUserId: userId,
        reason,
      });

      res.json({ success: true, message: 'Mở khóa tài khoản thành công', data: updated });
    } catch (error) {
      next(error);
    }
  }

  // -----------------------------------------------------------------------
  // PATCH /admin/users/:userId/role — Cập nhật vai trò (Admin only)
  // Body: { newRole: string, reason?: string }
  // newRole phải là giá trị DB hợp lệ: 'Admin', 'Khach hang', 'Nguoi dai dien', ...
  // -----------------------------------------------------------------------
  async updateUserRole(req, res, next) {
    try {
      const { userId } = req.params;
      const { newRole, maChiNhanh, maHsdn, reason } = req.body;

      const actorId = req.user.id;
      const actorAccountId = req.user.accountId;
      const actorRole = req.user.role;

      const updated = await this.userService.updateUserRole({
        actorId,
        actorAccountId,
        actorRole,
        targetUserId: userId,
        newRole,
        maChiNhanh,
        maHsdn,
        reason,
      });

      res.json({ success: true, message: 'Cập nhật vai trò thành công', data: updated });
    } catch (error) {
      next(error);
    }
  }

  // -----------------------------------------------------------------------
  // GET /users/profile — Xem thông tin của chính mình (mọi role đã đăng nhập)
  // -----------------------------------------------------------------------
  async getProfile(req, res, next) {
    try {
      // req.user.id được lấy từ JWT token — không cần params
      const user = await this.userService.getProfile(req.user.id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  // -----------------------------------------------------------------------
  // 7. LẤY DANH SÁCH CHI NHÁNH VÀ ĐỐI TÁC CHO COMBOBOX
  // -----------------------------------------------------------------------
  async listBranches(req, res, next) {
    try {
      const branches = await this.userService.listBranches({
        maHsdn: req.query.maHsdn || undefined,
        includeInactive: false,
      });
      res.status(200).json({ success: true, data: branches, message: 'Lấy danh sách chi nhánh thành công' });
    } catch (error) {
      next(error);
    }
  }

  async listPartners(req, res, next) {
    try {
      const partners = await this.userService.listPartners({ includeInactive: false });
      res.status(200).json({ success: true, data: partners, message: 'Lấy danh sách đối tác thành công' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
