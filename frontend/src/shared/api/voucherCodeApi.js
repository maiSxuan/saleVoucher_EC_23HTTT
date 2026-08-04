/**
 * FILE: frontend/src/features/core-access/api/voucherCodeApi.js
 * PURPOSE: API Client giao tiếp với Backend cho tính năng tra cứu và xác nhận voucher (BR-PAR-05, BR-PAR-06).
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res) {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `Lỗi máy chủ (${res.status})`);
  }
  return json;
}

/**
 * 1. Tra cứu và kiểm tra tính hợp lệ của mã voucher (BR-PAR-05)
 */
export async function verifyVoucherCode({ code, branchId = null }) {
  const res = await fetch(`${BASE_URL}/vouchers/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ code, branchId }),
  });
  return handleResponse(res);
}

/**
 * 2. Xác nhận sử dụng voucher tại quầy chi nhánh (BR-PAR-06)
 */
export async function redeemVoucherCode({ code, branchId = null, note = '' }) {
  const res = await fetch(`${BASE_URL}/vouchers/redeem`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ code, branchId, note }),
  });
  return handleResponse(res);
}

/**
 * 3. Lấy lịch sử sử dụng voucher tại chi nhánh
 */
export async function fetchUsageHistory({ branchId = null, page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (branchId) params.set('branchId', branchId);

  const res = await fetch(`${BASE_URL}/vouchers/usage-history?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

/**
 * 4. Lấy danh sách mã mẫu từ cơ sở dữ liệu để kiểm thử
 */
export async function fetchSampleCodes() {
  const res = await fetch(`${BASE_URL}/vouchers/sample-codes`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

/**
 * 5. Lấy danh sách chi nhánh hoạt động theo doanh nghiệp / phạm vi người dùng
 */
export async function fetchBranches(maHsdn = null) {
  try {
    const res = await fetch(`${BASE_URL}/vouchers/branches`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data && json.data.length > 0) return json;
    }
  } catch (e) {
    console.warn('[fetchBranches] Lỗi gọi /vouchers/branches:', e);
  }

  try {
    const params = new URLSearchParams();
    if (maHsdn) params.set('maHsdn', maHsdn);
    const query = params.toString();

    const resAdmin = await fetch(`${BASE_URL}/admin/branches${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(resAdmin);
  } catch (e) {
    console.warn('[fetchBranches] Lỗi gọi /admin/branches:', e);
    return { success: true, data: [] };
  }
}

