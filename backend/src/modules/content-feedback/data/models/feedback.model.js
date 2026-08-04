// Model cho khiếu nại (bảng public.khieunai)
class FeedbackModel {
  constructor({ ma_khieu_nai, noi_dung, ngay_khieu_nai, trang_thai, ma_voucher_mua, ma_tk_xuly }) {
    this.id = ma_khieu_nai;
    this.content = noi_dung;
    this.createdAt = ngay_khieu_nai;
    this.status = trang_thai;
    this.voucherPurchaseId = ma_voucher_mua;
    this.handlerId = ma_tk_xuly;
  }
}

module.exports = FeedbackModel;
