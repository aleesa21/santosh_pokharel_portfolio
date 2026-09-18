import React from "react";
import { FaPlay } from "react-icons/fa6";

function Video() {
  const videos = [
    {
      id: 1,
      title: "GTV Headlines | Major National Coverage",
      category: "Live Broadcast",
      date: "Sep 12, 2026",
      youtubeUrl: "https://www.youtube.com/embed/axYJey7D5ds",
    },
    {
      id: 2,
      title: "Special Report: Ground Investigation on Public Policy",
      category: "Investigative",
      date: "Aug 28, 2026",
      youtubeUrl: "https://www.youtube.com/embed/axYJey7D5ds",
    },
    {
      id: 3,
      title: "Parliamentary Debate & Legislative Updates",
      category: "Politics",
      date: "Aug 15, 2026",
      youtubeUrl: "https://www.youtube.com/embed/axYJey7D5ds",
    },
    {
      id: 4,
      title: "District Relief Operations & Crisis Reporting",
      category: "Field Report",
      date: "Jul 10, 2026",
      youtubeUrl: "https://www.youtube.com/embed/axYJey7D5ds",
    },
  ];

  return (
    <section
      id="videos"
      className="relative bg-white text-slate-900 w-full border-b border-slate-200 py-8 md:py-12 2xl:py-16"
    >
      {/* Aligned Container */}
      <div className="mx-auto w-full px-4 md:px-15 2xl:px-20">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2 2xl:gap-4 mb-6 md:mb-10 2xl:mb-14">
          <div className="inline-flex items-center gap-2 self-start bg-gradient-to-r from-red-50 to-red-100/80 border border-red-200/90 px-3 py-1 2xl:px-5 2xl:py-2 rounded-full text-red-700 font-bold text-[11px] 2xl:text-sm tracking-wider">
            <FaPlay className="w-2.5 h-2.5 2xl:w-4 2xl:h-4 text-red-600" />
            <span>BROADCAST WORK</span>
          </div>

          <h2 className="text-2xl sm:text-4xl 2xl:text-6xl font-black text-slate-900 tracking-tight">
            Latest News <span className="text-red-700">Reports</span>
          </h2>
          <p className="text-xs sm:text-sm 2xl:text-xl text-slate-600 font-normal">
            Watch live bulletins, field reports, and investigative coverage.
          </p>
        </div>

        {/* Responsive Video Grid (1 col mobile -> 2 cols tablet -> 3 cols laptop -> 4 cols desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 2xl:gap-8">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group bg-white/90 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-red-200 transition-all duration-200 overflow-hidden flex flex-col"
            >
              {/* Aspect Ratio Embed Container */}
              <div className="relative w-full aspect-video bg-slate-900">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={video.youtubeUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Card Meta */}
              <div className="p-3.5 2xl:p-5 flex flex-col justify-between flex-1">
                <div className="flex items-center justify-between text-[11px] 2xl:text-xs mb-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded border border-slate-200">
                    {video.category}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {video.date}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm 2xl:text-lg group-hover:text-red-700 transition-colors line-clamp-2">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Video;