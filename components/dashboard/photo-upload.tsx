"use client";

import { useState } from "react";

interface PhotoUploadProps {
  albumId: string;
  token: string;
  onUploadSuccess: () => void;
}

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  caption: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export default function PhotoUpload({
  albumId,
  token,
  onUploadSuccess,
}: PhotoUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = (fileList: File[]) => {
    const imageFiles = fileList.filter((file) =>
      file.type.startsWith("image/")
    );

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      const fileId = `${Date.now()}-${Math.random()}`;

      reader.onload = (e) => {
        const newFile: UploadFile = {
          id: fileId,
          file,
          preview: e.target?.result as string,
          caption: "",
          progress: 0,
          status: "pending",
        };
        setFiles((prev) => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  const updateCaption = (id: string, caption: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, caption: caption.substring(0, 100) } : f
      )
    );
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFile = async (file: UploadFile) => {
    try {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: "uploading", progress: 0 } : f
        )
      );

      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("albumId", albumId);
      formData.append("caption", file.caption);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, progress: Math.round(progress) } : f
            )
          );
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 201 || xhr.status === 200) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, status: "success", progress: 100 } : f
            )
          );
        } else {
          const errorData = JSON.parse(xhr.responseText);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    status: "error",
                    error: errorData.message || "Upload failed",
                  }
                : f
            )
          );
        }
      });

      xhr.addEventListener("error", () => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, status: "error", error: "Network error" }
              : f
          )
        );
      });

      xhr.open("POST", "/api/photos/upload");
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? { ...f, status: "error", error: "Upload failed" }
            : f
        )
      );
    }
  };

  const uploadAllFiles = async () => {
    if (files.length === 0) {
      alert("Please select photos to upload");
      return;
    }

    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) {
      alert("All files have been processed");
      return;
    }

    setUploading(true);

    for (const file of pendingFiles) {
      await uploadFile(file);
      // Small delay between uploads
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setUploading(false);

    // Check if all uploads are successful
    const allSuccessful = files.every(
      (f) =>
        f.status === "success" ||
        (f.status === "pending" &&
          files.filter((x) => x.status === "pending").length === 0)
    );

    if (allSuccessful && files.some((f) => f.status === "success")) {
      // Clear successful uploads after 2 seconds
      setTimeout(() => {
        setFiles((prev) => prev.filter((f) => f.status !== "success"));
        onUploadSuccess();
      }, 2000);
    }
  };

  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;
  const uploadedCount = successCount + errorCount;

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: "2px solid #e5e7eb",
        padding: "32px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
      }}
    >
      <h2
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        📤 Upload Photos to This Album
      </h2>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `3px dashed ${dragActive ? "#a855f7" : "#ec4899"}`,
          borderRadius: "12px",
          padding: "48px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s",
          background: dragActive
            ? "rgba(168, 85, 247, 0.1)"
            : "rgba(236, 72, 153, 0.05)",
          marginBottom: "24px",
        }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
          id="photoInput"
        />
        <label
          htmlFor="photoInput"
          style={{ cursor: "pointer", display: "block" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>
            {dragActive ? "🎯" : "📷"}
          </div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "8px",
            }}
          >
            {dragActive
              ? "Drop your photos here!"
              : "Drag & drop your photos here"}
          </h3>
          <p
            style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}
          >
            or click to select files from your computer
          </p>
          <p style={{ fontSize: "12px", color: "#9ca3af" }}>
            Supports JPG, PNG, WebP • Upload multiple photos at once • Max 10MB
            per file
          </p>
        </label>
      </div>

      {/* Files List */}
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
              {files.length} file{files.length !== 1 ? "s" : ""} selected
              {uploadedCount > 0 && (
                <span
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    fontWeight: "500",
                    marginLeft: "8px",
                  }}
                >
                  ({successCount} ✅ {errorCount > 0 ? `${errorCount} ❌` : ""})
                </span>
              )}
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
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#e5e7eb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#f3f4f6")
              }
            >
              Clear All
            </button>
          </div>

          {/* Photos Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {files.map((file) => (
              <div
                key={file.id}
                style={{
                  background: "#f9fafb",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "2px solid #e5e7eb",
                  transition: "all 0.3s",
                }}
              >
                {/* Image Preview */}
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "100%",
                    background: "#f3f4f6",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={file.preview}
                    alt="Preview"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: file.status === "success" ? 0.4 : 1,
                    }}
                  />

                  {/* Status Overlay */}
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
                        animation: "pulse 1s infinite",
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

                  {file.status === "uploading" && (
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
                        background: "rgba(0,0,0,0.3)",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div style={{ fontSize: "20px" }}>⏳</div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {file.progress}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div style={{ padding: "12px" }}>
                  {file.status === "error" && file.error && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#dc2626",
                        margin: "0 0 8px 0",
                        fontWeight: "600",
                      }}
                    >
                      {file.error}
                    </p>
                  )}

                  {file.status !== "success" && file.status !== "error" && (
                    <>
                      <input
                        type="text"
                        value={file.caption}
                        onChange={(e) => updateCaption(file.id, e.target.value)}
                        placeholder="Add caption..."
                        disabled={file.status !== "pending"}
                        maxLength={100}
                        style={{
                          width: "100%",
                          padding: "6px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "4px",
                          fontSize: "11px",
                          marginBottom: "6px",
                          boxSizing: "border-box",
                          opacity: file.status === "pending" ? 1 : 0.5,
                          cursor:
                            file.status === "pending" ? "text" : "not-allowed",
                        }}
                      />
                      <button
                        onClick={() => removeFile(file.id)}
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
                            file.status === "pending"
                              ? "pointer"
                              : "not-allowed",
                          opacity: file.status === "pending" ? 1 : 0.5,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (file.status === "pending") {
                            e.currentTarget.style.background = "#fca5a5";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (file.status === "pending") {
                            e.currentTarget.style.background = "#fee2e2";
                          }
                        }}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <button
            onClick={uploadAllFiles}
            disabled={uploading || files.every((f) => f.status !== "pending")}
            style={{
              width: "100%",
              padding: "14px",
              background:
                uploading || files.every((f) => f.status !== "pending")
                  ? "#d1d5db"
                  : "linear-gradient(90deg, #ec4899, #a855f7, #3b82f6)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "bold",
              cursor:
                uploading || files.every((f) => f.status !== "pending")
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.3s",
              opacity:
                uploading || files.every((f) => f.status !== "pending")
                  ? 0.6
                  : 1,
            }}
            onMouseEnter={(e) => {
              !(uploading || files.every((f) => f.status !== "pending")) &&
                (e.currentTarget.style.transform = "translateY(-2px)");
            }}
            onMouseLeave={(e) => {
              !(uploading || files.every((f) => f.status !== "pending")) &&
                (e.currentTarget.style.transform = "translateY(0)");
            }}
          >
            {uploading
              ? `⏳ Uploading... (${uploadedCount}/${files.length})`
              : `🚀 Upload ${
                  files.filter((f) => f.status === "pending").length
                } Photo${
                  files.filter((f) => f.status === "pending").length !== 1
                    ? "s"
                    : ""
                }`}
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
