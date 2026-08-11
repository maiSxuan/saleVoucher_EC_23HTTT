/**
 * Purpose: Controller xử lý HTTP requests cho quản lý danh mục.
 */
const service = require("../../business/services/category.service");

async function getCategories(req, res, next) {
  try {
    const result = await service.getCategories();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const result = await service.getCategoryById(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const result = await service.createCategory(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const result = await service.updateCategory(req.params.id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    await service.deleteCategory(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
