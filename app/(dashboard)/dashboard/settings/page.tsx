"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  preferences?: {
    theme: "light" | "dark";
    notifications: boolean;
    publicProfile: boolean;
  };
  privacySettings?: {
    showOnPublicGallery: boolean;
    albumsPrivateByDefault: boolean;
  };
}

export default function SettingsPage() {
  const { token } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<
    "account" | "privacy" | "preferences"
  >("account");

  // Account states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Privacy states
  const [showOnPublicGallery, setShowOnPublicGallery] = useState(false);
  const [albumsPrivateByDefault, setAlbumsPrivateByDefault] = useState(true);

  // Preferences states
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (token) {
      loadUserProfile();
    }
  }, [token]);

  const loadUserProfile = async () => {
    try {
      console.log("🔄 Loading user profile...");
      const response = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.user) {
        console.log("📊 User data loaded:", data.user);
        setUser(data.user);
        setName(data.user.name || "");
        setEmail(data.user.email || "");

        // Load preferences
        if (data.user.preferences) {
          console.log("🎨 Preferences loaded:", data.user.preferences);
          setTheme(data.user.preferences.theme || "light");
          setNotifications(data.user.preferences.notifications ?? true);
        }

        // Load privacy settings
        if (data.user.privacySettings) {
          console.log("🔒 Privacy settings loaded:", data.user.privacySettings);
          setShowOnPublicGallery(
            data.user.privacySettings.showOnPublicGallery ?? false
          );
          setAlbumsPrivateByDefault(
            data.user.privacySettings.albumsPrivateByDefault ?? true
          );
        } else {
          console.log("⚠️ No privacy settings found, using defaults");
        }
      }
    } catch (error) {
      console.error("❌ Error loading profile:", error);
      setMessage("❌ Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Save account settings
  const saveAccountSettings = async () => {
    if (!name.trim()) {
      setMessage("❌ Name is required");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setMessage("✅ Profile updated successfully!");
        await loadUserProfile();
      } else {
        setMessage("❌ Failed to update profile");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMessage("❌ Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("❌ All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setMessage("✅ Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.error || "Failed to change password"}`);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMessage("❌ Error changing password");
    } finally {
      setSaving(false);
    }
  };

  // Save preferences
  const savePreferences = async () => {
    setSaving(true);
    setMessage("");

    try {
      console.log("💾 Saving preferences...");
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          theme,
          notifications,
          publicProfile: false,
        }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        setMessage("✅ Preferences saved successfully!");
      } else {
        setMessage(`❌ ${data.error || "Failed to save preferences"}`);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMessage("❌ Error saving preferences");
    } finally {
      setSaving(false);
    }
  };

  // Save privacy settings
  const savePrivacySettings = async () => {
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        showOnPublicGallery,
        albumsPrivateByDefault,
      };

      console.log("🚀 Saving privacy settings:", payload);
      console.log("Token:", token?.substring(0, 20) + "...");

      const response = await fetch("/api/user/privacy", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response content-type:",
        response.headers.get("content-type")
      );

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.success) {
        setMessage("✅ Privacy settings saved successfully!");
        console.log("✅ Settings saved, reloading profile...");

        // Reload user profile to verify
        setTimeout(() => {
          loadUserProfile();
        }, 300);
      } else {
        const errorMsg =
          data.error || data.message || "Failed to save privacy settings";
        setMessage(`❌ ${errorMsg}`);
        console.error("❌ Save failed:", errorMsg);
      }
    } catch (error) {
      console.error("❌ Error saving privacy settings:", error);
      setMessage(`❌ Error: ${String(error)}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}
        >
          Settings ⚙️
        </h1>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          Manage your account and preferences
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            background: message.includes("✅") ? "#dcfce7" : "#fee2e2",
            border:
              "2px solid " + (message.includes("✅") ? "#86efac" : "#fca5a5"),
            color: message.includes("✅") ? "#166534" : "#991b1b",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "24px",
            fontSize: "14px",
          }}
        >
          {message}
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          borderBottom: "2px solid #e5e7eb",
          background: "white",
          borderRadius: "12px 12px 0 0",
          padding: "0 20px",
        }}
      >
        {[
          { id: "account" as const, label: "👤 Account" },
          { id: "privacy" as const, label: "🔒 Privacy" },
          { id: "preferences" as const, label: "🎨 Preferences" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "16px 20px",
              border: "none",
              background: "none",
              borderBottom: activeTab === tab.id ? "3px solid #ec4899" : "none",
              color: activeTab === tab.id ? "#ec4899" : "#6b7280",
              fontWeight: activeTab === tab.id ? "bold" : "500",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        style={{
          background: "white",
          borderRadius: "0 0 12px 12px",
          border: "2px solid #e5e7eb",
          padding: "24px",
        }}
      >
        {/* ACCOUNT TAB */}
        {activeTab === "account" && (
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              Account Information
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#ec4899")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  background: "#f9fafb",
                  cursor: "not-allowed",
                  opacity: 0.6,
                }}
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "8px 0 0 0",
                }}
              >
                Email cannot be changed
              </p>
            </div>

            <button
              onClick={saveAccountSettings}
              disabled={saving}
              style={{
                padding: "12px 24px",
                background: saving
                  ? "#d1d5db"
                  : "linear-gradient(90deg, #ec4899, #a855f7)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: saving ? "not-allowed" : "pointer",
                fontSize: "14px",
                marginBottom: "32px",
              }}
            >
              {saving ? "⏳ Saving..." : "💾 Save Changes"}
            </button>

            {/* Change Password */}
            <div
              style={{
                background: "#f9fafb",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                }}
              >
                Change Password
              </h3>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#ec4899")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#ec4899")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#ec4899")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <button
                onClick={changePassword}
                disabled={saving}
                style={{
                  padding: "12px 24px",
                  background: saving ? "#d1d5db" : "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: "14px",
                }}
              >
                {saving ? "⏳ Changing..." : "🔐 Change Password"}
              </button>
            </div>
          </div>
        )}

        {/* PRIVACY TAB */}
        {activeTab === "privacy" && (
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              🔒 Privacy & Gallery Settings
            </h2>

            <div
              style={{
                background: "#f9fafb",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ flex: 1, marginRight: "16px" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      margin: "0 0 4px 0",
                    }}
                  >
                    🌐 Feature on Public Gallery
                  </h3>
                  <p
                    style={{ fontSize: "13px", color: "#6b7280", margin: "0" }}
                  >
                    Show your wedding on the homepage gallery (visible to
                    everyone)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={showOnPublicGallery}
                  onChange={(e) => {
                    console.log(
                      "🔄 Toggling public gallery:",
                      e.target.checked
                    );
                    setShowOnPublicGallery(e.target.checked);
                  }}
                  style={{
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    marginTop: "4px",
                    flexShrink: 0,
                  }}
                />
              </div>
              {showOnPublicGallery && (
                <p
                  style={{
                    fontSize: "12px",
                    background: "#dbeafe",
                    color: "#1e40af",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    margin: "8px 0 0 0",
                  }}
                >
                  ✅ Your wedding will appear on the public gallery homepage
                </p>
              )}
            </div>

            <div
              style={{
                background: "#f9fafb",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ flex: 1, marginRight: "16px" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      margin: "0 0 4px 0",
                    }}
                  >
                    🔐 Keep All Albums Private
                  </h3>
                  <p
                    style={{ fontSize: "13px", color: "#6b7280", margin: "0" }}
                  >
                    All new albums will be private by default (you can change
                    per album)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={albumsPrivateByDefault}
                  onChange={(e) => {
                    console.log(
                      "🔄 Toggling private albums:",
                      e.target.checked
                    );
                    setAlbumsPrivateByDefault(e.target.checked);
                  }}
                  style={{
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    marginTop: "4px",
                    flexShrink: 0,
                  }}
                />
              </div>
              {albumsPrivateByDefault && (
                <p
                  style={{
                    fontSize: "12px",
                    background: "#dcfce7",
                    color: "#166534",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    margin: "8px 0 0 0",
                  }}
                >
                  ✅ All new albums will be private by default
                </p>
              )}
            </div>

            <button
              onClick={savePrivacySettings}
              disabled={saving}
              style={{
                padding: "12px 24px",
                background: saving
                  ? "#d1d5db"
                  : "linear-gradient(90deg, #ec4899, #a855f7)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: saving ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
              onMouseEnter={(e) =>
                !saving && (e.currentTarget.style.opacity = "0.9")
              }
              onMouseLeave={(e) =>
                !saving && (e.currentTarget.style.opacity = "1")
              }
            >
              {saving ? "⏳ Saving..." : "💾 Save Privacy Settings"}
            </button>
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === "preferences" && (
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              🎨 User Preferences
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "12px",
                  fontSize: "14px",
                }}
              >
                Theme
              </label>
              <div style={{ display: "flex", gap: "12px" }}>
                {[
                  { value: "light" as const, label: "☀️ Light" },
                  { value: "dark" as const, label: "🌙 Dark" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    style={{
                      padding: "12px 20px",
                      border:
                        "2px solid " +
                        (theme === opt.value ? "#ec4899" : "#e5e7eb"),
                      background: theme === opt.value ? "#fce7f3" : "white",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      transition: "all 0.2s",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      margin: "0 0 4px 0",
                    }}
                  >
                    🔔 Email Notifications
                  </h3>
                  <p
                    style={{ fontSize: "13px", color: "#6b7280", margin: "0" }}
                  >
                    Receive email notifications for important updates
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  style={{
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    marginLeft: "16px",
                    flexShrink: 0,
                  }}
                />
              </div>
            </div>

            <button
              onClick={savePreferences}
              disabled={saving}
              style={{
                padding: "12px 24px",
                background: saving
                  ? "#d1d5db"
                  : "linear-gradient(90deg, #ec4899, #a855f7)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: saving ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
              onMouseEnter={(e) =>
                !saving && (e.currentTarget.style.opacity = "0.9")
              }
              onMouseLeave={(e) =>
                !saving && (e.currentTarget.style.opacity = "1")
              }
            >
              {saving ? "⏳ Saving..." : "💾 Save Preferences"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
