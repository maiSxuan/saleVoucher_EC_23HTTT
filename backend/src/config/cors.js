/**
 * Purpose: Cấu hình CORS cho API.
 * Dùng khi frontend chạy trên localhost và backend chạy ở port khác.
 */
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = {
  corsOptions,
};
