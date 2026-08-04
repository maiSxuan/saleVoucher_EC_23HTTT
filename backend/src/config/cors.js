/**
 * Purpose: Cấu hình CORS linh hoạt cho API Backend.
 * Cho phép tất cả các cổng Vite dev (5173, 5174, v.v.), 127.0.0.1 và LAN IPs.
 */
const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

module.exports = {
  corsOptions,
};
