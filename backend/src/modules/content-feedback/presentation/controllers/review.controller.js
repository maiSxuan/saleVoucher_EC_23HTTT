const service = require("../../business/services/review.service");

// Lấy danh sách đánh giá
async function getReviewList(req, res, next) {
  try {
    const result = await service.getReviewList();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// Lấy đánh giá theo id
async function getReviewById(req, res, next) {
  try {
    const result = await service.getReviewById(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// Tạo mới đánh giá
async function createReview(req, res, next) {
  try {
    const result = await service.createReview(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// Xóa đánh giá
async function deleteReview(req, res, next) {
  try {
    await service.deleteReview(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
}

// Lấy đánh giá theo voucher id
async function getReviewsByVoucher(req, res, next) {
  try {
    const result = await service.getReviewsByVoucherId(req.params.voucherId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// Lấy đánh giá theo ma_voucher_mua (lần mua)
async function getReviewByPurchaseId(req, res, next) {
  try {
    const result = await service.getReviewByPurchaseId(req.params.voucherPurchaseId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getReviewList,
  getReviewById,
  createReview,
  deleteReview,
  getReviewsByVoucher,
  getReviewByPurchaseId,
};
