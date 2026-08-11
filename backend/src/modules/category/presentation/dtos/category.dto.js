/**
 * Purpose: DTO chuẩn hóa dữ liệu danh mục (danh_muc) cho API request/response.
 */
function buildCategoryDto(item) {
  if (!item) return null;
  return {
    ma_danh_muc: item.ma_danh_muc,
    ten_danh_muc: item.ten_danh_muc,
    mo_ta: item.mo_ta || "",
    id: item.ma_danh_muc,
    name: item.ten_danh_muc,
    title: item.ten_danh_muc,
    description: item.mo_ta || "",
    content: item.mo_ta || "",
    type: "danh_muc",
    status: "visible",
  };
}

module.exports = {
  buildCategoryDto,
};
