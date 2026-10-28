import { useEffect, useState } from "react";
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
} from "lucide-react";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { getPersonalDetails, updatePersonalDetails } from "../supabase/details";

const sections = [
  {
    title: "Contact",
    description: "How people can reach you.",
    icon: Contact,
    fields: [
      { name: "name", label: "Name", type: "text", icon: User, placeholder: "Your full name", required: true },
      { name: "email", label: "Email", type: "email", icon: Mail, placeholder: "you@example.com", required: true },
      { name: "phone", label: "Phone", type: "tel", icon: Phone, placeholder: "+977 98XXXXXXXX" },
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
};

// Keep only the editable fields and turn null (empty DB values) into ""
const pickFields = (row) =>
  Object.fromEntries(
    Object.keys(initialDetails).map((k) => [k, row?.[k] ?? ""])
  );

const secondaryBtn =
  "inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-95";

function Personaldetails() {
  const [rowId, setRowId] = useState(null);
  const [details, setDetails] = useState(initialDetails);
  const [saved, setSaved] = useState(initialDetails);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", message }

  const isDirty = JSON.stringify(details) !== JSON.stringify(saved);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rowId) return;

    const trimmed = Object.fromEntries(
      Object.entries(details).map(([k, v]) => [k, v.trim()])
    );

    // Empty optional fields are stored as null
    const updates = {
      ...trimmed,
      phone: trimmed.phone || null,
      facebook_link: trimmed.facebook_link || null,
      twitter_link: trimmed.twitter_link || null,
    };

    setSaving(true);
    try {
      const row = await updatePersonalDetails(rowId, updates);
      const values = pickFields(row);
      setDetails(values);
      setSaved(values);
      showToast("success", "Changes saved.");
    } catch (err) {
      console.error(err);
      showToast("error", "Could not save. Are you logged in?");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => setDetails(saved);

  const disabled = loading || saving;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-b from-red-600 to-red-700 text-white shadow-lg shadow-red-900/25">
          <User size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            Personal details
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the contact and social details shown on your site.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="h-1 bg-linear-to-r from-red-600 via-red-500 to-orange-400" />

        <div className="divide-y divide-slate-100">
          {sections.map(({ title, description, icon: SectionIcon, fields }) => (
            <section key={title} className="p-5 md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <SectionIcon size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{title}</h2>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {fields.map(
                  ({ name, label, type, icon: Icon, placeholder, required, wide }) => (
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
                  )
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            {!loading && (
              <>
                <span
                  className={`h-2 w-2 rounded-full ${
                    isDirty ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                />
                {isDirty ? "You have unsaved changes" : "All changes saved"}
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || disabled}
              className={`${secondaryBtn} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <RotateCcw size={15} />
              Reset
            </button>
            <button
              type="submit"
              disabled={!isDirty || disabled}
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-linear-to-b from-red-600 to-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/25 transition-all hover:from-red-500 hover:to-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
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