const service = require("../../business/services/content.service");

// Lấy danh sách nội dung
async function getContentList(req, res, next) {
  try {
    const result = await service.getContentList();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// Lấy nội dung theo id
async function getContentById(req, res, next) {
  try {
    const result = await service.getContentById(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// Tạo mới nội dung
async function createContent(req, res, next) {
  try {
    const result = await service.createContent(req.body, req.user);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// Cập nhật nội dung
async function updateContent(req, res, next) {
  try {
    const result = await service.updateContent(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// Xóa nội dung
async function deleteContent(req, res, next) {
  try {
    await service.deleteContent(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getContentList,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
};
