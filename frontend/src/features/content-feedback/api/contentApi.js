const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

function getHeaders() {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("ec_auth_token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const contentApi = {
  list: async (type, lang) => {
    const currentLang = lang || localStorage.getItem("i18nextLng") || "vi";
    const params = new URLSearchParams();
    if (type) params.append("loai", type);
    if (currentLang) params.append("lang", currentLang);
    const url = `${API_BASE}/content?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch contents");
    const json = await response.json();
    return json.data || json;
  },
  getById: async (id, lang) => {
    const currentLang = lang || localStorage.getItem("i18nextLng") || "vi";
    const response = await fetch(`${API_BASE}/content/${id}?lang=${encodeURIComponent(currentLang)}`);
    if (!response.ok) throw new Error("Failed to fetch content");
    const json = await response.json();
    return json.data || json;
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
  }
};
