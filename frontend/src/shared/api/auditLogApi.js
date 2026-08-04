/**
 * API client gọi backend `/api/admin/logs` hoặc `/admin/logs` (BR-ADM-07).
 */
import { mockStore } from '../store/mockDataStore';

const API_BASE = '/api';

export async function fetchAuditLogsApi({
  page = 1,
  limit = 20,
  hanhDong = '',
  doiTuong = '',
  ketQua = '',
} = {}) {
  const token = localStorage.getItem('accessToken');
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (hanhDong) params.set('hanhDong', hanhDong);
  if (doiTuong) params.set('doiTuong', doiTuong);
  if (ketQua) params.set('ketQua', ketQua);

  try {
    const res = await fetch(`${API_BASE}/admin/logs?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        logs: data.data || [],
        pagination: data.pagination || {
          page: Number(page),
          limit: Number(limit),
          total: data.data?.length || 0,
          totalPages: 1,
        },
      };
    }
  } catch (err) {
    console.warn('[auditLogApi] Backend API unavailable, fallback to mockStore:', err.message);
  }

  // Fallback sang mockStore nếu backend offline hoặc token dev
  const mockLogs = mockStore.getAuditLogs() || [];
  let filtered = [...mockLogs];
  if (hanhDong) {
    filtered = filtered.filter((l) =>
      (l.hanh_dong || '').toLowerCase().includes(hanhDong.toLowerCase())
    );
  }
  if (doiTuong) {
    filtered = filtered.filter((l) =>
      (l.doi_tuong || '').toLowerCase().includes(doiTuong.toLowerCase())
    );
  }
  if (ketQua) {
    filtered = filtered.filter((l) => l.ket_qua === ketQua);
  }

  const offset = (page - 1) * limit;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    logs: paginated,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit) || 1,
    },
  };
}
