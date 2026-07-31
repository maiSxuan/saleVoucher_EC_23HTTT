/**
 * Purpose: Cấu hình CORS cho API.
 * Cho phép kết nối linh hoạt từ frontend (localhost:5173, 5174, 127.0.0.1, v.v.)
 */
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = {
  corsOptions,
};
