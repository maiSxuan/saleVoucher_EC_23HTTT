const repository = require("../../data/repositories/feedback.repository");
const accountRepository = require("../../data/repositories/account.repository");
const validator = require("../../presentation/validators/feedback.validator");
const dto = require("../../presentation/dtos/feedback.dto");

// Lấy danh sách khiếu nại
async function getFeedbackList() {
  const items = await repository.findAll();
  return items.map((item) => dto.buildFeedbackDto(item));
}

// Lấy khiếu nại theo id
async function getFeedbackById(id) {
  const item = await repository.findById(id);
  return dto.buildFeedbackDto(item);
}

// Tạo mới khiếu nại
async function createFeedback(payload, accountId) {
  // Validate dữ liệu
  validator.validateCreateFeedback(payload);

  if (
    !accountId ||
    !(await repository.isVoucherPurchaseOwnedBy(
      payload.ma_voucher_mua,
      accountId,
    ))
  ) {
    const err = new Error(
      "Bạn không có quyền khiếu nại cho lần mua voucher này",
    );
    err.status = 403;
    throw err;
  }

  // Kiểm tra xem lần mua này đã được gửi khiếu nại chưa
  const existing = await repository.findByVoucherPurchaseId(
    payload.ma_voucher_mua,
  );
  if (existing) {
    throw new Error(
      "Bạn đã gửi phản ánh/khiếu nại cho lần mua voucher này rồi. Mỗi lần mua chỉ được gửi khiếu nại 1 lần.",
    );
  }

  const dbPayload = {
    noi_dung: payload.noi_dung,
    ma_voucher_mua: payload.ma_voucher_mua,
    ma_tk_xuly: null, // Ban đầu chưa có người xử lý, admin/staff sẽ cập nhật sau
  };

  const saved = await repository.create(dbPayload);
  return dto.buildFeedbackDto(saved);
}

// Lấy khiếu nại theo ma_voucher_mua
async function getFeedbackByPurchaseId(voucherPurchaseId, accountId, role) {
  if (
    role !== "Admin van hanh" &&
    !(await repository.isVoucherPurchaseOwnedBy(voucherPurchaseId, accountId))
  ) {
    const err = new Error("Bạn không có quyền xem khiếu nại này");
    err.status = 403;
    throw err;
  }
  const item = await repository.findByVoucherPurchaseId(voucherPurchaseId);
  return dto.buildFeedbackDto(item);
}

// Cập nhật trạng thái khiếu nại (Admin)
async function updateComplaintStatus(id, newStatus, adminAccountId) {
  const allowedStatuses = ["Dang xu ly", "Da xu ly", "Tu choi"];
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(
      `Trạng thái không hợp lệ. Chỉ chấp nhận: ${allowedStatuses.join(", ")}`,
    );
  }

  const current = await repository.findById(id);
  if (!current) {
    const err = new Error("Không tìm thấy khiếu nại");
    err.status = 404;
    throw err;
  }

  if (current.trang_thai === "Da xu ly" || current.trang_thai === "Tu choi") {
    throw new Error(
      "Khiếu nại này đã xử lý hoặc từ chối, không thể thay đổi trạng thái nữa.",
    );
  }

  const updated = await repository.updateStatusAndHandler(
    id,
    newStatus,
    adminAccountId,
  );
  return dto.buildFeedbackDto(updated);
}

module.exports = {
  getFeedbackList,
  getFeedbackById,
  createFeedback,
  getFeedbackByPurchaseId,
  updateComplaintStatus,
};
