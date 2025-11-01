"use client";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "2,500",
      features: [
        "50 GB Storage",
        "5 Shared Albums",
        "Basic Support",
        "1 Year Access",
      ],
      bgColor: "#dbeafe",
      popular: false,
    },
    {
      name: "Professional",
      price: "3,500",
      features: [
        "Unlimited Storage",
        "Unlimited Albums",
        "Priority Support",
        "Lifetime Access",
        "Guest Upload",
      ],
      bgColor: "#fce7f3",
      popular: true,
    },
    {
      name: "Premium",
      price: "4,500",
      features: [
        "Everything in Pro",
        "Advanced Editing",
        "Video Support",
        "4K Exports",
        "Dedicated Support",
      ],
      bgColor: "#e9d5ff",
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
      style={{
        padding: "128px 24px",
        background: "white",
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
            Simple, Transparent Pricing
          </h2>
          <p
            style={{
              fontSize: "20px",
              color: "#6b7280",
            }}
          >
            No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
          }}
        >
          {plans.map((plan, i) => (
            <div
              key={i}
              style={{
                background: `linear-gradient(135deg, ${plan.bgColor} 0%, #ffffff 100%)`,
                border: "3px solid #d1d5db",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s",
                transform: plan.popular ? "scale(1.05)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 20px 35px -5px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = plan.popular
                  ? "scale(1.08)"
                  : "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = plan.popular
                  ? "scale(1.05)"
                  : "scale(1)";
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      background: "linear-gradient(90deg, #ec4899, #a855f7)",
                      color: "white",
                      padding: "6px 16px",
                      borderRadius: "50px",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  marginBottom: "8px",
                }}
              >
                {plan.name}
              </h3>

              {/* Price */}
              <p
                style={{
                  fontSize: "48px",
                  fontWeight: "900",
                  background: "linear-gradient(90deg, #ec4899, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: "24px",
                }}
              >
                Rs. {plan.price}
                <span style={{ fontSize: "16px", color: "#6b7280" }}>
                  /year
                </span>
              </p>

              {/* Features List */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  marginBottom: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {plan.features.map((feature, j) => (
                  <li
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      color: "#374151",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>✅</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => (window.location.href = "/(auth)/register")}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  background: plan.popular
                    ? "linear-gradient(90deg, #ec4899, #a855f7, #3b82f6)"
                    : "white",
                  color: plan.popular ? "white" : "#1f2937",
                  borderColor: plan.popular ? "transparent" : "#d1d5db",
                  borderWidth: plan.popular ? 0 : 2,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
