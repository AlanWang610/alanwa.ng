import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Form", path: "/" },
  { label: "Discipline", path: "/discipline" },
  { label: "Instruction", path: "/instruction" },
  { label: "Work", path: "/work" },
  { label: "Essays", path: "/essays" },
  { label: "Photography", path: "/photography" },
  { label: "Reading Log", path: "/reading-log" },
];

// ─── Sample Data ─────────────────────────────────────────────────────────────

const WORKOUTS = [
  { date: "2026-02-24", title: "Long Run — River Trail", distance: "14.2 mi", duration: "1:52:30", link: "#", note: "Negative split, last 5K at tempo" },
  { date: "2026-02-22", title: "Intervals — Track", distance: "8.0 mi", duration: "1:04:15", link: "#", note: "8×800m @ 3:05 avg, 200m jog recovery" },
  { date: "2026-02-20", title: "Easy Recovery", distance: "5.1 mi", duration: "45:20", link: "#", note: "" },
  { date: "2026-02-18", title: "Tempo — Urban Loop", distance: "10.0 mi", duration: "1:15:40", link: "#", note: "Miles 3–8 at 6:55/mi" },
  { date: "2026-02-16", title: "Hill Repeats — Cemetery Ridge", distance: "7.3 mi", duration: "1:02:10", link: "#", note: "6× hill, 90s recovery" },
  { date: "2026-02-14", title: "Long Run — Coastal Path", distance: "16.0 mi", duration: "2:08:45", link: "#", note: "Wind advisory; adjusted pace" },
  { date: "2026-02-12", title: "Strength — Compound Lifts", distance: "—", duration: "1:10:00", link: "#", note: "Squat / Deadlift / Press cycle" },
  { date: "2026-02-10", title: "Easy Recovery", distance: "4.8 mi", duration: "42:50", link: "#", note: "" },
];

const PROJECTS = [
  { id: "1", title: "Distributed Inference Engine", tags: ["Systems", "ML"], year: "2025", summary: "Low-latency inference routing across heterogeneous GPU clusters. Reduced p99 latency by 40% under load.", featured: true },
  { id: "2", title: "Typographic Layout Compiler", tags: ["Tools", "Design"], year: "2025", summary: "Constraint-based document layout engine that enforces grid discipline at compile time." },
  { id: "3", title: "Signal / Noise", tags: ["Data", "Visualization"], year: "2024", summary: "Real-time anomaly detection dashboard for streaming telemetry data." },
  { id: "4", title: "Archival Search", tags: ["NLP", "Search"], year: "2024", summary: "Semantic retrieval system for digitized manuscript collections. Handles degraded OCR gracefully." },
];

const ESSAYS = [
  { id: "1", title: "On the Resistance of Material", date: "2026-01-15", summary: "Why constraint is generative, and why most 'creative freedom' produces interchangeable results.", featured: true, readTime: "12 min" },
  { id: "2", title: "Legibility as Ethic", date: "2025-11-02", summary: "The case for treating clear communication as a moral commitment rather than a stylistic preference.", readTime: "8 min" },
  { id: "3", title: "Against Atmosphere", date: "2025-08-20", summary: "How ambient design erodes the distinction between content and mood.", readTime: "15 min" },
  { id: "4", title: "Practice and Record", date: "2025-05-10", summary: "Notes on the difference between doing a thing and documenting a thing.", readTime: "6 min" },
];

const PHOTOS = [
  { id: 1, aspect: 1.5, caption: "Concrete formwork, morning light — Tōkyō" },
  { id: 2, aspect: 0.75, caption: "Steel cable detail — suspension bridge" },
  { id: 3, aspect: 1.33, caption: "Salt flat, midday — Bonneville" },
  { id: 4, aspect: 0.67, caption: "Stairwell geometry — Brutalist housing block" },
  { id: 5, aspect: 1.5, caption: "Fog burning off a ridge — coastal range" },
  { id: 6, aspect: 1.0, caption: "Typeface proof sheet — letterpress studio" },
  { id: 7, aspect: 0.8, caption: "Rebar grid before pour" },
  { id: 8, aspect: 1.4, caption: "Empty track, 6 AM — municipal stadium" },
  { id: 9, aspect: 1.2, caption: "Rusted I-beam cross section" },
];

