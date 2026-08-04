function validateCreateFeedback(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Payload không hợp lệ");
  }

  // Kiểm tra các trường bắt buộc
  const requiredFields = ['noi_dung', 'ma_voucher_mua', 'ma_tk_xuly'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Thiếu trường bắt buộc: ${field}`);
    }
  }
}

module.exports = { validateCreateFeedback };
