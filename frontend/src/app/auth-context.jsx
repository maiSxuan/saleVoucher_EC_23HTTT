import React, { createContext, useContext, useState, useEffect } from "react";
import { loginApi, logoutApi, getMeApi } from "../shared/api/authApi";

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
  const [loading, setLoading] = useState(false);

  const persistSession = (nextToken, nextUser) => {
    setToken(nextToken || "");
    setUser(nextUser || null);

    if (nextToken && nextUser) {
      localStorage.setItem("accessToken", nextToken);
      localStorage.setItem("user", JSON.stringify(nextUser));
      // Giữ tương thích với các màn hình do Ngân phát triển.
      localStorage.setItem("ec_auth_token", nextToken);
      localStorage.setItem("ec_auth_user", JSON.stringify(nextUser));
      return;
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("ec_auth_token");
    localStorage.removeItem("ec_auth_user");
  };

  useEffect(() => {
    if (token && !user) {
      getMeApi(token).then((userData) => {
        if (userData) {
          persistSession(token, userData);
        } else {
          persistSession("", null);
        }
      });
    }
    // persistSession chỉ ghi state/localStorage và không phụ thuộc props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await loginApi({ username, password });
      if (res.success && res.token) {
        persistSession(res.token, res.user);
        return res;
      }
      throw new Error(res.message || "Đăng nhập thất bại");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (token) {
        await logoutApi(token);
      }
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      persistSession("", null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        logout,
        setUser,
        setToken,
        persistSession,
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
