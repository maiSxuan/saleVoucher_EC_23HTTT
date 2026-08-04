/**
 * Purpose: Lỗi 401 Unauthorized — chưa đăng nhập hoặc token không hợp lệ.
 * Khác với ForbiddenError (403) là đã đăng nhập nhưng không đủ quyền.
 */
const AppError = require('./AppError');

class UnauthorizedError extends AppError {
  constructor(message = 'Bạn cần đăng nhập để thực hiện thao tác này', details = null) {
    super(message, 401, 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
