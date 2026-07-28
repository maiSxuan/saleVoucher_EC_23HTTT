// Model mô tả đối tượng feedback.
// Có thể dùng như schema chuẩn cho DB sau này.

class ContentFeedbackModel {
  constructor({ id, userId, content, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.content = content;
    this.createdAt = createdAt;
  }
}

module.exports = ContentFeedbackModel;
