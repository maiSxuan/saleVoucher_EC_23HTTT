const repository = require("../../data/repositories/feedback.repository");
const validator = require("../../presentation/validators/feedback.validator");
const dto = require("../../presentation/dtos/feedback.dto");

// Lấy danh sách khiếu nại
async function getFeedbackList() {
  const items = await repository.findAll();
  return items.map(item => dto.buildFeedbackDto(item));
}

// Lấy khiếu nại theo id
async function getFeedbackById(id) {
  const item = await repository.findById(id);
  return dto.buildFeedbackDto(item);
}

// Tạo mới khiếu nại
async function createFeedback(payload) {
  // Validate dữ liệu
  validator.validateCreateFeedback(payload);
  
  const saved = await repository.create(payload);
  return dto.buildFeedbackDto(saved);
}

module.exports = {
  getFeedbackList,
  getFeedbackById,
  createFeedback,
};
