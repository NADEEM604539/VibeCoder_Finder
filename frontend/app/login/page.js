"use client";

import { useEffect, useRef, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

/* ═══════════════════════════════════════════════════════════
   VIBE CODER FINDER — /login
   Everything (styles, effects, Google auth) lives in this file.
   Palette:  matrix green #00ff41 · deep green #0f5a22
             payload red #ff003c · void #020603
   ═══════════════════════════════════════════════════════════ */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const BANNER = `██╗   ██╗ ██████╗███████╗
██║   ██║██╔════╝██╔════╝
██║   ██║██║     █████╗  
╚██╗ ██╔╝██║     ██╔══╝  
 ╚████╔╝ ╚██████╗██║     
  ╚═══╝   ╚═════╝╚═╝     `;

const BOOT = [
  { t: "ok", m: "kernel: vibecoder-core v1.0 loaded" },
  { t: "ok", m: "agents spawned: planner / operator / observer / reporter" },
  { t: "ok", m: "playwright engine ............ ready" },
  { t: "info", m: "scan queue ................... 0 jobs" },
  { t: "warn", m: "unauthenticated session detected" },
  { t: "err", m: "ACCESS DENIED - identity required" },
  { t: "info", m: "handshake provider: google oauth2 ... available" },
];

const TAGS = {
  ok: { label: "[  OK  ]", color: "text-[#00ff41]", msg: "text-[#9dffb0]" },
  info: { label: "[ INFO ]", color: "text-[#3ddc84]", msg: "text-[#6fbf86]" },
  warn: { label: "[ WARN ]", color: "text-[#d4ff00]", msg: "text-[#d4ff00]" },
  err: { label: "[ FAIL ]", color: "text-[#ff003c]", msg: "text-[#ff003c]" },
};

const THREATS = [
  { red: true, m: "[!] SQLi  /api/users?id=1' OR '1'='1" },
  { red: false, m: "[+] 14 routes mapped" },
  { red: true, m: "[!] XSS reflected  /search?q=<script>" },
  { red: false, m: "[+] session fuzzing complete" },
  { red: true, m: "[!] HTTP 500  POST /api/checkout" },
  { red: false, m: "[+] playwright: 212 interactions replayed" },
  { red: true, m: "[!] exposed .env  /static/.env" },
  { red: false, m: "[+] report #031 generated" },
];

const CSS = `
.scanlines{position:fixed;inset:0;z-index:40;pointer-events:none;background:repeating-linear-gradient(to bottom,rgba(0,0,0,.3) 0,rgba(0,0,0,.3) 1px,transparent 1px,transparent 3px)}
.vignette{position:fixed;inset:0;z-index:39;pointer-events:none;background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,.9) 100%)}
.scanbar{position:fixed;left:0;right:0;top:0;height:160px;z-index:38;pointer-events:none;background:linear-gradient(to bottom,transparent,rgba(0,255,65,.08),transparent);animation:scanbar 7s linear infinite}
@keyframes scanbar{from{transform:translateY(-180px)}to{transform:translateY(100vh)}}

.glow{text-shadow:0 0 6px rgba(0,255,65,.8),0 0 22px rgba(0,255,65,.35)}
.glow-red{text-shadow:0 0 6px rgba(255,0,60,.8),0 0 20px rgba(255,0,60,.4)}

.terminal{animation:flick 6s infinite;box-shadow:0 0 0 1px rgba(0,255,65,.12),0 0 60px -10px rgba(0,255,65,.35),inset 0 0 40px rgba(0,255,65,.04)}
@keyframes flick{0%,100%{opacity:1}48%{opacity:.985}50%{opacity:.93}52%{opacity:1}}

.glitch{position:relative;display:inline-block;color:#00ff41;text-shadow:0 0 8px rgba(0,255,65,.6)}
.glitch::before,.glitch::after{content:attr(data-text);position:absolute;top:0;width:100%;overflow:hidden}
.glitch::before{left:2px;color:#ff003c;animation:gl1 3.2s infinite steps(1)}
.glitch::after{left:-2px;color:#b6ffc8;animation:gl2 2.6s infinite steps(1)}
@keyframes gl1{0%,90%{clip-path:inset(0 0 100% 0)}91%{clip-path:inset(15% 0 55% 0)}94%{clip-path:inset(62% 0 8% 0)}97%{clip-path:inset(4% 0 82% 0)}100%{clip-path:inset(0 0 100% 0)}}
@keyframes gl2{0%,86%{clip-path:inset(0 0 100% 0)}88%{clip-path:inset(48% 0 30% 0)}92%{clip-path:inset(8% 0 70% 0)}96%{clip-path:inset(75% 0 4% 0)}100%{clip-path:inset(0 0 100% 0)}}

.blink{animation:blink 1s steps(1) infinite}
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}

.fadein{animation:fadein .35s ease-out both}
@keyframes fadein{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}

.marquee{display:flex;width:max-content;animation:marquee 38s linear infinite}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}

@media (prefers-reduced-motion:reduce){
  .scanbar,.terminal,.glitch::before,.glitch::after,.marquee,.blink{animation:none!important}
}
`;

/* ───────────── Matrix rain background ───────────── */
function MatrixRain() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chars =
      "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789$#<>/{}[]=+*&%";
    const size = 16;
    let w = 0;
    let h = 0;
    let drops = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      drops = Array.from({ length: Math.floor(w / size) }, () => Math.random() * -60);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(2,6,3,0.13)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${size}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const x = i * size;
        const y = drops[i] * size;
        const r = Math.random();
        ctx.fillStyle = r > 0.985 ? "#ff003c" : r > 0.93 ? "#d6ffe0" : "#00ff41";
        ctx.fillText(ch, x, y);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    };

    let id;
    if (reduce) {
      for (let i = 0; i < 40; i++) draw();
    } else {
      id = setInterval(draw, 50);
    }

    return () => {
      clearInterval(id);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 z-0 opacity-[0.32]" />;
}

