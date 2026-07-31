/**
 * Purpose: Đọc biến môi trường và cung cấp cấu hình tập trung.
 * Các file khác nên dùng hàm này thay vì đọc process.env trực tiếp.
 */
require("dotenv").config();

function loadEnvironment() {
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || "3001",
  };
}

function loadDatabase() {
  return {
    supabaseUrl:
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

// Cấu hình email cho đăng ký khách hàng
function loadGmail() {
  return {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM,
  };
}

// Cấu hình email cho OTP Quên mật khẩu
function loadAuthGmail() {
  return {
    host: process.env.AUTH_SMTP_HOST,
    port: process.env.AUTH_SMTP_PORT,
    secure: process.env.AUTH_SMTP_SECURE,
    user: process.env.AUTH_SMTP_USER,
    pass: process.env.AUTH_SMTP_PASS,
    from: process.env.AUTH_MAIL_FROM
  };
}

module.exports = {
  loadEnvironment,
  loadDatabase,
  loadGmail,
  loadAuthGmail,
};
