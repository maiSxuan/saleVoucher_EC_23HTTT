function buildFeedbackDto(item) {
  if (!item) return null;

  // Ánh xạ từ các cột DB sang tên trường dễ hiểu hơn
  return {
    id: item.ma_khieu_nai,
    content: item.noi_dung,
    createdAt: item.ngay_khieu_nai,
    status: item.trang_thai,
    voucherPurchaseId: item.ma_voucher_mua, // ma_voucher_mua
    handlerId: item.ma_tk_xuly, // ma_tk_xuly
    rejectReason: item.ly_do_tu_choi_kn || null,
    voucherCode: item.voucher_mua?.voucher_code || null,
    voucherCodeStatus: item.voucher_mua?.trang_thai || null,
    orderId: item.voucher_mua?.ma_dh || null,
  };
}

module.exports = { buildFeedbackDto };
