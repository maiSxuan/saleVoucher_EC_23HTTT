const API_BASE = "http://localhost:3001/api";

export const reviewApi = {
  list: async () => {
    const response = await fetch(`${API_BASE}/review`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/review/${id}`);
    if (!response.ok) throw new Error("Failed to fetch review");
    return response.json();
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create review");
    return response.json();
  },
  getByPurchaseId: async (voucherPurchaseId) => {
    const response = await fetch(`${API_BASE}/review/purchase/${voucherPurchaseId}`);
    if (!response.ok) throw new Error("Failed to fetch review by purchase id");
    const json = await response.json();
    return json.data;
  },
};
