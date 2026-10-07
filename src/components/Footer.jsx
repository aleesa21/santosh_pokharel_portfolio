import React from "react";
import { FaYoutube, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Mail, ArrowUp, Heart } from "lucide-react";

function Footer() {
  const navLinks = [
    { name: "Home", link: "#hero" },
    { name: "Videos", link: "#videos" },
    { name: "Experience", link: "#experience" },
    { name: "Contacts", link: "#contact" },
  ];

  const socialLinks = [
    { name: "Facebook", href: "#", icon: FaFacebook },
    { name: "X (Twitter)", href: "#", icon: FaXTwitter },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <a href="#" className="flex flex-col group mb-4">
                <span className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">
                  Santosh Pokharel
                </span>
                <span className="text-xs text-red-400 font-medium tracking-wide uppercase">
                  TV Journalist · GTV Nepal
                </span>
              </a>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Dedicated to bringing truthful news, insightful reporting, and
                compelling stories from across Nepal.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="p-2.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-red-900 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map(({ name, link }) => (
                <li key={name}>
                  <a
                    href={link}
                    className="text-sm text-slate-400 hover:text-red-400 transition-colors inline-block"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact Info & Back to Top */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 inline-block">
                Contact Info
              </h3>
              <p className="text-sm text-slate-400 mb-2">GTV Nepal Studios</p>
              <a
                href="mailto:contact@santoshpokharel.com"
                className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-red-500" />
                contact@santoshpokharel.com
              </a>
            </div>

            {/* Back to Top Button */}
            <div className="mt-6 md:mt-0">
              <a
                href="#hero"
                className="w-fit flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-red-900 px-4 py-2 rounded-full transition-all cursor-pointer"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar / Copyright */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>
            © {new Date().getFullYear()} Santosh Pokharel. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5">
            Made with{" "}
            <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600 inline-block animate-pulse" />{" "}
            by{" "}
            <a
              href="https://alishakafle.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-red-400 font-medium underline underline-offset-2 transition-colors"
            >
              alishakafle.com.np
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
