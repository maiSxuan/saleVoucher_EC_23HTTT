/**
 * Purpose: Context mẫu cho xác thực người dùng.
 * Dùng để lưu thông tin người dùng và role hiện tại trong ứng dụng.
 */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ role: "customer" });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
