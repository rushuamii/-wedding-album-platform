"use client";

import { useState } from "react";

export default function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    {
      icon: "🔒",
      title: "100% Secure",
      description: "Bank-level encryption protects your memories forever",
      gradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-100",
    },
    {
      icon: "📸",
      title: "Unlimited Storage",
      description: "Upload thousands of photos & videos without limits",
      gradient: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Easy Sharing",
      description: "Share with family worldwide with secure guest access",
      gradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
    },
    {
      icon: "⭐",
      title: "Guest Upload",
      description: "Let guests upload their favorite wedding moments",
      gradient: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-200",
      iconBg: "bg-yellow-100",
    },
    {
      icon: "🎁",
      title: "Beautiful Layouts",
      description: "Professional album designs without premium software",
      gradient: "from-red-50 to-rose-50",
      borderColor: "border-red-200",
      iconBg: "bg-red-100",
    },
    {
      icon: "♾️",
      title: "Lifetime Access",
      description: "Your memories stay with you forever, always accessible",
      gradient: "from-violet-50 to-purple-50",
      borderColor: "border-violet-200",
      iconBg: "bg-violet-100",
    },
  ];

  return (
    <section
      id="features"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white border border-gray-200 rounded-full shadow-sm">
            <span className="text-sm font-medium text-gray-600">
              ✨ Features
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #1f2937 0%, #4b5563 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Why Choose
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
              WeddingAlbum?
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Professional features at a fraction of traditional album costs
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                group relative p-8 rounded-2xl bg-gradient-to-br ${
                  feature.gradient
                }
                border ${feature.borderColor} shadow-sm hover:shadow-xl
                transform transition-all duration-300 cursor-pointer
                ${
                  hoveredIndex === i
                    ? "scale-[1.02] -translate-y-1"
                    : "scale-100"
                }
              `}
            >
              {/* Icon container */}
              <div
                className={`
                  inline-flex items-center justify-center w-14 h-14 mb-5 rounded-xl ${
                    feature.iconBg
                  }
                  shadow-sm transform transition-all duration-300
                  ${
                    hoveredIndex === i
                      ? "scale-110 rotate-6"
                      : "scale-100 rotate-0"
                  }
                `}
              >
                <span className="text-3xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>

              {/* Hover indicator */}
              <div
                className={`
                  absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
                  rounded-b-2xl transform transition-all duration-300
                  ${
                    hoveredIndex === i
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0"
                  }
                `}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 sm:mt-20">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => (window.location.href = "/register")}
              className="group px-8 py-3 overflow-hidden rounded-lg font-semibold text-sm text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              style={{
                background:
                  "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%)",
              }}
            >
              <span className="flex items-center gap-2">
                Get Started Free
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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

            <p className="text-sm text-gray-500">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
