const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res, message) {
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || message);
  }
  return json.data;
}

export async function fetchCart() {
  const res = await fetch(`${BASE_URL}/cart`, { headers: authHeaders() });
  return handleResponse(res, "Không thể fetch dữ liệu trong giỏ hàng");
}

export async function addToCart(voucherId, quantity) {
  const res = await fetch(`${BASE_URL}/cart/items`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ voucherId, quantity }),
  });
  return handleResponse(res, "Không thể thêm vào giỏ hàng");
}

export async function updateCartItemQuantity(voucherId, quantity) {
  const res = await fetch(`${BASE_URL}/cart/items/${voucherId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ quantity }),
  });

  return handleResponse(res, "Không thể update được số lượng của voucher");
}

// xóa các voucher được chọn
export async function removeCartItems(voucherIds) {
  const res = await fetch(`${BASE_URL}/cart/items`, {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify({ voucherIds }),
  });

  return handleResponse(res, "Không thể xóa các voucher đã chọn");
}
