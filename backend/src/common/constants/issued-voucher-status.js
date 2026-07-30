/**
 * Purpose: Trạng thái của voucher code đã phát hành (VOUCHER_MUA).
 * Đồng bộ với CHECK constraint của bảng VOUCHER_MUA.trang_thai.
 */
module.exports = {
  CHUA_SU_DUNG: 'Chua su dung',   // Mã chưa được sử dụng
  DA_SU_DUNG: 'Da su dung',       // Mã đã được nhân viên xác nhận sử dụng
  HET_HAN: 'Het han',             // Mã hết hạn (quá ngày sử dụng)
  LOI_SINH_MA: 'Loi sinh ma',     // Lỗi trong quá trình sinh mã
  VO_HIEU_HOA: 'Vo hieu hoa',     // Admin vô hiệu hóa (hoàn tiền, vi phạm...)
};
