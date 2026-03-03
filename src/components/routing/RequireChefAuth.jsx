import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireChefAuth() {
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("authRole");

  if (!token) {
    return <Navigate to="/chef/login" state={{ from: location }} replace />;
  }

  if (role && role !== "CHEF") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    return <Navigate to="/chef/login" replace />;
  }

  return <Outlet />;
}
