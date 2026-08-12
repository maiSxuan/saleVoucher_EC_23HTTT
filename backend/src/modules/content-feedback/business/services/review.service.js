const repository = require("../../data/repositories/review.repository");
const accountRepository = require("../../data/repositories/account.repository");
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
  
  // Kiểm tra xem lần mua này (ma_voucher_mua) đã được đánh giá chưa
  const existing = await repository.findByVoucherPurchaseId(payload.ma_voucher_mua);
  if (existing) {
    throw new Error("Lần mua voucher này đã được đánh giá trước đó. Mỗi lần mua chỉ được đánh giá 1 lần.");
  }

  const maTk = await accountRepository.findTkIdByNguoiDungId(payload.ma_nguoi_dung);
  if (!maTk) {
    throw new Error("Không tìm thấy tài khoản tương ứng với người dùng.");
  }
  
  const dbPayload = {
    diem: payload.diem,
    noi_dung: payload.noi_dung,
    ma_voucher_mua: payload.ma_voucher_mua,
    ma_tk_danhgia: maTk
  };
  
  const saved = await repository.create(dbPayload);
  return dto.buildReviewDto(saved);
}

// Xóa đánh giá
async function deleteReview(id) {
  return await repository.remove(id);
}

// Lấy danh sách đánh giá theo voucher id
async function getReviewsByVoucherId(voucherId) {
  const items = await repository.findByVoucherId(voucherId);
  return items.map(item => dto.buildReviewDto(item));
}

// Lấy đánh giá theo ma_voucher_mua
async function getReviewByPurchaseId(voucherPurchaseId) {
  const item = await repository.findByVoucherPurchaseId(voucherPurchaseId);
  return dto.buildReviewDto(item);
}

module.exports = {
  getReviewList,
  getReviewById,
  createReview,
  deleteReview,
  getReviewsByVoucherId,
  getReviewByPurchaseId,
};
