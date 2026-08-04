/**
 * Purpose: Trạng thái thanh toán và hoàn tiền.
 * Đồng bộ với CHECK constraint của bảng THANHTOAN.trang_thai và HOANTIEN.trang_thai.
 */
module.exports = {
  DANG_XU_LY: 'Dang xu ly',   // Đang xử lý giao dịch
  THANH_CONG: 'Thanh cong',   // Giao dịch thành công
  THAT_BAI: 'That bai',       // Giao dịch thất bại
};
