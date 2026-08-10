const repository = require("../../data/repositories/content.repository");
const validator = require("../../presentation/validators/content.validator");
const dto = require("../../presentation/dtos/content.dto");
const supabase = require("../../../../config/supabase");

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

async function getDefaultAdminAccountId() {
  const { data } = await supabase
    .from('taikhoan')
    .select('ma_tk')
    .limit(1)
    .maybeSingle();
  if (data) return data.ma_tk;
  return '10000000-0000-0000-0000-000000000001';
}

// Tạo mới nội dung
async function createContent(payload, reqUser) {
  const loai = payload.loai || payload.type;
  const tieu_de = payload.tieu_de || payload.title;
  const noi_dung = payload.noi_dung || payload.content;
  let trang_thai = payload.trang_thai;
  if (payload.status) {
    trang_thai = mapStatusToDb(payload.status);
  }
  if (!trang_thai) trang_thai = 'Dang hien thi';

  let matk_admin = reqUser?.accountId || reqUser?.id || payload.matk_admin;
  if (!matk_admin || matk_admin === 'UUID_ADMIN_EXAMPLE') {
    matk_admin = await getDefaultAdminAccountId();
  }

  const dbPayload = {
    loai,
    tieu_de,
    noi_dung,
    trang_thai,
    matk_admin
  };

  validator.validateCreateContent(dbPayload);
  const saved = await repository.create(dbPayload);
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
  const dbPayload = {};
  if (payload.loai || payload.type) dbPayload.loai = payload.loai || payload.type;
  if (payload.tieu_de || payload.title) dbPayload.tieu_de = payload.tieu_de || payload.title;
  if (payload.noi_dung || payload.content) dbPayload.noi_dung = payload.noi_dung || payload.content;
  if (payload.trang_thai) dbPayload.trang_thai = payload.trang_thai;
  if (payload.status) {
    dbPayload.trang_thai = mapStatusToDb(payload.status);
  }
  dbPayload.ngay_cap_nhat = new Date().toISOString();

  const updated = await repository.update(id, dbPayload);
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
