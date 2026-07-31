/**
 * Purpose: Trạng thái của voucher (sản phẩm) trong hệ thống.
 * Đồng bộ với CHECK constraint của bảng VOUCHER.trang_thai.
 */
module.exports = {
  NHAP: 'Nhap',                // Voucher mới tạo, chưa gửi duyệt
  CHO_DUYET: 'Cho duyet',     // Đã gửi duyệt, đang chờ Admin xét
  DANG_BAN: 'Dang ban',       // Admin đã duyệt, đang mở bán
  TU_CHOI: 'Tu choi',         // Admin từ chối
  TAM_NGUNG: 'Tam ngung',     // Tạm ngừng bán (đối tác hoặc admin ngừng)
  NGUNG_BAN: 'Ngung ban',     // Kết thúc bán (hết thời gian hoặc hết số lượng)
};
