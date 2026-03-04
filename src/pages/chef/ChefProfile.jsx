import React, { useMemo, useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { Button } from "../../components/ui-waiter/button";
import { Input } from "../../components/ui-waiter/input";
import { Label } from "../../components/ui-waiter/label";
import { RightPanel } from "../../components/ui/RightPanel";

// services
import { getChefProfile, updateChefProfile, updateChefPassword } from "../../services/profile";

const DAYS_IN_WEEK = 7;
const MONTH_RANGE = 3;

function getDaysInMonth(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startOffset = first.getDay();
  const daysInMonth = last.getDate();
  const totalCells =
    Math.ceil((startOffset + daysInMonth) / DAYS_IN_WEEK) * DAYS_IN_WEEK;
  const cells = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: null, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true });
  }
  const filled = cells.length;
  for (let i = filled; i < totalCells; i++) {
    cells.push({ day: null, isCurrentMonth: false });
  }
  return cells;
}

function getInitialProfile() {
  return {
    name: localStorage.getItem("chefName") || localStorage.getItem("userName") || "Chef",
    email: localStorage.getItem("chefEmail") || "",
    password: "",
  };
}

// Safely extract the profile object from various API response shapes.
// getChefProfile returns res.data.data (already unwrapped to the inner object).
// updateChefProfile returns res.data which may be { data: {...} } or { name, email, ... }
function extractProfileData(res) {
  if (!res) return {};
  return res.data ?? res;
}

export default function ChefProfile() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [profile, setProfile] = useState(getInitialProfile);
  const [editForm, setEditForm] = useState(() => getInitialProfile());

  // Fetch profile from server on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // getChefProfile already returns res.data.data (the inner user object)
        const data = await getChefProfile();
        console.debug("getChefProfile data", data);

        // normalize server response: prefer fullName but write into name for UI
        const serverName = data.fullName || data.name;
        setProfile((p) => ({ ...p, ...data, name: serverName }));
        setEditForm((f) => ({ ...f, name: serverName }));
        if (data.email) {
          localStorage.setItem("chefEmail", data.email);
        }
      } catch (err) {
        console.error("Failed to load chef profile", err);
      }
    };
    loadProfile();
  }, []);

  const [saveMessage, setSaveMessage] = useState("");
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const videoRef = useRef(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const currentMonthOffset =
    (viewYear - now.getFullYear()) * 12 + (viewMonth - now.getMonth());
  const canGoPrev = currentMonthOffset > -MONTH_RANGE;
  const canGoNext = currentMonthOffset < MONTH_RANGE;

  const goPrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (!canGoNext) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const calendarDays = useMemo(
    () => getDaysInMonth(viewYear, viewMonth),
    [viewYear, viewMonth]
  );





  const monthName = new Date(viewYear, viewMonth).toLocaleString("default", {
    month: "long",
  });

  const handleOpenProfilePanel = () => {
    setEditForm({ name: profile.name, password: "" });
    setProfilePanelOpen(true);
    setShowPasswordFields(false);
    setPasswordError("");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setSaveMessage("");
  };

  const handleCloseProfilePanel = () => {
    setProfilePanelOpen(false);
    setShowPasswordFields(false);
    setSaveMessage("");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const newName = editForm.name?.trim() || profile.name;

    try {
      // send fullName since backend expects it
      const res = await updateChefProfile({ fullName: newName });
      console.debug("updateChefProfile res", res);

      // Normalise: unwrap nested data if present
      const updated = extractProfileData(res);
      const resolvedName = updated.fullName || updated.name || newName;

      setProfile((p) => ({
        ...p,
        name: resolvedName,
        ...(updated.email ? { email: updated.email } : {}),
      }));
      localStorage.setItem("chefName", resolvedName);
      localStorage.setItem("userName", resolvedName);

      setSaveMessage("Profile updated successfully.");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update chef profile", err);
      setSaveMessage("Unable to save profile. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!passwordForm.currentPassword.trim()) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (!passwordForm.newPassword.trim()) {
      setPasswordError("Please enter a new password.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    try {
      await updateChefPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setSaveMessage("Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordFields(false);
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error("Password update failed", err);
      setPasswordError(
        err?.response?.data?.message ||
        "Unable to update password. Please check your current password."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] px-4 py-8 text-[#2C2C2C]">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#2C2C2C]">
            Chef Profile
          </h1>
          <p className="text-sm text-[#999]">
            Manage your profile and attendance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[#FFB3B3] bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#999]">
                Profile
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenProfilePanel}
                className="rounded-lg"
              >
                Update Profile
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-[#999] uppercase tracking-wider">
                  Name
                </p>
                <p className="text-sm text-[#2C2C2C] mt-0.5">{profile.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#999] uppercase tracking-wider">
                  Email
                </p>
                <p className="text-sm text-[#2C2C2C] mt-0.5">{profile.email}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#FFB3B3]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#999] mb-3">
                Attendance
              </h3>
              <button
                type="button"
                onClick={() => setScannerOpen(!scannerOpen)}
                className="w-full rounded-lg bg-[#FF4D4F] hover:bg-[#FF7F7F] text-white p-3 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="h-4 w-4" />
                {scannerOpen ? "Close Scanner" : "Scan QR Code"}
              </button>
              {scannerOpen && (
                <div className="mt-4 rounded-lg border border-[#FFB3B3] overflow-hidden bg-[#FFF5F5] p-4">
                  <video
                    ref={videoRef}
                    className="w-full rounded-lg"
                    style={{ maxHeight: "300px" }}
                  />
                  <p className="text-xs text-[#999] text-center mt-3">
                    Point camera at QR code to scan attendance
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#FFB3B3] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#999]">
                Calendar — {monthName} {viewYear}
              </h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goPrevMonth}
                  disabled={!canGoPrev}
                  className="h-8 w-8 rounded-lg"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goNextMonth}
                  disabled={!canGoNext}
                  className="h-8 w-8 rounded-lg"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="text-[10px] font-medium text-[#999] py-1"
                >
                  {d}
                </div>
              ))}
              {calendarDays.map((cell, i) => (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                    !cell.day
                      ? "bg-transparent"
                      : "bg-[#FFF5F5] text-[#2C2C2C]"
                  }`}
                >
                  {cell.day ?? ""}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Update Profile Panel */}
      <RightPanel
        open={profilePanelOpen}
        onClose={handleCloseProfilePanel}
        title="Update Profile"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name" className="text-[#2C2C2C]">Name</Label>
            <Input
              id="profile-name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Your name"
            />
          </div>
          <Button type="submit" className="rounded-lg w-full">
            Save Name
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#FFB3B3]">
          <button
            type="button"
            onClick={() => {
              setShowPasswordFields((v) => !v);
              setPasswordError("");
            }}
            className="text-sm font-medium text-[#FF4D4F] hover:text-[#FF7F7F] transition-colors"
          >
            {showPasswordFields ? "Cancel Password Update" : "Update Password"}
          </button>
          {showPasswordFields && (
            <form onSubmit={handleSavePassword} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-[#2C2C2C]">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                  }
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-[#2C2C2C]">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-[#2C2C2C]">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                  }
                  placeholder="Confirm new password"
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-600 font-medium">{passwordError}</p>
              )}
              <Button type="submit" className="rounded-lg w-full">
                Update Password
              </Button>
            </form>
          )}
        </div>

        {saveMessage && (
          <p className="mt-4 text-sm text-green-600 font-medium">{saveMessage}</p>
        )}
      </RightPanel>


    </div>
  );
}