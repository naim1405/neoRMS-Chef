import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import AuthCard from "../../components/auth/AuthCard";
import AuthForm from "../../components/auth/AuthForm";
import { loginManagement } from "@/services/auth";
import { getChefProfile } from "@/services/profile";
import { useAuth } from "../../context/AuthContext";

export default function ChefLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError("");

    try {
      const { accessToken, user } = await loginManagement({ email, password });
      // Write token to localStorage so the /user/me request interceptor picks it up
      localStorage.setItem("authToken", accessToken);
      const me = await getChefProfile();
      login(accessToken, user.role, me.fullName, me.Chef.tenantId, me.Chef.restaurantId);
      navigate("/dashboard", { replace: true });
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