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

module.exports = {
  loadEnvironment,
  loadDatabase,
};
