const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function addToCart(voucherId, quantity) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ voucherId, quantity }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || "Không thể thêm vào giỏ hàng");
  }
  return json.data;
}
