/**
 * Purpose: Validator mẫu cho payload đăng nhập.
 * Khi triển khai thật, nên validate email/password ở đây.
 */
function validateLoginPayload(payload) {
  if (!payload || !payload.email || !payload.password) {
    throw new Error("Email and password are required");
  }

  return payload;
}

module.exports = {
  validateLoginPayload,
};
