"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

interface UploadedPhoto {
  _id: string;
  imageUrl: string;
  caption: string;
  folder: string;
}

export default function CreateAlbumPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coupleNames, setCoupleNames] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [location, setLocation] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // Drag and drop handlers
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const element = e.currentTarget as HTMLDivElement;
    element.style.backgroundColor = "#f3e8ff";
    element.style.borderColor = "#ec4899";
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const element = e.currentTarget as HTMLDivElement;
    element.style.backgroundColor = "#f9fafb";
    element.style.borderColor = "#e5e7eb";
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const element = e.currentTarget as HTMLDivElement;
    element.style.backgroundColor = "#f9fafb";
    element.style.borderColor = "#e5e7eb";
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }

  function handleFiles(files: FileList) {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        uploadPhoto(file);
      }
    });
  }

  async function uploadPhoto(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", "");
      formData.append("folder", "other");

      const response = await fetch("/api/photos/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPhotos((prev) => [...prev, data.photo]);
        setMessage(`✅ Photo uploaded: ${file.name}`);
      } else {
        setMessage(`❌ Failed to upload ${file.name}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Upload error");
    }
  }

  async function createAlbum() {
    if (!title.trim()) {
      setMessage("❌ Album title is required");
      return;
    }

    if (photos.length === 0) {
      setMessage("❌ Please upload at least one photo");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          coupleNames,
          weddingDate,
          location,
          isPublic,
          photos: photos.map((p) => p._id),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("✅ Album created successfully!");
        setTimeout(() => {
          router.push("/dashboard/albums");
        }, 1000);
      } else {
        setMessage("❌ Failed to create album");
      }
    } catch (error) {
      console.error("Create album error:", error);
      setMessage("❌ Error creating album");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}
        >
          Create Album 📸
        </h1>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          Create a new wedding album and upload photos
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

      {/* Main Form */}
      <div
        style={{
          background: "white",
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        {/* Album Title */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            Album Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Sarah & John's Wedding"
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

        {/* Couple Names */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            Couple Names
          </label>
          <input
            type="text"
            value={coupleNames}
            onChange={(e) => setCoupleNames(e.target.value)}
            placeholder="e.g., Sarah & John"
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

        {/* Wedding Date */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            Wedding Date
          </label>
          <input
            type="date"
            value={weddingDate}
            onChange={(e) => setWeddingDate(e.target.value)}
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

        {/* Location */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Hotel Grand, Colombo"
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

        {/* Description */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your wedding..."
            rows={4}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#ec4899")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>

        {/* Public Setting */}
        <div
          style={{
            background: "#f9fafb",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                margin: "0 0 4px 0",
              }}
            >
              🌐 Make Album Public
            </h3>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "0" }}>
              Allow others to view this album
            </p>
          </div>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            style={{ width: "24px", height: "24px", cursor: "pointer" }}
          />
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging ? "3px solid #ec4899" : "2px dashed #e5e7eb",
            borderRadius: "12px",
            padding: "40px 20px",
            textAlign: "center",
            backgroundColor: isDragging ? "#fce7f3" : "#f9fafb",
            cursor: "pointer",
            transition: "all 0.2s",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📸</div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#1f2937",
            }}
          >
            Drop photos here
          </h3>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            or click to browse from your computer
          </p>
        </div>

        {/* Photo Count */}
        <div
          style={{
            background: photos.length > 0 ? "#dcfce7" : "#fee2e2",
            border: "2px solid " + (photos.length > 0 ? "#86efac" : "#fca5a5"),
            color: photos.length > 0 ? "#166534" : "#991b1b",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          📷 {photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded
        </div>

        {/* Photo Preview Grid */}
        {photos.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            {photos.map((photo) => (
              <div
                key={photo._id}
                style={{
                  width: "100%",
                  height: "100px",
                  borderRadius: "8px",
                  background: `url(${photo.imageUrl}) center/cover`,
                  border: "2px solid #e5e7eb",
                }}
              />
            ))}
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={createAlbum}
          disabled={loading || photos.length === 0}
          style={{
            width: "100%",
            padding: "14px 24px",
            background:
              loading || photos.length === 0
                ? "#d1d5db"
                : "linear-gradient(90deg, #ec4899, #a855f7)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: loading || photos.length === 0 ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "⏳ Creating Album..." : "✨ Create Album"}
        </button>
      </div>
    </div>
  );
}
