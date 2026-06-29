// ╔══════════════════════════════════════════════════════════════╗
// ║  Santosh Pokharel — TV Journalist Portfolio                  ║
// ║  React single-file component                                 ║
// ║                                                              ║
// ║  SETUP: npm install react react-dom                          ║
// ║  For real backend later:                                     ║
// ║    npm install @supabase/supabase-js  (thoughts + login)     ║
// ║    npm install @emailjs/browser       (contact form)         ║
// ╚══════════════════════════════════════════════════════════════╝

import { useState, useEffect, createContext, useContext } from "react";

// ─────────────────────────────────────────────────────────────────
// LANGUAGE CONTEXT
// This is how bilingual works in React:
// 1. We create a "context" that holds the current language
// 2. Any component can read it with useContext(LangContext)
// 3. The toggle button at the top flips it for the whole app
// ─────────────────────────────────────────────────────────────────
const LangContext = createContext("en");
const useLang = () => useContext(LangContext);

// t() = translate helper. Pass { en: "Hello", np: "नमस्ते" }
// and it returns the right one based on current language.
const t = (lang, obj) => obj[lang] || obj.en;

// ─────────────────────────────────────────────────────────────────
// DESIGN TOKENS (inline styles as JS object)
// Change colors here → changes everywhere
// Purple/indigo accent instead of red, per your preference
// ─────────────────────────────────────────────────────────────────
const C = {
  accent:      "#5b47e0",   // indigo-violet — the signature color
  accentDark:  "#3d30c4",
  accentLight: "#ede9ff",
  accentText:  "#2d1fa3",
  gold:        "#b07d2a",
  goldLight:   "#fdf4e0",
  bg:          "#f8f7fb",   // very subtle violet tint on white
  surface:     "#ffffff",
  surface2:    "#f0eff8",
  border:      "#e2e0f0",
  text:        "#17151f",
  text2:       "#52496e",
  text3:       "#9590b0",
};

// Reusable style fragments
const S = {
  card: {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    overflow: "hidden",
  },
  accentBtn: {
    background: C.accent,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.15s",
  },
  outlineBtn: {
    background: "transparent",
    color: C.text,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "0.15s",
  },
  tag: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 20,
    background: C.accentLight,
    color: C.accentText,
    letterSpacing: 0.3,
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 18,
    fontWeight: 600,
    color: C.text,
  },
  bar: {
    width: 4,
    height: 22,
    borderRadius: 2,
    background: C.accent,
    flexShrink: 0,
  },
};

// ─────────────────────────────────────────────────────────────────
// MOCK DATA
// In a real app, this comes from Supabase or an API.
// Replace with real fetch() calls later.
// ─────────────────────────────────────────────────────────────────
const INITIAL_THOUGHTS = [
  {
    id: 1,
    text: {
      en: "What I saw in parliament today was deeply concerning for democracy. Open debate is what we need — not walkouts. Parliament belongs to the citizens, not to political parties.",
      np: "आज संसदमा जे देखें, त्यो लोकतन्त्रका लागि चिन्ताजनक थियो। खुला बहस हुनुपर्छ, अवरोध होइन। संसद् नागरिकको हो, दलको होइन।",
    },
    time: "2 hours ago",
    likes: 234,
    liked: false,
  },
  {
    id: 2,
    text: {
      en: "Just returned from 3 weeks in Humla. No roads. No mobile network. Children walking 4 hours to school. The resilience I witnessed was unlike anything I've seen in Kathmandu boardrooms. Story airs Thursday on NTV.",
      np: "हुम्लाबाट ३ हप्तापछि फर्किएँ। बाटो छैन। मोबाइल सञ्जाल छैन। बच्चाहरू ४ घण्टा हिँडेर स्कुल जान्छन्। यो गुरुबार NTV मा।",
    },
    time: "Yesterday",
    likes: 891,
    liked: false,
  },
];

