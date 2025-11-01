"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface WeddingAlbum {
  _id: string;
  title: string;
  coupleNames: string;
  weddingDate: string;
  location: string;
  coverImage: string;
  photosCount: number;
  publicToken: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
}

export default function GalleryShowcase() {
  const [weddings, setWeddings] = useState<WeddingAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "recent" | "featured">("all");

  useEffect(() => {
    loadPublicWeddings();
  }, []);

  const loadPublicWeddings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/gallery/public-weddings");
      const data = await response.json();

      if (data.success && data.weddings) {
        setWeddings(data.weddings);
      } else {
        setError("Failed to load gallery");
      }
    } catch (err) {
      console.error("Error loading weddings:", err);
      setError("Error loading weddings");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section
        style={{
          padding: "60px 20px",
          background: "#fff",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
        <p style={{ color: "#6b7280" }}>Loading gallery...</p>
      </section>
    );
  }

  if (error || weddings.length === 0) {
    return (
      <section
        style={{
          padding: "60px 20px",
          background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#1f2937",
          }}
        >
          💕 Wedding Gallery
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#6b7280",
            marginBottom: "24px",
          }}
        >
          No weddings yet! Be the first to feature your wedding on our gallery.
        </p>
        <Link href="/auth/register" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "14px 32px",
              background: "linear-gradient(90deg, #ec4899, #a855f7)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Share Your Wedding
          </button>
        </Link>
      </section>
    );
  }

  return (
    <section
      style={{
        padding: "60px 20px",
        background: "#f9fafb",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontSize: "40px",
              fontWeight: "900",
              marginBottom: "12px",
              background: "linear-gradient(90deg, #ec4899, #a855f7)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent" as any,
            }}
          >
            💕 Featured Weddings
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#6b7280",
              marginBottom: "24px",
            }}
          >
            Celebrate beautiful wedding moments from our community
          </p>

          {/* Filter Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { id: "all", label: "📸 All Weddings" },
              { id: "recent", label: "🕐 Recently Added" },
              { id: "featured", label: "⭐ Featured" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                style={{
                  padding: "10px 20px",
                  border:
                    "2px solid " + (filter === btn.id ? "#ec4899" : "#e5e7eb"),
                  background: filter === btn.id ? "#fce7f3" : "white",
                  color: filter === btn.id ? "#ec4899" : "#6b7280",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "all 0.2s",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {weddings.map((wedding) => (
            <div
              key={wedding._id}
              style={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                border: "2px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(236, 72, 153, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
              }}
            >
              {/* Cover Image */}
              <Link
                href={`/gallery/${wedding.publicToken}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    height: "240px",
                    background: wedding.coverImage
                      ? `url(${wedding.coverImage}) center/cover`
                      : "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(0, 0, 0, 0.3)",
                      opacity: 0,
                      transition: "opacity 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = "0";
                    }}
                  />

                  {!wedding.coverImage && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        fontSize: "64px",
                      }}
                    >
                      📸
                    </div>
                  )}

                  {/* Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "rgba(236, 72, 153, 0.9)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    💍 Wedding
                  </div>
                </div>
              </Link>

              {/* Content */}
              <div style={{ padding: "20px" }}>
                {/* Couple Names */}
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    margin: "0 0 8px 0",
                  }}
                >
                  {wedding.coupleNames}
                </h3>

                {/* Title */}
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    margin: "0 0 12px 0",
                  }}
                >
                  {wedding.title}
                </p>

                {/* Wedding Info */}
                <div style={{ marginBottom: "12px" }}>
                  {wedding.weddingDate && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#ec4899",
                        margin: "0 0 4px 0",
                        fontWeight: "600",
                      }}
                    >
                      📅 {formatDate(wedding.weddingDate)}
                    </p>
                  )}
                  {wedding.location && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#8b5cf6",
                        margin: "0",
                        fontWeight: "600",
                      }}
                    >
                      📍 {wedding.location}
                    </p>
                  )}
                </div>

                {/* Photos Count */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 0",
                    borderTop: "2px solid #e5e7eb",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      fontWeight: "600",
                    }}
                  >
                    📷 {wedding.photosCount}{" "}
                    {wedding.photosCount === 1 ? "Photo" : "Photos"}
                  </span>
                </div>

                {/* User Info */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    background: "#f9fafb",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: wedding.user.avatar
                        ? `url(${wedding.user.avatar}) center/cover`
                        : "linear-gradient(135deg, #ec4899, #a855f7)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "18px",
                    }}
                  >
                    {!wedding.user.avatar && "👤"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        margin: "0",
                        color: "#1f2937",
                      }}
                    >
                      {wedding.user.name}
                    </p>
                    {wedding.user.bio && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          margin: "2px 0 0 0",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {wedding.user.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* View Gallery Button */}
                <Link
                  href={`/gallery/${wedding.publicToken}`}
                  style={{ textDecoration: "none" }}
                >
                  <button
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "linear-gradient(90deg, #ec4899, #a855f7)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginTop: "12px",
                      fontSize: "13px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1)";
                    }}
                  >
                    View Gallery →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div
          style={{
            marginTop: "60px",
            textAlign: "center",
            padding: "40px",
            background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
            borderRadius: "16px",
          }}
        >
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "16px",
              color: "#1f2937",
            }}
          >
            Share Your Wedding Story 💑
          </h3>
          <p
            style={{ fontSize: "16px", color: "#6b7280", marginBottom: "24px" }}
          >
            Create your account and feature your wedding on our public gallery!
          </p>
          <Link href="/auth/register" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "14px 32px",
                background: "linear-gradient(90deg, #ec4899, #a855f7)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
