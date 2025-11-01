"use client";

export default function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Security", "Blog"],
    },
    {
      title: "Company",
      links: ["About Us", "Contact", "Careers", "Press"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "GDPR", "Cookies"],
    },
    {
      title: "Social",
      links: ["Facebook", "Instagram", "Twitter", "LinkedIn"],
    },
  ];

  return (
    <footer
      style={{
        background: "#111827",
        color: "white",
        padding: "64px 24px 32px",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Main Footer Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "48px",
            marginBottom: "48px",
          }}
        >
          {/* Brand Column */}
          <div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "900",
                background: "linear-gradient(90deg, #f472b6, #a855f7, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "16px",
              }}
            >
              WeddingAlbum
            </h3>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Beautiful digital albums for Sri Lankan couples. Preserve your
              memories forever with bank-level security and unlimited storage.
            </p>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section, i) => (
            <div key={i}>
              <h4
                style={{
                  fontWeight: "bold",
                  marginBottom: "16px",
                  fontSize: "16px",
                  color: "white",
                }}
              >
                {section.title}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href="#"
                      style={{
                        color: "#9ca3af",
                        textDecoration: "none",
                        transition: "color 0.3s",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ec4899";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#9ca3af";
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid #374151",
            paddingTop: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            © 2025 WeddingAlbum. All rights reserved.
          </p>
          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Made for Sri Lankan Couples with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
