/**
 * Purpose: Middleware mẫu dùng để xác thực người dùng trước khi truy cập API.
 * Trong giai đoạn đầu, file này chỉ gắn user demo để các module khác có thể dùng ngay.
 */
function authenticateMiddleware(req, res, next) {
  req.user = req.user || { id: "demo-user", role: "customer" };
  next();
}

module.exports = {
  authenticateMiddleware,
};
