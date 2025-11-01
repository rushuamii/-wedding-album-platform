"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

interface Album {
  _id: string;
  title: string;
}

interface UploadedFile {
  file: File;
  preview: string;
  caption: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
}

export default function UploadPage() {
  const { token } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useState(() => {
    fetchAlbums();
  });

  const fetchAlbums = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/albums", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAlbums(data.albums || []);
    } catch (error) {
      console.error("Failed to fetch albums:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newFiles.push({
            file,
            preview: e.target?.result as string,
            caption: "",
            progress: 0,
            status: "pending",
          });
          if (
            newFiles.length ===
            Array.from(fileList).filter((f) => f.type.startsWith("image/"))
              .length
          ) {
            setFiles((prev) => [...prev, ...newFiles]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const updateFileCaption = (index: number, caption: string) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index].caption = caption;
      return newFiles;
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (!selectedAlbumId || files.length === 0) {
      alert("Please select an album and add photos");
      return;
    }

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[i].status = "uploading";
        return newFiles;
      });

      try {
        const formData = new FormData();
        formData.append("file", file.file);
        formData.append("albumId", selectedAlbumId);
        formData.append("caption", file.caption);

        const response = await fetch("/api/photos/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (response.ok) {
          setFiles((prev) => {
            const newFiles = [...prev];
            newFiles[i].status = "success";
            newFiles[i].progress = 100;
            return newFiles;
          });
        } else {
          setFiles((prev) => {
            const newFiles = [...prev];
            newFiles[i].status = "error";
            return newFiles;
          });
        }
      } catch (error) {
        console.error("Upload error:", error);
        setFiles((prev) => {
          const newFiles = [...prev];
          newFiles[i].status = "error";
          return newFiles;
        });
      }
    }

    setUploading(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
        <p style={{ color: "#6b7280" }}>Loading albums...</p>
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>📭</div>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "8px",
          }}
        >
          No albums yet
        </h2>
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
          Create an album first to upload photos
        </p>
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
            Create Album
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "900",
          color: "#1f2937",
          marginBottom: "32px",
        }}
      >
        Bulk Upload Photos 📤
      </h1>

      {/* Select Album */}
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          border: "2px solid #e5e7eb",
          marginBottom: "24px",
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Select Album *
        </label>
        <select
          value={selectedAlbumId}
          onChange={(e) => setSelectedAlbumId(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "14px",
            cursor: "pointer",
            background: "white",
            boxSizing: "border-box",
          }}
        >
          <option value="">Choose an album...</option>
          {albums.map((album) => (
            <option key={album._id} value={album._id}>
              {album.title}
            </option>
          ))}
        </select>
      </div>

      {/* Drag & Drop */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `3px dashed ${dragActive ? "#a855f7" : "#ec4899"}`,
          borderRadius: "16px",
          padding: "60px 40px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s",
          background: dragActive ? "rgba(168, 85, 247, 0.1)" : "white",
          marginBottom: "24px",
        }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
          id="fileInput"
        />
        <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>📸</div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "8px",
            }}
          >
            Drop your photos here or click to select
          </h3>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Support JPG, PNG, WebP • Up to 50 photos at once
          </p>
        </label>
      </div>

      {/* Files Grid */}
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
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#1f2937",
                margin: 0,
              }}
            >
              {files.length} photo{files.length !== 1 ? "s" : ""} selected
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
                color: "#1f2937",
              }}
            >
              Clear All
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {files.map((file, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "2px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "100%",
                    background: "#f3f4f6",
                  }}
                >
                  <img
                    src={file.preview}
                    alt={`Preview ${index}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: file.status === "success" ? 0.5 : 1,
                    }}
                  />
                  {file.status === "success" && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(34, 197, 94, 0.9)",
                        fontSize: "32px",
                      }}
                    >
                      ✅
                    </div>
                  )}
                  {file.status === "error" && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(220, 38, 38, 0.9)",
                        fontSize: "32px",
                      }}
                    >
                      ❌
                    </div>
                  )}
                </div>
                <div style={{ padding: "12px" }}>
                  <input
                    type="text"
                    value={file.caption}
                    onChange={(e) => updateFileCaption(index, e.target.value)}
                    placeholder="Add caption..."
                    maxLength={50}
                    disabled={file.status !== "pending"}
                    style={{
                      width: "100%",
                      padding: "6px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "4px",
                      fontSize: "11px",
                      marginBottom: "6px",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    onClick={() => removeFile(index)}
                    disabled={file.status !== "pending"}
                    style={{
                      width: "100%",
                      padding: "6px",
                      background: "#fee2e2",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#dc2626",
                      cursor:
                        file.status === "pending" ? "pointer" : "not-allowed",
                      opacity: file.status === "pending" ? 1 : 0.5,
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <button
            onClick={uploadFiles}
            disabled={uploading || !selectedAlbumId}
            style={{
              width: "100%",
              padding: "16px",
              background:
                uploading || !selectedAlbumId
                  ? "#d1d5db"
                  : "linear-gradient(90deg, #ec4899, #a855f7, #3b82f6)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: uploading || !selectedAlbumId ? "not-allowed" : "pointer",
              transition: "all 0.3s",
            }}
          >
            {uploading ? "⏳ Uploading..." : "🚀 Upload All Photos"}
          </button>
        </div>
      )}
    </div>
  );
}
