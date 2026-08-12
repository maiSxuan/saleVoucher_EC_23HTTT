const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

function authHeaders() {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("ec_auth_token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const feedbackApi = {
  list: async () => {
    const response = await fetch(`${API_BASE}/feedback`, { headers: authHeaders() });
    if (!response.ok) throw new Error("Failed to fetch feedbacks");
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/feedback/${id}`, { headers: authHeaders() });
    if (!response.ok) throw new Error("Failed to fetch feedback");
    return response.json();
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create feedback");
    return response.json();
  },
  getByPurchaseId: async (voucherPurchaseId) => {
    const response = await fetch(`${API_BASE}/feedback/purchase/${voucherPurchaseId}`, { headers: authHeaders() });
    if (!response.ok) throw new Error("Failed to fetch feedback by purchase id");
    const json = await response.json();
    return json.data;
  },
  updateStatus: async (id, { status }) => {
    const response = await fetch(`${API_BASE}/feedback/${id}/status`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const json = await response.json().catch(() => null);
      throw new Error(json?.message || "Failed to update complaint status");
    }
    return response.json();
  },
};
