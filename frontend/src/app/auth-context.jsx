import React, { createContext, useContext, useState, useEffect } from "react";
import { loginApi, logoutApi, getMeApi } from "../shared/api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("ec_auth_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("ec_auth_token") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      getMeApi(token).then((userData) => {
        if (userData) {
          setUser(userData);
          localStorage.setItem("ec_auth_user", JSON.stringify(userData));
        } else {
          // Token expired or invalid
          setToken("");
          setUser(null);
          localStorage.removeItem("ec_auth_token");
          localStorage.removeItem("ec_auth_user");
        }
      });
    }
  }, [token, user]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await loginApi({ username, password });
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem("ec_auth_token", res.token);
        localStorage.setItem("ec_auth_user", JSON.stringify(res.user));
        setLoading(false);
        return res;
      } else {
        throw new Error(res.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      setLoading(false);
      throw error;
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
      setToken("");
      setUser(null);
      localStorage.removeItem("ec_auth_token");
      localStorage.removeItem("ec_auth_user");
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
