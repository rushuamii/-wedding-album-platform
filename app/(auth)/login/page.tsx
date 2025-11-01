"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save token and user info
      login(data.token, data.user);

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        background: "white",
        borderRadius: "24px",
        padding: "48px",
        boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.15)",
        border: "2px solid #f3e8ff",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "900",
            marginBottom: "8px",
            background: "linear-gradient(90deg, #ec4899, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Welcome Back
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          Sign in to your account
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "2px solid #fca5a5",
            color: "#991b1b",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          ❌ {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
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
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
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

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading
              ? "#d1d5db"
              : "linear-gradient(90deg, #ec4899, #a855f7, #3b82f6)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "8px",
          }}
          onMouseEnter={(e) =>
            !loading && (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) =>
            !loading && (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: "24px",
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        Don't have an account?{" "}
        <Link
          href="/register"
          style={{
            color: "#ec4899",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
