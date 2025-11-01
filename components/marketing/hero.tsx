"use client";

export default function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "128px",
        background:
          "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #dbeafe 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          width: "384px",
          height: "384px",
          background: "#f472b6",
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: 0.2,
          animation: "pulse 2s infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          width: "384px",
          height: "384px",
          background: "#a855f7",
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: 0.2,
          animation: "pulse 2s 1s infinite",
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "24px",
          textAlign: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-block",
            marginBottom: "24px",
            padding: "8px 24px",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            border: "2px solid #fce7f3",
            borderRadius: "50px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#ec4899",
          }}
        >
          ⭐ Trusted by 500+ Couples | 4.9★ Rating
        </div>

        {/* Main Heading */}
        <h1
          style={{
            fontSize: "clamp(32px, 8vw, 72px)",
            fontWeight: "900",
            marginBottom: "32px",
            lineHeight: "1.2",
            background: "linear-gradient(90deg, #ec4899, #a855f7, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Preserve Your Wedding Memories Forever ✨
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "20px",
            color: "#374151",
            marginBottom: "16px",
            fontWeight: "500",
          }}
        >
          Beautiful Digital Albums for Sri Lankan Couples
        </p>

        <p
          style={{
            fontSize: "18px",
            color: "#6b7280",
            marginBottom: "48px",
            maxWidth: "512px",
            margin: "0 auto 48px",
          }}
        >
          Bank-level secure. Unlimited storage. Share with family worldwide.
          <span style={{ fontWeight: "bold", color: "#16a34a" }}>
            {" "}
            Save 92% today!
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "48px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => (window.location.href = "/(auth)/register")}
            style={{
              background: "linear-gradient(90deg, #ec4899, #a855f7, #3b82f6)",
              color: "white",
              padding: "16px 40px",
              borderRadius: "16px",
              fontWeight: "bold",
              fontSize: "18px",
              boxShadow: "0 25px 50px -12px rgba(236, 72, 153, 0.5)",
              cursor: "pointer",
              transition: "all 0.3s",
              border: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow =
                "0 30px 60px -12px rgba(236, 72, 153, 0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 25px 50px -12px rgba(236, 72, 153, 0.5)";
            }}
          >
            🎉 Start Your Free Trial →
          </button>

          <button
            onClick={() =>
              document
                .getElementById("features")
                .scrollIntoView({ behavior: "smooth" })
            }
            style={{
              background: "white",
              border: "3px solid #c084fc",
              color: "#a855f7",
              padding: "16px 40px",
              borderRadius: "16px",
              fontWeight: "bold",
              fontSize: "18px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#faf5ff";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            View Features ❤️
          </button>
        </div>

        {/* Price Comparison */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            border: "2px solid #c084fc",
            maxWidth: "512px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                background: "#fee2e2",
                padding: "24px",
                borderRadius: "12px",
                border: "3px solid #fca5a5",
              }}
            >
              <p
                style={{
                  color: "#991b1b",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Physical Albums
              </p>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  color: "#dc2626",
                  textDecoration: "line-through",
                }}
              >
                Rs. 50,000
              </p>
            </div>
            <div
              style={{
                background: "#dcfce7",
                padding: "24px",
                borderRadius: "12px",
                border: "3px solid #86efac",
              }}
            >
              <p
                style={{
                  color: "#166534",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                WeddingAlbum
              </p>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  color: "#22c55e",
                }}
              >
                Rs. 3,500<span style={{ fontSize: "14px" }}>/yr</span>
              </p>
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
              padding: "24px",
              borderRadius: "12px",
              border: "2px solid #22c55e",
              marginBottom: "32px",
            }}
          >
            <p
              style={{ fontSize: "24px", fontWeight: "900", color: "#15803d" }}
            >
              💚 Save 92%! Unlimited Everything!
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/(auth)/register")}
            style={{
              width: "100%",
              background: "linear-gradient(90deg, #ec4899, #a855f7, #3b82f6)",
              color: "white",
              padding: "12px",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "18px",
              cursor: "pointer",
              border: "none",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 20px 25px -5px rgba(236, 72, 153, 0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Get Started Free →
          </button>
        </div>
      </div>
    </section>
  );
}
