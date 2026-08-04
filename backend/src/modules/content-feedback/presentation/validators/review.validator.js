function validateCreateReview(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Payload không hợp lệ");
  }

  // Kiểm tra các trường bắt buộc
  const requiredFields = ['diem', 'ma_voucher_mua', 'ma_tk_danhgia'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Thiếu trường bắt buộc: ${field}`);
    }
  }

  // Kiểm tra điểm phải nằm trong khoảng 1-5
  if (typeof data.diem !== 'number' || data.diem < 1 || data.diem > 5) {
    throw new Error("Điểm đánh giá phải là số từ 1 đến 5");
  }
}

module.exports = { validateCreateReview };
