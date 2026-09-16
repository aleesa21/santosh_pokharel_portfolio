import React, { useState } from "react";
import { Menu, X } from "lucide-react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = ["News", "Blogs", "Videos", "Thoughts", "Contacts"];

  return (
    <header className="sticky top-0 relative z-50 w-full bg-[#f8f7fb]/95 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-8 py-3 transition-all">
      {" "}
      <div className="w-full mx-auto flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          {/* <div className="h-10 w-10 shrink-0 bg-red-900 text-white font-bold text-lg grid place-items-center rounded-full shadow-sm group-hover:bg-red-800 transition-colors">
            स
          </div> */}
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 leading-tight group-hover:text-red-900 transition-colors">
              Santosh Pokharel
            </span>
            <span className="text-xs text-slate-500 font-medium">
              TV Journalist · GTV Nepal
            </span>
          </div>
        </a>

        <nav className="hidden  md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium text-slate-600 hover:text-red-900 transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <button className="px-5 py-2 text-sm font-medium text-white bg-red-900 hover:bg-red-800 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer">
            Login
          </button>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 w-full bg-[#f8f7fb] border-y border-slate-200  shadow-lg px-4 pt-4 pb-6 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
              className="px-2 py-1 text-base font-medium text-slate-700 hover:text-red-900 transition-colors"
            >
              {link}
            </a>
          ))}
          <div className="pt-2">
            <button className="w-full py-2.5 text-sm font-medium text-white bg-red-900 hover:bg-red-800 rounded-lg transition-colors">
              Login
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
