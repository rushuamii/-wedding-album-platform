"use client";

export default function CTA() {
  return (
    <section
      style={{
        padding: "96px 24px",
        background: "linear-gradient(90deg, #ec4899, #a855f7, #3b82f6)",
      }}
    >
      <div
        style={{ maxWidth: "1024px", margin: "0 auto", textAlign: "center" }}
      >
        <h2
          style={{
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: "900",
            color: "white",
            marginBottom: "24px",
          }}
        >
          Ready to Preserve Your Memories?
        </h2>

        <p
          style={{
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: "40px",
            maxWidth: "512px",
            margin: "0 auto 40px",
          }}
        >
          Join 500+ Sri Lankan couples already using WeddingAlbum
        </p>

        <button
          onClick={() => (window.location.href = "/(auth)/register")}
          style={{
            background: "white",
            color: "#ec4899",
            padding: "16px 48px",
            borderRadius: "16px",
            fontSize: "18px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0 25px 35px -5px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 20px 25px -5px rgba(0, 0, 0, 0.2)";
          }}
        >
          Start Your Free Trial Today →
        </button>
      </div>
    </section>
  );
}