const READING_LOG = {
  current: [
    { title: "The Craftsman", author: "Richard Sennett", note: "On the relationship between hand and mind in skilled practice." },
    { title: "Ornament and Crime", author: "Adolf Loos", note: "" },
  ],
  completed: {
    2025: [
      { title: "Sun and Steel", author: "Yukio Mishima", note: "The body as corrective to abstraction. Central to this site's design philosophy." },
      { title: "The Timeless Way of Building", author: "Christopher Alexander", note: "Pattern language as living structure." },
      { title: "Seeing Like a State", author: "James C. Scott", note: "Legibility as power; the costs of imposed order." },
      { title: "In Praise of Shadows", author: "Jun'ichirō Tanizaki", note: "The aesthetics of darkness and texture against Western illumination." },
      { title: "The Shape of Design", author: "Frank Chimero", note: "" },
    ],
    2024: [
      { title: "Finite and Infinite Games", author: "James P. Carse", note: "Discipline as finite game; practice as infinite." },
      { title: "The Poetics of Space", author: "Gaston Bachelard", note: "" },
      { title: "Hackers & Painters", author: "Paul Graham", note: "Craft as the through-line between making software and making art." },
      { title: "Meditations", author: "Marcus Aurelius", note: "" },
    ],
  },
};

// ─── Icons (SVG) ─────────────────────────────────────────────────────────────

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4, verticalAlign: "middle" }}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,4 12,13 2,4" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SunDisk = ({ size = 6 }) => (
  <span style={{
    display: "inline-block",
    width: size,
    height: size,
    borderRadius: "50%",
    background: "var(--accent-2)",
    flexShrink: 0,
  }} />
);

// ─── Styles ──────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;600;700&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-4: 32px; --space-5: 48px; --space-6: 64px;
  --radius-0: 0px; --radius-1: 4px;
  --ink-950: #0B0D10; --ink-900: #12151A; --ink-700: #2A313A; --ink-500: #5B6675;
  --paper-50: #F6F3ED; --paper-100: #EEE8DD;
  --steel-700: #45515E; --steel-600: #5E6C7A; --steel-400: #9AA7B3;
  --sun-600: #B88933; --sun-500: #D6A34A; --sun-300: #E8C67A;
  --font-serif: "Noto Serif JP", "Source Han Serif JP", "Source Han Serif", "Noto Serif CJK JP", "Georgia", "Times New Roman", serif;
  --max-w: 1120px;
  --transition: 250ms ease;
}

[data-theme="day"] {
  --bg: var(--paper-50); --surface: var(--paper-100); --text: var(--ink-950);
  --muted-text: var(--ink-500); --border: rgba(11,13,16,0.16);
  --accent: var(--steel-600); --accent-2: var(--sun-500); --focus: var(--steel-700);
  --photo-placeholder-a: #d4cfc6; --photo-placeholder-b: #c8c0b4;
}
[data-theme="night"] {
  --bg: var(--ink-950); --surface: var(--ink-900); --text: var(--paper-50);
  --muted-text: var(--steel-400); --border: rgba(154,167,179,0.22);
  --accent: var(--sun-500); --accent-2: var(--steel-400); --focus: var(--sun-300);
  --photo-placeholder-a: #1e2228; --photo-placeholder-b: #252a32;
}

html { font-size: 16px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
body { font-family: var(--font-serif); background: var(--bg); color: var(--text); line-height: 1.65; transition: background var(--transition), color var(--transition); }
a { color: var(--accent); text-decoration: none; transition: color var(--transition), border-color var(--transition); }
a:hover { border-bottom: 1px solid var(--accent); }
a:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; border-radius: var(--radius-1); }
button:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; border-radius: var(--radius-1); }
img { display: block; max-width: 100%; }

/* ── Utility ── */
.container { max-width: var(--max-w); margin: 0 auto; padding: 0 var(--space-3); }
.eyebrow { font-family: var(--font-serif); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; font-size: 12px; color: var(--muted-text); }
.rule { border: none; border-top: 1px solid var(--border); margin: var(--space-5) 0; }
.rule--tight { margin: var(--space-3) 0; }
.muted { color: var(--muted-text); }
.tnum { font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }

