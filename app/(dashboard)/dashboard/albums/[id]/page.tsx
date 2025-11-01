"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

interface Photo {
  _id: string;
  imageUrl: string;
  thumbnailUrl: string;
  caption: string;
  likes: number;
  createdAt: string;
}

interface Album {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
}

export default function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { token } = useAuth();

  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (token && id) {
      loadAlbumData();
    }
  }, [token, id]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    if (menuOpenId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [menuOpenId]);

  async function loadAlbumData() {
    try {
      // Fetch album details
      const albumRes = await fetch(`/api/albums/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const albumData = await albumRes.json();
      console.log("Album:", albumData);
      setAlbum(albumData.album);

      // Fetch photos for this album
      const photosRes = await fetch(`/api/albums/${id}/photos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const photosData = await photosRes.json();
      console.log("Photos:", photosData);
      setPhotos(photosData.photos || []);
    } catch (e) {
      console.error("Error loading data:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setPhotos(photos.filter((p) => p._id !== photoId));
        setDeleteConfirmId(null);
        setMenuOpenId(null);
      } else {
        console.error("Failed to delete photo");
      }
    } catch (error) {
      console.error("Failed to delete photo:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "500px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>Loading album...</p>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p style={{ fontSize: "18px", color: "#6b7280" }}>Album not found</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Back Button */}
      <Link
        href="/dashboard/albums"
        style={{
          color: "#ec4899",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        ← Back to Albums
      </Link>

      {/* Album Header */}
      <div
        style={{
          marginTop: "24px",
          marginBottom: "32px",
          paddingBottom: "24px",
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "900",
            color: "#1f2937",
            marginBottom: "8px",
          }}
        >
          {album.title} 📸
        </h1>
        <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "12px" }}>
          {album.description || "No description"}
        </p>
        <div
          style={{
            display: "flex",
            gap: "20px",
            fontSize: "14px",
            color: "#9ca3af",
          }}
        >
          <span>
            📷 {photos.length} photo{photos.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Photos Section */}
      <div>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "20px",
          }}
        >
          Photos Gallery
        </h2>

        {photos.length === 0 ? (
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
                fontSize: "18px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "8px",
              }}
            >
              No photos yet
            </h3>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Upload your first photo to see it here!
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {photos.map((photo, index) => (
              <div
                key={photo._id}
                style={{
                  position: "relative",
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "2px solid #e5e7eb",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 35px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0,0,0,0.07)";
                }}
              >
                {/* Photo Image */}
                <div
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onClick={() => {
                    setSelectedPhotoIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={photo.thumbnailUrl || photo.imageUrl}
                    alt={photo.caption}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      cursor: "pointer",
                      transition: "transform 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />

                  {/* Three Dot Menu Button */}
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      zIndex: 10,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpenId(
                          menuOpenId === photo._id ? null : photo._id
                        );
                      }}
                      style={{
                        background: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
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
                    {menuOpenId === photo._id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: "absolute",
                          top: "42px",
                          right: "0",
                          background: "white",
                          border: "2px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          overflow: "hidden",
                          minWidth: "140px",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeleteConfirmId(photo._id);
                          }}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            background: "white",
                            border: "none",
                            textAlign: "left",
                            cursor: "pointer",
                            fontSize: "13px",
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
                          🗑️ Delete Photo
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Photo Info */}
                <div style={{ padding: "14px" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#1f2937",
                      fontWeight: "600",
                      marginBottom: "8px",
                      minHeight: "28px",
                      maxHeight: "28px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {photo.caption || "No caption"}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#9ca3af",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      ❤️ <strong>{photo.likes || 0}</strong>
                    </p>
                    <p
                      style={{ fontSize: "10px", color: "#d1d5db", margin: 0 }}
                    >
                      {new Date(photo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && photos.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(4px)",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              fontSize: "32px",
              cursor: "pointer",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              zIndex: 101,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
          >
            ✕
          </button>

          {/* Previous Button */}
          <button
            onClick={() =>
              setSelectedPhotoIndex(
                (selectedPhotoIndex - 1 + photos.length) % photos.length
              )
            }
            style={{
              position: "absolute",
              left: "20px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              fontSize: "32px",
              cursor: "pointer",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              zIndex: 101,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
          >
            ◀
          </button>

          {/* Main Image */}
          <img
            src={photos[selectedPhotoIndex].imageUrl}
            alt="Full size"
            style={{
              maxWidth: "90%",
              maxHeight: "85vh",
              borderRadius: "12px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          />

          {/* Next Button */}
          <button
            onClick={() =>
              setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length)
            }
            style={{
              position: "absolute",
              right: "20px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              fontSize: "32px",
              cursor: "pointer",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              zIndex: 101,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
          >
            ▶
          </button>

          {/* Photo Caption */}
          {photos[selectedPhotoIndex].caption && (
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.8)",
                color: "white",
                padding: "12px 20px",
                borderRadius: "8px",
                textAlign: "center",
                maxWidth: "80%",
                fontSize: "14px",
                zIndex: 101,
              }}
            >
              {photos[selectedPhotoIndex].caption}
            </div>
          )}

          {/* Photo Counter */}
          <div
            style={{
              position: "absolute",
              bottom: "30px",
              right: "30px",
              background: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              zIndex: 101,
            }}
          >
            {selectedPhotoIndex + 1} / {photos.length}
          </div>
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
              maxWidth: "400px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              Delete Photo?
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              Are you sure you want to delete this photo? This action cannot be
              undone.
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
                onClick={() => handleDeletePhoto(deleteConfirmId)}
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
