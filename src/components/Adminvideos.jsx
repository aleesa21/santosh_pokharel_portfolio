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
  Trash2 ,
} from "lucide-react";
import AddVideos, { getYouTubeId } from "./AddVideos";
import { deleteVideo, getVideos, insertVideo, updateVideo } from "../supabase/videos";
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
  if (!name) {
    return (
      <span
        className={`inline-flex w-fit items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 ${className}`}
      >
        Uncategorized
      </span>
    );
  }
  return (
    <span
      className={`inline-flex w-fit max-w-full items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ${className}`}
    >
      <span className="truncate">{name}</span>
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
  "inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-95";

const listGrid =
  "grid grid-cols-[112px_1fr_auto] items-center gap-3 md:grid-cols-[168px_1fr_190px_150px_84px] md:gap-5";

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

const pulse = "bg-slate-100 motion-safe:animate-pulse";

function ListSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <ul className="divide-y divide-slate-100" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className={`${listGrid} px-4 py-4`}>
            <div className={`aspect-video rounded-lg ${pulse}`} />
            <div className="space-y-2">
              <div className={`h-4 w-2/3 rounded ${pulse}`} />
              <div className={`h-3 w-1/3 rounded md:hidden ${pulse}`} />
            </div>
            <div className={`hidden h-6 w-24 rounded-md md:block ${pulse}`} />
            <div className={`hidden h-4 w-20 rounded md:block ${pulse}`} />
            <div className={`h-9 w-9 rounded-lg ${pulse}`} />
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
      setLoadError(
         "Something went wrong while loading your videos."
      );
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
    [editing]
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
          : [saved, ...prev]
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
          v.category?.toLowerCase().includes(q)
      )
      .sort(
        (a, b) =>
          String(b.date ?? "").localeCompare(String(a.date ?? "")) ||
          String(b.created_at ?? "").localeCompare(String(a.created_at ?? ""))
      );
  }, [videos, query]);

  const filtersActive = query.trim() !== "" ;
  const clearFilters = () => {
    setQuery("");
  };

  const hasVideos = !loading && !loadError && videos.length > 0;

  const openAdd = () => setEditing({});

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Videos
            </h1>
            {hasVideos && (
              <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-bold text-white">
                {videos.length}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {loadError
              ? "We couldn't load your library."
              : "Manage the videos shown on your site."}
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-linear-to-b from-red-600 to-red-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/25 transition-all hover:from-red-500 hover:to-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-95"
        >
          <Plus size={18} />
          Add video
        </button>
      </div>

      {/* Toolbar */}
      {hasVideos && (
        <div className="mb-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative min-w-0 flex-1 md:max-w-sm">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or category"
                aria-label="Search videos"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              />
            </div>
          </div>


          {filtersActive && (
            <p className="text-sm text-slate-500">
              Showing {visible.length} of {videos.length}
            </p>
          )}
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
              <button type="button" onClick={fetchVideos} className={secondaryBtn}>
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
            text="Try a different search or category."
            action={
              <button type="button" onClick={clearFilters} className={secondaryBtn}>
                Clear filters
              </button>
            }
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div
            className={`${listGrid} hidden border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 md:grid`}
          >
            <span>Video</span>
            <span>Title</span>
            <span>Category</span>
            <span>Date</span>
            <span >Actions</span>
          </div>

          <ul className="divide-y divide-slate-100">
            {visible.map((v) => {
              const rel = relativeDate(v.date);
              return (
                <li
                  key={v.id}
                  onClick={() => setEditing(v)}
                  className={`${listGrid} px-4 py-4 transition-all hover:bg-slate-50`}
                >
                  <Thumb video={v} className="rounded-lg ring-1 ring-slate-200" />

                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-bold leading-5 text-slate-900">
                      {v.title}
                    </p>
                    {/* Mobile meta */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 md:hidden">
                      <CategoryChip category={v.category} />
                      <span className="text-xs text-slate-500">
                        {formatDate(v.date)}
                      </span>
                    </div>
                  </div>

                  <div className="hidden min-w-0 md:block">
                    <CategoryChip category={v.category} />
                  </div>

                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-700">
                      {formatDate(v.date)}
                    </p>
                
                    {rel && <p className="text-xs text-slate-400">{rel}</p>}
                  </div>
                  <div className="flex items-center gap-2 md:justify-self-end"
                    onClick={(e) => e.stopPropagation()}
>
                    <button
                      type="button"
                      onClick={() => setEditing(v)}
                      aria-label={`Edit ${v.title}`}
                      title="Edit"
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-95"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(v)}
                      aria-label={`Delete ${v.title}`}
                      title="Delete"
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-600 transition-all hover:bg-red-100 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-95"
                    >
                      <Trash2 size={16} />
                    </button>
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

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 left-1/2 z-60 flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
            toast.type === "error" ? "bg-red-700" : "bg-slate-900"
          }`}
        >
          {toast.type === "error" ? (
            <AlertTriangle size={16} />
          ) : (
            <CheckCircle2 size={16} />
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
