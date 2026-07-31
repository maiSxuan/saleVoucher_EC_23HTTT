const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// -----------------------------------------------------------------------
// Helper: tạo headers chuẩn cho mọi request cần xác thực
// Lấy token từ localStorage (được lưu khi login thành công)
// -----------------------------------------------------------------------
function getAuthHeaders() {
  const token = localStorage.getItem('accessToken'); // Key đồng bộ với LoginPage.jsx
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, // Backend authenticate middleware đọc header này
  };
}

// -----------------------------------------------------------------------
// Helper: xử lý response từ fetch
// - Nếu HTTP error (4xx, 5xx) → parse JSON và throw error message từ backend
// - Nếu thành công → trả về JSON data
// -----------------------------------------------------------------------
async function handleResponse(res) {
  const json = await res.json();
  if (!res.ok) {
    // Backend trả về { success: false, message: '...' }
    throw new Error(json.message || `Lỗi server: ${res.status}`);
  }
  return json; // { success: true, data: ..., pagination: ... }
}

// -----------------------------------------------------------------------
// 1. LẤY DANH SÁCH NGƯỜI DÙNG
//    GET /admin/users?page=&limit=&name=&phone=&role=&status=
// -----------------------------------------------------------------------
export async function fetchUsers({ page = 1, limit = 20, name = '', phone = '', role = '', status = '' } = {}) {
  // Tạo query string từ params (bỏ qua giá trị rỗng để URL sạch hơn)
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (name) params.set('name', name);
  if (phone) params.set('phone', phone);
  if (role) params.set('role', role);
  if (status) params.set('status', status);

  const res = await fetch(`${BASE_URL}/admin/users?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(), // Cần token Admin
  });

  return handleResponse(res);
  // Trả về: { success: true, data: User[], pagination: { page, limit, total, totalPages } }
}

// -----------------------------------------------------------------------
// 2. LẤY CHI TIẾT NGƯỜI DÙNG
//    GET /admin/users/:userId
// -----------------------------------------------------------------------
export async function fetchUserById(userId) {
  const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
  // Trả về: { success: true, data: User }
}

// -----------------------------------------------------------------------
// 3. KHÓA TÀI KHOẢN
//    PATCH /admin/users/:userId/lock    Body: { reason }
// -----------------------------------------------------------------------
export async function lockUser(userId, reason) {
  const res = await fetch(`${BASE_URL}/admin/users/${userId}/lock`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }), // Gửi lý do khóa lên backend để ghi vào audit log
  });
  return handleResponse(res);
  // Trả về: { success: true, message: 'Khóa tài khoản thành công', data: updatedUser }
}

// -----------------------------------------------------------------------
// 4. MỞ KHÓA TÀI KHOẢN
//    PATCH /admin/users/:userId/unlock  Body: { reason }
// -----------------------------------------------------------------------
export async function unlockUser(userId, reason) {
  const res = await fetch(`${BASE_URL}/admin/users/${userId}/unlock`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }),
  });
  return handleResponse(res);
}

// -----------------------------------------------------------------------
// 5. CẬP NHẬT VAI TRÒ
//    PATCH /admin/users/:userId/role    Body: { newRole, maChiNhanh, maHsdn, reason }
// -----------------------------------------------------------------------
export async function updateUserRole(userId, newRole, maChiNhanh, maHsdn, reason) {
  const res = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ newRole, maChiNhanh, maHsdn, reason }),
  });
  return handleResponse(res);
}

// -----------------------------------------------------------------------
// 6. LẤY DANH SÁCH CHI NHÁNH VÀ ĐỐI TÁC (CHO COMBOBOX)
// -----------------------------------------------------------------------
export async function fetchBranches() {
  const res = await fetch(`${BASE_URL}/admin/branches`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function fetchPartners() {
  const res = await fetch(`${BASE_URL}/admin/partners`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

