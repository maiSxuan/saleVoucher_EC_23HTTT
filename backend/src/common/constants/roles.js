/**
 * Purpose: Định nghĩa các vai trò hệ thống, đồng bộ với schema DB (NGUOIDUNG.vai_tro).
 * DB_ROLES: giá trị lưu trong cột vai_tro của bảng NGUOIDUNG.
 * JWT_ROLES: giá trị ngắn gọn lưu trong JWT token để frontend xử lý dễ.
 * DB_TO_JWT: mapping từ vai trò DB sang vai trò JWT.
 */

// Vai trò lưu trong DB (khớp với CHECK constraint của bảng NGUOIDUNG)
const DB_ROLES = {
  CUSTOMER: 'Khach hang',
  PARTNER_OWNER: 'Nguoi dai dien',
  PARTNER_STAFF_SALES: 'Nhan vien ban hang',
  PARTNER_STAFF_VOUCHER: 'Nhan vien quan ly voucher',
  ADMIN_SYSTEM: 'Admin he thong',
  ADMIN_MODERATION: 'Admin kiem duyet',
  ADMIN_OPERATION: 'Admin van hang',
};

// Vai trò trong JWT token (ngắn gọn, dùng ở frontend + authorize middleware)
const JWT_ROLES = {
  ADMIN_SYSTEM: 'ADMIN_SYSTEM',
  ADMIN_MODERATION: 'ADMIN_MODERATION',
  ADMIN_OPERATION: 'ADMIN_OPERATION',
  PARTNER_OWNER: 'PARTNER_OWNER',
  PARTNER_MANAGER: 'PARTNER_MANAGER',
  PARTNER_STAFF: 'PARTNER_STAFF',
  CUSTOMER: 'CUSTOMER',
};

// Mapping vai trò DB → vai trò JWT
const DB_TO_JWT = {
  [DB_ROLES.PARTNER_OWNER]: JWT_ROLES.PARTNER_OWNER,
  [DB_ROLES.PARTNER_STAFF_SALES]: JWT_ROLES.PARTNER_STAFF,
  [DB_ROLES.PARTNER_STAFF_VOUCHER]: JWT_ROLES.PARTNER_MANAGER,
  [DB_ROLES.CUSTOMER]: JWT_ROLES.CUSTOMER,
  [DB_ROLES.ADMIN_SYSTEM]: JWT_ROLES.ADMIN_SYSTEM,
  [DB_ROLES.ADMIN_MODERATION]: JWT_ROLES.ADMIN_MODERATION,
  [DB_ROLES.ADMIN_OPERATION]: JWT_ROLES.ADMIN_OPERATION,
  'Admin van hanh': JWT_ROLES.ADMIN_OPERATION,
};

module.exports = {
  DB_ROLES,
  JWT_ROLES,
  DB_TO_JWT,
};
