const API_BASE = "http://localhost:3001/api";

function getHeaders() {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("ec_auth_token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const contentApi = {
  list: async (type) => {
    const url = type ? `${API_BASE}/content?loai=${type}` : `${API_BASE}/content`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch contents");
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/content/${id}`);
    if (!response.ok) throw new Error("Failed to fetch content");
    return response.json();
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE}/content`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create content");
    return response.json();
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE}/content/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update content");
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE}/content/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete content");
    return response.json();
  },
  listCategories: async () => {
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
