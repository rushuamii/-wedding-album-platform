"use client";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Priya & Rohan",
      text: "WeddingAlbum saved us thousands! The quality is incredible and so easy to share with family worldwide.",
      rating: 5,
      location: "Colombo",
    },
    {
      name: "Anushka & Kabir",
      text: "Best decision ever! Our parents and grandparents love accessing our memories anytime. Simply amazing!",
      rating: 5,
      location: "Galle",
    },
    {
      name: "Dimple & Arjun",
      text: "Professional, secure, and affordable. This is exactly what we needed. Highly recommended to all couples!",
      rating: 5,
      location: "Kandy",
    },
  ];

  return (
    <section
      id="testimonials"
      style={{
        padding: "128px 24px",
        background:
          "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #dbeafe 100%)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
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
            Loved by Sri Lankan Couples
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
          }}
        >
          {testimonials.map((test, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                border: "2px solid #fce7f3",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 35px -5px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1)";
              }}
            >
              {/* Rating */}
              <div
                style={{ display: "flex", gap: "4px", marginBottom: "16px" }}
              >
                {[...Array(test.rating)].map((_, j) => (
                  <span key={j} style={{ fontSize: "20px" }}>
                    ⭐
                  </span>
                ))}
              </div>

              {/* Review Text */}
              <p
                style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  marginBottom: "24px",
                  lineHeight: "1.6",
                  fontStyle: "italic",
                }}
              >
                "{test.text}"
              </p>

              {/* Divider */}
              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "16px",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "4px",
                  }}
                >
                  {test.name}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#9ca3af",
                  }}
                >
                  {test.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
