/**
 * Purpose: Lỗi 404 Not Found — tài nguyên không tồn tại.
 */
const AppError = require('./AppError');

class NotFoundError extends AppError {
  constructor(message = 'Không tìm thấy tài nguyên', details = null) {
    super(message, 404, 'RESOURCE_NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
