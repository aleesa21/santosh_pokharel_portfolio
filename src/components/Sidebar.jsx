import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { Video, FileText, LogOut, Radio, Menu, X } from "lucide-react";

const navItems = [
  { to: "/admin/videos", label: "Videos", icon: Video },
  { to: "/admin/details", label: "Details", icon: FileText },
];

function Sidebar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the drawer after navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape + lock page scroll while the drawer is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 text-white md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-red-700 to-red-600">
            <Radio size={16} className="text-white" />
          </div>
          <span className="text-sm font-extrabold tracking-tight">Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="cursor-pointer rounded-lg p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile overlay */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar: slides in from the right on mobile, stays on the left on desktop */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-64 max-w-[85vw] flex-col justify-between border-l border-slate-800 bg-slate-950 text-white shadow-2xl md:border-l-0 md:border-r transition-[transform,visibility] duration-300 ease-out md:visible md:sticky md:bottom-auto md:top-0 md:h-screen md:max-w-none md:shrink-0 md:translate-x-0 md:shadow-none ${
          open ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-red-700 to-red-600 shadow-md shadow-red-900/30">
                <Radio size={20} className="text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-extrabold tracking-tight">
                  Santosh Pokharel
                </p>
                <p className="text-xs font-medium text-slate-400">
                  Admin panel
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1.5 p-3">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-95 ${
                    isActive
                      ? "bg-red-700 text-white shadow-md shadow-red-900/20"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? "text-white"
                          : "text-slate-500 transition-colors group-hover:text-red-500"
                      }
                    />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-3">
          <button
            type="button"

            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800/80 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-95"
          >
            <LogOut size={18} className="text-slate-500" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
