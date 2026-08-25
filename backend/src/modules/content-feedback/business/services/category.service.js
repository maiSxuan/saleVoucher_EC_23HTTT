/**
 * Purpose: Business logic xử lý nghiệp vụ quản lý danh mục (danh_muc).
 */
const repository = require("../../data/repositories/category.repository");
const validator = require("../../presentation/validators/category.validator");
const dto = require("../../presentation/dtos/category.dto");
const supabase = require("../../../../config/supabase");

async function uploadBase64ToSupabase(base64String, folder = "categories") {
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
      console.warn("[CategoryService] Storage upload warning:", error.message);
      return base64String;
    }

    const { data: publicUrlData } = supabase.storage
      .from("partner-documents")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn("[CategoryService] Failed to upload Base64 to Storage:", err.message);
    return base64String;
  }
}

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
  let hinh_anh_url = payload.hinh_anh_url || payload.imageUrl || null;
  if (hinh_anh_url && hinh_anh_url.startsWith("data:")) {
    hinh_anh_url = await uploadBase64ToSupabase(hinh_anh_url, "categories");
  }

  const dbPayload = {
    ten_danh_muc: (payload.ten_danh_muc || payload.title || payload.name).trim(),
    mo_ta: (payload.mo_ta || payload.content || payload.description || "").trim(),
    hinh_anh_url: hinh_anh_url || null,
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

  const rawImg = payload.hinh_anh_url !== undefined ? payload.hinh_anh_url : payload.imageUrl;
  if (rawImg !== undefined) {
    if (rawImg && rawImg.startsWith("data:")) {
      dbPayload.hinh_anh_url = await uploadBase64ToSupabase(rawImg, "categories");
    } else {
      dbPayload.hinh_anh_url = rawImg || null;
    }
  }

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
