import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Module-level setter so api.js interceptor can update token without being a React component
let _setToken = null;
export const updateTokenFromInterceptor = (newToken) => {
  localStorage.setItem("authToken", newToken);
  _setToken?.(newToken);
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [role, setRole] = useState(() => localStorage.getItem("authRole"));
  const [tenantId, setTenantId] = useState(() => localStorage.getItem("tenantId"));
  const [restaurantId, setRestaurantId] = useState(() => localStorage.getItem("restaurantId"));
  const [user, setUser] = useState(() => {
    const name = localStorage.getItem("userName");
    const id = localStorage.getItem("userId");
    return (name || id) ? { fullName: name, id } : null;
  });

  // Register the token setter so the api interceptor can reach it
  _setToken = setToken;

  const login = (accessToken, userRole, userName, tenantId, restaurantId, userId) => {
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("authRole", userRole);
    if (userName) localStorage.setItem("userName", userName);
    if (tenantId) localStorage.setItem("tenantId", tenantId);
    if (restaurantId) localStorage.setItem("restaurantId", restaurantId);
    if (userId) localStorage.setItem("userId", userId);
    setToken(accessToken);
    setRole(userRole);
    setTenantId(tenantId ?? null);
    setRestaurantId(restaurantId ?? null);
    setUser({ fullName: userName, id: userId });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("chefName");
    localStorage.removeItem("tenantId");
    localStorage.removeItem("restaurantId");
    localStorage.removeItem("userId");
    setToken(null);
    setRole(null);
    setTenantId(null);
    setRestaurantId(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    if (userData?.fullName) localStorage.setItem("userName", userData.fullName);
    if (userData?.id) localStorage.setItem("userId", userData.id);
    setUser((prev) => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider
      value={{ token, role, tenantId, restaurantId, user, isAuthenticated: !!token, login, logout, updateUser }}
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
