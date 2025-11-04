"use client";

import { useState } from "react";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"yearly" | "monthly">(
    "yearly"
  );
  const yearlyPrice = 5000;
  const monthlyPrice = Math.round(yearlyPrice / 12);

  const features = [
    { icon: "☁️", text: "Unlimited photo & video storage" },
    { icon: "🔒", text: "Bank-level security & privacy" },
    { icon: "👨‍👩‍👧‍👦", text: "Share with unlimited guests" },
    { icon: "📤", text: "Guest upload feature included" },
    { icon: "🎨", text: "Beautiful pre-designed layouts" },
    { icon: "♾️", text: "Lifetime access to all memories" },
    { icon: "📱", text: "Mobile & desktop apps" },
    { icon: "⚡", text: "Priority 24/7 support" },
  ];

  return (
    <section
      id="pricing"
      className="relative py-12 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 bg-white border border-gray-200 rounded-full shadow-sm">
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              💰 Pricing
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight px-4">
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #1f2937 0%, #4b5563 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Simple,
            </span>
            <span
              className="block mt-1"
              style={{
                background:
                  "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Transparent Pricing
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            One plan with everything included. No hidden fees. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5 bg-gray-100 rounded-full">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`
                px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200
                ${
                  billingPeriod === "monthly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`
                px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 sm:gap-2
                ${
                  billingPeriod === "yearly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              Yearly
              <span className="px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 text-[10px] sm:text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="relative bg-white/90 backdrop-blur-lg border-2 border-gray-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div
                className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm font-bold shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%)",
                }}
              ></div>
            </div>

            <div className="p-6 sm:p-8 md:p-10 lg:p-12">
              {/* Plan name */}
              <div className="text-center mb-6 sm:mb-8 mt-2 sm:mt-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  WeddingAlbum Premium
                </h3>
                <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                  <span
                    className="text-4xl sm:text-5xl md:text-6xl font-black"
                    style={{
                      background:
                        "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Rs.{" "}
                    {billingPeriod === "yearly"
                      ? yearlyPrice.toLocaleString()
                      : monthlyPrice.toLocaleString()}
                  </span>
                  <span className="text-base sm:text-lg md:text-xl text-gray-500">
                    /{billingPeriod === "yearly" ? "year" : "month"}
                  </span>
                </div>
                {billingPeriod === "yearly" && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    That's just Rs.{" "}
                    {Math.round(yearlyPrice / 12).toLocaleString()}/month
                  </p>
                )}
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">
                      {feature.icon}
                    </span>
                    <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => (window.location.href = "/register")}
                className="group w-full px-6 sm:px-8 py-3 sm:py-4 overflow-hidden rounded-lg sm:rounded-xl font-bold text-base sm:text-lg text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%)",
                }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  Start Now
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </button>
            </div>

            {/* Bottom decorative bar */}
            <div
              className="h-1.5 sm:h-2"
              style={{
                background:
                  "linear-gradient(90deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%)",
              }}
            />
          </div>

          {/* Comparison callout */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl sm:rounded-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center">
              <span className="text-2xl sm:text-3xl">💰</span>
              <div>
                <p className="text-base sm:text-lg font-bold text-green-900">
                  Save 90% vs. Traditional Albums
                </p>
                <p className="text-xs sm:text-sm text-green-700">
                  Physical albums cost Rs. 50,000+ with limited capacity
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ teaser */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            Have questions?
          </p>
          <button
            onClick={() =>
              document
                .getElementById("faq")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-sm sm:text-base text-pink-600 hover:text-pink-700 font-semibold underline underline-offset-4"
          >
            View FAQ →
          </button>
        </div>
      </div>
    </section>
  );
}
