import { useEffect, useMemo, useState } from "react";
import {
  getChefProfile,
  updateChefProfile,
  updateChefPassword,
} from "../services/profile";

export function useChefProfile(orders) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let data = await getChefProfile();
        // make sure we always have a `name` for UI convenience
        if (data?.fullName && !data.name) {
          data = { ...data, name: data.fullName };
        }
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Calculate stats from orders
  const stats = useMemo(() => {
    const readyOrders = orders?.filter((o) => o.status === "ready") ?? [];

    return {
      totalCompleted: readyOrders.length,
      totalItemsCooked: readyOrders.flatMap((o) => o.items ?? []).length,
    };
  }, [orders]);

  // Update profile
  const handleUpdateProfile = async (payload) => {
    try {
      setSaving(true);
      const normalized = { ...payload };
      if (normalized.name && !normalized.fullName) {
        normalized.fullName = normalized.name;
        delete normalized.name;
      }
      await updateChefProfile(normalized);
      let updated = await getChefProfile();
      if (updated?.fullName && !updated.name) {
        updated = { ...updated, name: updated.fullName };
      }
      setProfile(updated);
    } catch (err) {
      console.error("Profile update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  // Update password
  const handleUpdatePassword = async (payload) => {
    try {
      setSaving(true);
      await updateChefPassword(payload);
    } catch (err) {
      console.error("Password update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    stats,
    loading,
    saving,
    handleUpdateProfile,
    handleUpdatePassword,
  };
}