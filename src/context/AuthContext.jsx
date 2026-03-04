import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [role, setRole] = useState(() => localStorage.getItem("authRole"));
  const [tenantId, setTenantId] = useState(() => localStorage.getItem("tenantId"));
  const [restaurantId, setRestaurantId] = useState(() => localStorage.getItem("restaurantId"));

  const login = (accessToken, userRole, userName, tenantId, restaurantId) => {
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("authRole", userRole);
    if (userName) localStorage.setItem("userName", userName);
    if (tenantId) localStorage.setItem("tenantId", tenantId);
    if (restaurantId) localStorage.setItem("restaurantId", restaurantId);
    setToken(accessToken);
    setRole(userRole);
    setTenantId(tenantId ?? null);
    setRestaurantId(restaurantId ?? null);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("chefName");
    localStorage.removeItem("tenantId");
    localStorage.removeItem("restaurantId");
    setToken(null);
    setRole(null);
    setTenantId(null);
    setRestaurantId(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, tenantId, restaurantId, isAuthenticated: !!token, login, logout }}
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
