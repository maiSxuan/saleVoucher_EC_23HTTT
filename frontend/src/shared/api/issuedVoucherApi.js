/**
 * FILE: frontend/src/features/core-access/api/issuedVoucherApi.js
 * PURPOSE: API calls cho BR-CUS-07 — Voucher đã mua.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  const lang = localStorage.getItem("app_lang") || "vi";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "Accept-Language": lang,
  };
}

async function handleResponse(res) {
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(json?.message || "Có lỗi xảy ra");
    err.status = res.status;
    err.details = json?.details;
    throw err;
  }
  return json.data;
}

/**
 * Lấy danh sách "Voucher của tôi".
 * @param {object} params - { page, limit, status }
 */
export async function getMyVouchers({ page = 1, limit = 20, status } = {}) {
  const lang = localStorage.getItem("app_lang") || "vi";
  const query = new URLSearchParams({ page, limit, lang });
  if (status) query.set("status", status);

  const res = await fetch(`${BASE_URL}/vouchers/my?${query.toString()}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/**
 * Lấy danh sách voucher của đơn hàng (gọi ngay sau thanh toán thành công).
 * @param {string} orderId
 */
export async function getVouchersByOrder(orderId) {
  const res = await fetch(`${BASE_URL}/vouchers/order/${orderId}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/**
 * Lấy chi tiết một voucher đã mua.
 * @param {string} issuedId - ma_voucher_mua
 */
export async function getIssuedVoucherDetail(issuedId) {
  const res = await fetch(`${BASE_URL}/vouchers/issued/${issuedId}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}
