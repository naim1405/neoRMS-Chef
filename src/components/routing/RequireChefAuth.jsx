import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireChefAuth() {
  const location = useLocation();
  const { isAuthenticated, role, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && role !== "CHEF") {
    logout();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
