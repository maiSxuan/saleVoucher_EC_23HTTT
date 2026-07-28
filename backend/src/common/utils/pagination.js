/**
 * Purpose: Hàm tiện ích phân trang dữ liệu.
 * Dùng khi trả về danh sách dài như voucher, order, user.
 */
function paginate(items, page = 1, pageSize = 10) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: items.slice(startIndex, endIndex),
    page,
    pageSize,
    totalItems: items.length,
  };
}

module.exports = {
  paginate,
};
