/**
 * Purpose: Trạng thái của đơn hàng trong hệ thống.
 * Đồng bộ với CHECK constraint của bảng DONHANG.trang_thai.
 */
module.exports = {
  CHO_THANH_TOAN: 'Cho thanh toan',           // Đặt hàng xong, chờ thanh toán
  DA_THANH_TOAN: 'Da thanh toan',             // Thanh toán thành công
  DA_HUY: 'Da huy',                           // Đã hủy đơn
  CHO_HOAN_TIEN: 'Cho hoan tien',             // Yêu cầu hoàn tiền đang chờ xử lý
  DA_HOAN_TIEN: 'Da hoan tien',               // Đã hoàn tiền thành công
  HUY_YEU_CAU_HOAN_TIEN: 'Huy yeu cau hoan tien', // Khách hủy yêu cầu hoàn tiền
};
