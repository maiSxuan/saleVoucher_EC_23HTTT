/**
 * Purpose: Lớp lỗi chung cho toàn bộ backend.
 * Dùng khi cần trả lỗi có statusCode rõ ràng.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
