const repository = require("../../data/repositories/content.repository");
const validator = require("../../presentation/validators/content.validator");
const dto = require("../../presentation/dtos/content.dto");
const supabase = require("../../../../config/supabase");

async function uploadBase64ToSupabase(base64String, folder = "content") {
  if (!base64String || typeof base64String !== "string" || !base64String.startsWith("data:")) {
    return base64String;
  }
  try {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return base64String;

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    let ext = "png";
    if (contentType.includes("jpeg") || contentType.includes("jpg")) ext = "jpg";

    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("partner-documents")
      .upload(fileName, buffer, { contentType, upsert: true });

    if (error) {
      console.warn("[ContentService] Storage upload warning:", error.message);
      return base64String;
    }

    const { data: publicUrlData } = supabase.storage
      .from("partner-documents")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn("[ContentService] Failed to upload Base64 to Storage:", err.message);
    return base64String;
  }
}

// Lấy danh sách nội dung
async function getContentList(query) {
  let items;
  if (query && query.loai) {
    items = await repository.findByType(query.loai);
  } else {
    items = await repository.findAll();
  }
  return (items || []).map(item => dto.buildContentDto(item));
}

// Lấy nội dung theo id
async function getContentById(id) {
  const item = await repository.findById(id);
  return dto.buildContentDto(item);
}

async function getDefaultModerationAccountId() {
  const { data } = await supabase
    .from('taikhoan')
    .select('ma_tk, nguoidung!inner(vai_tro)')
    .eq('nguoidung.vai_tro', 'Admin kiem duyet')
    .limit(1)
    .maybeSingle();
  return data?.ma_tk || null;
}

// Tạo mới nội dung
async function createContent(payload, reqUser) {
  const loai = payload.loai || payload.type;
  const tieu_de = payload.tieu_de || payload.title;
  const noi_dung = payload.noi_dung || payload.content || "";
  let trang_thai = payload.trang_thai;
  if (payload.status) {
    trang_thai = mapStatusToDb(payload.status);
  }
  if (!trang_thai) trang_thai = 'Dang hien thi';

  let matk_admin = reqUser?.accountId || reqUser?.id || payload.matk_admin;
  if (!matk_admin || matk_admin === 'UUID_MODERATION_EXAMPLE') {
    matk_admin = await getDefaultModerationAccountId();
  }

  let hinh_anh_url = payload.hinh_anh_url || payload.imageUrl || null;
  if (hinh_anh_url) {
    hinh_anh_url = await uploadBase64ToSupabase(hinh_anh_url, "content");
  }

  const dbPayload = {
    loai,
    tieu_de,
    noi_dung,
    trang_thai,
    matk_admin,
    hinh_anh_url
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
  if (payload.hinh_anh_url !== undefined || payload.imageUrl !== undefined) {
    let rawImg = payload.hinh_anh_url !== undefined ? payload.hinh_anh_url : payload.imageUrl;
    let img = (rawImg === "" || rawImg === null) ? null : rawImg;
    if (img) {
      dbPayload.hinh_anh_url = await uploadBase64ToSupabase(img, "content");
    } else {
      dbPayload.hinh_anh_url = null;
    }
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
