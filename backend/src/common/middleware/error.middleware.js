/**
 * Purpose: Middleware xử lý lỗi tập trung cho toàn bộ API.
 * - Nhận diện AppError và các subclass → trả errorCode chuẩn.
 * - Log lỗi 500 ra console để debug.
 * - Format response thống nhất: { success, message, errorCode, details }.
 */
const AppError = require("../errors/AppError");
const { loadEnvironment } = require("../../config/environment");

const config = loadEnvironment();

function errorMiddleware(err, req, res, next) {
  // Lỗi có cấu trúc (AppError và subclasses)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Lỗi nghiệp vụ dạng plain Error có gắn .status
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode || "ERROR",
    });
  }

  // Lỗi không mong đợi (500)
  const isDev = config.nodeEnv === "development";
  console.error("[UNHANDLED ERROR]", err);

  return res.status(500).json({
    success: false,
    message: "Lỗi hệ thống. Vui lòng thử lại sau.",
    errorCode: "INTERNAL_ERROR",
    ...(isDev ? { stack: err.stack } : {}),
  });
}

module.exports = { errorMiddleware };
