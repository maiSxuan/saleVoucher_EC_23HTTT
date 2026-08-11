/**
 * Helper định dạng tên danh mục có dấu đẹp mắt cho toàn bộ giao diện
 */
export const CATEGORY_NAME_MAP = {
  "cat-1": "Ẩm Thực & Nhà Hàng",
  "cat-2": "Làm Đẹp & Spa",
  "cat-3": "Giải Trí & Vui Chơi",
  "cat-4": "Du Lịch & Khách Sạn",
  "cat-5": "Giáo Dục & Khóa Học",
  "40000000-0000-0000-0000-000000000001": "Ẩm Thực & Nhà Hàng",
  "40000000-0000-0000-0000-000000000002": "Làm Đẹp & Spa",
  "40000000-0000-0000-0000-000000000003": "Giải Trí & Vui Chơi",
  "40000000-0000-0000-0000-000000000004": "Du Lịch & Khách Sạn",
  "40000000-0000-0000-0000-000000000005": "Giáo Dục & Khóa Học",
  "An uong": "Ẩm Thực & Nhà Hàng",
  "Ẩm thực": "Ẩm Thực & Nhà Hàng",
  "Ẩm Thực": "Ẩm Thực & Nhà Hàng",
  "Am thuc": "Ẩm Thực & Nhà Hàng",
  "Lam dep": "Làm Đẹp & Spa",
  "Làm đẹp": "Làm Đẹp & Spa",
  "Làm Đẹp": "Làm Đẹp & Spa",
  "Giai tri": "Giải Trí & Vui Chơi",
  "Giải trí": "Giải Trí & Vui Chơi",
  "Giải Trí": "Giải Trí & Vui Chơi",
  "Du lich": "Du Lịch & Khách Sạn",
  "Du lịch": "Du Lịch & Khách Sạn",
  "Du Lịch": "Du Lịch & Khách Sạn",
  "Mua sam": "Mua Sắm & Bán Lẻ",
  "Mua sắm": "Mua Sắm & Bán Lẻ",
  "Mua Sắm": "Mua Sắm & Bán Lẻ",
  "Suc khoe": "Sức Khỏe & Làm Đẹp",
  "Sức khỏe": "Sức Khỏe & Làm Đẹp",
  "Sức Khỏe": "Sức Khỏe & Làm Đẹp",
  "Giao duc": "Giáo Dục & Khóa Học",
  "Giáo dục": "Giáo Dục & Khóa Học",
  "Giaoduc": "Giáo Dục & Khóa Học",
  "Khac": "Danh Mục Khác",
  "Khác": "Danh Mục Khác",
};

export function formatCategoryName(catNameOrId) {
  if (!catNameOrId) return "Danh Mục Khác";
  
  if (CATEGORY_NAME_MAP[catNameOrId]) {
    return CATEGORY_NAME_MAP[catNameOrId];
  }

  const cleanKey = String(catNameOrId).trim();
  for (const [key, val] of Object.entries(CATEGORY_NAME_MAP)) {
    if (key.toLowerCase() === cleanKey.toLowerCase()) {
      return val;
    }
  }

  return catNameOrId;
}

export default formatCategoryName;