/* ── Header ── */
.header { position: sticky; top: 0; z-index: 100; background: var(--bg); border-bottom: 1px solid var(--border); transition: background var(--transition); }
.header__inner { display: flex; align-items: center; justify-content: space-between; height: 56px; gap: var(--space-3); }
.header__mark { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 15px; letter-spacing: 0.02em; cursor: pointer; background: none; border: none; color: var(--text); font-family: var(--font-serif); white-space: nowrap; }
.header__mark:hover { color: var(--accent); }
.header__nav { display: flex; align-items: center; gap: var(--space-3); }
.header__nav-link { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; color: var(--muted-text); cursor: pointer; background: none; border: none; border-bottom: 2px solid transparent; padding: 4px 0; font-family: var(--font-serif); transition: color var(--transition), border-color var(--transition); white-space: nowrap; }
.header__nav-link:hover { color: var(--text); border-bottom-color: var(--accent); }
.header__nav-link--active { color: var(--text); border-bottom-color: var(--accent); }
.header__right { display: flex; align-items: center; gap: 12px; }
.header__social { display: flex; align-items: center; gap: 12px; color: var(--muted-text); }
.header__social a { color: var(--muted-text); display: flex; align-items: center; border: none; }
.header__social a:hover { color: var(--text); border: none; }
.theme-toggle { background: none; border: 1px solid var(--border); color: var(--muted-text); cursor: pointer; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-1); transition: color var(--transition), border-color var(--transition), background var(--transition); }
.theme-toggle:hover { color: var(--text); border-color: var(--accent); background: var(--surface); }

/* Mobile nav */
.mobile-menu-btn { display: none; background: none; border: none; color: var(--text); cursor: pointer; padding: 4px; }
.mobile-drawer { display: none; position: fixed; top: 56px; left: 0; right: 0; bottom: 0; background: var(--bg); z-index: 99; padding: var(--space-4) var(--space-3); flex-direction: column; gap: var(--space-2); overflow-y: auto; border-top: 1px solid var(--border); }
.mobile-drawer.open { display: flex; }
.mobile-drawer__link { font-size: 18px; font-weight: 600; letter-spacing: 0.04em; color: var(--muted-text); background: none; border: none; font-family: var(--font-serif); cursor: pointer; text-align: left; padding: var(--space-2) 0; border-bottom: 1px solid var(--border); transition: color var(--transition); }
.mobile-drawer__link:hover, .mobile-drawer__link--active { color: var(--text); }
.mobile-drawer__social { display: flex; gap: 16px; padding-top: var(--space-3); color: var(--muted-text); }
.mobile-drawer__social a { color: var(--muted-text); display: flex; border: none; }
.mobile-drawer__social a:hover { color: var(--text); }

@media (max-width: 900px) {
  .header__nav { display: none; }
  .header__social { display: none; }
  .mobile-menu-btn { display: flex; }
}

/* ── Page ── */
.page { padding: var(--space-6) 0; min-height: calc(100vh - 56px); animation: fadeIn 400ms ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) {
  .page { animation: none; }
  * { transition-duration: 0ms !important; }
}

/* ── Hero ── */
.hero { padding: var(--space-6) 0 var(--space-5); }
.hero__name { font-size: clamp(28px, 5vw, 42px); font-weight: 700; line-height: 1.15; margin-bottom: var(--space-2); }
.hero__thesis { font-size: 17px; line-height: 1.65; color: var(--muted-text); max-width: 640px; margin-bottom: var(--space-4); }
.hero__current { background: var(--surface); border: 1px solid var(--border); padding: var(--space-3) var(--space-4); border-radius: var(--radius-1); max-width: 640px; }
.hero__current p { font-size: 15px; line-height: 1.7; }

/* ── Section headings ── */
.section-heading { display: flex; align-items: center; gap: 12px; margin-bottom: var(--space-4); }
.section-heading h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; color: var(--muted-text); }
.section-heading::after { content: ""; flex: 1; height: 1px; background: var(--border); }

/* ── Form page bio ── */
.bio { max-width: 680px; font-size: 17px; line-height: 1.75; margin-bottom: var(--space-5); }
.bio p + p { margin-top: var(--space-3); }
.principles { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-3); margin-bottom: var(--space-5); }
.principle { padding: var(--space-3); border-left: 2px solid var(--accent); }
.principle__title { font-weight: 600; font-size: 15px; margin-bottom: 6px; }
.principle__desc { font-size: 14px; color: var(--muted-text); line-height: 1.6; }

