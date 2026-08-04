function buildReviewDto(item) {
  if (!item) return null;

  // Ánh xạ từ các cột DB sang tên trường dễ hiểu hơn
  return {
    id: item.ma_danh_gia,
    rating: item.diem,
    comment: item.noi_dung,
    createdAt: item.ngay_danh_gia,
    voucherPurchaseId: item.ma_voucher_mua, // ma_voucher_mua
    userId: item.ma_tk_danhgia, // ma_tk_danhgia
  };
}

module.exports = { buildReviewDto };
