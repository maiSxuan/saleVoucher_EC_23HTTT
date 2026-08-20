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
 * Lấy chỉ số tổng quan thuộc phạm vi của role admin đang đăng nhập.
 * Backend giữ nguyên nguồn dữ liệu dashboard và chỉ trả các trường role đó sở hữu.
 * @returns {Promise<object>}
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
