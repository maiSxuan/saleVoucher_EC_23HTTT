/**
 * Purpose: Đọc biến môi trường và cung cấp cấu hình tập trung.
 * Các file khác nên dùng hàm này thay vì đọc process.env trực tiếp.
 */
require("dotenv").config();

function loadEnvironment() {
  process.env.NODE_ENV = process.env.NODE_ENV || "development";
  process.env.PORT = process.env.PORT || "3001";
}

module.exports = {
  loadEnvironment,
};
