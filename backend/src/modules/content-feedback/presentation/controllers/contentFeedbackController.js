// Controller tầng presentation.
// Chỉ nhận request, gọi service, trả response.

const contentFeedbackService = require("../../business/services/contentFeedbackService");

async function getFeedbackList(req, res, next) {
  try {
    const result = await contentFeedbackService.getFeedbackList();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function createFeedback(req, res, next) {
  try {
    const result = await contentFeedbackService.createFeedback(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFeedbackList,
  createFeedback,
};
