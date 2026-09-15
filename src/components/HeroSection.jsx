import React from "react";
// Icons imported from react-icons (Fa6, Hi2, Tb, Io5)
import {
  FaPlay,
  FaNewspaper,
  FaBullhorn,
  FaAward,
  FaMapLocationDot,
} from "react-icons/fa6";
import { HiOutlineSparkles, HiRadio } from "react-icons/hi2";
import { TbFileReport } from "react-icons/tb";

function HeroSection() {
  const tickerItems = [
    "New episode airs Thursday, 8 PM on NTV",
    "Gold trade investigation: part two out now",
    "Parliament budget debate enters third day",
    "Flood relief reaches 12 districts in eastern Nepal",
  ];

  const stats = [
    { value: "8+", label: "Years Exp.", icon: FaAward },
    { value: "2,100+", label: "Reports", icon: TbFileReport },
    { value: "77", label: "Districts Covered", icon: FaMapLocationDot },
  ];

  return (
    <section className="relative bg-slate-900/5 text-slate-900 flex flex-col h-full w-full overflow-hidden border-b border-slate-200">
      {/* Background Subtle Mesh & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100/40 rounded-full filter blur-3xl pointer-events-none" />

      {/* Breaking Marquee  */}
      <div className="relative z-10 shrink-0 border-b border-slate-950 bg-slate-950 text-white shadow-md">
        <div className="flex items-center">
          <div className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white text-[11px] font-black uppercase tracking-widest px-4 py-2 shadow-lg z-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Breaking
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="flex whitespace-nowrap animate-marquee py-2 text-xs font-medium">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-3 text-slate-300 mx-6 hover:text-white transition-colors cursor-default"
                >
                  <span className="text-red-500 font-bold">•</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-0 mx-auto w-full px-4 md:px-8 py-3 md:py-5 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10 w-full max-h-full">
          {/* Left Text Content Column */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 self-start bg-gradient-to-r from-red-50 to-red-100/80 border border-red-200/90 px-3 py-1 rounded-full text-red-700 font-bold text-[11px] tracking-wider shadow-xs">
              <HiRadio className="w-4 h-4 text-red-600 animate-pulse" />
              <span>ON AIR · GTV NEPAL</span>
            </div>

            {/* Name Header */}
            <div className="space-y-0">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
                Santosh <span className="text-red-700">Pokharel</span>
              </h1>
              <div className="pt-1 flex items-center gap-2">
                <h2 className="text-sm sm:text-base text-slate-600 font-medium tracking-wide">
                  सन्तोष पोखरेल
                </h2>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-500">
                  Kathmandu, Nepal
                </span>
              </div>
            </div>

            {/* Category Badges */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {[
                "Senior Reporter",
                "Politics & Society",
                "Investigative Journalism",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-white/90 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Biography */}
            <p className="max-w-xl text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              Covering ground-level investigative stories, public policy, and
              key political developments across all 77 districts of Nepal for
              GTV News.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-red-700 hover:bg-red-800 active:scale-95 rounded-xl shadow-md shadow-red-900/10 transition-all cursor-pointer group">
                <FaPlay className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
                Watch Latest Reports
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 active:scale-95 rounded-xl shadow-2xs transition-all cursor-pointer">
                <FaNewspaper className="w-4 h-4 text-slate-500" />
                Read Articles
              </button>
            </div>

            {/* Stat Cards*/}
            <div className="grid grid-cols-3 gap-3 pt-3 mt-1 border-t border-slate-200 max-w-lg">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="group relative flex flex-col p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-red-200 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-red-700 transition-colors">
                        {s.value}
                      </span>
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Image  */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center h-full">
            <div className="relative w-full max-w-xs sm:max-w-sm group">
              {/* Subtle Ambient Glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-red-600 via-slate-800 to-red-900 rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition duration-500" />

              <div className="relative w-full aspect-[3/4] max-h-[360px] sm:max-h-[420px] rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-700">
                <img
                  src="/hero.jpeg"
                  alt="Santosh Pokharel - Senior Reporter"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Broadcast Lower-Third Overlay Card */}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-stretch rounded-xl overflow-hidden shadow-2xl backdrop-blur-md bg-white/90 border border-white/60">
                  <div className="w-1.5 bg-red-700" />
                  <div className="px-3.5 py-2 flex-1 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-slate-900 font-extrabold text-xs sm:text-sm tracking-tight leading-none">
                          Santosh Pokharel
                        </p>
                        <HiOutlineSparkles className="w-3.5 h-3.5 text-red-600" />
                      </div>
                      <p className="text-slate-500 font-medium text-[11px] mt-0.5">
                        Senior Reporter · GTV Nepal
                      </p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
