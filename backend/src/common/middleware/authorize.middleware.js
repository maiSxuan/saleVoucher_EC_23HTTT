/**
 * Purpose: Middleware kiểm tra phân quyền theo vai trò (RBAC).
 * Dùng sau authenticateMiddleware — req.user đã được gắn token payload.
 * allowedRoles: danh sách JWT_ROLES được phép truy cập route.
 *
 * Ví dụ dùng trong route:
 *   router.get('/admin/logs', authenticate, authorize('ADMIN'), auditLogController.list)
 */
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');

function authorizeMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Vui lòng đăng nhập để tiếp tục.'));
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Role '${req.user.role}' không có quyền truy cập tài nguyên này.`,
          { requiredRoles: allowedRoles }
        )
      );
    }

    next();
  };
}

module.exports = { authorizeMiddleware };
