/**
 * Purpose: Hàm tiện ích trả response chuẩn cho API.
 * Giúp thống nhất format JSON giữa các controller.
 *
 * Format thành công: { success: true, message, data }
 * Format phân trang: { success: true, message, data, pagination }
 * Format lỗi:        { success: false, message, errorCode, details? }
 */

/**
 * Trả response thành công (200 hoặc statusCode tùy chỉnh).
 */
function successResponse(res, data, message = 'Thành công', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Trả response thành công kèm thông tin phân trang.
 * @param {object} pagination - { page, limit, total, totalPages }
 */
function paginatedResponse(res, data, pagination, message = 'Thành công') {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
}

/**
 * Trả response lỗi có cấu trúc.
 * Thường dùng trong catch block khi không dùng next(err).
 */
function errorResponse(res, message = 'Lỗi hệ thống', statusCode = 500, errorCode = 'INTERNAL_ERROR', details = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    ...(details ? { details } : {}),
  });
}

module.exports = {
  successResponse,
  paginatedResponse,
  errorResponse,
};
