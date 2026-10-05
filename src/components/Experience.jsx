import React from "react";
import {
  FaRadio,
  FaTv,
  FaNewspaper,
  FaBullhorn,
  FaBuildingColumns,
} from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";

// Original order
const experiences = [
  { id: 1, role: "News Reader", organization: "Radio Darpan 88.4 MHz, Bardibas", period: "1 Year", icon: FaRadio, current: false },
  { id: 2, role: "Editor (सम्पादक)", organization: "Madhya Aawaj Weekly", period: "2065 Shrawan – Present", icon: FaNewspaper, current: true },
  { id: 3, role: "News Chief", organization: "Radio Bardibas", period: "1 Year", icon: FaRadio, current: false },
  { id: 4, role: "Program Developer", organization: "Daily TV Karyakram / Program Development Forum", period: "2015 – Present", icon: FaTv, current: true },
  { id: 5, role: "Sub Editor", organization: "Palika Khabar Media Pvt. Ltd.", period: "Media Professional", icon: FaBuildingColumns, current: false },
  { id: 6, role: "News Coordinator", organization: "News Nepal Television (NTV)", period: "2 Years", icon: FaTv, current: false },
  { id: 7, role: "News Coordinator", organization: "GTV (Gandaki Television) Network", period: "Present", icon: FaBullhorn, current: true },
  { id: 8, role: "Producer", organization: "Media Network Nepal", period: "Present", icon: FaTv, current: true },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative bg-slate-900/5 text-slate-900 w-full py-16 md:py-10 font-sans border-t border-slate-200 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-red-100/40 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100/80 border border-red-200/90 px-3 py-1 2xl:px-5 2xl:py-2 rounded-full text-red-700 font-bold text-[11px] 2xl:text-sm tracking-wider shadow-xs mb-3">
            <HiOutlineSparkles className="w-4 h-4 text-red-600 animate-pulse" />
            <span>CAREER TRACK</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
            Professional <span className="text-red-700">Journey</span>
          </h3>
          <p className="text-slate-600 font-medium text-sm sm:text-base mt-2">
            A chronological sequence of media appointments, editorial leadership, and broadcast roles.
          </p>
        </div>

        {/* Two-column list */}
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {experiences.map((exp) => {
            const Icon = exp.icon;
            return (
              <li
                key={exp.id}
                className="group relative flex items-center gap-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 px-5 py-4 overflow-hidden transition-all duration-200 hover:bg-white hover:border-slate-300 hover:shadow-md"
              >
                {/* Accent bar slides in on hover */}
                <span className="absolute left-0 top-0 h-full w-1 bg-red-600 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 motion-reduce:transition-none" />

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                    exp.current
                      ? "bg-red-50 text-red-700 group-hover:bg-red-600 group-hover:text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-900 group-hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-black text-slate-900 leading-snug transition-colors group-hover:text-red-700">
                    {exp.role}
                  </h4>
                  <p className="text-sm font-semibold text-slate-600 mt-0.5">
                    {exp.organization}
                  </p>
                </div>

                <span
                  className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${
                    exp.current
                      ? "text-red-700 bg-red-50 border-red-200"
                      : "text-slate-500 bg-slate-50 border-slate-200"
                  }`}
                >
                  {exp.current && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse motion-reduce:animate-none" />
                  )}
                  {exp.period}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