/* ── Featured cards ── */
.featured-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-3); margin-bottom: var(--space-5); }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-1); padding: var(--space-3) var(--space-4); cursor: pointer; transition: border-color var(--transition), box-shadow var(--transition); position: relative; }
.card:hover { border-color: var(--accent); }
.card--featured { border-top: 2px solid var(--accent-2); }
.card__eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; color: var(--muted-text); margin-bottom: 8px; }
.card__title { font-size: 17px; font-weight: 600; margin-bottom: 8px; line-height: 1.35; }
.card__desc { font-size: 14px; color: var(--muted-text); line-height: 1.6; }
.card__meta { font-size: 12px; color: var(--muted-text); margin-top: 12px; }

/* ── Discipline ── */
.workout-row { display: grid; grid-template-columns: 100px 1fr auto; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--border); align-items: baseline; }
.workout-row:first-child { border-top: 1px solid var(--border); }
.workout-row__date { font-size: 13px; color: var(--muted-text); white-space: nowrap; }
.workout-row__body { }
.workout-row__title { font-weight: 600; font-size: 15px; margin-bottom: 2px; }
.workout-row__note { font-size: 13px; color: var(--muted-text); line-height: 1.5; }
.workout-row__stats { font-size: 13px; color: var(--muted-text); white-space: nowrap; }
.workout-row__link { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; color: var(--accent); cursor: pointer; margin-top: 4px; }
.workout-row__link:hover { border-bottom-color: var(--accent); }

@media (max-width: 640px) {
  .workout-row { grid-template-columns: 1fr; gap: 4px; }
  .workout-row__stats { margin-top: 4px; }
}

/* ── Instruction ── */
.instr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-5); }
@media (max-width: 700px) { .instr-grid { grid-template-columns: 1fr; } }
.instr-block { border-top: 1px solid var(--border); padding-top: var(--space-3); }
.instr-block__title { font-weight: 600; font-size: 15px; margin-bottom: 8px; }
.instr-block__list { font-size: 14px; color: var(--muted-text); line-height: 1.8; }
.cta-block { background: var(--surface); border: 1px solid var(--border); padding: var(--space-4); border-radius: var(--radius-1); text-align: center; }
.cta-block p { font-size: 15px; margin-bottom: var(--space-3); }
.cta-btn { display: inline-block; background: var(--accent); color: var(--bg); padding: 10px 28px; font-family: var(--font-serif); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border: none; border-radius: var(--radius-1); cursor: pointer; transition: background var(--transition); }
.cta-btn:hover { background: var(--focus); border: none; }

/* ── Work ── */
.work-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-3); }
.tag-filter { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-4); }
.tag-btn { font-family: var(--font-serif); font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; background: none; border: 1px solid var(--border); color: var(--muted-text); padding: 6px 14px; cursor: pointer; border-radius: var(--radius-1); transition: all var(--transition); }
.tag-btn:hover, .tag-btn--active { border-color: var(--accent); color: var(--text); background: var(--surface); }

