const API_BASE = "http://localhost:3001/api";

export const feedbackApi = {
  list: async () => {
    const response = await fetch(`${API_BASE}/feedback`);
    if (!response.ok) throw new Error("Failed to fetch feedbacks");
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/feedback/${id}`);
    if (!response.ok) throw new Error("Failed to fetch feedback");
    return response.json();
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create feedback");
    return response.json();
  },
  getByPurchaseId: async (voucherPurchaseId) => {
    const response = await fetch(`${API_BASE}/feedback/purchase/${voucherPurchaseId}`);
    if (!response.ok) throw new Error("Failed to fetch feedback by purchase id");
    const json = await response.json();
    return json.data;
  },
  updateStatus: async (id, { status }) => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("ec_auth_token") || "";
    const response = await fetch(`${API_BASE}/feedback/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const json = await response.json().catch(() => null);
      throw new Error(json?.message || "Failed to update complaint status");
    }
    return response.json();
  },
};
