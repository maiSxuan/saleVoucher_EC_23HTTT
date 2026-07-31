/**
 * Purpose: Kết quả ghi nhận trong nhật ký hệ thống (LOG_HT.ket_qua).
 * Đồng bộ với CHECK constraint của bảng LOG_HT.
 */
module.exports = {
  THANH_CONG: 'Thanh cong',   // Thao tác thực hiện thành công
  THAT_BAI: 'That bai',       // Thao tác thất bại (lỗi hoặc bị từ chối)
};
