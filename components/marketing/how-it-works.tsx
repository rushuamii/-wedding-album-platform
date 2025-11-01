"use client";

export default function HowItWorks() {
  const steps = [
    { num: "1", title: "Sign Up Free", desc: "Create account in 2 minutes" },
    {
      num: "2",
      title: "Upload Photos",
      desc: "Add thousands of wedding images",
    },
    {
      num: "3",
      title: "Invite Guests",
      desc: "Share secure links with family",
    },
    { num: "4", title: "Cherish Forever", desc: "Access your album anytime" },
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-black mb-6">
          <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            How It Works
          </span>
        </h2>
        <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
          Simple, beautiful, and secure in just 4 easy steps
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl font-black text-white">
                  {step.num}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
