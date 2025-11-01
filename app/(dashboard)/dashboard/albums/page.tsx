"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

interface Album {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  photosCount: number;
  photosPreviews: string[];
  createdAt: string;
}

export default function AlbumsPage() {
  const { token } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchAlbums();
    }
  }, [token]);

  const fetchAlbums = async () => {
    try {
      setError("");
      console.log("Fetching albums...");

      const response = await fetch("/api/albums", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Albums response:", data);

      // Fetch photos for each album to get previews
      const albumsWithPhotos = await Promise.all(
        (data.albums || []).map(async (album: any) => {
          try {
            const photosRes = await fetch(`/api/albums/${album._id}/photos`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const photosData = await photosRes.json();
            const photos = photosData.photos || [];

            return {
              ...album,
              photosPreviews: photos
                .slice(0, 4)
                .map((p: any) => p.thumbnailUrl || p.imageUrl),
            };
          } catch (e) {
            console.error("Error fetching photos for album:", album._id, e);
            return { ...album, photosPreviews: [] };
          }
        })
      );

      setAlbums(albumsWithPhotos);
    } catch (error) {
      console.error("Failed to fetch albums:", error);
      setError("Failed to load albums");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/albums/${albumId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setAlbums(albums.filter((a) => a._id !== albumId));
        setDeleteConfirmId(null);
        setMenuOpenId(null);
      } else {
        try {
          const data = await response.json();
          setError(data.error || "Failed to delete album");
        } catch {
          setError(`Failed to delete album (Status: ${response.status})`);
        }
      }
    } catch (error) {
      console.error("Failed to delete album:", error);
      setError("Failed to delete album");
    } finally {
      setDeleting(false);
    }
  };

  const filteredAlbums = albums
    .filter((album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sortBy === "most-photos")
        return (b.photosCount || 0) - (a.photosCount || 0);
      return 0;
    });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Loading your albums...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          paddingBottom: "24px",
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "900",
              color: "#1f2937",
              marginBottom: "8px",
            }}
          >
            Your Albums 📸
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            {albums.length} album{albums.length !== 1 ? "s" : ""} •{" "}
            {albums.reduce((sum, a) => sum + (a.photosCount || 0), 0)} photos
            total
          </p>
        </div>
        <Link
          href="/dashboard/albums/create"
          style={{ textDecoration: "none" }}
        >
          <button
            style={{
              padding: "12px 24px",
              background: "linear-gradient(90deg, #ec4899, #a855f7, #3b82f6)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s",
              boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(236, 72, 153, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(236, 72, 153, 0.3)";
            }}
          >
            ✨ Create New Album
          </button>
        </Link>
      </div>

      {/* Search & Filter */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "2px solid #e5e7eb",
          marginBottom: "32px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search albums..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "10px 12px",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "14px",
            transition: "all 0.3s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#ec4899")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "10px 12px",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "14px",
            cursor: "pointer",
            background: "white",
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="most-photos">Most Photos</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "2px solid #fca5a5",
            color: "#991b1b",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Albums Grid */}
      {filteredAlbums.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "60px 40px",
            borderRadius: "16px",
            textAlign: "center",
            border: "2px dashed #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>📭</div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "8px",
            }}
          >
            {albums.length === 0 ? "No albums yet" : "No results found"}
          </h3>
          <p
            style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}
          >
            {albums.length === 0
              ? "Create your first album to start organizing your wedding memories"
              : "Try adjusting your search terms"}
          </p>
          {albums.length === 0 && (
            <Link
              href="/dashboard/albums/create"
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(90deg, #ec4899, #a855f7)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Create First Album
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredAlbums.map((album) => (
            <div key={album._id} style={{ position: "relative" }}>
              <Link
                href={`/dashboard/albums/${album._id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "2px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 32px rgba(0,0,0,0.12)";
                    e.currentTarget.style.borderColor = "#ec4899";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.06)";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                >
                  {/* Photo Preview Grid */}
                  <div
                    style={{
                      height: "200px",
                      background:
                        "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
                      display: "grid",
                      gridTemplateColumns:
                        album.photosPreviews.length === 1 ? "1fr" : "1fr 1fr",
                      gridTemplateRows:
                        album.photosPreviews.length <= 2 ? "1fr" : "1fr 1fr",
                      gap: "2px",
                    }}
                  >
                    {album.photosPreviews.length > 0 ? (
                      album.photosPreviews.slice(0, 4).map((photoUrl, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: `url(${photoUrl}) center/cover`,
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      ))
                    ) : (
                      <div
                        style={{
                          gridColumn: "1 / -1",
                          gridRow: "1 / -1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "48px",
                        }}
                      >
                        📸
                      </div>
                    )}
                  </div>

                  {/* Album Info */}
                  <div style={{ padding: "20px" }}>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#1f2937",
                        marginBottom: "6px",
                      }}
                    >
                      {album.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                        marginBottom: "12px",
                        minHeight: "36px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as any,
                      }}
                    >
                      {album.description || "No description"}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "12px",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <div style={{ display: "flex", gap: "16px" }}>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#9ca3af",
                            margin: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          📷 <strong>{album.photosCount || 0}</strong> photos
                        </p>
                      </div>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#d1d5db",
                          margin: 0,
                        }}
                      >
                        {new Date(album.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Three Dot Menu Button */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  zIndex: 10,
                }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === album._id ? null : album._id);
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.95)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.15)";
                  }}
                >
                  ⋮
                </button>

                {/* Dropdown Menu */}
                {menuOpenId === album._id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      top: "48px",
                      right: "0",
                      background: "white",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      overflow: "hidden",
                      minWidth: "160px",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteConfirmId(album._id);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "white",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#dc2626",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fee2e2";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                      }}
                    >
                      🗑️ Delete Album
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            style={{
              background: "white",
              padding: "32px",
              borderRadius: "16px",
              maxWidth: "420px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "48px",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              ⚠️
            </div>
            <h3
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              Delete Album?
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "24px",
                textAlign: "center",
                lineHeight: "1.6",
              }}
            >
              Are you sure you want to delete{" "}
              <strong>
                "{albums.find((a) => a._id === deleteConfirmId)?.title}"
              </strong>
              ?
              <br />
              This action cannot be undone and all photos will be deleted.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: deleting ? "not-allowed" : "pointer",
                  color: "#1f2937",
                  fontSize: "14px",
                  transition: "all 0.2s",
                  opacity: deleting ? 0.5 : 1,
                }}
                onMouseEnter={(e) =>
                  !deleting && (e.currentTarget.style.background = "#e5e7eb")
                }
                onMouseLeave={(e) =>
                  !deleting && (e.currentTarget.style.background = "#f3f4f6")
                }
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAlbum(deleteConfirmId)}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: deleting ? "#d1d5db" : "#dc2626",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: deleting ? "not-allowed" : "pointer",
                  color: "white",
                  fontSize: "14px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  !deleting && (e.currentTarget.style.background = "#b91c1c")
                }
                onMouseLeave={(e) =>
                  !deleting && (e.currentTarget.style.background = "#dc2626")
                }
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
