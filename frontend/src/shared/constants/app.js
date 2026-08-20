/**
 * Purpose: Các hằng số dùng chung cho toàn bộ ứng dụng.
 * Lưu các role, status, API base URL, etc.
 */
export const ROLES = {
  Admin he thong: "admin-system",
  Admin kiem duyet: "admin-moderation",
  Admin van hanh: "admin-operation",
  STAFF: "staff",
  SELLER: "seller",
  CUSTOMER: "customer",
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
