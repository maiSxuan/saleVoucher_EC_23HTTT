/**
 * Purpose: Middleware xử lý lỗi tập trung cho toàn bộ API.
 * Khi service/dao ném lỗi, middleware này sẽ trả response chuẩn.
 */
function errorMiddleware(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}

module.exports = {
  errorMiddleware,
};
