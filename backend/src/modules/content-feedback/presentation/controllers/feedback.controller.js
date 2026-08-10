const service = require("../../business/services/feedback.service");

// Lấy danh sách khiếu nại
async function getFeedbackList(req, res, next) {
  try {
    const result = await service.getFeedbackList();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// Lấy khiếu nại theo id
async function getFeedbackById(req, res, next) {
  try {
    const result = await service.getFeedbackById(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// Tạo mới khiếu nại
async function createFeedback(req, res, next) {
  try {
    const result = await service.createFeedback(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// Lấy khiếu nại theo ma_voucher_mua (lần mua)
async function getFeedbackByPurchaseId(req, res, next) {
  try {
    const result = await service.getFeedbackByPurchaseId(req.params.voucherPurchaseId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// Cập nhật trạng thái khiếu nại (Admin)
async function updateComplaintStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminAccountId = req.user?.accountId || req.user?.id;
    const result = await service.updateComplaintStatus(id, status, adminAccountId);
    res.status(200).json({ success: true, data: result, message: "Cập nhật trạng thái khiếu nại thành công" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFeedbackList,
  getFeedbackById,
  createFeedback,
  getFeedbackByPurchaseId,
  updateComplaintStatus,
};
