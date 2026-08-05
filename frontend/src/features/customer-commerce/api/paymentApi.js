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

export async function finalizeVnpayReturn(queryParams) {
  const res = await fetch(
    `${BASE_URL}/payment/vnpay-return?${new URLSearchParams(queryParams).toString()}`,
    {
      method: "POST",
      headers: authHeaders(),
    },
  );
  return handleResponse(res);
}

export async function finalizePaypalReturn(token) {
  const res = await fetch(`${BASE_URL}/payment/paypal-return`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ token }),
  });
  return handleResponse(res);
}
