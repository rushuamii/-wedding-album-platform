"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Wait for auth to load before checking
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#f9fafb",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
          <p style={{ fontSize: "16px", color: "#6b7280" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? "280px" : "80px",
          background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
          color: "white",
          padding: "24px",
          transition: "width 0.3s",
          position: "fixed",
          height: "100vh",
          overflowY: "auto",
          zIndex: 40,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
            justifyContent: sidebarOpen ? "flex-start" : "center",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #ec4899, #a855f7)",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "20px" }}>💍</span>
          </div>
          {sidebarOpen && (
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              WeddingAlbum
            </span>
          )}
        </div>

        {/* Menu Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { icon: "📊", label: "Dashboard", href: "/dashboard" },
            { icon: "📸", label: "Albums", href: "/dashboard/albums" },
            { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
            { icon: "👤", label: "Profile", href: "/dashboard/profile" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "8px",
                color: "white",
                textDecoration: "none",
                transition: "all 0.3s",
                background: "rgba(255,255,255,0.1)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(236, 72, 153, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              {sidebarOpen && (
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          style={{
            width: sidebarOpen ? "100%" : "48px",
            marginTop: "32px",
            padding: "12px",
            background: "rgba(239, 68, 68, 0.2)",
            border: "2px solid #ef4444",
            color: "#fca5a5",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
          }}
        >
          {sidebarOpen ? "Logout" : "🚪"}
        </button>
      </aside>

      {/* Main Content */}
      <main
        style={{
          marginLeft: sidebarOpen ? "280px" : "80px",
          flex: 1,
          transition: "margin 0.3s",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            background: "white",
            padding: "20px 32px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            {sidebarOpen ? "◀️" : "▶️"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: 0,
                }}
              >
                {user?.firstName} {user?.lastName}
              </p>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                {user?.email}
              </p>
            </div>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ec4899, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {user?.firstName?.charAt(0)}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: "32px" }}>{children}</div>
      </main>
    </div>
  );
}
