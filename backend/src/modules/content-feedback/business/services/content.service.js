const repository = require("../../data/repositories/content.repository");
const validator = require("../../presentation/validators/content.validator");
const dto = require("../../presentation/dtos/content.dto");

// Lấy danh sách nội dung
async function getContentList() {
  const items = await repository.findAll();
  return items.map(item => dto.buildContentDto(item));
}

// Lấy nội dung theo id
async function getContentById(id) {
  const item = await repository.findById(id);
  return dto.buildContentDto(item);
}

// Tạo mới nội dung
async function createContent(payload) {
  validator.validateCreateContent(payload);
  if (payload.status) {
      payload.trang_thai = mapStatusToDb(payload.status);
      delete payload.status;
  }
  const saved = await repository.create(payload);
  return dto.buildContentDto(saved);
}

// Hàm ánh xạ trạng thái
function mapStatusToDb(status) {
  const map = {
    'visible': 'Dang hien thi',
    'hidden': 'Tam an',
    'stopped': 'Ngung hien thi'
  };
  return map[status] || status;
}

// Cập nhật nội dung
async function updateContent(id, payload) {
  if (payload.status) {
    validator.validateUpdateStatus(mapStatusToDb(payload.status));
    payload.trang_thai = mapStatusToDb(payload.status);
    delete payload.status;
  }
  const updated = await repository.update(id, payload);
  return dto.buildContentDto(updated);
}

// Xóa nội dung
async function deleteContent(id) {
  return await repository.remove(id);
}

module.exports = {
  getContentList,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
};
