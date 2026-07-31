/**
 * Purpose: Trạng thái của hồ sơ doanh nghiệp (HOSODN) và chi nhánh (CHINHANH).
 * Đồng bộ với CHECK constraint trong schema DB.
 */

// Trạng thái hồ sơ doanh nghiệp — HOSODN.trang_thai
const PARTNER_STATUS = {
  CHO_DUYET: 'Cho duyet',         // Mới đăng ký, chờ Admin duyệt
  DANG_HOAT_DONG: 'Dang hoat dong', // Admin đã duyệt, đang hoạt động
  TU_CHOI: 'Tu choi',             // Admin từ chối đăng ký
  TAM_KHOA: 'Tam khoa',           // Tạm khóa tạm thời
};

// Trạng thái chi nhánh — CHINHANH.trang_thai
const BRANCH_STATUS = {
  CHO_DUYET: 'Cho duyet',               // Mới tạo, chờ duyệt
  DANG_HOAT_DONG: 'Dang hoat dong',     // Đang hoạt động bình thường
  TU_CHOI: 'Tu choi',                   // Bị từ chối
  TAM_NGUNG: 'Tam ngung hoat dong',     // Tạm ngừng hoạt động
};

module.exports = {
  PARTNER_STATUS,
  BRANCH_STATUS,
};
