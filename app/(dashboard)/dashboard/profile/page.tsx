"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio: string;
  location: string;
  socialLinks?: {
    instagram: string;
    facebook: string;
    website: string;
  };
  createdAt: string;
}

export default function ProfilePage() {
  const { token } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (token) {
      loadProfile();
    }
  }, [token]);

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.user) {
        setUser(data.user);
        setName(data.user.name || "");
        setBio(data.user.bio || "");
        setLocation(data.user.location || "");
        setInstagram(data.user.socialLinks?.instagram || "");
        setFacebook(data.user.socialLinks?.facebook || "");
        setWebsite(data.user.socialLinks?.website || "");
        if (data.user.avatar) {
          setAvatarPreview(data.user.avatar);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    if (!name.trim()) {
      setMessage("❌ Name is required");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("location", location);
      formData.append("instagram", instagram);
      formData.append("facebook", facebook);
      formData.append("website", website);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await fetch("/api/user/profile-update", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        setMessage("✅ Profile updated successfully!");
        await loadProfile();
        setEditing(false);
        setAvatarFile(null);
      } else {
        setMessage("❌ Failed to update profile");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      {/* Back Button */}
      <Link
        href="/dashboard"
        style={{
          color: "#ec4899",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        ← Back to Dashboard
      </Link>

      {message && (
        <div
          style={{
            background: message.includes("✅") ? "#dcfce7" : "#fee2e2",
            border:
              "2px solid " + (message.includes("✅") ? "#86efac" : "#fca5a5"),
            color: message.includes("✅") ? "#166534" : "#991b1b",
            padding: "12px 16px",
            borderRadius: "8px",
            marginTop: "16px",
            marginBottom: "24px",
            fontSize: "14px",
          }}
        >
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "2px solid #e5e7eb",
          overflow: "hidden",
          marginTop: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
        }}
      >
        {/* Header Background */}
        <div
          style={{
            height: "200px",
            background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
            position: "relative",
          }}
        />

        {/* Profile Content */}
        <div
          style={{
            padding: "0 24px 24px 24px",
            position: "relative",
            marginTop: "-80px",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "16px",
                  background: avatarPreview
                    ? `url(${avatarPreview}) center/cover`
                    : "#e5e7eb",
                  border: "4px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  position: "relative",
                }}
              >
                {!avatarPreview && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      fontSize: "64px",
                    }}
                  >
                    👤
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(90deg, #ec4899, #a855f7)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {/* Profile Info */}
          {!editing ? (
            <div>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  margin: "0 0 8px 0",
                  color: "#1f2937",
                }}
              >
                {user?.name}
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  margin: "0 0 16px 0",
                }}
              >
                {user?.email}
              </p>

              {user?.bio && (
                <p
                  style={{
                    fontSize: "15px",
                    color: "#374151",
                    margin: "0 0 12px 0",
                    lineHeight: "1.6",
                  }}
                >
                  {user.bio}
                </p>
              )}

              {user?.location && (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    margin: "0 0 16px 0",
                  }}
                >
                  📍 {user.location}
                </p>
              )}

              {/* Social Links */}
              {(user?.socialLinks?.instagram ||
                user?.socialLinks?.facebook ||
                user?.socialLinks?.website) && (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  {user?.socialLinks?.instagram && (
                    <a
                      href={`https://instagram.com/${user.socialLinks.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "10px 16px",
                        background: "#f3f4f6",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#ec4899",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fce7f3";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f3f4f6";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      📷 Instagram
                    </a>
                  )}
                  {user?.socialLinks?.facebook && (
                    <a
                      href={`https://facebook.com/${user.socialLinks.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "10px 16px",
                        background: "#f3f4f6",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#3b82f6",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#dbeafe";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f3f4f6";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      f Facebook
                    </a>
                  )}
                  {user?.socialLinks?.website && (
                    <a
                      href={user.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "10px 16px",
                        background: "#f3f4f6",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#8b5cf6",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#ede9fe";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f3f4f6";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
              )}

              {/* Member Since */}
              <p
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  margin: "16px 0 0 0",
                }}
              >
                Member since{" "}
                {new Date(user?.createdAt || "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          ) : (
            // Edit Mode
            <div>
              {/* Avatar Upload */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{
                    display: "block",
                    marginTop: "8px",
                    fontSize: "13px",
                  }}
                />
              </div>

              {/* Name */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Full Name *
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

              {/* Bio */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Bio (Optional)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    minHeight: "80px",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#ec4899")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    margin: "4px 0 0 0",
                  }}
                >
                  {bio.length}/200 characters
                </p>
              </div>

              {/* Location */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Colombo, Sri Lanka"
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

              {/* Social Links */}
              <div
                style={{
                  background: "#f9fafb",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              >
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "12px",
                  }}
                >
                  Social Links (Optional)
                </h3>

                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "4px",
                      fontSize: "12px",
                    }}
                  >
                    📷 Instagram Username
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="yourinstagram"
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "4px",
                      fontSize: "12px",
                    }}
                  >
                    f Facebook Username
                  </label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="yourfacebook"
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "4px",
                      fontSize: "12px",
                    }}
                  >
                    🌐 Website URL
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => {
                    setEditing(false);
                    loadProfile();
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#f3f4f6",
                    color: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: "12px",
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
                >
                  {saving ? "⏳ Saving..." : "💾 Save Profile"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginTop: "32px",
        }}
      >
        <Link href="/dashboard/settings" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "white",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "#ec4899";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>⚙️</div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                margin: "0",
                color: "#1f2937",
              }}
            >
              Settings
            </h3>
          </div>
        </Link>

        <Link href="/dashboard/albums" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "white",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "#ec4899";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📸</div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                margin: "0",
                color: "#1f2937",
              }}
            >
              Albums
            </h3>
          </div>
        </Link>

        <Link href="/gallery" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "white",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "#ec4899";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🌐</div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                margin: "0",
                color: "#1f2937",
              }}
            >
              Public Gallery
            </h3>
          </div>
        </Link>
      </div>
    </div>
  );
}
