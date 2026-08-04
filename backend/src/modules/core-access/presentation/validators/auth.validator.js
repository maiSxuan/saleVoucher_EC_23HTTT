const ValidationError = require('../../../../common/errors/ValidationError');

/**
 * Purpose: Kiểm tra và chuẩn hóa payload đăng nhập trước khi vào controller.
 */
function validateLoginPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new ValidationError('Dữ liệu đăng nhập không hợp lệ');
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const username = typeof payload.username === 'string' ? payload.username.trim() : '';
  const loginIdentifier = email || username;
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (!loginIdentifier || !password) {
    throw new ValidationError('Email/SĐT và mật khẩu là bắt buộc', {
      fields: {
        email: !loginIdentifier ? 'Vui lòng nhập email, số điện thoại hoặc tên đăng nhập' : undefined,
        password: !password ? 'Vui lòng nhập mật khẩu' : undefined,
      },
    });
  }

  return { ...payload, email: loginIdentifier, username, password };
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
