const express = require('express');
const UserController = require('../controllers/user.controller');
const userService = require('../../business/services/user.service');
const { authenticateMiddleware } = require('../../../../common/middleware/authenticate.middleware');
const { authorizeMiddleware } = require('../../../../common/middleware/authorize.middleware');
const { JWT_ROLES } = require('../../../../common/constants/roles');

const router = express.Router();
// Tạo instance controller, inject service (theo pattern đã dùng ở audit-log.routes.js)
const controller = new UserController(userService);

// -----------------------------------------------------------------------
// ADMIN ROUTES — Chỉ ADMIN được phép truy cập
// Middleware chain: authenticate → authorize(ADMIN) → controller
// -----------------------------------------------------------------------

// Lấy danh sách người dùng (có lọc + phân trang)
// GET /admin/users?page=1&limit=20&name=...&role=...&status=...
router.get(
  '/admin/users',
  authenticateMiddleware,                   // Bước 1: Kiểm tra JWT hợp lệ, gắn req.user
  authorizeMiddleware(JWT_ROLES.ADMIN),     // Bước 2: Kiểm tra role phải là ADMIN
  controller.listUsers.bind(controller)     // Bước 3: Gọi controller
);

// Xem chi tiết người dùng theo UUID
// GET /admin/users/:userId
router.get(
  '/admin/users/:userId',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  controller.getUserById.bind(controller)
);

// Khóa tài khoản người dùng
// PATCH /admin/users/:userId/lock    Body: { reason: string }
router.patch(
  '/admin/users/:userId/lock',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  controller.lockUser.bind(controller)
);

// Mở khóa tài khoản người dùng
// PATCH /admin/users/:userId/unlock  Body: { reason: string }
router.patch(
  '/admin/users/:userId/unlock',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  controller.unlockUser.bind(controller)
);

// Cập nhật vai trò người dùng
// PATCH /admin/users/:userId/role    Body: { newRole: string, reason?: string }
router.patch(
  '/admin/users/:userId/role',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  controller.updateUserRole.bind(controller)
);

// Lấy danh sách chi nhánh (phục vụ Combobox Admin và chọn Chi nhánh Đối tác)
router.get(
  '/admin/branches',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN, JWT_ROLES.PARTNER_OWNER, JWT_ROLES.PARTNER_STAFF),
  controller.listBranches.bind(controller)
);
router.get(
  '/branches',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN, JWT_ROLES.PARTNER_OWNER, JWT_ROLES.PARTNER_STAFF),
  controller.listBranches.bind(controller)
);

// Lấy danh sách đối tác (để lấy danh sách combo box)
router.get(
  '/admin/partners',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN, JWT_ROLES.PARTNER_OWNER, JWT_ROLES.PARTNER_STAFF),
  controller.listPartners.bind(controller)
);
router.get(
  '/partners',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN, JWT_ROLES.PARTNER_OWNER, JWT_ROLES.PARTNER_STAFF),
  controller.listPartners.bind(controller)
);

// -----------------------------------------------------------------------
// USER ROUTE — Mọi người dùng đã đăng nhập (bất kể role)
// -----------------------------------------------------------------------

// Xem thông tin profile của chính mình (userId lấy từ JWT token)
// GET /users/profile
router.get(
  '/users/profile',
  authenticateMiddleware,                   // Chỉ cần xác thực, không cần role cụ thể
  controller.getProfile.bind(controller)
);

module.exports = router;
