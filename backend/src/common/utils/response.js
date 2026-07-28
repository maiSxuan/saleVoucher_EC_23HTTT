/**
 * Purpose: Hàm tiện ích trả response chuẩn cho API.
 * Giúp thống nhất format JSON giữa các controller/service.
 */
function successResponse(res, data, message = "Success", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

module.exports = {
  successResponse,
};
