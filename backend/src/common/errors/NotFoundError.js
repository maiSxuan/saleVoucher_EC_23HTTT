/**
 * Purpose: Lỗi dùng khi không tìm thấy dữ liệu hoặc tài nguyên.
 */
const AppError = require("./AppError");

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

module.exports = NotFoundError;
