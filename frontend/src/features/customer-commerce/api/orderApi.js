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
  return json.data;
}
export async function reviewOrder(voucherIds) {
  const res = await fetch(`${BASE_URL}/orders/review`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ voucherIds }),
  });
  return handleResponse(res);
}

export async function createOrder({ voucherIds, paymentMethod }) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ voucherIds, paymentMethod }),
  });
  return handleResponse(res); // { orderId, paymentId, redirectUrl }
}

export async function cancelOrder(orderId) {
  const res = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
    method: "POST",
    headers: authHeaders(),
  });
  return handleResponse(res);
}
