"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

interface Stats {
  albumsCount: number;
  photosCount: number;
  storageUsedMB: string;
  sharedAlbumsCount: number;
}

interface RecentAlbum {
  _id: string;
  title: string;
  coverImage: string;
  photosCount: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentAlbums, setRecentAlbums] = useState<RecentAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const loadDashboardData = async () => {
    try {
      const statsRes = await fetch("/api/user/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsRes.json();
      if (statsData.stats) {
        setStats(statsData.stats);
      }

      const albumsRes = await fetch("/api/albums", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const albumsData = await albumsRes.json();
      if (albumsData.albums) {
        setRecentAlbums(albumsData.albums.slice(0, 4));
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @media (max-width: 768px) {
          .welcome-title {
            font-size: 24px !important;
          }
          .welcome-text {
            font-size: 14px !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .stat-card {
            padding: 16px !important;
          }
          .stat-number {
            font-size: 28px !important;
          }
          .actions-section {
            padding: 20px !important;
          }
          .actions-grid {
            grid-template-columns: 1fr !important;
          }
          .action-button {
            padding: 12px !important;
            font-size: 13px !important;
          }
          .albums-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .albums-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: "40px" }}>
          <h1
            className="welcome-title"
            style={{
              fontSize: "36px",
              fontWeight: "900",
              color: "#1f2937",
              marginBottom: "8px",
            }}
          >
            👋 Welcome, User!
          </h1>
          <p
            className="welcome-text"
            style={{ fontSize: "16px", color: "#6b7280" }}
          >
            Manage your wedding memories and share with loved ones
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div
              className="stats-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
                marginBottom: "40px",
              }}
            >
              <div
                className="stat-card"
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ fontSize: "28px" }}>📸</span>
                  <span
                    style={{
                      fontSize: "12px",
                      background: "#fce7f3",
                      color: "#ec4899",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    Albums
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    margin: "0 0 8px 0",
                  }}
                >
                  Total Albums
                </p>
                <p
                  className="stat-number"
                  style={{
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {stats?.albumsCount || 0}
                </p>
              </div>

              <div
                className="stat-card"
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ fontSize: "28px" }}>🖼️</span>
                  <span
                    style={{
                      fontSize: "12px",
                      background: "#ecfdf5",
                      color: "#059669",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    Photos
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    margin: "0 0 8px 0",
                  }}
                >
                  Total Photos
                </p>
                <p
                  className="stat-number"
                  style={{
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {stats?.photosCount || 0}
                </p>
              </div>

              <div
                className="stat-card"
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ fontSize: "28px" }}>💾</span>
                  <span
                    style={{
                      fontSize: "12px",
                      background: "#fef3c7",
                      color: "#d97706",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    Storage
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    margin: "0 0 8px 0",
                  }}
                >
                  Storage Used
                </p>
                <p
                  className="stat-number"
                  style={{
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {stats?.storageUsedMB || "0.0"} MB
                </p>
              </div>

              <div
                className="stat-card"
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ fontSize: "28px" }}>👥</span>
                  <span
                    style={{
                      fontSize: "12px",
                      background: "#dbeafe",
                      color: "#2563eb",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    Public
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    margin: "0 0 8px 0",
                  }}
                >
                  Public Albums
                </p>
                <p
                  className="stat-number"
                  style={{
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0",
                  }}
                >
                  {stats?.sharedAlbumsCount || 0}
                </p>
              </div>
            </div>

            <div
              className="actions-section"
              style={{
                background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
                padding: "32px",
                borderRadius: "16px",
                marginBottom: "40px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  marginBottom: "16px",
                }}
              >
                ⚡ Quick Actions
              </h2>
              <div
                className="actions-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                }}
              >
                <Link
                  href="/dashboard/albums/create"
                  style={{ textDecoration: "none" }}
                >
                  <button
                    className="action-button"
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "linear-gradient(90deg, #ec4899, #a855f7)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    ✨ Create New Album
                  </button>
                </Link>
                <Link
                  href="/dashboard/albums"
                  style={{ textDecoration: "none" }}
                >
                  <button
                    className="action-button"
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "white",
                      color: "#ec4899",
                      border: "2px solid #ec4899",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fce7f3";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                    }}
                  >
                    📸 View All Albums
                  </button>
                </Link>
                <Link href="/gallery" style={{ textDecoration: "none" }}>
                  <button
                    className="action-button"
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "white",
                      color: "#3b82f6",
                      border: "2px solid #3b82f6",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#dbeafe";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                    }}
                  >
                    🌐 Browse Gallery
                  </button>
                </Link>
              </div>
            </div>

            {recentAlbums.length > 0 && (
              <div>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  💕 Recent Albums
                </h2>
                <div
                  className="albums-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {recentAlbums.map((album) => (
                    <Link
                      key={album._id}
                      href={`/dashboard/albums/${album._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        style={{
                          background: "white",
                          borderRadius: "12px",
                          overflow: "hidden",
                          border: "2px solid #e5e7eb",
                          cursor: "pointer",
                          transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow =
                            "0 12px 24px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div
                          style={{
                            height: "140px",
                            background: album.coverImage
                              ? `url(${album.coverImage}) center/cover`
                              : "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "40px",
                          }}
                        >
                          {!album.coverImage && "📸"}
                        </div>
                        <div style={{ padding: "12px" }}>
                          <h3
                            style={{
                              fontSize: "14px",
                              fontWeight: "bold",
                              color: "#1f2937",
                              margin: "0 0 8px 0",
                            }}
                          >
                            {album.title}
                          </h3>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              margin: "0",
                            }}
                          >
                            📷 {album.photosCount} photo
                            {album.photosCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
