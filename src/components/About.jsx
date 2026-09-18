import React from "react";

export default function AboutSection() {
  const beats = [
    "Politics & Governance (Parliament, Cabinet Decisions)",
    "Investigative Journalism & Public Accountability",
    "Public Policy & Economy (Market Prices, Supply Chain)",
    "Disaster & Crisis Response (Floods, Relief Operations)",
  ];

  return (
    <section
      id="about"
      className="w-full bg-white py-16 font-sans border-t border-gray-100"
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Name & Title */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
            GTV Nepal
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            Santosh Pokharel{" "}
            <span className="text-lg font-normal text-gray-500">
              (सन्तोष पोखरेल)
            </span>
          </h2>
          <p className="text-gray-600 font-medium">
            Senior Reporter / TV Journalist — Kathmandu, Nepal
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div>
            <div className="text-2xl font-bold text-gray-900">8+</div>
            <div className="text-xs text-gray-500 uppercase font-semibold">
              Years Exp.
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">2,100+</div>
            <div className="text-xs text-gray-500 uppercase font-semibold">
              Reports Filed
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">77</div>
            <div className="text-xs text-gray-500 uppercase font-semibold">
              Districts Covered
            </div>
          </div>
        </div>

        {/* Beats List */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
            Primary Beats & Work
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {beats.map((beat, idx) => (
              <li
                key={idx}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium text-gray-800 flex items-center"
              >
                <span className="w-2 h-2 rounded-full bg-red-600 mr-3"></span>
                {beat}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
