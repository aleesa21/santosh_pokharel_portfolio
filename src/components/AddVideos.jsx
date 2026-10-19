import { useState } from "react";
import { Play, X, AlertCircle,CheckCircle2,Info } from "lucide-react";

export const getYouTubeId = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const m = u.pathname.match(/\/(embed|shorts|live)\/([\w-]{6,})/);
      if (m) return m[2];
    }
  } catch {
    /* not a valid URL yet */
  }
  return null;
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const emptyForm = () => ({ url: "", title: "", category: "", date: todayISO() });

const labelClass = "block text-xs font-semibold text-slate-700 mb-1.5";
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 hover:border-slate-300";

export function AddVideos({ initial = null, onSubmit, onCancel }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(
    initial ? { ...initial, url: initial.url || initial.youtube_url || "" } : emptyForm()
  );
  const [error, setError] = useState("");

  const videoId = getYouTubeId(form.url);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleClearUrl = () => {
    setForm((prev) => ({ ...prev, url: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoId) return setError("Please enter a valid YouTube video link.");
    if (!form.title.trim()) return setError("Please enter a video title.");
    if (!form.category.trim()) return setError("Please enter a category.");

    onSubmit?.({
      ...form,
      url: form.url.trim(),
      title: form.title.trim(),
      category: form.category.trim(),
      videoId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg md:grid-cols-[1fr_260px] md:p-6"
    >
      {/* Form Section */}
      <div className="flex flex-col justify-between gap-5">
        <div>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            {isEdit ? "Edit Video" : "Add Video"}
          </h2>

          <div className="space-y-4">
            {/* YouTube URL */}
            <div>
              <label htmlFor="url" className={labelClass}>
                YouTube Link
              </label>
              <div className="relative flex items-center">
                <input
                  id="url"
                  name="url"
                  type="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`${inputClass} pr-9`}
                  autoFocus
                />
                {form.url && (
                  <button
                    type="button"
                    onClick={handleClearUrl}
                    className="absolute right-3 cursor-pointer text-slate-400 hover:text-slate-600"
                    title="Clear link"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Video Title */}
            <div>
              <label htmlFor="title" className={labelClass}>
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Highlights vs Football Club"
                className={inputClass}
              />
            </div>

            {/* Category & Date */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className={labelClass}>
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Live Broadcast"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="date" className={labelClass}>
                  Publish Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {isEdit ? "Save Changes" : "Add Video"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-4">
        <div>
          <span className="mb-2 block text-xs font-semibold text-slate-500">
            Preview
          </span>

          <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-900 shadow-inner">
            {videoId ? (
              <>
                <img
                  src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                  alt="Video thumbnail"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/20" />
                <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md">
                  <Play size={18} className="translate-x-0.5 fill-white" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-slate-400">
                <Play size={22} />
                <span className="text-xs font-medium">No video loaded</span>
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          {videoId ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>Valid video URL detected</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <Info size={14} className="shrink-0 text-slate-400" />
              <span>Paste a valid YouTube link to preview the thumbnail.</span>
            </span>
          )}
        </p>
      </div>
    </form>
  );
}

export default AddVideos;