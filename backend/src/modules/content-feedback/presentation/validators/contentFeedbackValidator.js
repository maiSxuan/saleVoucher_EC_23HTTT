// Validator tầng presentation.
// Dùng để kiểm tra dữ liệu đầu vào trước khi gọi service.

function validateCreateFeedback(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Payload không hợp lệ");
  }

  if (!data.userId || !data.content) {
    throw new Error("Thiếu userId hoặc content");
  }
}

module.exports = {
  validateCreateFeedback,
};
