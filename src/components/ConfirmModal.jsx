import { useEffect, useState } from "react";
import { AlertTriangle, Info } from "lucide-react";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  const [busy, setBusy] = useState(false);

  // Escape closes + lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !busy && onCancel?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, busy, onCancel]);

  if (!open) return null;

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm?.(); 
    } finally {
      setBusy(false);
    }
  };

  const Icon = danger ? AlertTriangle : Info;

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onCancel?.()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              danger ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
            }`}
          >
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            {message && (
              <p className="mt-1 break-words text-sm text-slate-500">{message}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-95 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            autoFocus
            className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 disabled:opacity-60 ${
              danger
                ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
                : "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500"
            }`}
          >
            {busy ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}