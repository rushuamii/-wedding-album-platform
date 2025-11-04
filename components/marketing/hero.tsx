"use client";

import { useState, useEffect } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 via-transparent to-blue-50/30" />

      {/* Background image with MUCH lighter overlay - hero image is VISIBLE */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.png"
          alt="Wedding memories"
          className="w-full h-full object-cover"
        />
        {/* Changed from white/90 to black/20 for better image visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
      </div>

      {/* Content container with better text contrast */}
      <div
        className={`relative z-10 w-full max-w-5xl mx-auto px-6 py-20 text-center transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Trust badge - now with better contrast */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/90 backdrop-blur-md border border-white/50 rounded-full shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">
                ★
              </span>
            ))}
          </div>
          <span className="text-xs font-medium text-gray-700">
            4.9 from 500+ couples
          </span>
        </div>

        {/* Headline with text shadow for readability */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight drop-shadow-lg">
          <span
            className="block text-white"
            style={{
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            Preserve Your Wedding
          </span>
          <span
            className="block mt-2"
            style={{
              background:
                "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 8px rgba(236, 72, 153, 0.5))",
            }}
          >
            Memories Forever
          </span>
        </h1>

        {/* Subtitle with better readability */}
        <p className="text-lg sm:text-xl text-white font-medium mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Beautiful digital albums for Sri Lankan couples. Bank-level security,
          unlimited storage, and easy worldwide sharing.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 max-w-md mx-auto">
          <button
            onClick={() => (window.location.href = "/register")}
            className="group relative w-full sm:w-auto px-6 py-3 overflow-hidden rounded-lg font-semibold text-sm text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            style={{
              background:
                "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%)",
            }}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center justify-center gap-2">
              Start Free Trial
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

          <button
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-full sm:w-auto px-6 py-3 bg-white/95 backdrop-blur-md hover:bg-white text-gray-700 border border-white/30 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            View Features
          </button>
        </div>

        {/* Feature highlights with better contrast */}
        <div className="flex flex-wrap justify-center gap-6 mb-16 text-sm">
          <div className="flex items-center gap-2 text-white drop-shadow-md">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Unlimited storage</span>
          </div>
          <div className="flex items-center gap-2 text-white drop-shadow-md">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Secure & private</span>
          </div>
          <div className="flex items-center gap-2 text-white drop-shadow-md">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Share worldwide</span>
          </div>
        </div>

        {/* Pricing card with glass effect */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-8">
            {/* Pricing comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Physical albums */}
              <div className="relative p-6 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200">
                <div className="absolute -top-3 left-4 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                  Traditional
                </div>
                <p className="text-sm font-medium text-red-900 mb-2 mt-2">
                  Physical Albums
                </p>
                <p className="text-3xl font-bold text-red-600 line-through mb-3">
                  Rs. 50,000
                </p>
                <div className="space-y-1 text-xs text-red-700">
                  <p>• Limited capacity</p>
                  <p>• Can get damaged</p>
                  <p>• Hard to share</p>
                </div>
              </div>

              {/* WeddingAlbum */}
              <div className="relative p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
                <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                  Recommended
                </div>
                <p className="text-sm font-medium text-green-900 mb-2 mt-2">
                  WeddingAlbum
                </p>
                <p className="text-3xl font-bold text-green-600 mb-3">
                  Rs. 5,000
                  <span className="text-sm font-normal">/year</span>
                </p>
                <div className="space-y-1 text-xs text-green-700">
                  <p>✓ Unlimited photos</p>
                  <p>✓ Forever protected</p>
                  <p>✓ Share anywhere</p>
                </div>
              </div>
            </div>

            {/* Savings banner */}
            <div className="relative p-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 mb-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-shimmer" />
              <p className="relative text-lg font-bold text-green-900 text-center">
                🎉 Save 92% compared to traditional albums
              </p>
            </div>

            {/* Final CTA */}
            <button
              onClick={() => (window.location.href = "/register")}
              className="group w-full px-6 py-4 overflow-hidden rounded-xl font-semibold text-base text-white shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
              style={{
                background:
                  "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%)",
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                Get Started Free
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
        </div>
      </div>

      {/* Shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </section>
  );
}