/* ───────────── Google "G" ───────────── */
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/* ───────────── Page ───────────── */
export default function LoginPage() {
  const [shown, setShown] = useState(0);
  const [clock, setClock] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ready = shown >= BOOT.length;

  // boot sequence: reveal one log line at a time
  useEffect(() => {
    if (ready) return;
    const t = setTimeout(() => setShown((s) => s + 1), 280 + Math.random() * 260);
    return () => clearTimeout(t);
  }, [shown, ready]);

  // live clock
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-GB"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Google auth-code flow -> FastAPI callback exchanges the code (secret stays server-side)
  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: `${API_BASE}/api/auth/google/callback`,
    scope: "openid email profile",
    onError: () => {
      setLoading(false);
      setError("handshake failed - retry authentication");
    },
  });

  const handleLogin = () => {
    setError("");
    setLoading(true);
    login();
  };

  return (
    <main className="relative flex min-h-screen flex-1 overflow-hidden bg-[#020603] font-mono text-[#9dffb0]">
      <style>{CSS}</style>

      <MatrixRain />
      <div className="scanbar" />
      <div className="vignette" />
      <div className="scanlines" />

      {/* terminal window */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-10 pb-20">
        <div className="terminal w-full max-w-2xl border border-[#0f5a22] bg-[#030a05]/90 backdrop-blur-sm">
          {/* title bar */}
          <div className="flex items-center justify-between border-b border-[#0f5a22] bg-[#04100a] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff003c]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#0f5a22]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#00ff41]" />
              <span className="ml-3 text-xs text-[#3ddc84]/80">root@vibecoder:~</span>
            </div>
            <span className="glow-red blink text-[11px] font-bold tracking-widest text-[#ff003c]">
              ● THREAT: ELEVATED
            </span>
          </div>

          {/* body */}
          <div className="p-5 sm:p-8">
            <pre className="glow overflow-x-auto text-[11px] leading-[1.15] text-[#00ff41] sm:text-base">
              {BANNER}
            </pre>

            <h1 className="mt-5 text-2xl font-bold tracking-[0.12em] sm:text-4xl">
              <span className="glitch" data-text="VIBE_CODER_FINDER">
                VIBE_CODER_FINDER
              </span>
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#6fbf86]">
              &gt; autonomous ai agents // find the holes{" "}
              <span className="glow-red text-[#ff003c]">before they do</span>
              <span className="blink ml-1 inline-block h-4 w-2 translate-y-0.5 bg-[#00ff41]" />
            </p>

            {/* boot log */}
            <div className="mt-6 min-h-[11.5rem] space-y-1 border-l-2 border-[#0f5a22] pl-4 text-[13px] leading-6">
              {BOOT.slice(0, shown).map((l, i) => {
                const tag = TAGS[l.t];
                return (
                  <p key={i} className="fadein">
                    <span className={`${tag.color} mr-3 font-bold`}>{tag.label}</span>
                    <span className={tag.msg}>{l.m}</span>
                  </p>
                );
              })}
            </div>

            {/* auth */}
            <div className={`mt-6 transition-opacity duration-700 ${ready ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              <p className="text-sm">
                <span className="text-[#ff003c]">root@vibecoder</span>
                <span className="text-[#6fbf86]">:</span>
                <span className="text-[#3ddc84]">~</span>
                <span className="text-[#6fbf86]"># </span>
                <span className="text-[#9dffb0]">./authenticate --provider=google</span>
              </p>

              <button
                type="button"
                onClick={handleLogin}
                disabled={loading || !ready}
                className="group relative mt-4 flex w-full items-center justify-center gap-3 border border-[#00ff41] bg-[#00ff41]/10 px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#00ff41] shadow-[0_0_22px_rgba(0,255,65,0.25)] transition-all duration-200 hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_45px_rgba(0,255,65,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff41] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030a05] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="grid h-7 w-7 place-items-center rounded-sm bg-white">
                  {loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  ) : (
                    <GoogleLogo />
                  )}
                </span>
                <span>{loading ? "establishing handshake..." : "[ continue with google ]"}</span>
              </button>

              {error && (
                <p role="alert" className="glow-red mt-3 text-xs text-[#ff003c]">
                  [!] {error}
                </p>
              )}

              <p className="mt-4 text-[11px] leading-5 text-[#3ddc84]/60">
                // only your name + email are requested. no passwords are ever stored.
              </p>
            </div>
          </div>

          {/* status bar */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#0f5a22] bg-[#04100a] px-4 py-2 text-[11px] text-[#3ddc84]/80">
            <span>
              <span className="text-[#00ff41]">●</span> ENCRYPTED // TLS 1.3
            </span>
            <span>NODE 10.13.37.1</span>
            <span suppressHydrationWarning>{clock}</span>
          </div>
        </div>
      </div>

      {/* live threat ticker */}
      <div className="fixed inset-x-0 bottom-0 z-30 overflow-hidden border-t border-[#0f5a22] bg-black/85 py-1.5 text-[11px]">
        <div className="marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 gap-10 pr-10 whitespace-nowrap">
              {THREATS.map((t, i) => (
                <span key={`${k}-${i}`} className={t.red ? "text-[#ff003c]" : "text-[#00ff41]/80"}>
                  {t.m}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
