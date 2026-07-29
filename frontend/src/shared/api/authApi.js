const API_BASE_URL = "http://localhost:3001/api/auth";

export async function loginApi({ username, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Đăng nhập không thành công!");
    }

    return data;
  } catch (error) {
    // If backend server fails to respond, throw clear error
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Không thể kết nối đến Backend Server");
    }
    throw error;
  }
}

export async function logoutApi(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return await response.json();
  } catch (e) {
    return { success: true };
  }
}

export async function getMeApi(token) {
  if (!token) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return null;
    }
    return data.user;
  } catch (e) {
    return null;
  }
}