const INITIAL_VIDEOS = [
  { id: 1, youtubeId: "dQw4w9WgXcQ", badge: "EXCLUSIVE",     title: { en: "President exclusive interview: Constitution & the road ahead",          np: "राष्ट्रपतिसँग विशेष अन्तरवार्ता" },              views: "1.2L", duration: "12:43" },
  { id: 2, youtubeId: "dQw4w9WgXcQ", badge: "GROUND REPORT", title: { en: "Flood victims of Terai: Reporting live from the field",                  np: "तराईको बाढी पीडित: फिल्डबाट सिधा" },             views: "87k",  duration: "8:20"  },
  { id: 3, youtubeId: "dQw4w9WgXcQ", badge: "INVESTIGATIVE", title: { en: "Nepal's illegal gold trade: 6-month investigation",                       np: "नेपालको अवैध सुन व्यापार: अनुसन्धान" },          views: "3.4L", duration: "22:05" },
  { id: 4, youtubeId: "dQw4w9WgXcQ", badge: "DEBATE",        title: { en: "Federal budget debate with economists & politicians",                      np: "संघीय बजेट बहस — अर्थशास्त्री र नेताहरू" },      views: "56k",  duration: "47:30" },
];

const BLOGS = [
  { id: 1, emoji: "📰", bg: "#ede9ff", cat: "Opinion",      title: { en: "Press freedom in Nepal: Where do we stand in 2025?",            np: "नेपालमा प्रेस स्वतन्त्रता: हामी कहाँ छौं?" },       date: "June 12, 2025",  read: "6 min" },
  { id: 2, emoji: "🏔️", bg: "#e8f5e8", cat: "Ground Report", title: { en: "Three weeks in Humla: Mountains, poverty & forgotten roads",  np: "हुम्लामा तीन हप्ता: पहाड, गरिबी र बिर्सिएका बाटा" }, date: "May 3, 2025",    read: "10 min" },
  { id: 3, emoji: "📡", bg: "#fdf3e3", cat: "Media",         title: { en: "How digital journalism is changing Nepal's newsroom",          np: "डिजिटल पत्रकारिताले न्यूजरूम कसरी बदल्दैछ" },       date: "Apr 18, 2025",   read: "7 min" },
];

// ─────────────────────────────────────────────────────────────────
// YOUTUBE ID EXTRACTOR
// Takes a full YouTube URL like https://youtube.com/watch?v=abc123
// or https://youtu.be/abc123 and returns just "abc123"
// ─────────────────────────────────────────────────────────────────
function extractYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    return u.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

