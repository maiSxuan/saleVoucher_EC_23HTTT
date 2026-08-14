/**
 * Utility helper định dạng tên danh mục: Trả về trực tiếp tên danh mục từ DB
 */
export function formatCategoryName(catNameOrId) {
  if (!catNameOrId) return "";
  return String(catNameOrId);
}

export default formatCategoryName;
