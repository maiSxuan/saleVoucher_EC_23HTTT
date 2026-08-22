const API_BASE = "http://localhost:3001/api";

export const reviewApi = {
  list: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.rating && filters.rating !== "all") params.append("rating", filters.rating);
    if (filters.userId) params.append("userId", filters.userId);
    if (filters.voucherId) params.append("voucherId", filters.voucherId);
    if (filters.fromDate) params.append("fromDate", filters.fromDate);
    if (filters.toDate) params.append("toDate", filters.toDate);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const url = `${API_BASE}/review${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);
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
  delete: async (id) => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("ec_auth_token") || "";
    const response = await fetch(`${API_BASE}/review/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!response.ok) throw new Error("Failed to delete review");
    return response.json();
  },
  getByPurchaseId: async (voucherPurchaseId) => {
    const response = await fetch(`${API_BASE}/review/purchase/${voucherPurchaseId}`);
    if (!response.ok) throw new Error("Failed to fetch review by purchase id");
    const json = await response.json();
    return json.data;
  },
};
