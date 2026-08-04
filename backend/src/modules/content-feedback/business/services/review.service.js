const repository = require("../../data/repositories/review.repository");
const validator = require("../../presentation/validators/review.validator");
const dto = require("../../presentation/dtos/review.dto");

// Lấy danh sách đánh giá
async function getReviewList() {
  const items = await repository.findAll();
  return items.map(item => dto.buildReviewDto(item));
}

// Lấy đánh giá theo id
async function getReviewById(id) {
  const item = await repository.findById(id);
  return dto.buildReviewDto(item);
}

// Tạo mới đánh giá
async function createReview(payload) {
  // Validate dữ liệu
  validator.validateCreateReview(payload);
  
  const saved = await repository.create(payload);
  return dto.buildReviewDto(saved);
}

module.exports = {
  getReviewList,
  getReviewById,
  createReview,
};
