/**
 * Purpose: Lỗi 400 Bad Request — dữ liệu đầu vào không hợp lệ.
 * Dùng khi request body/params/query thiếu hoặc sai định dạng.
 */
const AppError = require('./AppError');

class ValidationError extends AppError {
  constructor(message = 'Dữ liệu đầu vào không hợp lệ', details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

module.exports = ValidationError;
