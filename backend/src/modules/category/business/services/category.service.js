/**
 * Purpose: Business logic xử lý nghiệp vụ quản lý danh mục (danh_muc).
 */
const repository = require("../../data/repositories/category.repository");
const validator = require("../../presentation/validators/category.validator");
const dto = require("../../presentation/dtos/category.dto");

async function getCategories() {
  const items = await repository.findAll();
  return items.map(item => dto.buildCategoryDto(item));
}

async function getCategoryById(ma_danh_muc) {
  const item = await repository.findById(ma_danh_muc);
  return dto.buildCategoryDto(item);
}

async function createCategory(payload) {
  validator.validateCreateCategory(payload);
  const dbPayload = {
    ten_danh_muc: (payload.ten_danh_muc || payload.title || payload.name).trim(),
    mo_ta: (payload.mo_ta || payload.content || payload.description || "").trim(),
  };
  const saved = await repository.create(dbPayload);
  return dto.buildCategoryDto(saved);
}

async function updateCategory(ma_danh_muc, payload) {
  validator.validateUpdateCategory(payload);
  const dbPayload = {};
  const ten_danh_muc = payload.ten_danh_muc || payload.title || payload.name;
  const mo_ta = payload.mo_ta || payload.content || payload.description;

  if (ten_danh_muc !== undefined) dbPayload.ten_danh_muc = ten_danh_muc.trim();
  if (mo_ta !== undefined) dbPayload.mo_ta = mo_ta.trim();

  const updated = await repository.update(ma_danh_muc, dbPayload);
  return dto.buildCategoryDto(updated);
}

async function deleteCategory(ma_danh_muc) {
  return await repository.remove(ma_danh_muc);
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
