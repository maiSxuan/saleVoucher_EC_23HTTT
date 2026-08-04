// Model cho đánh giá (bảng public.danhgia)
class ReviewModel {
  constructor({ ma_danh_gia, diem, noi_dung, ngay_danh_gia, ma_voucher_mua, ma_tk_danhgia }) {
    this.id = ma_danh_gia;
    this.rating = diem;
    this.comment = noi_dung;
    this.createdAt = ngay_danh_gia;
    this.voucherPurchaseId = ma_voucher_mua;
    this.userId = ma_tk_danhgia;
  }
}

module.exports = ReviewModel;
