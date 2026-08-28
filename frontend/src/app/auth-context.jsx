import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { loginApi, logoutApi, getMeApi, refreshApi } from "../shared/api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user") || localStorage.getItem("ec_auth_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("accessToken") || localStorage.getItem("ec_auth_token") || ""
  );

  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem("refreshToken") || ""
  );

  const [loading, setLoading] = useState(false);
  const [sessionChecking, setSessionChecking] = useState(true);
  const sessionValidationStarted = useRef(false);

  // ---------------------------------------------------------------
  // persistSession — lưu/xóa toàn bộ session (access + refresh + user)
  // ---------------------------------------------------------------
  const persistSession = useCallback((nextToken, nextUser, nextRefreshToken) => {
    setToken(nextToken || "");
    setUser(nextUser || null);
    setRefreshToken(nextRefreshToken || "");

    if (nextToken && nextUser) {
      localStorage.setItem("accessToken", nextToken);
      localStorage.setItem("user", JSON.stringify(nextUser));
      // Tương thích với các màn hình cũ
      localStorage.setItem("ec_auth_token", nextToken);
      localStorage.setItem("ec_auth_user", JSON.stringify(nextUser));

      if (nextRefreshToken) {
        localStorage.setItem("refreshToken", nextRefreshToken);
      }
      return;
    }

    // Clear all
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("ec_auth_token");
    localStorage.removeItem("ec_auth_user");
    localStorage.removeItem("refreshToken");
  }, []);

  // ---------------------------------------------------------------
  // refreshSession — dùng refreshToken để lấy accessToken mới
  // Trả về true nếu thành công, false nếu thất bại (cần login lại)
  // ---------------------------------------------------------------
  const refreshSession = useCallback(async () => {
    const storedRefreshToken =
      refreshToken || localStorage.getItem("refreshToken");

    if (!storedRefreshToken) return false;

    try {
      const result = await refreshApi(storedRefreshToken);
      if (result && result.accessToken) {
        // Cập nhật access token + refresh token mới (rotation)
        const currentUser = user || JSON.parse(localStorage.getItem("user") || "null");
        persistSession(result.accessToken, currentUser, result.refreshToken || storedRefreshToken);
        return true;
      }
    } catch (e) {
      console.warn("[Auth] refreshSession thất bại:", e);
    }

    // Refresh thất bại → clear session
    persistSession("", null, "");
    return false;
  }, [refreshToken, user, persistSession]);

  // ---------------------------------------------------------------
  // Khi mount: luôn xác minh token với backend, kể cả localStorage vẫn còn user.
  // Điều này ngăn session cũ/hết hạn bị hiểu nhầm là đang đăng nhập.
  // ---------------------------------------------------------------
  useEffect(() => {
    if (sessionValidationStarted.current) return;
    sessionValidationStarted.current = true;

    async function validateStoredSession() {
      if (!token) {
        persistSession("", null, "");
        setSessionChecking(false);
        return;
      }

      let validToken = token;
      let validRefreshToken = refreshToken;
      let userData = await getMeApi(validToken);

      if (!userData && validRefreshToken) {
        const refreshed = await refreshApi(validRefreshToken);
        if (refreshed?.accessToken) {
          validToken = refreshed.accessToken;
          validRefreshToken = refreshed.refreshToken || validRefreshToken;
          userData = await getMeApi(validToken);
        }
      }

      if (userData) {
        persistSession(validToken, userData, validRefreshToken);
      } else {
        persistSession("", null, "");
      }

      setSessionChecking(false);
    }

    validateStoredSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------
  // login — dùng bởi LoginPage qua auth context (không dùng trực tiếp)
  // ---------------------------------------------------------------
  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await loginApi({ username, password });
      if (res.success && res.token) {
        persistSession(res.token, res.user, res.refreshToken || "");
        return res;
      }
      throw new Error(res.message || "Đăng nhập thất bại");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------
  // logout — revoke refreshToken trên server + clear local state
  // ---------------------------------------------------------------
  const logout = async () => {
    setLoading(true);

    const currentAccessToken =
      token ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem(LEGACY_TOKEN_KEY) ||
      "";
    const currentRefreshToken =
      refreshToken || localStorage.getItem("refreshToken") || "";

    // Xóa phiên phía trình duyệt ngay lập tức, không chờ API đăng xuất hoàn tất.
    persistSession("", null, "");

    try {
      if (currentAccessToken || currentRefreshToken) {
        await logoutApi(currentAccessToken, currentRefreshToken);
      }
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isAuthenticated: !sessionChecking && !!user && !!token,
        loading: loading || sessionChecking,
        login,
        logout,
        setUser,
        setToken,
        persistSession,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
