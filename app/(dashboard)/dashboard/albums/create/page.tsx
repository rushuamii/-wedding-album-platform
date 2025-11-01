"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FilePreview {
  id: number;
  file?: File;
  preview?: string;
  type: "image" | "youtube";
  caption: string;
  folder: "pre-wedding" | "ceremony" | "reception" | "honeymoon" | "other";
  location: string;
  youtubeUrl?: string;
  status?: "pending" | "success" | "error";
}

const FOLDER_OPTIONS = [
  { value: "pre-wedding", label: "💑 Pre-Wedding", icon: "💑" },
  { value: "ceremony", label: "💒 Ceremony", icon: "💒" },
  { value: "reception", label: "🎉 Reception", icon: "🎉" },
  { value: "honeymoon", label: "🌴 Honeymoon", icon: "🌴" },
  { value: "other", label: "📸 Other", icon: "📸" },
];

export default function CreateAlbumPage() {
  const { token } = useAuth();
  const router = useRouter();

  // Album Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coupleNames, setCoupleNames] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [location, setLocation] = useState("");

  // Files
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<
    "pre-wedding" | "ceremony" | "reception" | "honeymoon" | "other"
  >("other");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"photos" | "youtube">("photos");

  // Extract YouTube video ID
  function extractYoutubeId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  // Handle drag and drop
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.currentTarget.style.background = "#f3e8ff";
  }

  function handleDragLeave(e: React.DragEvent) {
    e.currentTarget.style.backgroundColor = "#fce7f3";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.currentTarget.style.background = "#fce7f3";
    const newFiles = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    addFiles(newFiles);
  }

  function addFiles(fileList: File[]) {
    fileList.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFiles((prev) => [
          ...prev,
          {
            file: f,
            preview: reader.result as string,
            type: "image",
            caption: "",
            folder: selectedFolder,
            location: selectedLocation,
            id: Date.now() + Math.random(),
          },
        ]);
      };
      reader.readAsDataURL(f);
    });
  }

  // Add YouTube video
  function addYoutubeVideo() {
    if (!youtubeUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    const videoId = extractYoutubeId(youtubeUrl);
    if (!videoId) {
      setError("Invalid YouTube URL. Please enter a valid URL or video ID.");
      return;
    }

    setFiles((prev) => [
      ...prev,
      {
        type: "youtube",
        caption: "",
        folder: selectedFolder,
        location: selectedLocation,
        youtubeUrl: youtubeUrl,
        preview: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        id: Date.now() + Math.random(),
      },
    ]);

    setYoutubeUrl("");
    setError("");
  }

  function updateFileCaption(id: number, caption: string) {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, caption } : f)));
  }

  function updateFileFolder(id: number, folder: string) {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, folder: folder as any } : f))
    );
  }

  function updateFileLocation(id: number, location: string) {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, location } : f)));
  }

  function removeFile(id: number) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleCreateAlbum() {
    if (!title.trim()) {
      setError("Album title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create album
      const albumRes = await fetch("/api/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          coupleNames,
          weddingDate: weddingDate || null,
          location,
        }),
      });

      if (!albumRes.ok) {
        throw new Error("Failed to create album");
      }

      const albumData = await albumRes.json();
      const albumId = albumData.album._id;

      // Upload files
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const form = new FormData();

        if (f.type === "image" && f.file) {
          form.append("file", f.file);
          form.append("mediaType", "image");
        } else if (f.type === "youtube") {
          form.append("youtubeUrl", f.youtubeUrl);
          form.append("youtubeThumbnail", f.preview);
          form.append("mediaType", "youtube-video");
        }

        form.append("albumId", albumId);
        form.append("caption", f.caption);
        form.append("folder", f.folder);
        form.append("location", f.location);

        try {
          await fetch("/api/photos/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: form,
          });
        } catch (e) {
          console.error("Error uploading file:", e);
        }
      }

      router.push(`/dashboard/albums/${albumId}`);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create album");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
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

      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginTop: "16px",
          marginBottom: "8px",
        }}
      >
        Create New Album ✨
      </h1>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "32px" }}>
        Add album details and organize your wedding memories
      </p>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "2px solid #fca5a5",
            color: "#991b1b",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Step 1: Album Details */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "2px solid #e5e7eb",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}
        >
          💒 Wedding Details
        </h2>

        <div style={{ marginBottom: "16px" }}>
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
            placeholder="e.g., Wedding Day 2025, Reception Moments"
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
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this album..."
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
            Couple Names (Optional)
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              Wedding Date (Optional)
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

          <div>
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
              placeholder="e.g., Bali, Indonesia"
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
        </div>
      </div>

      {/* Step 2: Upload Photos & Videos */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "2px solid #e5e7eb",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}
        >
          📸 Upload Media
        </h2>

        {/* Folder Selection */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "12px",
              fontSize: "14px",
            }}
          >
            Default Folder for New Files
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "12px",
            }}
          >
            {FOLDER_OPTIONS.map((folder) => (
              <button
                key={folder.value}
                onClick={() => setSelectedFolder(folder.value as any)}
                style={{
                  padding: "12px",
                  border:
                    "2px solid " +
                    (selectedFolder === folder.value ? "#ec4899" : "#e5e7eb"),
                  background:
                    selectedFolder === folder.value ? "#fce7f3" : "white",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                  transition: "all 0.2s",
                }}
              >
                {folder.icon} {folder.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            borderBottom: "2px solid #e5e7eb",
          }}
        >
          <button
            onClick={() => setActiveTab("photos")}
            style={{
              padding: "12px 20px",
              border: "none",
              background: "none",
              borderBottom:
                activeTab === "photos" ? "3px solid #ec4899" : "none",
              color: activeTab === "photos" ? "#ec4899" : "#6b7280",
              fontWeight: activeTab === "photos" ? "bold" : "500",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s",
            }}
          >
            📷 Photos
          </button>
          <button
            onClick={() => setActiveTab("youtube")}
            style={{
              padding: "12px 20px",
              border: "none",
              background: "none",
              borderBottom:
                activeTab === "youtube" ? "3px solid #ec4899" : "none",
              color: activeTab === "youtube" ? "#ec4899" : "#6b7280",
              fontWeight: activeTab === "youtube" ? "bold" : "500",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s",
            }}
          >
            🎬 YouTube Videos
          </button>
        </div>

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: "3px dashed #ec4899",
              borderRadius: "12px",
              padding: "48px 32px",
              textAlign: "center",
              background: "#fce7f3",
              marginBottom: files.length > 0 ? "24px" : "0",
              cursor: "pointer",
            }}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                e.target.files && addFiles(Array.from(e.target.files))
              }
              style={{ display: "none" }}
              id="photoInput"
            />
            <label
              htmlFor="photoInput"
              style={{ cursor: "pointer", display: "block" }}
            >
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📤</div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#1f2937",
                }}
              >
                Drag photos here or click to browse
              </h3>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                JPEG, PNG, GIF • Max 100MB per file • Unlimited uploads
              </p>
            </label>
          </div>
        )}

        {/* YouTube Tab */}
        {activeTab === "youtube" && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                YouTube URL or Video ID
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
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
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "4px 0 0 0",
                }}
              >
                Enter a YouTube URL or paste the video ID
              </p>
            </div>

            <button
              onClick={addYoutubeVideo}
              style={{
                padding: "12px 24px",
                background: "#ec4899",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#be185d")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#ec4899")
              }
            >
              ➕ Add YouTube Video
            </button>
          </div>
        )}

        {/* Files Preview */}
        {files.length > 0 && (
          <div>
            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                {files.length} item{files.length !== 1 ? "s" : ""} (
                {files.filter((f) => f.type === "image").length} photos,{" "}
                {files.filter((f) => f.type === "youtube").length} videos)
              </h3>
              <button
                onClick={() => setFiles([])}
                style={{
                  padding: "8px 16px",
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Clear All
              </button>
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              {files.map((f) => (
                <div
                  key={f.id}
                  style={{
                    background: "#f9fafb",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: "16px",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      background: `url(${f.preview}) center/cover`,
                      position: "relative",
                      border: "2px solid #e5e7eb",
                    }}
                  >
                    {f.type === "youtube" && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: "32px",
                          background: "rgba(0,0,0,0.6)",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ▶️
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div>
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Caption
                      </label>
                      <input
                        type="text"
                        value={f.caption}
                        onChange={(e) =>
                          updateFileCaption(f.id, e.target.value)
                        }
                        placeholder="Add a caption..."
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "13px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            display: "block",
                            marginBottom: "4px",
                          }}
                        >
                          Folder
                        </label>
                        <select
                          value={f.folder}
                          onChange={(e) =>
                            updateFileFolder(f.id, e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "12px",
                            boxSizing: "border-box",
                          }}
                        >
                          {FOLDER_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            display: "block",
                            marginBottom: "4px",
                          }}
                        >
                          Location
                        </label>
                        <input
                          type="text"
                          value={f.location}
                          onChange={(e) =>
                            updateFileLocation(f.id, e.target.value)
                          }
                          placeholder="e.g., Ballroom"
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "12px",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => removeFile(f.id)}
                      style={{
                        padding: "8px",
                        background: "#fee2e2",
                        border: "none",
                        color: "#dc2626",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px" }}>
        <Link
          href="/dashboard/albums"
          style={{ flex: 1, textDecoration: "none" }}
        >
          <button
            style={{
              width: "100%",
              padding: "14px",
              background: "#f3f4f6",
              color: "#1f2937",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Cancel
          </button>
        </Link>
        <button
          onClick={handleCreateAlbum}
          disabled={loading || !title.trim()}
          style={{
            flex: 1,
            padding: "14px",
            background:
              loading || !title.trim()
                ? "#d1d5db"
                : "linear-gradient(90deg, #ec4899, #a855f7)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: loading || !title.trim() ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "⏳ Creating..." : "✨ Create Album"}
        </button>
      </div>
    </div>
  );
}
