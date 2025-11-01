"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        width: "100%",
        top: 0,
        zIndex: 50,
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid #f3e8ff",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "80px",
        }}
      >
        {/* Logo Section */}
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
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
            <span style={{ fontSize: "24px" }}>💍</span>
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: "900",
              background: "linear-gradient(90deg, #ec4899, #a855f7, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            WeddingAlbum
          </span>
        </a>

        {/* Desktop Menu - Only shown when NOT mobile */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              gap: "32px",
            }}
          >
            {[
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "Reviews", href: "#testimonials" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#374151",
                  textDecoration: "none",
                  transition: "all 0.3s",
                  paddingBottom: "4px",
                  borderBottom: "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ec4899";
                  e.currentTarget.style.borderBottomColor = "#ec4899";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#374151";
                  e.currentTarget.style.borderBottomColor = "transparent";
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}

        {/* Desktop CTA Buttons - Only shown when NOT mobile */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              onClick={() => (window.location.href = "/login")}
              style={{
                padding: "8px 20px",
                background: "transparent",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                color: "#374151",
                cursor: "pointer",
                transition: "all 0.3s",
                borderRadius: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.style.color = "#ec4899";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#374151";
              }}
            >
              Sign In
            </button>

            <button
              onClick={() => (window.location.href = "/register")}
              style={{
                padding: "8px 24px",
                background: "linear-gradient(90deg, #ec4899, #a855f7, #3b82f6)",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.boxShadow =
                  "0 15px 35px -5px rgba(236, 72, 153, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px -5px rgba(236, 72, 153, 0.4)";
              }}
            >
              Get Started
            </button>
          </div>
        )}

        {/* Mobile Menu Button - Only shown on mobile */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "3px",
                background: "#374151",
                borderRadius: "2px",
                transition: "all 0.3s",
                transform: mobileMenuOpen
                  ? "rotate(45deg) translateY(12px)"
                  : "rotate(0)",
              }}
            />
            <div
              style={{
                width: "24px",
                height: "3px",
                background: "#374151",
                borderRadius: "2px",
                transition: "all 0.3s",
                opacity: mobileMenuOpen ? 0 : 1,
              }}
            />
            <div
              style={{
                width: "24px",
                height: "3px",
                background: "#374151",
                borderRadius: "2px",
                transition: "all 0.3s",
                transform: mobileMenuOpen
                  ? "rotate(-45deg) translateY(-12px)"
                  : "rotate(0)",
              }}
            />
          </button>
        )}
      </div>

      {/* Mobile Menu - Only shown on mobile when open */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            background: "white",
            borderTop: "1px solid #e5e7eb",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            animation: "fadeInDown 0.3s ease-out",
          }}
        >
          {[
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Reviews", href: "#testimonials" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: "16px",
                fontWeight: "500",
                color: "#374151",
                textDecoration: "none",
                padding: "8px 0",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ec4899";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#374151";
              }}
            >
              {item.label}
            </a>
          ))}

          <div
            style={{ height: "1px", background: "#e5e7eb", margin: "8px 0" }}
          />

          <button
            onClick={() => {
              window.location.href = "/login";
              setMobileMenuOpen(false);
            }}
            style={{
              width: "100%",
              padding: "10px",
              background: "transparent",
              border: "2px solid #e5e7eb",
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ec4899";
              e.currentTarget.style.color = "#ec4899";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.color = "#374151";
            }}
          >
            Sign In
          </button>

          <button
            onClick={() => {
              window.location.href = "/register";
              setMobileMenuOpen(false);
            }}
            style={{
              width: "100%",
              padding: "10px",
              background: "linear-gradient(90deg, #ec4899, #a855f7, #3b82f6)",
              border: "none",
              fontSize: "16px",
              fontWeight: "600",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}
