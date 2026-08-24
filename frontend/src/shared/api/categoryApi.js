const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

function getHeaders() {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("ec_auth_token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const categoryApi = {
  fetchCategories: async () => {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  },
  createCategory: async (data) => {
    const response = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create category");
    return response.json();
  },
  updateCategory: async (id, data) => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update category");
    return response.json();
  },
  deleteCategory: async (id) => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete category");
    return response.json();
  },
};
