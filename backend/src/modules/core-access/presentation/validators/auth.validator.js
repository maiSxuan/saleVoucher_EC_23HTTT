const ValidationError = require('../../../../common/errors/ValidationError');

/**
 * Purpose: Kiểm tra và chuẩn hóa payload đăng nhập trước khi vào controller.
 */
function validateLoginPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new ValidationError('Dữ liệu đăng nhập không hợp lệ');
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (!email || !password) {
    throw new ValidationError('Email/SĐT và mật khẩu là bắt buộc', {
      fields: {
        email: !email ? 'Vui lòng nhập email hoặc số điện thoại' : undefined,
        password: !password ? 'Vui lòng nhập mật khẩu' : undefined,
      },
    });
  }

  return { ...payload, email, password };
}

function validateLoginRequest(req, res, next) {
  try {
    req.body = validateLoginPayload(req.body);
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateLoginPayload,
  validateLoginRequest,
};
