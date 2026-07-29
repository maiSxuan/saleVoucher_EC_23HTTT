/**
 * Purpose: Lỗi 403 Forbidden — người dùng đã đăng nhập nhưng không đủ quyền.
 */
const AppError = require('./AppError');

class ForbiddenError extends AppError {
  constructor(message = 'Bạn không có quyền thực hiện thao tác này', details = null) {
    super(message, 403, 'ACCESS_FORBIDDEN', details);
    this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
