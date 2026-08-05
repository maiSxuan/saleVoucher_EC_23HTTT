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
};
