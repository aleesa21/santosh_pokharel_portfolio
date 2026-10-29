import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  Radio,
  ShieldCheck,
} from "lucide-react";

// Where to go after a successful login

const inputClass =
  "w-full rounded-xl border border-stone-300/80 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-stone-900 shadow-2xs transition-all placeholder:font-normal placeholder:text-stone-400 hover:border-stone-400 focus:border-red-700 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-red-700/10 disabled:cursor-not-allowed disabled:opacity-60";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Quick client-side validation
    if (!email.trim() || !password) {
      setError("Please fill in all required credentials.");
      return;
    }

    

    setLoading(true);

    console.log("--- Form Submitted ---");
    console.log("Email:", email.trim());

    
  };

 

  return (
    <div className="flex min-h-screen w-full bg-slate-950 font-sans text-stone-900 selection:bg-red-800 selection:text-white">
      {/* Left */}
      <aside className="relative hidden w-1/2 max-w-xl flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex border-r border-slate-800">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-red-600/20 blur-3xl animate-pulse"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-28 h-[400px] w-[400px] rounded-full bg-orange-600/15 blur-3xl"
        />
        
        <Link to={"/"} className="inline-block w-fit">
          <div className="relative z-10 flex items-center gap-3.5 transition-opacity hover:opacity-90">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg shadow-red-700/30 ring-1 ring-white/20">
              <Radio size={22} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-white">
                Santosh Pokharel
              </p>
              <p className="text-xs font-medium text-slate-400">
                Admin Control Center
              </p>
            </div>
          </div>
        </Link>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 backdrop-blur-md mb-6 shadow-inner">
            <ShieldCheck size={14} />
            <span>Secure Portal Access</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
            Manage your <br />
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              portfolio, your way.
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Update videos, contact info, and reports in real time. Changes reflect live instantly across your platform.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-6 text-xs text-slate-500">
          <p>Private portal. Authorized personnel only.</p>
          <p className="font-mono text-[10px] text-slate-600">v2.5.0</p>
        </div>
      </aside>

      {/* Right */}
      <main className="relative flex flex-1 items-start justify-center bg-[#f7f5f2] px-4 sm:px-8 py-6 sm:py-12 lg:items-center">
        <div className="w-full max-w-md">
          
          {/* Mobile */}
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm font-semibold text-stone-700 shadow-sm transition-all hover:border-red-700 hover:text-red-800 focus:outline-hidden focus:ring-4 focus:ring-red-700/10 "
          >
            <ArrowLeft size={16} />
            <span >Back to Home</span>
          </Link>

          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-800 text-white shadow-md">
              <Radio size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">
                Santosh Pokharel
              </p>
              <p className="text-xs font-medium text-stone-500">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Section Header */}
          <div className="space-y-1.5 mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-800">
              Administration Portal
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
              Welcome back<span className="text-red-700">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              Sign in to access your dashboard and manage your portfolio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-stone-700"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-stone-700"
                >
                  Password
                </label>
                <span className="text-[11px] text-stone-400 font-medium">
                  Keep your credentials private
                </span>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-stone-400 transition-colors hover:text-stone-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="mt-2 flex w-full cursor-pointer items-center justify-between rounded-xl bg-red-800 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-900 active:scale-[0.99] focus:outline-hidden focus:ring-4 focus:ring-red-900/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogIn size={16} />
                )}
                <span>{loading ? "Authenticating..." : "Sign in to dashboard"}</span>
              </div>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer security notice */}
          <div className="mt-8 pt-6 border-t border-stone-200/80 flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-stone-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-stone-700">
                Secure administrative access
              </p>
              <p className="text-[11px] text-stone-500">
                This page is intended for authorized portfolio administrators.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Login;