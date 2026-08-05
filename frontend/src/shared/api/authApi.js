const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || "/api"}/auth`;

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

    const payload = data.data || data;
    return {
      success: true,
      message: data.message,
      token: payload.accessToken || payload.token,
      accessToken: payload.accessToken || payload.token,
      refreshToken: payload.refreshToken || null,
      user: payload.user,
    };
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Không thể kết nối đến Backend Server");
    }
    throw error;
  }
}

export async function logoutApi(token, refreshToken) {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ refreshToken: refreshToken || null }),
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
    return data.data || data.user || null;
  } catch (e) {
    return null;
  }
}

/**
 * Gửi yêu cầu OTP quên mật khẩu
 * @param {string} emailOrPhone - Email hoặc SĐT đăng ký
 */
export async function forgotPasswordApi(emailOrPhone) {
  try {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailOrPhone }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể gửi mã xác thực. Vui lòng thử lại.");
    }

    return {
      success: true,
      message: data.message || "Mã OTP đã được gửi đến email của bạn.",
      data: data.data,
    };
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Không thể kết nối đến máy chủ Backend.");
    }
    throw error;
  }
}

/**
 * Kiểm tra tính hợp lệ của mã xác thực OTP (UC-BUS-05 Bước 11)
 * @param {{ email: string, otp: string }}
 */
export async function verifyOtpApi({ email, otp }) {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Mã xác thực không hợp lệ.");
    }

    return {
      success: true,
      message: data.message || "Mã xác thực hợp lệ.",
      data: data.data,
    };
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Không thể kết nối đến máy chủ Backend.");
    }
    throw error;
  }
}

/**
 * Đặt lại mật khẩu mới sau khi xác thực OTP thành công (UC-BUS-05 Bước 15-16)
 * @param {{ email: string, otp: string, newPassword: string, confirmPassword: string }}
 */
export async function resetPasswordApi({ email, otp, newPassword, confirmPassword }) {
  try {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Đặt lại mật khẩu thất bại.");
    }

    return {
      success: true,
      message: data.message || "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.",
      data: data.data,
    };
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Không thể kết nối đến máy chủ Backend.");
    }
    throw error;
  }
}

/**
 * Đăng nhập trực tiếp bằng mã OTP (UC-BUS dự phòng)
 * @param {{ email: string, otp: string }}
 */
export async function loginWithOtpApi({ email, otp }) {
  try {
    const response = await fetch(`${API_BASE_URL}/login-with-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Đăng nhập bằng OTP thất bại!");
    }

    const payload = data.data || data;
    return {
      success: true,
      message: data.message,
      token: payload.accessToken || payload.token,
      accessToken: payload.accessToken || payload.token,
      refreshToken: payload.refreshToken || null,
      user: payload.user,
    };
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Không thể kết nối đến Backend Server");
    }
    throw error;
  }
}

/**
 * Dùng refreshToken để lấy accessToken mới.
 * @param {string} refreshToken
 * @returns {{ accessToken, refreshToken } | null}
 */
export async function refreshApi(refreshToken) {
  if (!refreshToken) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return null;
    }

    const payload = data.data || {};
    return {
      accessToken: payload.accessToken || payload.token || null,
      refreshToken: payload.refreshToken || null,
    };
  } catch (e) {
    return null;
  }
}

