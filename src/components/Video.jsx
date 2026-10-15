import React, { useEffect, useState } from "react";
import { FaPlay, FaTriangleExclamation, FaRotateRight } from "react-icons/fa6";
import { getVideos } from "../supabase/videos";
import { useCallback } from "react";

function getYouTubeId(url) {
  const match = url?.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/,
  );
  return match ? match[1] : null;
}

function VideoPlayer({ video }) {
  const [playing, setPlaying] = useState(false);
  const youtubeId = getYouTubeId(video.youtube_url);

  if (!youtubeId) return null;

  const thumb = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div className="relative w-full aspect-video bg-slate-900">
      {playing ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${video.title}`}
          className="group/play absolute inset-0 w-full h-full cursor-pointer"
        >
          <img
            src={thumb}
            alt={video.title}
            width="480"
            height="360"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/play:bg-black/10 transition-colors">
            <span className="flex h-12 w-12 2xl:h-16 2xl:w-16 items-center justify-center rounded-full bg-red-700 text-white shadow-lg group-hover/play:scale-110 transition-transform">
              <FaPlay className="ml-0.5 w-4 h-4 2xl:w-6 2xl:h-6" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

function VideoSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="w-full aspect-video bg-slate-200" />
      <div className="p-3.5 2xl:p-5">
        <div className="flex justify-between mb-3">
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-100 rounded" />
        </div>
        <div className="h-3 w-full bg-slate-200 rounded mb-2" />
        <div className="h-3 w-2/3 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div
      role="alert"
      className="col-span-full flex flex-col items-center gap-3 py-12 text-center border border-dashed border-red-200 bg-red-50/50 rounded-xl"
    >
      <FaTriangleExclamation className="w-8 h-8 text-red-600" />
      <div>
        <p className="font-bold text-slate-900">Couldn't load videos</p>
        <p className="text-sm text-slate-600">
          Please check your connection and try again.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 text-white text-sm font-semibold hover:bg-red-800 transition-colors cursor-pointer"
      >
        <FaRotateRight className="w-3.5 h-3.5" />
        Try again
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <p className="col-span-full text-center text-slate-500 py-12">
      No videos have been published yet.
    </p>
  );
}
export default function Video() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getVideos();
      setVideos(res ?? []);
    } catch (e) {
      console.error("Failed to fetch videos:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);
  return (
    <section
      id="videos"
      className="relative bg-white text-slate-900 w-full border-b border-slate-200 py-8 md:py-12 2xl:py-16"
    >
      <div className="mx-auto w-full px-4 md:px-15 2xl:px-20">
        {/* Section Header */}
        <div className="flex flex-col gap-2 2xl:gap-4 mb-6 md:mb-10 2xl:mb-14">
          <div className="inline-flex items-center gap-2 self-start bg-linear-to-r from-red-50 to-red-100/80 border border-red-200/90 px-3 py-1 2xl:px-5 2xl:py-2 rounded-full text-red-700 font-bold text-[11px] 2xl:text-sm tracking-wider">
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

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 2xl:gap-8"
          aria-busy={loading}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <VideoSkeleton key={i} />)
          ) : error ? (
            <ErrorState onRetry={fetchVideos} />
          ) : videos.length === 0 ? (
            <EmptyState />
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                className="group bg-white/90 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-red-200 transition-all duration-200 overflow-hidden flex flex-col"
              >
                <VideoPlayer video={video} />
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
            ))
          )}
        </div>
      </div>
    </section>
  );
}
