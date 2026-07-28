/**
 * Purpose: Middleware mẫu dùng để kiểm tra phân quyền theo vai trò.
 * Ví dụ: chỉ admin mới được vào một số endpoint.
 */
function authorizeMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    next();
  };
}

module.exports = {
  authorizeMiddleware,
};
