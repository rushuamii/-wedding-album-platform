"use client";

export default function Features() {
  const features = [
    {
      icon: "🔒",
      title: "100% Secure",
      description: "Bank-level encryption protects your memories forever",
      color: "#dcfce7",
    },
    {
      icon: "📸",
      title: "Unlimited Storage",
      description: "Upload thousands of photos & videos without limits",
      color: "#f3e8ff",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Easy Sharing",
      description: "Share with family worldwide with secure guest access",
      color: "#dbeafe",
    },
    {
      icon: "⭐",
      title: "Guest Upload",
      description: "Let guests upload their favorite wedding moments",
      color: "#fef3c7",
    },
    {
      icon: "🎁",
      title: "Beautiful Layouts",
      description: "Professional album designs without premium software",
      color: "#fee2e2",
    },
    {
      icon: "♾️",
      title: "Lifetime Access",
      description: "Your memories stay with you forever, always accessible",
      color: "#e9d5ff",
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: "128px 24px",
        background: "white",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <h2
            style={{
              fontSize: "clamp(32px, 6vw, 56px)",
              fontWeight: "900",
              marginBottom: "24px",
              background: "linear-gradient(90deg, #ec4899, #a855f7, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Why Choose WeddingAlbum?
          </h2>
          <p
            style={{
              fontSize: "20px",
              color: "#6b7280",
              maxWidth: "512px",
              margin: "0 auto",
            }}
          >
            Professional features at a fraction of traditional album costs
          </p>
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
          }}
        >
          {features.map((feature, i) => (
            <div
              key={i}
              style={{
                background: feature.color,
                border: "3px solid #d1d5db",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 25px -5px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "16px",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  marginBottom: "12px",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  lineHeight: "1.6",
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
