/**
 * Purpose: Lớp lỗi gốc cho toàn bộ backend.
 * Tất cả lỗi nghiệp vụ nên extend từ class này.
 * errorCode là string định danh loại lỗi (ví dụ: 'AUTH_INVALID_CREDENTIALS').
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    // Capture stack trace đúng cách trong Node.js
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = AppError;
