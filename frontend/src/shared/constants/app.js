/**
 * Purpose: Các hằng số dùng chung cho toàn bộ ứng dụng.
 * Lưu các role, status, API base URL, etc.
 */
export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  SELLER: "seller",
  CUSTOMER: "customer",
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
