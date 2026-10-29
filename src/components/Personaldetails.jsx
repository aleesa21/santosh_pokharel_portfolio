import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  User,
  Share2,
  Contact,
  RotateCcw,
  Loader2,
  Camera,
  Upload,
  Trash2,
  Save,
} from "lucide-react";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import {
  getPersonalDetails,
  updatePersonalDetails,
  getPhotoUrl,
  uploadPhoto,
  deletePhoto,
} from "../supabase/details";

const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const sections = [
  {
    title: "Contact",
    description: "How people can reach you.",
    icon: Contact,
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        icon: User,
        placeholder: "Your full name",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        icon: Mail,
        placeholder: "you@example.com",
        required: true,
      },
      {
        name: "phone",
        label: "Phone",
        type: "tel",
        icon: Phone,
        placeholder: "+977 98XXXXXXXX",
      },
    ],
  },
  {
    title: "Social links",
    description: "Profiles shown on your site.",
    icon: Share2,
    fields: [
      {
        name: "facebook_link",
        label: "Facebook link",
        type: "url",
        icon: FaFacebook,
        placeholder: "https://facebook.com/yourpage",
        wide: true,
      },
      {
        name: "twitter_link",
        label: "Twitter link",
        type: "url",
        icon: FaTwitter,
        placeholder: "https://twitter.com/yourhandle",
        wide: true,
      },
    ],
  },
];

const initialDetails = {
  name: "",
  email: "",
  phone: "",
  facebook_link: "",
  twitter_link: "",
  photo_path: "",
};

// Keep only the editable fields and turn null (empty DB values) into ""
const pickFields = (row) =>
  Object.fromEntries(
    Object.keys(initialDetails).map((k) => [k, row?.[k] ?? ""]),
  );

const cardClass =
  "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm";

const secondaryBtn =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";

function CardHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 md:px-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
        <Icon size={18} />
      </div>
      <div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function Personaldetails() {
  const [rowId, setRowId] = useState(null);
  const [details, setDetails] = useState(initialDetails);
  const [saved, setSaved] = useState(initialDetails);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", message }

  // Photo state: a newly picked file waits here until "Save changes"
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const isDirty =
    JSON.stringify(details) !== JSON.stringify(saved) || photoFile !== null;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Load the details when the page opens
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const row = await getPersonalDetails();
        if (cancelled) return;
        const values = pickFields(row);
        setRowId(row.id);
        setDetails(values);
        setSaved(values);
      } catch (err) {
        console.error(err);
        if (!cancelled) showToast("error", "Could not load details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Warn before closing/refreshing the tab with unsaved changes
  useEffect(() => {
    if (!isDirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  // Make a local preview for the picked file, and free it when it changes
  useEffect(() => {
    if (!photoFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  // What to show: new local file > saved photo > nothing
  const displayedPhoto = previewUrl || getPhotoUrl(details.photo_path);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast("error", "Use a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      showToast("error", "Photo must be under 2 MB.");
      return;
    }
    setPhotoFile(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setDetails((prev) => ({ ...prev, photo_path: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rowId || !isDirty) return;

    const trimmed = Object.fromEntries(
      Object.entries(details).map(([k, v]) => [k, v.trim()]),
    );

    setSaving(true);
    let newPath = null;
    try {
      // 1. Upload the new photo first (if one was picked)
      let photo_path = trimmed.photo_path;
      if (photoFile) {
        newPath = await uploadPhoto(rowId, photoFile);
        photo_path = newPath;
      }

      // 2. Save everything, including the path, to the table.
      // Empty optional fields are stored as null
      const updates = {
        ...trimmed,
        phone: trimmed.phone || null,
        facebook_link: trimmed.facebook_link || null,
        twitter_link: trimmed.twitter_link || null,
        photo_path: photo_path || null,
      };
      const row = await updatePersonalDetails(rowId, updates);

      // 3. Only after the DB update succeeds, delete the old file
      const oldPath = saved.photo_path;
      if (oldPath && oldPath !== row.photo_path) {
        deletePhoto(oldPath).catch(console.error);
      }

      const values = pickFields(row);
      setDetails(values);
      setSaved(values);
      setPhotoFile(null);
      showToast("success", "Changes saved.");
    } catch (err) {
      console.error(err);
      // The DB save failed, so don't leave the new file orphaned
      if (newPath) deletePhoto(newPath).catch(console.error);
      showToast("error", "Could not save. Are you logged in?");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setDetails(saved);
    setPhotoFile(null);
  };

  const disabled = loading || saving;

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5 md:px-8 md:py-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-b from-red-600 to-red-700 text-white shadow-lg shadow-red-900/25 md:flex">
              <User size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-extrabold tracking-tight text-slate-900 md:text-2xl">
                  Personal details
                </h1>
                {/* Mobile-only unsaved dot */}
                {!loading && isDirty && (
                  <span
                    title="Unsaved changes"
                    className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-500 md:hidden"
                  />
                )}
              </div>
              <p className="hidden text-xs text-slate-500 md:block">
                Manage the contact and social details shown on your site.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            {/* Desktop-only status pill */}
            {!loading && (
              <span
                className={`hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold md:inline-flex ${
                  isDirty
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isDirty ? "animate-pulse bg-amber-500" : "bg-emerald-500"
                  }`}
                />
                {isDirty ? "Unsaved changes" : "All changes saved"}
              </span>
            )}

            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || disabled}
              aria-label="Reset changes"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white p-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2.5"
            >
              <RotateCcw size={16} />
              <span className="hidden md:inline">Reset</span>
            </button>

            <button
              type="submit"
              form="details-form"
              disabled={!isDirty || disabled}
              className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-linear-to-b from-red-600 to-red-700 px-3.5 py-2 text-sm font-semibold text-white shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none md:gap-2 md:px-5 md:py-2.5 ${
                isDirty && !saving
                  ? "shadow-red-900/30 ring-4 ring-red-500/20 hover:from-red-500 hover:to-red-600"
                  : "shadow-red-900/25"
              }`}
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              <span className="md:hidden">{saving ? "Saving" : "Save"}</span>
              <span className="hidden md:inline">
                {saving ? "Saving..." : "Save changes"}
              </span>
            </button>
          </div>
        </div>
        {isDirty && !loading && (
          <div className="animate-slide-down bg-linear-to-r from-red-700 via-red-600 to-orange-500 shadow-md shadow-red-900/20">
            <p className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 py-2.5 text-center text-sm font-bold text-white md:px-8 md:text-base">
              <AlertCircle size={18} className="shrink-0 animate-pulse" />
              दादा केही चेन्ज गरेपछि सेभ बटन थिच्नु है अनि मात्र सेभ हुन्छ।
            </p>
          </div>
        )}
      </header>

      {/* Content */}
      <form
        id="details-form"
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-5xl grid-cols-1 gap-6 p-4 md:p-8 lg:grid-cols-3"
      >
        {/* Left: photo */}
        <section className={`${cardClass} self-start lg:sticky lg:top-28`}>
          <CardHeader
            icon={Camera}
            title="Photo"
            description="JPG, PNG or WebP, up to 2 MB."
          />

          <div className="flex flex-col items-center gap-5 p-6">
            {loading ? (
              <div className="h-40 w-40 animate-pulse rounded-full bg-slate-100" />
            ) : displayedPhoto ? (
              <img
                src={displayedPhoto}
                alt="Profile"
                className="h-40 w-40 rounded-full border border-slate-200 object-cover shadow-md"
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400">
                <User size={48} />
              </div>
            )}

            <input
              ref={fileInputRef}
              id="photo"
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              onChange={handlePhotoChange}
              disabled={disabled}
              className="hidden"
            />

            <div className="flex w-full flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className={`${secondaryBtn} w-full`}
              >
                <Upload size={15} />
                {displayedPhoto ? "Change photo" : "Upload photo"}
              </button>

              {displayedPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={disabled}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Right: contact + social */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {sections.map(({ title, description, icon, fields }) => (
            <section key={title} className={cardClass}>
              <CardHeader icon={icon} title={title} description={description} />

              <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 md:p-6">
                {fields.map(
                  ({
                    name,
                    label,
                    type,
                    icon: Icon,
                    placeholder,
                    required,
                    wide,
                  }) => (
                    <div
                      key={name}
                      className={`group ${wide ? "md:col-span-2" : ""}`}
                    >
                      <label
                        htmlFor={name}
                        className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-slate-600"
                      >
                        {label}
                        {required && <span className="text-red-500">*</span>}
                      </label>

                      {loading ? (
                        <div className="h-10.5 animate-pulse rounded-xl bg-slate-100" />
                      ) : (
                        <div className="relative">
                          <Icon
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-red-500"
                          />
                          <input
                            id={name}
                            name={name}
                            type={type}
                            value={details[name]}
                            onChange={handleChange}
                            placeholder={placeholder}
                            disabled={disabled}
                            required={required}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-sm transition-all placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-red-300 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70 disabled:cursor-not-allowed disabled:opacity-60"
                          />
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </form>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 left-1/2 z-60 flex -translate-x-1/2 items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ring-1 ring-white/10 ${
            toast.type === "error" ? "bg-red-700" : "bg-slate-900"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle2 size={16} className="text-emerald-400" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default Personaldetails;