// ─────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────
function Navbar({ lang, setLang, isLoggedIn, onLoginClick, onLogout }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(248,247,251,0.95)" : "transparent",
      backdropFilter: "blur(12px)",
      borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
      transition: "all 0.2s",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 62, gap: 16 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans Devanagari', serif", fontSize: 14, fontWeight: 600 }}>
            स
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Santosh Pokharel</div>
            <div style={{ fontSize: 11, color: C.text3 }}>TV Journalist · NTV Nepal</div>
          </div>
        </div>

        {/* Nav links — desktop */}
        <div style={{ display: "flex", gap: 2, marginLeft: "auto" }}>
          {["news","blog","videos","thoughts","about","contact"].map(id => (
            <button key={id} onClick={() => scroll(id)} style={{ background: "none", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 13, color: C.text2, cursor: "pointer", fontFamily: "inherit" }}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>

        {/* Lang toggle */}
        <button
          onClick={() => setLang(l => l === "en" ? "np" : "en")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.border}`, background: C.surface, fontSize: 12, fontWeight: 600, color: C.text2, cursor: "pointer", fontFamily: "inherit" }}
        >
          🌐 {lang === "en" ? "नेपाली" : "English"}
        </button>

        {/* Login / Logout */}
        {isLoggedIn ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>SP</div>
            <button onClick={onLogout} style={{ ...S.outlineBtn, padding: "6px 12px", fontSize: 12 }}>Logout</button>
          </div>
        ) : (
          <button onClick={onLoginClick} style={{ ...S.accentBtn, padding: "7px 16px", fontSize: 13 }}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────
// LOGIN MODAL
// In a real app: replace handleLogin() with Supabase auth.
// supabase.auth.signInWithPassword({ email, password })
// ─────────────────────────────────────────────────────────────────
function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    // ── MOCK LOGIN ─────────────────────────────────────────────
    // Replace this block with real Supabase auth:
    //
    // import { createClient } from '@supabase/supabase-js'
    // const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass })
    // if (error) { setErr(error.message); setLoading(false); return; }
    // onLogin(); onClose();
    // ───────────────────────────────────────────────────────────
    await new Promise(r => setTimeout(r, 800)); // simulate network
    if (email === "santosh@ntv.com" && pass === "password123") {
      onLogin();
      onClose();
    } else {
      setErr("Wrong email or password. (Demo: santosh@ntv.com / password123)");
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,8,20,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, borderRadius: 16, padding: 32, width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.accentLight, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🔐</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Reporter Login</h2>
          <p style={{ fontSize: 13, color: C.text3, marginTop: 4 }}>Only Santosh can post here</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: "block", marginBottom: 5 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="santosh@ntv.com" required
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", fontFamily: "inherit", color: C.text, background: C.bg }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: "block", marginBottom: 5 }}>Password</label>
            <input
              type="password" value={pass} onChange={e => setPass(e.target.value)}
              placeholder="••••••••" required
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", fontFamily: "inherit", color: C.text, background: C.bg }}
            />
          </div>

          {err && <p style={{ fontSize: 12, color: "#c0392b", background: "#fde8e8", padding: "8px 12px", borderRadius: 6 }}>{err}</p>}

          <button type="submit" disabled={loading}
            style={{ ...S.accentBtn, width: "100%", padding: "12px", fontSize: 15, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button onClick={onClose} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: C.text3, fontSize: 13, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// HERO SECTION — with photo placeholder + stats + live badge
// ─────────────────────────────────────────────────────────────────
function Hero() {
  const lang = useLang();

  return (
    <section id="home" style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 480, gap: 0 }}>

          {/* LEFT — identity */}
          <div style={{ padding: "56px 48px 56px 0", display: "flex", flexDirection: "column", justifyContent: "center", gap: 22, borderRight: `1px solid ${C.border}` }}>

            {/* Live badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: 1, textTransform: "uppercase" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, animation: "pulse 1.5s infinite", display: "inline-block" }} />
              NTV Nepal · Active Reporter
            </div>

            {/* Name + photo row */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>

              {/* Photo — replace this div with <img src="your-photo.jpg" /> */}
              <div style={{
                width: 120, height: 140, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(135deg, ${C.accentLight} 0%, #d4c8ff 100%)`,
                border: `3px solid ${C.accent}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                fontSize: 36, gap: 6,
              }}>
                <span>🎙️</span>
                {/* ↑ REPLACE THIS WHOLE DIV with:
                    <img
                      src="/santosh.jpg"
                      alt="Santosh Pokharel"
                      style={{ width: 120, height: 140, borderRadius: 12, objectFit: "cover", border: `3px solid ${C.accent}` }}
                    />
                */}
                <span style={{ fontSize: 9, color: C.accentText, fontWeight: 600, letterSpacing: 0.5 }}>ADD PHOTO</span>
              </div>

              <div>
                <h1 style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.15, color: C.text }}>
                  Santosh Pokharel
                </h1>
                <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 20, color: C.text2, marginTop: 4 }}>
                  सन्तोष पोखरेल
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={S.tag}>Senior Reporter</span>
                  <span style={{ ...S.tag, background: "#fdf4e0", color: "#7a5810" }}>8+ Years</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p style={{ fontSize: 15, color: C.text2, lineHeight: 1.75, maxWidth: 420 }}>
              {t(lang, {
                en: "Covering politics, society, and ground-level stories from across all 77 districts of Nepal. Based in Kathmandu, reporting for NTV Nepal.",
                np: "नेपालका ७७ वटै जिल्लामा राजनीति, समाज र जनजीवनका कथाहरू समेट्दै आएको छु। काठमाडौंस्थित NTV नेपालका वरिष्ठ पत्रकार।",
              })}
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 24, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              {[["8+","Years"],["2,100+","Reports"],["45k","YT Subs"],["77","Districts"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{n}</div>
                  <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 10 }}>
              <button style={S.accentBtn} onClick={() => document.getElementById("videos")?.scrollIntoView({ behavior: "smooth" })}>
                ▶ {t(lang, { en: "Watch Latest", np: "भिडियो हेर्नुस्" })}
              </button>
              <button style={S.outlineBtn} onClick={() => document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" })}>
                {t(lang, { en: "Read Blog", np: "ब्लग पढ्नुस्" })}
              </button>
            </div>
          </div>

          {/* RIGHT — latest news cards */}
          <div style={{ padding: "40px 0 40px 40px", display: "flex", flexDirection: "column", gap: 14, justifyContent: "center" }} id="news">
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: C.accent, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, display: "inline-block" }} />
              {t(lang, { en: "Latest Coverage", np: "ताजा समाचार" })}
            </div>

            {[
              { tag: t(lang,{en:"Politics",np:"राजनीति"}), title: t(lang,{en:"Parliament session: Budget debate heats up as opposition stages walkout",np:"संसद् अधिवेशनमा बजेटमाथि तीव्र बहस, विपक्षले अवरोध गर्‍यो"}), time: t(lang,{en:"2 hours ago",np:"२ घण्टा अघि"}) },
              { tag: t(lang,{en:"Society",np:"समाज"}), title: t(lang,{en:"Kathmandu road reconstruction: Locals speak out, government responds",np:"काठमाडौंको सडक पुनर्निर्माण: स्थानीयको गुनासो र सरकारको जवाफ"}), time: t(lang,{en:"Yesterday",np:"हिजो"}) },
              { tag: t(lang,{en:"Economy",np:"अर्थ"}), title: t(lang,{en:"Remittance hits record high — but at what cost to families left behind?",np:"रेमिट्यान्स रेकर्ड उचाइमा — तर परिवारको मूल्यमा?"}), time: t(lang,{en:"2 days ago",np:"२ दिन अघि"}) },
            ].map((item, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={S.tag}>{item.tag}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.55, color: C.text, fontFamily: lang === "np" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 11, color: C.text3, marginTop: 5 }}>🕐 {item.time} · NTV Nepal</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: ${C.bg}; }
        button:hover { opacity: 0.88; }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION WRAPPER — consistent layout
// ─────────────────────────────────────────────────────────────────
function Section({ id, title, npTitle, right, children, bg }) {
  return (
    <section id={id} style={{ background: bg || C.bg, borderBottom: `1px solid ${C.border}`, padding: "44px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={S.sectionTitle}>
            <div style={S.bar} />
            {title}
            <span style={{ fontSize: 13, fontWeight: 400, color: C.text3 }}>/ {npTitle}</span>
          </div>
          {right}
        </div>
        {children}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// BLOG SECTION
// ─────────────────────────────────────────────────────────────────
function BlogSection() {
  const lang = useLang();
  return (
    <Section id="blog" title={t(lang,{en:"Blogs & Opinions",np:"ब्लग र विचार"})} npTitle="ब्लग र विचार"
      bg={C.surface}
      right={<a href="#" style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>See all →</a>}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {BLOGS.map(b => (
          <article key={b.id} style={{ ...S.card, cursor: "pointer", transition: "transform 0.15s, border-color 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = C.accent; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = C.border; }}>
            <div style={{ height: 120, background: b.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42 }}>
              {b.emoji}
            </div>
            <div style={{ padding: 16 }}>
              <span style={{ ...S.tag, marginBottom: 8, display: "inline-block" }}>{b.cat}</span>
              <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.55, color: C.text, marginBottom: 8, fontFamily: lang === "np" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}>
                {t(lang, b.title)}
              </h3>
            </div>
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: C.text3 }}>📅 {b.date} · {b.read} {t(lang,{en:"read",np:"मिनेट"})}</span>
              <button style={{ background: "none", border: "none", color: C.accent, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Read →</button>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────
// YOUTUBE SECTION — with admin "Add Video" panel
// isLoggedIn → shows an input to paste a YouTube URL
// ─────────────────────────────────────────────────────────────────
function VideoSection({ isLoggedIn }) {
  const lang = useLang();
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [ytUrl, setYtUrl]   = useState("");
  const [badge, setBadge]   = useState("EXCLUSIVE");
  const [titleEn, setTitleEn] = useState("");
  const [titleNp, setTitleNp] = useState("");
  const [error, setError]   = useState("");

  const addVideo = () => {
    const id = extractYouTubeId(ytUrl);
    if (!id) { setError("Could not extract YouTube ID. Paste a full URL."); return; }
    if (!titleEn) { setError("Please add an English title."); return; }
    setError("");
    setVideos(v => [{
      id: Date.now(),
      youtubeId: id,
      badge,
      title: { en: titleEn, np: titleNp || titleEn },
      views: "New",
      duration: "—",
    }, ...v]);
    setYtUrl(""); setTitleEn(""); setTitleNp(""); setBadge("EXCLUSIVE");
    // REAL BACKEND: POST to Supabase
    // await supabase.from('videos').insert({ youtube_id: id, badge, title_en: titleEn, title_np: titleNp })
  };

  return (
    <Section id="videos" title={t(lang,{en:"Videos",np:"भिडियोहरू"})} npTitle="मेरा भिडियोहरू"
      right={<a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>YouTube channel →</a>}>

      {/* Admin: Add video panel (only visible when logged in) */}
      {isLoggedIn && (
        <div style={{ background: C.surface, border: `1.5px dashed ${C.accent}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            🔐 Add a YouTube Video
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.text2, display: "block", marginBottom: 4 }}>YouTube URL *</label>
              <input value={ytUrl} onChange={e => setYtUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", color: C.text, outline: "none" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.text2, display: "block", marginBottom: 4 }}>Badge</label>
              <select value={badge} onChange={e => setBadge(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", color: C.text, background: C.bg, outline: "none" }}>
                {["EXCLUSIVE","GROUND REPORT","INVESTIGATIVE","DEBATE","INTERVIEW","BREAKING"].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.text2, display: "block", marginBottom: 4 }}>Title (English) *</label>
              <input value={titleEn} onChange={e => setTitleEn(e.target.value)}
                placeholder="English title..."
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", color: C.text, outline: "none" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.text2, display: "block", marginBottom: 4 }}>Title (Nepali) <span style={{fontWeight:400}}>optional</span></label>
              <input value={titleNp} onChange={e => setTitleNp(e.target.value)}
                placeholder="नेपाली शीर्षक..."
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "'Noto Sans Devanagari', sans-serif", color: C.text, outline: "none" }} />
            </div>
          </div>
          {error && <p style={{ fontSize: 12, color: "#c0392b", marginBottom: 10 }}>{error}</p>}
          <button onClick={addVideo} style={{ ...S.accentBtn, padding: "9px 20px", fontSize: 13 }}>
            + Add to Portfolio
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
        {videos.map(v => (
          <a key={v.id}
            href={`https://youtube.com/watch?v=${v.youtubeId}`}
            target="_blank" rel="noreferrer"
            style={{ ...S.card, display: "block", textDecoration: "none", transition: "transform 0.15s, border-color 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "#ff0000"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = C.border; }}>

            {/* Thumbnail — uses YouTube's auto-generated thumbnail */}
            <div style={{ position: "relative", height: 160, background: "#0f0f0f", overflow: "hidden" }}>
              <img
                src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                onError={e => { e.target.style.display = "none"; }}
              />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff" }}>▶</div>
              </div>
              <div style={{ position: "absolute", top: 10, left: 10, background: C.accent, color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 4, letterSpacing: 0.5 }}>{v.badge}</div>
              <div style={{ position: "absolute", bottom: 8, right: 10, background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 11, padding: "2px 7px", borderRadius: 4 }}>{v.duration}</div>
            </div>

            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: C.text3, marginBottom: 5 }}>NTV Nepal · Santosh Pokharel</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.55, fontFamily: lang === "np" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}>
                {t(lang, v.title)}
              </div>
              <div style={{ fontSize: 11, color: C.text3, marginTop: 8 }}>👁 {v.views} views</div>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────
// THOUGHTS SECTION
// Post button visible only when logged in
// ─────────────────────────────────────────────────────────────────
function ThoughtsSection({ isLoggedIn }) {
  const lang = useLang();
  const [thoughts, setThoughts] = useState(INITIAL_THOUGHTS);
  const [input, setInput]       = useState("");
  const MAX = 280;

  const post = () => {
    if (!input.trim()) return;
    const newItem = {
      id: Date.now(),
      text: { en: input, np: input }, // same text both languages when posted
      time: "Just now",
      likes: 0,
      liked: false,
    };
    setThoughts(t => [newItem, ...t]);
    setInput("");
    // REAL BACKEND: supabase.from('thoughts').insert({ text: input })
  };

  const toggleLike = (id) => {
    setThoughts(ts => ts.map(t =>
      t.id === id ? { ...t, liked: !t.liked, likes: t.liked ? t.likes - 1 : t.likes + 1 } : t
    ));
  };

  return (
    <Section id="thoughts" title={t(lang,{en:"Thoughts",np:"विचार"})} npTitle="विचार" bg={C.surface}>

      {/* Composer — only for logged in user */}
      {isLoggedIn && (
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>SP</div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value.slice(0, MAX))}
              placeholder={t(lang,{en:"Share a thought, observation, or quick take...",np:"विचार साझा गर्नुस्..."})}
              style={{ flex: 1, border: "none", background: "transparent", fontFamily: "inherit", fontSize: 14, color: C.text, resize: "none", outline: "none", lineHeight: 1.6, minHeight: 60 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 11, color: input.length > MAX * 0.8 ? "#c0392b" : C.text3 }}>{MAX - input.length} left</span>
            <button onClick={post} disabled={!input.trim()}
              style={{ ...S.accentBtn, padding: "7px 18px", fontSize: 13, opacity: input.trim() ? 1 : 0.5, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              Post गर्नुस्
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {thoughts.map(item => (
          <div key={item.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>SP</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Santosh Pokharel</div>
                <div style={{ fontSize: 11, color: C.text3 }}>सन्तोष पोखरेल · {item.time}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.75, fontFamily: lang === "np" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}>
              {t(lang, item.text)}
            </p>
            <div style={{ display: "flex", gap: 20, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
              <button onClick={() => toggleLike(item.id)}
                style={{ background: "none", border: "none", color: item.liked ? C.accent : C.text3, fontSize: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
                {item.liked ? "❤" : "🤍"} {item.likes}
              </button>
              <button style={{ background: "none", border: "none", color: C.text3, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                💬 Reply
              </button>
              <button style={{ background: "none", border: "none", color: C.text3, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                ↗ Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────
// ABOUT SECTION
// ─────────────────────────────────────────────────────────────────
function AboutSection() {
  const lang = useLang();
  return (
    <Section id="about" title={t(lang,{en:"About",np:"परिचय"})} npTitle="परिचय">
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 32, alignItems: "start" }}>

        {/* Sidebar card */}
        <div style={{ ...S.card, padding: 24, textAlign: "center" }}>
          <div style={{ width: 88, height: 88, borderRadius: "50%", border: `3px solid ${C.accent}`, background: C.accentLight, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: C.accentText }}>
            🎙️
            {/* Replace with <img src="/santosh.jpg" style={{width:88,height:88,borderRadius:"50%",objectFit:"cover"}} /> */}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Santosh Pokharel</div>
          <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 14, color: C.text2, marginTop: 3 }}>सन्तोष पोखरेल</div>
          <div style={{ fontSize: 12, color: C.text3, marginTop: 5, lineHeight: 1.5 }}>Senior Reporter · NTV Nepal<br />Kathmandu, Nepal 🇳🇵</div>

          {/* Social links */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
            {[["𝕏","https://twitter.com"],["▶","https://youtube.com"],["📘","https://facebook.com"],["✉","mailto:santosh@ntv.com"]].map(([icon, href]) => (
              <a key={icon} href={href} target="_blank" rel="noreferrer"
                style={{ width: 32, height: 32, borderRadius: 7, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: C.text2, textDecoration: "none" }}>
                {icon}
              </a>
            ))}
          </div>

          {/* Awards */}
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.border}`, textAlign: "left" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, letterSpacing: 0.5, marginBottom: 10 }}>AWARDS</div>
            {["🏆 Best Reporter 2022","📰 RSF Fellowship","🎖 National Media Award"].map(a => (
              <div key={a} style={{ fontSize: 12, color: C.text2, padding: "6px 10px", background: C.surface2, borderRadius: 6, marginBottom: 6 }}>{a}</div>
            ))}
          </div>
        </div>

        {/* Bio + timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <p style={{ fontSize: 15, color: C.text2, lineHeight: 1.85, fontFamily: lang === "np" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}>
            {t(lang, {
              en: "I'm Santosh Pokharel, a senior reporter at NTV Nepal with 8+ years covering politics, society, and human-interest stories across all 77 districts of Nepal. I believe journalism is a public service — a bridge between the people and power. I've reported from flood zones in Terai, earthquake relief camps in the hills, and parliament corridors in Kathmandu.",
              np: "म सन्तोष पोखरेल, NTV नेपालमा वरिष्ठ रिपोर्टर हुँ। ८ वर्षभन्दा बढी समयदेखि नेपालका ७७ वटै जिल्लामा राजनीति, समाज र मानवीय रुचिका कथाहरू समेट्दै आएको छु। म पत्रकारितालाई सार्वजनिक सेवाको रूपमा बुझ्छु — नागरिक र सत्ता बीचको सेतुको रूपमा।",
            })}
          </p>

          {/* Timeline */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text2, marginBottom: 16, letterSpacing: 0.5 }}>CAREER</div>
            {[
              ["2020–Present","Senior Reporter","NTV Nepal · Kathmandu"],
              ["2018–2020","Political Correspondent","Kantipur TV"],
              ["2016–2018","Reporter","Nepal Television"],
              ["2012–2016","BJ&MC","Tribhuvan University"],
            ].map(([yr, role, org], i, arr) => (
              <div key={yr} style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.accent, flexShrink: 0, marginTop: 4 }} />
                  {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: C.border, margin: "4px 0" }} />}
                </div>
                <div style={{ paddingBottom: 18 }}>
                  <div style={{ fontSize: 11, color: C.text3, fontWeight: 600, letterSpacing: 0.3 }}>{yr}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{role}</div>
                  <div style={{ fontSize: 12, color: C.text2 }}>{org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────
// CONTACT SECTION
//
// HOW THE CONTACT FORM WORKS:
// Option 1 (easiest, no backend): Formspree
//   1. Go to formspree.io → create free account → New Form
//   2. Copy your form ID (looks like "xabcdefg")
//   3. Replace the fetch URL below with:
//      fetch("https://formspree.io/f/YOUR_FORM_ID", ...)
//   Done. Formspree emails you when someone submits.
//
// Option 2 (more control): EmailJS
//   1. npm install @emailjs/browser
//   2. Create free account at emailjs.com
//   3. Set up a "service" (Gmail) and "template"
//   4. Use: emailjs.send(serviceId, templateId, formData, publicKey)
//
// Option 3 (full control): Supabase Edge Function
//   supabase.functions.invoke('send-email', { body: formData })
// ─────────────────────────────────────────────────────────────────
function ContactSection() {
  const lang = useLang();
  const [form, setForm] = useState({ name: "", email: "", subject: "Interview Request", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    // ── CONNECT YOUR FORM SERVICE HERE ──────────────────────────
    // Currently shows a mock success after 1 second.
    // Replace with one of the options above.
    //
    // Formspree example:
    // const res = await fetch("https://formspree.io/f/YOUR_ID", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json", "Accept": "application/json" },
    //   body: JSON.stringify(form),
    // });
    // if (res.ok) { setStatus("sent"); setForm({name:"",email:"",subject:"Interview Request",message:""}); }
    // else { setStatus("error"); }
    // ────────────────────────────────────────────────────────────
    await new Promise(r => setTimeout(r, 1000));
    setStatus("sent");
    setForm({ name: "", email: "", subject: "Interview Request", message: "" });
  };

  return (
    <Section id="contact" title={t(lang,{en:"Contact",np:"सम्पर्क"})} npTitle="सम्पर्क" bg={C.surface}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

        {/* Left: info */}
        <div>
          <p style={{ fontSize: 15, color: C.text2, lineHeight: 1.75, marginBottom: 24, fontFamily: lang === "np" ? "'Noto Sans Devanagari', sans-serif" : "inherit" }}>
            {t(lang, {
              en: "For interview requests, press inquiries, speaking engagements, or collaborations — reach out anytime.",
              np: "अन्तरवार्ता, प्रेस सम्बन्धी काम, वक्तृत्व कार्यक्रम वा सहकार्यका लागि सम्पर्क गर्नुस्।",
            })}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["✉","santosh@ntv.com"],
              ["📞","+977-98XXXXXXXX"],
              ["📍","Kathmandu, Bagmati Province, Nepal"],
              ["🏢","NTV Nepal, New Baneshwor"],
            ].map(([icon, val]) => (
              <div key={val} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: C.accentLight, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
                <span style={{ fontSize: 14, color: C.text2 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["name","Your Name","Ram Shrestha"],["email","Email","ram@example.com"]].map(([name,label,ph]) => (
              <div key={name}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: "block", marginBottom: 5 }}>{label}</label>
                <input name={name} type={name==="email"?"email":"text"} value={form[name]} onChange={handleChange} placeholder={ph} required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", color: C.text, background: C.bg, outline: "none" }} />
              </div>
            ))}
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: "block", marginBottom: 5 }}>Subject</label>
            <select name="subject" value={form.subject} onChange={handleChange}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", color: C.text, background: C.bg, outline: "none" }}>
              {["Interview Request","Press Inquiry","Speaking Engagement","Collaboration","Other"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.text2, display: "block", marginBottom: 5 }}>Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} required rows={4}
              placeholder={t(lang,{en:"Write your message here...",np:"आफ्नो सन्देश लेख्नुस्..."})}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", color: C.text, background: C.bg, outline: "none", resize: "vertical" }} />
          </div>

          {status === "sent" && (
            <div style={{ background: "#e8f5e8", border: "1px solid #4caf50", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#1b5e20" }}>
              ✅ {t(lang,{en:"Message sent! We'll get back to you soon.",np:"सन्देश पठाइयो! चाँडै जवाफ दिइनेछ।"})}
            </div>
          )}
          {status === "error" && (
            <div style={{ background: "#fde8e8", border: "1px solid #e53935", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#b71c1c" }}>
              ❌ {t(lang,{en:"Something went wrong. Please try again.",np:"केही गल्ती भयो। फेरि प्रयास गर्नुस्।"})}
            </div>
          )}

          <button type="submit" disabled={status === "sending"}
            style={{ ...S.accentBtn, padding: "12px", fontSize: 15, width: "100%", opacity: status === "sending" ? 0.7 : 1 }}>
            {status === "sending"
              ? t(lang,{en:"Sending...",np:"पठाउँदैछ..."})
              : t(lang,{en:"Send Message",np:"सन्देश पठाउनुस्"})}
          </button>
        </form>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────
function Footer() {
  const lang = useLang();
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer style={{ background: "#110e1a", color: "#a090b8", borderTop: `1px solid #2a2040`, padding: "36px 0 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 13 }}>स</div>
              <div>
                <div style={{ color: "#f0ebff", fontWeight: 700, fontSize: 14 }}>Santosh Pokharel</div>
                <div style={{ fontSize: 11, color: "#7060a0" }}>TV Journalist · NTV Nepal</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#6050a0", maxWidth: 200, lineHeight: 1.6, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              नागरिकको आवाज, सत्यको खोजी।
            </div>
          </div>
          <div style={{ display: "flex", gap: 48 }}>
            {[
              ["NAVIGATE", [["news","News"],["blog","Blog"],["videos","Videos"],["thoughts","Thoughts"],["about","About"]]],
              ["FOLLOW",   [["#","Twitter/X"],["#","YouTube"],["#","Instagram"],["#","Facebook"]]],
              ["MORE",     [["#","Press Kit"],["#","Privacy Policy"],["contact","Contact"]]],
            ].map(([heading, links]) => (
              <div key={heading}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#f0ebff", letterSpacing: 0.5, marginBottom: 12 }}>{heading}</div>
                {links.map(([id, label]) => (
                  <div key={label} style={{ marginBottom: 8 }}>
                    <button onClick={() => scroll(id)} style={{ background: "none", border: "none", color: "#6050a0", fontSize: 13, cursor: "pointer", fontFamily: "inherit", padding: 0 }}>{label}</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #2a2040", paddingTop: 18, display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4a3870" }}>
          <span>© 2025 Santosh Pokharel · सन्तोष पोखरेल · All rights reserved</span>
          <span>Built with ❤ in Kathmandu</span>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────
// ROOT APP COMPONENT
// This is what you export and render in your index.jsx
// ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang]           = useState("en");   // "en" or "np"
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <LangContext.Provider value={lang}>
      <div style={{ minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: C.bg }}>

        <Navbar
          lang={lang}
          setLang={setLang}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setShowLogin(true)}
          onLogout={() => setLoggedIn(false)}
        />

        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onLogin={() => setLoggedIn(true)}
          />
        )}

        <Hero />
        <BlogSection />
        <VideoSection isLoggedIn={isLoggedIn} />
        <ThoughtsSection isLoggedIn={isLoggedIn} />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>
    </LangContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────
// HOW TO RUN THIS:
//
// 1. Create a new React project:
//    npm create vite@latest santosh-portfolio -- --template react
//    cd santosh-portfolio
//    npm install
//
// 2. Replace src/App.jsx with this file.
//    Delete src/App.css and src/index.css (not needed).
//    In src/main.jsx, keep: ReactDOM.createRoot(...).render(<App />)
//
// 3. npm run dev → open http://localhost:5173
//
// DEMO LOGIN: santosh@ntv.com / password123
//
// ─────────────────────────────────────────────────────────────────
