// DTO dùng để định nghĩa cấu trúc dữ liệu trao đổi.
// Có thể mở rộng khi nối database thật.

function buildFeedbackDto(item) {
  return {
    id: item.id,
    userId: item.userId,
    content: item.content,
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

module.exports = {
  buildFeedbackDto,
};
