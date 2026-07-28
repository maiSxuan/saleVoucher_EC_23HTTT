/**
 * Purpose: Hàm tiện ích xử lý thời gian và định dạng ngày.
 */
function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

module.exports = {
  formatDate,
};
