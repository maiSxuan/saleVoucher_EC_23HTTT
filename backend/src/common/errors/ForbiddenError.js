/**
 * Purpose: Lỗi dùng khi người dùng không có quyền truy cập tính năng.
 */
const AppError = require("./AppError");

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

module.exports = ForbiddenError;
