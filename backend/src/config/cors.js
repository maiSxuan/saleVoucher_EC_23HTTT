/**
 * Purpose: Cấu hình CORS cho API.
 * Cho phép:
 *  - localhost:5173 và 127.0.0.1:5173 (dev trên máy)
 *  - 192.168.x.x:5173 (truy cập qua IP LAN khi frontend chạy --host 0.0.0.0)
 *  - Đọc thêm từ env CORS_ORIGIN nếu cần mở rộng (ví dụ: staging domain)
 */
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',  // vite preview
  'http://127.0.0.1:4173',
];

// Thêm origin từ env nếu có (ví dụ: CORS_ORIGIN=https://mydomain.com)
if (process.env.CORS_ORIGIN) {
  ALLOWED_ORIGINS.push(process.env.CORS_ORIGIN);
}

const corsOptions = {
  // Dùng hàm callback để kiểm tra origin động
  origin: (origin, callback) => {
    // origin = undefined khi gọi từ Postman / server-to-server (không có browser)
    if (!origin) return callback(null, true);

    // Cho phép localhost, 127.0.0.1 và toàn bộ dải mạng LAN 192.168.x.x
    const isAllowed =
      ALLOWED_ORIGINS.includes(origin) ||
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
      /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: origin ${origin} không được phép`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Cho phép gửi cookie / Authorization header
};

module.exports = {
  corsOptions,
};

