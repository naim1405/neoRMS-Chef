// src/pages/login/ManagementLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../../components/auth/AuthCard"
import AuthForm from "../../components/auth/AuthForm"
import { loginManagement } from "@/services/auth"; 

export default function ManagementLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError("");

    try {
      const { accessToken, user } = await loginManagement({ email, password });

      // Save to localStorage
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("authRole", user.role);
      localStorage.setItem("role", String(user.role).toLowerCase());
      if (user?.fullName || user?.name) {
        localStorage.setItem("userName", user.fullName || user.name);
      }

      // Navigate after successful login
      navigate("/admin", { replace: true });
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back" description="Sign in to manage your restaurant operations.">
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        submitLabel="Sign in"
      />
      <p className="mt-4 text-xs text-neutral-400">
        Only the restaurant owner can self-register. Managers and staff should use their assigned credentials.
      </p>
    </AuthCard>
  );
}