const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res) {
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(json?.message || "Có lỗi xảy ra");
    err.details = json?.details;
    throw err;
  }
  return json;
}

// --- Customer API ---
export async function fetchCustomerOrders(status = '', page = 1, limit = 10) {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  params.append('page', page);
  params.append('limit', limit);
  const res = await fetch(`${BASE_URL}/customer/orders?${params.toString()}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const json = await handleResponse(res);
  return {
    orders: json.data || [],
    pagination: json.pagination || { page: 1, limit, total: 0, totalPages: 0 },
  };
}

export async function fetchCustomerOrderDetail(id) {
  const res = await fetch(`${BASE_URL}/customer/orders/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const json = await handleResponse(res);
  return json.data;
}

export async function submitOrderComplaint(id, { maVoucherMua, noiDung }) {
  const res = await fetch(`${BASE_URL}/customer/orders/${id}/complaints`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ maVoucherMua, noiDung }),
  });
  return handleResponse(res);
}

export async function submitOrderReview(id, { maVoucherMua, diem, noiDung }) {
  const res = await fetch(`${BASE_URL}/customer/orders/${id}/reviews`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ maVoucherMua, diem, noiDung }),
  });
  return handleResponse(res);
}

export async function customerCancelOrder(id, { reason }) {
  const res = await fetch(`${BASE_URL}/customer/orders/${id}/cancel`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ reason }),
  });
  return handleResponse(res);
}

// --- Admin API ---
export async function fetchAdminOrders(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.orderStatus) params.append('orderStatus', filters.orderStatus);
  if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
  if (filters.voucherCodeStatus) params.append('voucherCodeStatus', filters.voucherCodeStatus);
  params.append('page', filters.page || 1);
  params.append('limit', filters.limit || 10);

  const res = await fetch(`${BASE_URL}/admin/orders?${params.toString()}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const json = await handleResponse(res);
  return {
    orders: json.data || [],
    pagination: json.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    total: json.pagination?.total || 0,
  };
}

export async function fetchAdminOrderDetail(id) {
  const res = await fetch(`${BASE_URL}/admin/orders/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const json = await handleResponse(res);
  return json.data;
}

export async function fetchAdminOrderLogs(id) {
  const res = await fetch(`${BASE_URL}/admin/orders/${id}/logs`, {
    method: "GET",
    headers: authHeaders(),
  });
  const json = await handleResponse(res);
  return json.data || [];
}

export async function updateOrderPaymentStatus(id, { newStatus, reason }) {
  const res = await fetch(`${BASE_URL}/admin/orders/${id}/payment-status`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ newStatus, reason }),
  });
  return handleResponse(res);
}

export async function adminCancelOrder(id, { reason }) {
  const res = await fetch(`${BASE_URL}/admin/orders/${id}/cancel`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ reason }),
  });
  return handleResponse(res);
}

export async function confirmOrderRefund(id, { reason }) {
  const res = await fetch(`${BASE_URL}/admin/orders/${id}/refund`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ reason }),
  });
  return handleResponse(res);
}

export async function rejectOrderRefund(id, { reason }) {
  const res = await fetch(`${BASE_URL}/admin/orders/${id}/refund/reject`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ reason }),
  });
  return handleResponse(res);
}

export async function reissueOrderCode(id, { maVoucherMua }) {
  const res = await fetch(`${BASE_URL}/admin/orders/${id}/reissue-code`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ maVoucherMua }),
  });
  return handleResponse(res);
}
