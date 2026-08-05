/**
 * Purpose: Middleware xác thực JWT token cho mọi route cần bảo vệ.
 * Giải mã token từ header Authorization: Bearer <token>.
 * Gắn req.user = { id, role, email, name, ... } để các middleware/controller sau dùng.
 */
require("dotenv").config();
const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");
const { loadJwt } = require("../../config/environment");

const { secret: JWT_SECRET } = loadJwt();

function authenticateMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new UnauthorizedError(
        "Thiếu hoặc sai định dạng token. Vui lòng đăng nhập.",
      ),
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role, email, name, vai_tro_he_thong, ma_chi_nhanh }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new UnauthorizedError("Token đã hết hạn. Vui lòng đăng nhập lại."),
      );
    }
    return next(new UnauthorizedError("Token không hợp lệ."));
  }
}

module.exports = { authenticateMiddleware };
