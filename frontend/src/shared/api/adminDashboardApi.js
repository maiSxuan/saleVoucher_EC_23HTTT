/**
 * FILE: frontend/src/shared/api/adminDashboardApi.js
 * PURPOSE: API call cho Admin Dashboard tổng quan (BR_ADM_06).
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function authHeaders() {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Lấy toàn bộ chỉ số tổng quan dashboard admin.
 * @returns {Promise<{
 *   totalUsers: number|null,
 *   activePartners: number|null,
 *   pendingPartners: number|null,
 *   activeVouchers: number|null,
 *   pendingVouchers: number|null,
 *   pendingOrders: number|null,
 *   totalRevenue: number|null,
 *   generatedAt: string
 * }>}
 */
export async function fetchDashboardSummary() {
  const res = await fetch(`${BASE_URL}/dashboard`, {
    headers: authHeaders(),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(json?.message || 'Không thể tải dữ liệu dashboard');
    err.status = res.status;
    throw err;
  }

  return json.data;
}
