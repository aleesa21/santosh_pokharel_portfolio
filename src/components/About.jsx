import React from "react";
import { 
  FaCalendarDays, 
  FaRadio, 
  FaTv, 
  FaNewspaper, 
  FaBullhorn,
  FaBuildingColumns
} from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";

export default function About() {
  const experiences = [
    {
      id: 1,
      role: "News Reader",
      organization: "Radio Darpan 88.4 MHz, Bardibas",
      period: "1 Year",
      icon: FaRadio,
    },
    {
      id: 2,
      role: "Editor (सम्पादक)",
      organization: "Madhya Aawaj Weekly",
      period: "2065 Shrawan – Present",
      icon: FaNewspaper,
    },
    {
      id: 3,
      role: "News Chief",
      organization: "Radio Bardibas",
      period: "1 Year",
      icon: FaRadio,
    },
    {
      id: 4,
      role: "Program Developer",
      organization: "Daily TV Karyakram / Program Development Forum",
      period: "2015 – Present",
      icon: FaTv,
    },
    {
      id: 5,
      role: "Sub Editor",
      organization: "Palika Khabar Media Pvt. Ltd.",
      period: "Media Professional",
      icon: FaBuildingColumns,
    },
    {
      id: 6,
      role: "News Coordinator",
      organization: "News Nepal Television (NTV)",
      period: "2 Years",
      icon: FaTv,
    },
    {
      id: 7,
      role: "News Coordinator",
      organization: "GTV (Gandaki Television) Network",
      period: "Present",
      icon: FaBullhorn,
    },
    {
      id: 8,
      role: "Producer",
      organization: "Media Network Nepal",
      period: "Present",
      icon: FaTv,
    },
  ];

  return (
    <section
      id="about"
      className="relative bg-slate-900/5 text-slate-900 w-full py-16 md:py-24 font-sans border-t border-slate-200 overflow-hidden"
    >
      {/* Background Subtle Mesh & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-red-100/40 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
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

        {/* Unified Left-Aligned Stacked Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-red-200 space-y-5">
          {experiences.map((exp) => {
            const IconComponent = exp.icon;

            return (
              <div key={exp.id} className="relative group">
                
                {/* Timeline Node Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-4 h-4 rounded-full border-2 border-white shadow-md bg-slate-400 group-hover:bg-slate-700 group-hover:scale-125 transition-transform" />

                {/* Content Box */}
                <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-300 backdrop-blur-md border bg-white/90 border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Left side: Icon, Role, and Organization */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl shrink-0 transition-colors bg-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white">
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div>
                        <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-red-700 transition-colors leading-snug">
                          {exp.role}
                        </h4>
                        <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                          {exp.organization}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Period */}
                    <div className="flex items-center gap-3 self-start sm:self-center pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <FaCalendarDays className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{exp.period}</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}