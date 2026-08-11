/**
 * Purpose: Validator kiểm tra tính hợp lệ dữ liệu danh mục.
 */
const ValidationError = require("../../../../common/errors/ValidationError");

function validateCreateCategory(payload) {
  const ten_danh_muc = payload.ten_danh_muc || payload.title || payload.name;
  if (!ten_danh_muc || typeof ten_danh_muc !== "string" || !ten_danh_muc.trim()) {
    throw new ValidationError("Tên danh mục là bắt buộc và không được để trống");
  }
}

function validateUpdateCategory(payload) {
  const ten_danh_muc = payload.ten_danh_muc || payload.title || payload.name;
  if (ten_danh_muc !== undefined) {
    if (typeof ten_danh_muc !== "string" || !ten_danh_muc.trim()) {
      throw new ValidationError("Tên danh mục không được để trống");
    }
  }
}

module.exports = {
  validateCreateCategory,
  validateUpdateCategory,
};
