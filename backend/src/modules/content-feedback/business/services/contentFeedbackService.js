// Service tầng business.
// Chứa logic nghiệp vụ chính của module.

const repository = require("../../data/repositories/contentFeedbackRepository");
const validator = require("../../presentation/validators/contentFeedbackValidator");
const dto = require("../../presentation/dtos/contentFeedbackDto");

async function getFeedbackList() {
  const items = await repository.findAll();
  return items.map((item) => dto.buildFeedbackDto(item));
}

async function createFeedback(payload) {
  validator.validateCreateFeedback(payload);
  const saved = await repository.create(payload);
  return dto.buildFeedbackDto(saved);
}

module.exports = {
  getFeedbackList,
  createFeedback,
};
