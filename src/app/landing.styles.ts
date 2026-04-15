export const landingCSS = `
  .mk {
    --paper: #ffffff; --ink: #111111; --muted: #5d5854;
    --line: rgba(17,17,17,0.14); --warm: #c16747; --olive: #727454; --blue: #3f5870;
    --content: 1320px; --hero-shift: 0px; --studio-shift: 0px;
    background: #ffffff; color: #111111; font-family: var(--font-inter), system-ui, sans-serif; overflow-x: hidden;
  }
  .mk a { color: inherit; text-decoration: none; }
  .mk .page-shell { width: 100%; max-width: var(--content); margin: 0 auto; padding: 0 28px; }

  .mk .site-nav {
    position: fixed; inset: 0 0 auto 0; z-index: 40;
    transition: background-color 0.45s ease, border-color 0.45s ease, color 0.45s ease;
    color: #ffffff; border-bottom: 1px solid transparent;
  }
  .mk.mk-nl .site-nav {
    background: rgba(255,255,255,0.94); color: var(--ink);
    border-bottom-color: var(--line); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  }
  .mk .nav-inner {
    width: 100%; max-width: var(--content); margin: 0 auto;
    min-height: 78px; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; gap: 24px;
  }
  .mk .brand { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; }
  .mk .brand-mark { color: var(--warm); }
  .mk .nav-links, .mk .nav-actions { display: flex; align-items: center; gap: 22px; }
  .mk .nav-links a { font-size: 14px; opacity: 0.84; transition: opacity 0.2s ease; }
  .mk .nav-links a:hover { opacity: 1; }
  .mk .button {
    display: inline-flex; align-items: center; justify-content: center;
    min-height: 46px; padding: 0 18px; border: 1px solid currentColor; border-radius: 4px;
    font-size: 14px; font-weight: 600;
    transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
  }
  .mk .button:hover { transform: translateY(-1px); }
  .mk .button-ghost { background: transparent; }
  .mk .button-solid { background: var(--ink); border-color: var(--ink); color: #ffffff; }
  .mk:not(.mk-nl) .button-solid {
    background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.45);
    color: #ffffff; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  }

  .mk .hero-stage {
    position: relative; min-height: 92svh; color: #ffffff; overflow: clip;
    background: linear-gradient(160deg, #c8bfb4 0%, #b5a99c 50%, #a8977f 100%);
  }
  .mk .hero-video {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover;
    transform: translateY(var(--hero-shift));
    filter: saturate(0.96) contrast(1.02);
  }
  .mk .hero-stage::after {
    content: ""; position: absolute; inset: 0; background: rgba(16,16,16,0.32); z-index: 1; pointer-events: none;
  }
  .mk .hero-overlay {
    position: relative; z-index: 2; min-height: 92svh;
    display: flex; align-items: flex-end; padding-top: 108px; padding-bottom: 56px;
  }
  .mk .hero-stack {
    width: 100%; display: grid; grid-template-columns: minmax(0,1.5fr) minmax(240px,0.55fr); gap: 28px; align-items: end;
  }
  .mk .hero-copy { max-width: 860px; }
  .mk .eyebrow { display: inline-flex; align-items: center; gap: 12px; font-size: 14px; line-height: 1.4; opacity: 0.95; margin-bottom: 18px; }
  .mk .eyebrow::before { content: ""; width: 24px; height: 1px; background: rgba(255,255,255,0.7); }
  .mk .hero-title {
    margin: 0; max-width: 820px; font-family: var(--font-newsreader), Georgia, serif;
    font-size: clamp(54px, 8vw, 100px); font-weight: 500; line-height: 0.93; letter-spacing: -0.04em; text-wrap: balance;
  }
  .mk .hero-title .warm { color: #f0b297; }
  .mk .hero-title .olive { color: #d3d7b6; }
  .mk .hero-sub { max-width: 610px; margin: 22px 0 0; font-size: 19px; line-height: 1.65; color: rgba(255,255,255,0.94); }
  .mk .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
  .mk .hero-actions .button-ghost { border-color: rgba(255,255,255,0.5); }
  .mk .hero-side { align-self: end; display: grid; gap: 16px; padding-bottom: 8px; font-size: 14px; line-height: 1.65; color: rgba(255,255,255,0.88); }
  .mk .hero-side strong { display: block; margin-bottom: 4px; color: #fff; font-size: 13px; letter-spacing: 0.03em; text-transform: uppercase; }

  .mk .hero-footer { position: relative; z-index: 3; margin-top: -1px; border-top: 1px solid var(--line); background: var(--paper); }
  .mk .hero-summary { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 26px; padding: 22px 0 24px; }
  .mk .summary-item { padding-top: 10px; border-top: 1px solid var(--line); }
  .mk .summary-item span { display: block; margin-bottom: 8px; color: var(--muted); font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .mk .summary-item p { margin: 0; color: var(--ink); font-size: 15px; line-height: 1.6; }

  .mk .section { padding: 92px 0; border-top: 1px solid var(--line); }
  .mk .section-topline { display: flex; justify-content: space-between; align-items: baseline; gap: 24px; margin-bottom: 28px; }
  .mk .section-label { color: var(--muted); font-size: 14px; }
  .mk .section-kicker { color: var(--warm); font-size: 14px; font-weight: 600; }
  .mk .story-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 42px; align-items: start; margin-bottom: 38px; }
  .mk .section-title { margin: 0; max-width: 760px; font-family: var(--font-newsreader), Georgia, serif; font-size: clamp(40px,5vw,62px); font-weight: 500; line-height: 0.98; letter-spacing: -0.03em; }
  .mk .section-copy { margin: 0; font-size: 18px; line-height: 1.75; color: var(--muted); }

  .mk .line-list { border-top: 1px solid var(--line); }
  .mk .line-row { display: grid; grid-template-columns: 90px 1.1fr 0.9fr; gap: 26px; align-items: start; padding: 22px 0; border-bottom: 1px solid var(--line); }
  .mk .line-row > span { color: var(--muted); font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .mk .line-row h3 { margin: 0 0 8px; font-size: 24px; line-height: 1.18; }
  .mk .line-row p { margin: 0; color: var(--muted); line-height: 1.7; }

  .mk .workflow-grid { display: grid; grid-template-columns: minmax(320px,0.75fr) minmax(0,1fr); gap: 56px; align-items: start; }
  .mk .studio-rail { position: sticky; top: 108px; }
  .mk .studio-frame {
    overflow: hidden;
    aspect-ratio: 9/13.5;
    background: #e8e0d7;
    border-radius: 14px;
    border: 1px solid rgba(17,17,17,0.12);
    box-shadow: 0 22px 50px rgba(17,17,17,0.14);
  }
  .mk .studio-video {
    width: 100%; height: 100%; object-fit: cover;
    transform: translateY(var(--studio-shift));
  }
  .mk .studio-note { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding-top: 18px; margin-top: 18px; border-top: 1px solid var(--line); }
  .mk .studio-note p { margin: 0; color: var(--muted); line-height: 1.7; }
  .mk .workflow-copy { max-width: 620px; margin: 0 0 26px; font-size: 18px; line-height: 1.75; color: var(--muted); }
  .mk .workflow-list { border-top: 1px solid var(--line); }
  .mk .workflow-step { display: grid; grid-template-columns: 90px 1fr; gap: 24px; padding: 22px 0; border-bottom: 1px solid var(--line); }
  .mk .workflow-step > span { color: var(--muted); font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .mk .workflow-step h3 { margin: 0 0 8px; font-size: 24px; line-height: 1.18; }
  .mk .workflow-step p { margin: 0; color: var(--muted); line-height: 1.7; }

  .mk .quote-band { padding: 84px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .mk .quote-band blockquote { margin: 0; max-width: 1060px; font-family: var(--font-newsreader), Georgia, serif; font-size: clamp(38px,5vw,64px); font-weight: 500; line-height: 1.02; letter-spacing: -0.03em; text-wrap: balance; }
  .mk .quote-band footer { margin-top: 18px; color: var(--muted); font-size: 15px; }

  .mk .teams-grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: 42px; align-items: start; }
  .mk .teams-list { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 20px; border-top: 1px solid var(--line); padding-top: 18px; }
  .mk .teams-list article { padding-top: 18px; border-top: 4px solid transparent; }
  .mk .teams-list article:nth-child(1) { border-color: var(--warm); }
  .mk .teams-list article:nth-child(2) { border-color: var(--olive); }
  .mk .teams-list article:nth-child(3) { border-color: var(--blue); }
  .mk .teams-list h3 { margin: 0 0 8px; font-size: 24px; line-height: 1.18; }
  .mk .teams-list p { margin: 0; color: var(--muted); line-height: 1.7; }

  .mk .cta-grid { display: grid; grid-template-columns: 1.2fr 0.85fr; gap: 42px; align-items: start; padding: 88px 0 96px; border-top: 1px solid var(--line); }
  .mk .cta-title { margin: 0; max-width: 740px; font-family: var(--font-newsreader), Georgia, serif; font-size: clamp(40px,5vw,60px); font-weight: 500; line-height: 0.98; letter-spacing: -0.03em; }
  .mk .cta-copy { max-width: 620px; margin-top: 18px; font-size: 18px; line-height: 1.75; color: var(--muted); }
  .mk .cta-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
  .mk .cta-rail { border-top: 1px solid var(--line); }
  .mk .cta-rail div { display: grid; grid-template-columns: 88px minmax(0,1fr); align-items: start; gap: 14px; padding: 20px 0; border-bottom: 1px solid var(--line); color: var(--muted); font-size: 15px; line-height: 1.6; }
  .mk .cta-rail strong { color: var(--ink); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }

  .mk .site-footer { border-top: 1px solid var(--line); padding: 20px 0 36px; }
  .mk .footer-inner { width: 100%; max-width: var(--content); margin: 0 auto; padding: 0 28px; display: flex; justify-content: space-between; gap: 24px; color: var(--muted); font-size: 14px; }
  .mk .footer-links { display: flex; gap: 18px; flex-wrap: wrap; }

  .mk .reveal { opacity: 0; transform: translateY(38px); transition: opacity 0.8s ease, transform 0.8s ease; will-change: opacity, transform; }
  .mk .reveal.is-visible { opacity: 1; transform: translateY(0); }
  .mk .delay-1 { transition-delay: 0.08s; }
  .mk .delay-2 { transition-delay: 0.16s; }
  .mk .delay-3 { transition-delay: 0.24s; }
  .mk .hero-animate { opacity: 0; transform: translateY(28px); transition: opacity 0.9s ease, transform 0.9s ease; }
  .mk.mk-hr .hero-animate { opacity: 1; transform: translateY(0); }
  .mk .hero-animate.delay-1 { transition-delay: 0.12s; }
  .mk .hero-animate.delay-2 { transition-delay: 0.24s; }
  .mk .hero-animate.delay-3 { transition-delay: 0.36s; }

  @media (max-width: 1120px) {
    .mk .hero-stack, .mk .story-grid, .mk .workflow-grid, .mk .teams-grid, .mk .cta-grid { grid-template-columns: 1fr; }
    .mk .hero-side { max-width: 540px; }
    .mk .hero-summary { grid-template-columns: repeat(2,minmax(0,1fr)); }
    .mk .line-row { grid-template-columns: 80px 1fr; }
    .mk .line-row > p:last-child { grid-column: 2; }
    .mk .studio-rail { position: static; }
  }
  @media (max-width: 860px) {
    .mk .nav-inner { min-height: 70px; }
    .mk .nav-links { display: none; }
    .mk .hero-stage, .mk .hero-overlay { min-height: 86svh; }
    .mk .hero-overlay { padding-top: 96px; padding-bottom: 38px; }
    .mk .hero-summary, .mk .teams-list, .mk .studio-note { grid-template-columns: 1fr; }
    .mk .section { padding: 72px 0; }
    .mk .quote-band { padding: 68px 0; }
    .mk .cta-grid { padding: 72px 0 80px; }
    .mk .line-row, .mk .workflow-step { grid-template-columns: 1fr; gap: 14px; }
    .mk .line-row > p:last-child { grid-column: auto; }
  }
  @media (max-width: 560px) {
    .mk .page-shell, .mk .nav-inner, .mk .footer-inner { padding-left: 14px; padding-right: 14px; }
    .mk .nav-actions .button-ghost { display: none; }
    .mk .nav-actions .button-solid { min-height: 42px; padding: 0 14px; }
    .mk .hero-actions .button, .mk .cta-actions .button { width: 100%; }
    .mk .section-topline, .mk .footer-inner, .mk .cta-rail div { display: grid; grid-template-columns: 1fr; }
    .mk .cta-rail div { gap: 6px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .mk .reveal, .mk .hero-animate, .mk .button, .mk .site-nav { transition: none !important; transform: none !important; }
  }
`;
