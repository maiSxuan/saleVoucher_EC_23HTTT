function validateCreateContent(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Payload không hợp lệ");
  }

  // Kiểm tra các trường bắt buộc theo bảng noidung
  const requiredFields = ['loai', 'tieu_de', 'noi_dung', 'matk_admin'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Thiếu trường bắt buộc: ${field}`);
    }
  }

  // Kiểm tra giá trị hợp lệ cho cột 'loai' dựa trên constraint trong DB
  const allowedTypes = ['banner', 'bai_viet', 'popup', 'chinh_sach'];
  if (!allowedTypes.includes(data.loai)) {
    throw new Error(`Loại nội dung không hợp lệ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`);
  }
}

function validateUpdateStatus(status) {
  const allowedStatuses = ['Dang hien thi', 'Tam an', 'Ngung hien thi'];
  if (!allowedStatuses.includes(status)) {
    throw new Error(`Trạng thái không hợp lệ. Chỉ chấp nhận: ${allowedStatuses.join(', ')}`);
  }
}

module.exports = { validateCreateContent, validateUpdateStatus };
