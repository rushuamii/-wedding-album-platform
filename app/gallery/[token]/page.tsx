"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Photo {
  _id: string;
  imageUrl: string;
  caption: string;
  folder: string;
  createdAt: string;
}

interface Album {
  _id: string;
  title: string;
  description: string;
  coupleNames: string;
  weddingDate: string;
  location: string;
  user: {
    name: string;
    avatar?: string;
  };
  photos: Photo[];
}

export default function PublicGalleryPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (token) {
      loadAlbum();
    }
  }, [token]);

  const loadAlbum = async () => {
    try {
      const response = await fetch(`/api/gallery/album/${token}`);
      const data = await response.json();

      if (data.success) {
        setAlbum(data.album);
      } else {
        setError("Album not found");
      }
    } catch (err) {
      setError("Failed to load album");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
        <p>Loading gallery...</p>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <h1
          style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}
        >
          {error}
        </h1>
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#ec4899",
            fontWeight: "bold",
          }}
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{ background: "#f9fafb", minHeight: "100vh", paddingTop: "20px" }}
    >
      {/* Header */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <Link
          href="/"
          style={{
            color: "#ec4899",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Back to Gallery
        </Link>

        <div style={{ marginTop: "24px", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            {album.coupleNames}
          </h1>
          <p style={{ fontSize: "16px", color: "#6b7280" }}>{album.title}</p>

          {album.weddingDate && (
            <p
              style={{
                fontSize: "14px",
                color: "#ec4899",
                fontWeight: "600",
                marginTop: "12px",
              }}
            >
              📅{" "}
              {new Date(album.weddingDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          {album.location && (
            <p
              style={{ fontSize: "14px", color: "#8b5cf6", fontWeight: "600" }}
            >
              📍 {album.location}
            </p>
          )}
        </div>

        {/* Gallery Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          {album.photos.map((photo) => (
            <div
              key={photo._id}
              onClick={() => setSelectedPhoto(photo)}
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                background: `url(${photo.imageUrl}) center/cover`,
                height: "250px",
                border: "2px solid #e5e7eb",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(236, 72, 153, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.caption}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: "12px",
              }}
            />
            {selectedPhoto.caption && (
              <p
                style={{
                  color: "white",
                  textAlign: "center",
                  marginTop: "16px",
                  fontSize: "14px",
                }}
              >
                {selectedPhoto.caption}
              </p>
            )}
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: "absolute",
                top: "-40px",
                right: "0",
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