/* ── Essays ── */
.essay-list { }
.essay-item { padding: var(--space-3) 0; border-bottom: 1px solid var(--border); cursor: pointer; transition: padding-left var(--transition); }
.essay-item:hover { padding-left: var(--space-2); }
.essay-item:first-child { border-top: 1px solid var(--border); }
.essay-item__title { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.essay-item__meta { font-size: 12px; color: var(--muted-text); margin-bottom: 6px; }
.essay-item__summary { font-size: 14px; color: var(--muted-text); line-height: 1.6; max-width: 640px; }
.essay-featured { background: var(--surface); border: 1px solid var(--border); border-top: 2px solid var(--accent-2); padding: var(--space-4); margin-bottom: var(--space-4); border-radius: var(--radius-1); cursor: pointer; }
.essay-featured:hover .essay-item__title { color: var(--accent); }

/* ── Photography ── */
.masonry { column-count: 3; column-gap: var(--space-3); }
@media (max-width: 900px) { .masonry { column-count: 2; } }
@media (max-width: 540px) { .masonry { column-count: 1; } }
.masonry__item { break-inside: avoid; margin-bottom: var(--space-3); position: relative; overflow: hidden; border-radius: var(--radius-1); }
.masonry__placeholder { width: 100%; background: linear-gradient(135deg, var(--photo-placeholder-a), var(--photo-placeholder-b)); display: flex; align-items: center; justify-content: center; position: relative; }
.masonry__caption { position: absolute; bottom: 0; left: 0; right: 0; padding: var(--space-2) var(--space-3); background: linear-gradient(transparent, rgba(11,13,16,0.7)); color: #F6F3ED; font-size: 13px; opacity: 0; transition: opacity var(--transition); pointer-events: none; }
.masonry__item:hover .masonry__caption { opacity: 1; }
@media (max-width: 540px) { .masonry__caption { opacity: 1; } }

/* ── Reading Log ── */
.reading-section { margin-bottom: var(--space-5); }
.book-entry { display: flex; gap: var(--space-3); padding: var(--space-3) 0; border-left: 2px solid var(--accent-2); padding-left: var(--space-3); }
.book-entry--completed { border-left-color: var(--border); }
.book-entry__title { font-weight: 600; font-size: 15px; }
.book-entry__author { font-size: 13px; color: var(--muted-text); margin-top: 2px; }
.book-entry__note { font-size: 13px; color: var(--muted-text); line-height: 1.6; margin-top: 4px; font-style: italic; }
.year-heading { font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; color: var(--muted-text); margin-bottom: var(--space-2); margin-top: var(--space-4); padding-bottom: var(--space-1); border-bottom: 1px solid var(--border); }

/* ── 404 ── */
.four04 { text-align: center; padding: var(--space-6) 0; }
.four04__num { font-size: clamp(64px, 12vw, 120px); font-weight: 700; color: var(--border); line-height: 1; margin-bottom: var(--space-3); }
.four04__msg { font-size: 17px; color: var(--muted-text); margin-bottom: var(--space-4); }
.four04__links { display: flex; gap: var(--space-3); justify-content: center; }

/* ── Footer ── */
.footer { border-top: 1px solid var(--border); padding: var(--space-4) 0; margin-top: var(--space-6); }
.footer__inner { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--muted-text); }
@media (max-width: 540px) { .footer__inner { flex-direction: column; gap: 8px; } }
`;

// ─── Components ──────────────────────────────────────────────────────────────

function Header({ currentPath, navigate, theme, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <button className="header__mark" onClick={() => handleNav("/")} aria-label="Home">
            <SunDisk size={8} />
            <span>Sun & Steel</span>
          </button>

          <nav className="header__nav" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                className={`header__nav-link ${currentPath === item.path ? "header__nav-link--active" : ""}`}
                onClick={() => handleNav(item.path)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="header__right">
            <div className="header__social">
              <a href="#" aria-label="GitHub"><GithubIcon /></a>
              <a href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href="#" aria-label="Email"><MailIcon /></a>
            </div>
            <div style={{ width: 1, height: 20, background: "var(--border)" }} className="header__social" />
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-pressed={theme === "night"}
              aria-label={`Switch to ${theme === "day" ? "night" : "day"} mode`}
            >
              {theme === "day" ? <MoonIcon /> : <SunIcon />}
            </button>
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-drawer__social">
          <a href="#" aria-label="GitHub"><GithubIcon /></a>
          <a href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
          <a href="#" aria-label="Email"><MailIcon /></a>
        </div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            className={`mobile-drawer__link ${currentPath === item.path ? "mobile-drawer__link--active" : ""}`}
            onClick={() => handleNav(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}

function SectionHeading({ children }) {
  return (
    <div className="section-heading">
      <h2>{children}</h2>
    </div>
  );
}

// ─── Pages ───────────────────────────────────────────────────────────────────

function FormPage({ navigate }) {
  return (
    <div className="page">
      <div className="container">
        <div className="hero">
          <h1 className="hero__name">Your Name</h1>
          <p className="hero__thesis">
            Builder, practitioner, instructor. Oriented toward clarity over ornament,
            constraint over flourish, and work that can be practiced, repeated, and verified.
          </p>
          <div className="hero__current">
            <span className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <SunDisk /> Present focus
            </span>
            <p>
              Training for a spring marathon; teaching a graduate seminar on systems design;
              finishing a distributed inference project; writing on legibility and material form.
            </p>
          </div>
        </div>

        <hr className="rule" />

        <SectionHeading>Biography</SectionHeading>
        <div className="bio">
          <p>
            I design and build software systems, teach at the intersection of engineering
            and design, run long distances, and write essays about constraint, craft, and
            the ethics of presentation. My work is organized around the conviction that
            form is not decoration but discipline—something earned through practice rather
            than declared through style.
          </p>
          <p>
            Before the current work, I spent several years in distributed systems
            engineering, with a focus on inference infrastructure and real-time data
            pipelines. I hold appointments in two departments and maintain a practice
            of distance running as a parallel discipline to intellectual work.
          </p>
        </div>

        <SectionHeading>Principles</SectionHeading>
        <div className="principles">
          <div className="principle">
            <div className="principle__title">Clarity over ornament</div>
            <div className="principle__desc">What matters should survive direct illumination. Claims should be checkable, and links should terminate in real objects.</div>
          </div>
          <div className="principle">
            <div className="principle__title">Constraint over flourish</div>
            <div className="principle__desc">Measured edges, repeated rhythms, and engineered systems. Discipline is the instrument, not mood.</div>
          </div>
          <div className="principle">
            <div className="principle__title">Practice over narration</div>
            <div className="principle__desc">Writing is one instrument among others, placed alongside physical practice, teaching, and building in a shared hierarchy.</div>
          </div>
          <div className="principle">
            <div className="principle__title">Exposure over atmosphere</div>
            <div className="principle__desc">Day mode as thesis: the reading experience should feel like standing in clean light rather than in atmosphere.</div>
          </div>
        </div>

        <hr className="rule" />

        <SectionHeading>Featured</SectionHeading>
        <div className="featured-grid">
          <div className="card card--featured" onClick={() => navigate("/work")}>
            <div className="card__eyebrow">Work</div>
            <div className="card__title">Distributed Inference Engine</div>
            <div className="card__desc">Low-latency inference routing across heterogeneous GPU clusters.</div>
          </div>
          <div className="card card--featured" onClick={() => navigate("/essays")}>
            <div className="card__eyebrow">Essay</div>
            <div className="card__title">On the Resistance of Material</div>
            <div className="card__desc">Why constraint is generative, and why most 'creative freedom' produces interchangeable results.</div>
          </div>
          <div className="card card--featured" onClick={() => navigate("/photography")}>
            <div className="card__eyebrow">Photograph</div>
            <div className="card__title">Concrete formwork, morning light</div>
            <div className="card__desc">Tōkyō, 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DisciplinePage() {
  const [filter, setFilter] = useState("All");
  const tags = ["All", "Run", "Strength", "Recovery"];

  const filtered = filter === "All" ? WORKOUTS : WORKOUTS.filter((w) => {
    if (filter === "Run") return w.title.includes("Run") || w.title.includes("Interval") || w.title.includes("Tempo") || w.title.includes("Hill");
    if (filter === "Strength") return w.title.includes("Strength");
    if (filter === "Recovery") return w.title.includes("Recovery");
    return true;
  });

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, marginBottom: "var(--space-2)" }}>Discipline</h1>
        <p className="muted" style={{ maxWidth: 640, fontSize: 15, lineHeight: 1.7, marginBottom: "var(--space-5)" }}>
          Training structured around distance running with supplementary strength work.
          No computed analytics—only the session record and its external corroboration.
          Each entry links to the route or activity on MapMyRun.
        </p>

        <div className="tag-filter">
          {tags.map((t) => (
            <button key={t} className={`tag-btn ${filter === t ? "tag-btn--active" : ""}`} onClick={() => setFilter(t)}>
              {t}
            </button>
          ))}
        </div>

        <div>
          {filtered.map((w, i) => (
            <div className="workout-row" key={i}>
              <div className="workout-row__date tnum">{w.date}</div>
              <div className="workout-row__body">
                <div className="workout-row__title">{w.title}</div>
                {w.note && <div className="workout-row__note">{w.note}</div>}
                <a href={w.link} className="workout-row__link" target="_blank" rel="noopener noreferrer">
                  MapMyRun<ExternalIcon />
                </a>
              </div>
              <div className="workout-row__stats tnum">
                {w.distance !== "—" && <span>{w.distance}</span>}
                {w.distance !== "—" && <span style={{ margin: "0 6px", color: "var(--border)" }}>·</span>}
                <span>{w.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InstructionPage() {
  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, marginBottom: "var(--space-2)" }}>Instruction</h1>
        <p className="muted" style={{ maxWidth: 640, fontSize: 15, lineHeight: 1.7, marginBottom: "var(--space-5)" }}>
          Teaching as engineered transfer of capability—structured, repeatable, and
          verifiable through the student's subsequent work rather than through evaluation theater.
        </p>

        <div className="instr-grid">
          <div className="instr-block">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Topics</div>
            <div className="instr-block__list">
              Systems design and distributed architecture, inference infrastructure and ML operations,
              technical writing and documentation practice, design systems and typographic discipline,
              software craft and engineering ethics.
            </div>
          </div>
          <div className="instr-block">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Modes</div>
            <div className="instr-block__list">
              One-on-one mentorship (ongoing engagements), intensive workshops (2–5 days, cohort-based),
              graduate seminars (semester-length), guest lectures and invited talks,
              code review and architecture critique sessions.
            </div>
          </div>
          <div className="instr-block">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Method</div>
            <div className="instr-block__list">
              Instruction proceeds from constraint: define the problem boundary first, then work
              within it. Students produce artifacts under real conditions—time pressure, incomplete
              information, public review. Feedback is specific, written, and revisitable.
            </div>
          </div>
          <div className="instr-block">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Principles</div>
            <div className="instr-block__list">
              The student's output is the only valid measure. No self-assessment surveys, no
              participation grades. The goal is transfer of real capability that persists after
              the instructional relationship ends.
            </div>
          </div>
        </div>

        <hr className="rule" />

        <div className="cta-block">
          <p>Availability varies by semester and engagement type. For inquiries, reach out directly.</p>
          <button className="cta-btn">Contact for Availability</button>
        </div>
      </div>
    </div>
  );
}

function WorkPage() {
  const allTags = [...new Set(PROJECTS.flatMap((p) => p.tags))];
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(filter));

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, marginBottom: "var(--space-2)" }}>Work</h1>
        <p className="muted" style={{ maxWidth: 640, fontSize: 15, lineHeight: 1.7, marginBottom: "var(--space-5)" }}>
          Selected projects. Each structured as problem, constraints, approach, and outcome.
          Links terminate in real artifacts where available.
        </p>

        <div className="tag-filter">
          <button className={`tag-btn ${filter === "All" ? "tag-btn--active" : ""}`} onClick={() => setFilter("All")}>All</button>
          {allTags.map((t) => (
            <button key={t} className={`tag-btn ${filter === t ? "tag-btn--active" : ""}`} onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>

        <div className="work-grid">
          {filtered.map((p) => (
            <div className={`card ${p.featured ? "card--featured" : ""}`} key={p.id}>
              <div className="card__eyebrow">{p.tags.join(" · ")} · {p.year}</div>
              <div className="card__title">{p.title}</div>
              <div className="card__desc">{p.summary}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EssaysPage() {
  const featured = ESSAYS.find((e) => e.featured);
  const rest = ESSAYS.filter((e) => !e.featured);

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, marginBottom: "var(--space-2)" }}>Essays</h1>
        <p className="muted" style={{ maxWidth: 640, fontSize: 15, lineHeight: 1.7, marginBottom: "var(--space-5)" }}>
          Writing treated as one instrument among others. Prose as an object that should
          withstand scrutiny, not as a cloud of personality.
        </p>

        {featured && (
          <div className="essay-featured">
            <div className="eyebrow" style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <SunDisk /> Featured
            </div>
            <div className="essay-item__title" style={{ fontSize: 22 }}>{featured.title}</div>
            <div className="essay-item__meta tnum">{featured.date} · {featured.readTime}</div>
            <div className="essay-item__summary" style={{ marginTop: 8 }}>{featured.summary}</div>
          </div>
        )}

        <div className="essay-list">
          {rest.map((e) => (
            <div className="essay-item" key={e.id}>
              <div className="essay-item__title">{e.title}</div>
              <div className="essay-item__meta tnum">{e.date} · {e.readTime}</div>
              <div className="essay-item__summary">{e.summary}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhotographyPage() {
  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, marginBottom: "var(--space-2)" }}>Photography</h1>
        <p className="muted" style={{ maxWidth: 640, fontSize: 15, lineHeight: 1.7, marginBottom: "var(--space-5)" }}>
          Material surfaces, structural repetition, and the meeting of light with engineered form.
        </p>

        <div className="masonry">
          {PHOTOS.map((photo) => (
            <div className="masonry__item" key={photo.id} tabIndex={0} role="button" aria-label={photo.caption}>
              <div
                className="masonry__placeholder"
                style={{ paddingBottom: `${(1 / photo.aspect) * 100}%` }}
              >
                <svg
                  viewBox="0 0 80 80"
                  style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 40, height: 40, opacity: 0.15 }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <rect x="8" y="8" width="64" height="64" rx="2" />
                  <circle cx="28" cy="28" r="6" />
                  <polyline points="8,56 28,36 48,56" />
                  <polyline points="44,48 56,36 72,52" />
                </svg>
              </div>
              <div className="masonry__caption">{photo.caption}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReadingLogPage() {
  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, marginBottom: "var(--space-2)" }}>Reading Log</h1>
        <p className="muted" style={{ maxWidth: 640, fontSize: 15, lineHeight: 1.7, marginBottom: "var(--space-5)" }}>
          Books completed and in progress. Short notes where the reading inflects current work or thinking.
        </p>

        <div className="reading-section">
          <SectionHeading>Now Reading</SectionHeading>
          {READING_LOG.current.map((book, i) => (
            <div className="book-entry" key={i}>
              <div>
                <div className="book-entry__title">{book.title}</div>
                <div className="book-entry__author">{book.author}</div>
                {book.note && <div className="book-entry__note">{book.note}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="reading-section">
          <SectionHeading>Completed</SectionHeading>
          {Object.entries(READING_LOG.completed)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, books]) => (
              <div key={year}>
                <div className="year-heading tnum">{year}</div>
                {books.map((book, i) => (
                  <div className="book-entry book-entry--completed" key={i}>
                    <div>
                      <div className="book-entry__title">{book.title}</div>
                      <div className="book-entry__author">{book.author}</div>
                      {book.note && <div className="book-entry__note">{book.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function NotFoundPage({ navigate }) {
  return (
    <div className="page">
      <div className="container four04">
        <div className="four04__num tnum">404</div>
        <div className="four04__msg">This page does not exist. Nothing here survived exposure.</div>
        <div className="four04__links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Return to Form</a>
          <span className="muted">·</span>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/essays"); }}>Read Essays</a>
          <span className="muted">·</span>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/work"); }}>View Work</a>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>© 2026 · Built with sun and steel</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SunDisk size={5} />
          <span>Form persists under changing conditions</span>
        </span>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [path, setPath] = useState("/");
  const [theme, setTheme] = useState("day");
  const mainRef = useRef(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" && window.localStorage?.getItem?.("theme");
    if (stored === "day" || stored === "night") {
      setTheme(stored);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "day" ? "night" : "day";
      try { window.localStorage?.setItem?.("theme", next); } catch {}
      return next;
    });
  }, []);

  const navigate = useCallback((newPath) => {
    setPath(newPath);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const renderPage = () => {
    switch (path) {
      case "/": return <FormPage navigate={navigate} />;
      case "/discipline": return <DisciplinePage />;
      case "/instruction": return <InstructionPage />;
      case "/work": return <WorkPage />;
      case "/essays": return <EssaysPage />;
      case "/photography": return <PhotographyPage />;
      case "/reading-log": return <ReadingLogPage />;
      default: return <NotFoundPage navigate={navigate} />;
    }
  };

  return (
    <div data-theme={theme} style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", transition: "background 250ms ease, color 250ms ease" }}>
      <style>{CSS}</style>
      <Header currentPath={path} navigate={navigate} theme={theme} toggleTheme={toggleTheme} />
      <main ref={mainRef}>{renderPage()}</main>
      <Footer />
    </div>
  );
}
