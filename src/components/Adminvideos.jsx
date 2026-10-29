import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  SearchX,
  X,
  Trash2,
  Video,
} from "lucide-react";
import AddVideos, { getYouTubeId } from "./AddVideos";
import {
  deleteVideo,
  getVideos,
  insertVideo,
  updateVideo,
} from "../supabase/videos";
import { supabase } from "../supabase/supabase";
import ConfirmModal from "./ConfirmModal";

const toDate = (iso) => {
  if (!iso) return null;
  const d = new Date(String(iso).slice(0, 10) + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatDate = (iso) => {
  const d = toDate(iso);
  return d
    ? d.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No date";
};

const relativeDate = (iso) => {
  const d = toDate(iso);
  if (!d) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((today - d) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days > 1 && days < 7) return `${days} days ago`;
  if (days < 0) return "Upcoming";
  return "";
};

function CategoryChip({ category, className = "" }) {
  const name = category?.trim();
  return (
    <span
      className={`inline-flex w-fit max-w-full items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[13px] font-medium ${
        name ? "text-slate-700" : "text-slate-500"
      } ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          name ? "bg-red-500" : "bg-slate-300"
        }`}
      />
      <span className="truncate">{name || "Uncategorized"}</span>
    </span>
  );
}

//thumbnail jasto video
function Thumb({ video, className = "" }) {
  const id = getYouTubeId(video.youtube_url ?? "");
  return (
    <a
      href={video.youtube_url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      aria-label={`Watch ${video.title} on YouTube`}
      className={`group/thumb relative flex aspect-video items-center justify-center overflow-hidden bg-slate-100 text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${className}`}
    >
      {id ? (
        <img
          src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover/thumb:scale-105"
        />
      ) : (
        <Play size={22} />
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-slate-950/30 opacity-0 transition-opacity group-hover/thumb:opacity-100 group-focus-visible/thumb:opacity-100">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
          <Play size={18} className="ml-0.5 fill-current" />
        </span>
      </span>
    </a>
  );
}

const secondaryBtn =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";

const listGrid =
  "grid grid-cols-[128px_1fr] gap-3 md:grid-cols-[184px_1fr_210px_170px_100px] md:gap-6";

function StateMessage({ icon: Icon, tone = "slate", title, text, action }) {
  const tones = {
    slate: "bg-slate-100 text-slate-400",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-20 text-center">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tones[tone]}`}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-base font-bold text-slate-900">{title}</p>
        {text && <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>}
      </div>
      {action}
    </div>
  );
}

function RowActions({ video, onEdit, onDelete, labeled = false }) {
  const base = labeled
    ? "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-semibold"
    : "flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg";
  const focus =
    "transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-95";
  return (
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => onEdit(video)}
        aria-label={`Edit ${video.title}`}
        title="Edit"
        className={`${base} ${focus} ${
          labeled
            ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <Pencil size={labeled ? 14 : 18} />
        {labeled && "Edit"}
      </button>
      <button
        type="button"
        onClick={() => onDelete(video)}
        aria-label={`Delete ${video.title}`}
        title="Delete"
        className={`${base} ${focus} ${
          labeled
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "text-slate-500 hover:bg-red-50 hover:text-red-600"
        }`}
      >
        <Trash2 size={labeled ? 14 : 18} />
        {labeled && "Delete"}
      </button>
    </div>
  );
}

const pulse = "bg-slate-100 motion-safe:animate-pulse";

function ListSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <ul className="divide-y divide-slate-100" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className={`${listGrid} items-center px-4 py-4 md:px-6`}>
            <div className={`aspect-video rounded-lg ${pulse}`} />
            <div className="space-y-2">
              <div className={`h-4 w-2/3 rounded ${pulse}`} />
              <div className={`h-3 w-1/3 rounded md:hidden ${pulse}`} />
            </div>
            <div className={`hidden h-6 w-24 rounded-md md:block ${pulse}`} />
            <div className={`hidden h-4 w-20 rounded md:block ${pulse}`} />
            <div className={`hidden h-9 w-9 rounded-lg md:block ${pulse}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Adminvideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // null or a video

  // null = closed, {} = adding, {...video} = editing
  const [editing, setEditing] = useState(null);

  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null); // { type: "success" | "error", message }

  const closeModal = () => setEditing(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await getVideos();
      setVideos(Array.isArray(res) ? res : []);
    } catch (e) {
      console.warn(e);
      setLoadError("Something went wrong while loading your videos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Close modal on Escape + lock background scroll while it is open
  useEffect(() => {
    if (!editing) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [editing]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // The form uses `url`; the database uses `youtube_url`
  const formInitial = useMemo(
    () =>
      editing?.id
        ? {
            ...editing,
            url: editing.youtube_url,
            date: String(editing.date ?? "").slice(0, 10),
          }
        : null,
    [editing],
  );

  const handleSave = async (data) => {
    const record = {
      title: data.title,
      category: data.category,
      date: data.date,
      youtube_url: data.url,
    };
    const isEdit = Boolean(editing?.id);

    try {
      // Save to Supabase first; it returns the real row (with the real id)
      const saved = isEdit
        ? await updateVideo(editing.id, record)
        : await insertVideo(record);

      // 2. Only after success, update the local list
      setVideos((prev) =>
        isEdit
          ? prev.map((v) => (v.id === saved.id ? { ...v, ...saved } : v))
          : [saved, ...prev],
      );

      closeModal();
      setToast({
        type: "success",
        message: isEdit ? "Changes saved." : "Video added.",
      });
    } catch (e) {
      console.warn(e);
      setToast({
        type: "error",
        message: e?.message || "Couldn't save the video. Try again.",
      });
    }
  };

  const handleDelete = async () => {
    const video = deleteTarget;
    if (!video) return;
    try {
      await deleteVideo(video.id);
      setVideos((prev) => prev.filter((v) => v.id !== video.id));
      setToast({ type: "success", message: "Video deleted." });
    } catch (e) {
      console.warn(e);
      setToast({
        type: "error",
        message: e?.message || "Couldn't delete the video. Try again.",
      });
    } finally {
      setDeleteTarget(null);
    }
  };
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos
      .filter(
        (v) =>
          !q ||
          v.title?.toLowerCase().includes(q) ||
          v.category?.toLowerCase().includes(q),
      )
      .sort(
        (a, b) =>
          String(b.date ?? "").localeCompare(String(a.date ?? "")) ||
          String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")),
      );
  }, [videos, query]);

  const filtersActive = query.trim() !== "";
  const clearFilters = () => setQuery("");

  const hasVideos = !loading && !loadError && videos.length > 0;

  const openAdd = () => setEditing({});

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      {/* Header banner */}

      <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-100/80 via-slate-50/50 to-white p-5 shadow-xs backdrop-blur-xl md:mb-8 md:p-7">
        {/* Ambient background glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 right-24 h-44 w-44 rounded-full bg-slate-200/50 blur-3xl"
        />

        {/* Watermark Icon (Visible on mobile now with responsive sizing) */}
        <Play
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rotate-12 fill-current text-slate-900/5 transition-transform duration-700 ease-out md:-right-10 md:-top-10 md:h-44 md:w-44"
        />

        <div className="relative flex items-center justify-between gap-3 md:gap-4">
          <div className="flex min-w-0 items-center gap-3.5 md:gap-5">
            {/* Icon Badge */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-red-600 to-red-700 text-white shadow-lg shadow-red-900/25 ring-4 ring-red-100/50 md:h-14 md:w-14">
              <Video className="h-5 w-5 md:h-6 md:w-6" />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                Videos
              </h1>
              <p
                className={`mt-0.5 text-sm font-medium ${loadError ? "text-amber-700" : "text-slate-500"}`}
              >
                {loadError
                  ? "We couldn't load your library."
                  : "Manage the videos shown on your site."}
              </p>
            </div>
          </div>

          {/* Primary Action Button (Icon-only on mobile, full text on sm+) */}
          <button
            type="button"
            onClick={openAdd}
            aria-label="Add video"
            className="group sm:flex shrink-0 cursor-pointer hidden items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-900/15 transition-all duration-200 hover:bg-red-700 active:scale-[0.98] sm:px-5"
          >
            <Plus
              size={18}
              className="transition-transform duration-200 group-hover:rotate-90"
            />
            <span className="hidden sm:inline">Add video</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      {hasVideos && (
        <div className="mb-5 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative min-w-0 flex-1 sm:max-w-md">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or category"
                aria-label="Search videos"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm font-medium text-slate-900 shadow-sm transition-all placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <p className="text-sm font-medium text-slate-500">
              {filtersActive
                ? `Showing ${visible.length} of ${videos.length}`
                : `${videos.length} ${videos.length === 1 ? "video" : "videos"}`}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <ListSkeleton />
      ) : loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50/50">
          <StateMessage
            icon={AlertTriangle}
            tone="red"
            title="Couldn't load your videos"
            text={loadError}
            action={
              <button
                type="button"
                onClick={fetchVideos}
                className={secondaryBtn}
              >
                <RefreshCw size={15} />
                Try again
              </button>
            }
          />
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white">
          <StateMessage
            icon={Play}
            title="No videos yet"
            text="Add your first YouTube link to see it listed here."
            action={
              <button type="button" onClick={openAdd} className={secondaryBtn}>
                <Plus size={15} />
                Add video
              </button>
            }
          />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <StateMessage
            icon={SearchX}
            title="No matching videos"
            text="Try a different title or category in the search box."
            action={
              <button
                type="button"
                onClick={clearFilters}
                className={secondaryBtn}
              >
                Clear search
              </button>
            }
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div
            className={`${listGrid} hidden items-center border-b border-slate-100 px-6 py-3 md:grid`}
          >
            <span className="text-[13px] font-semibold text-slate-500">
              Video
            </span>
            <span className="text-[13px] font-semibold text-slate-500">
              Title
            </span>
            <span className="text-[13px] font-semibold text-slate-500">
              Category
            </span>
            <span className="text-[13px] font-semibold text-slate-500">
              Date
            </span>
            <span className="justify-self-end text-[13px] font-semibold text-slate-500">
              Actions
            </span>
          </div>

          <ul className="divide-y divide-slate-100">
            {visible.map((v) => {
              const rel = relativeDate(v.date);
              return (
                <li
                  key={v.id}
                  onClick={() => setEditing(v)}
                  className={`${listGrid} group/row relative cursor-pointer items-start px-4 py-5 transition-colors before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-red-500 before:opacity-0 before:transition-opacity hover:bg-slate-50 hover:before:opacity-100 md:items-center md:px-6`}
                >
                  <Thumb
                    video={v}
                    className="rounded-lg ring-1 ring-slate-200"
                  />

                  <div className="min-w-0">
                    <p className="line-clamp-2 text-[15px] font-bold leading-6 text-slate-900 md:text-base">
                      {v.title}
                    </p>

                    {/* Mobile: meta + actions under the title */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 md:hidden">
                      <CategoryChip category={v.category} />
                      <span className="text-[13px] text-slate-500">
                        {formatDate(v.date)}
                        {rel && ` · ${rel}`}
                      </span>
                    </div>
                    <div className="mt-3 md:hidden">
                      <RowActions
                        labeled
                        video={v}
                        onEdit={setEditing}
                        onDelete={setDeleteTarget}
                      />
                    </div>
                  </div>

                  <div className="hidden min-w-0 md:block">
                    <CategoryChip category={v.category} />
                  </div>

                  <div className="hidden md:block">
                    <p className="text-[15px] font-medium text-slate-700">
                      {formatDate(v.date)}
                    </p>
                    {rel && <p className="text-[13px] text-slate-400">{rel}</p>}
                  </div>

                  <div className="hidden md:block md:justify-self-end">
                    <RowActions
                      video={v}
                      onEdit={setEditing}
                      onDelete={setDeleteTarget}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Add / Edit modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm md:items-center"
          onMouseDown={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={editing.id ? "Edit video" : "Add video"}
            className="relative w-full max-w-3xl"
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <X size={18} />
            </button>
            <AddVideos
              initial={formInitial}
              onSubmit={handleSave}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

      {/* Mobile: floating add button */}
      <button
        type="button"
        onClick={openAdd}
        aria-label="Add video"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-linear-to-b from-red-600 to-red-700 text-white shadow-xl shadow-red-900/30 transition-all hover:from-red-500 hover:to-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-95 md:hidden"
      >
        <Plus size={26} />
      </button>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-24 left-1/2 z-60 md:bottom-5 flex -translate-x-1/2 items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ring-1 ring-white/10 ${
            toast.type === "error" ? "bg-red-700" : "bg-slate-900"
          }`}
        >
          {toast.type === "error" ? (
            <AlertTriangle size={16} />
          ) : (
            <CheckCircle2 size={16} className="text-emerald-400" />
          )}
          {toast.message}
        </div>
      )}

      {/* delete confirm model */}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        danger
        title="डिलिट गर्दिम यो भिडियो?"
        message={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmText="गर्दिम गर्दिम"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Adminvideos;
