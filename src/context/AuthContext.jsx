import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [role, setRole] = useState(() => localStorage.getItem("authRole"));

  const login = (accessToken, userRole, userName) => {
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("authRole", userRole);
    if (userName) localStorage.setItem("userName", userName);
    setToken(accessToken);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("chefName");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
