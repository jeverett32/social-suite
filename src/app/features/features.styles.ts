export const featuresCSS = `
  .mkf {
    --paper: #ffffff; --ink: #111111; --muted: #625d58;
    --line: rgba(17,17,17,0.14); --wash: #f4efe8; --warm: #c16747; --olive: #727454; --blue: #3f5870;
    --content: 1320px;
    background: #ffffff; color: #111111; font-family: var(--font-inter), system-ui, sans-serif; overflow-x: hidden;
  }
  .mkf a { color: inherit; text-decoration: none; }
  .mkf .page-shell { width: 100%; max-width: var(--content); margin: 0 auto; padding: 0 28px; }

  .mkf .site-nav {
    position: sticky; top: 0; z-index: 40;
    background: rgba(255,255,255,0.94); border-bottom: 1px solid var(--line);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  }
  .mkf .nav-inner { width: 100%; max-width: var(--content); margin: 0 auto; min-height: 78px; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .mkf .brand { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; }
  .mkf .brand-mark { color: var(--warm); }
  .mkf .nav-links, .mkf .nav-actions { display: flex; align-items: center; gap: 22px; }
  .mkf .nav-links a { font-size: 14px; color: var(--muted); transition: color 0.2s ease; }
  .mkf .nav-links a.is-current, .mkf .nav-links a:hover { color: var(--ink); }
  .mkf .button { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0 18px; border: 1px solid currentColor; border-radius: 4px; font-size: 14px; font-weight: 600; transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease; }
  .mkf .button:hover { transform: translateY(-1px); }
  .mkf .button-ghost { color: var(--ink); }
  .mkf .button-solid { background: var(--ink); border-color: var(--ink); color: #ffffff; }

  .mkf .hero { padding: 104px 0 44px; border-bottom: 1px solid var(--line); }
  .mkf .hero-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 40px; align-items: end; }
  .mkf .eyebrow { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 18px; color: var(--muted); font-size: 14px; }
  .mkf .eyebrow::before { content: ""; width: 24px; height: 1px; background: var(--warm); }
  .mkf .hero-title { max-width: 760px; font-family: var(--font-newsreader), Georgia, serif; font-size: clamp(48px,7vw,88px); font-weight: 500; line-height: 0.98; letter-spacing: -0.03em; text-wrap: balance; margin: 0; }
  .mkf .hero-title .warm { color: var(--warm); }
  .mkf .hero-title .olive { color: var(--olive); }
  .mkf .hero-copy { max-width: 620px; margin-top: 22px; color: var(--muted); font-size: 19px; line-height: 1.75; }
  .mkf .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
  .mkf .hero-index { border-top: 1px solid var(--line); }
  .mkf .hero-index div { display: grid; grid-template-columns: 92px 1fr; gap: 18px; padding: 16px 0; border-bottom: 1px solid var(--line); }
  .mkf .hero-index span { color: var(--muted); font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .mkf .hero-index p { margin: 0; color: var(--muted); line-height: 1.7; }

  .mkf .summary-band { padding: 22px 0 0; }
  .mkf .summary-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 22px; padding: 24px 0 26px; }
  .mkf .summary-item { border-top: 1px solid var(--line); padding-top: 12px; }
  .mkf .summary-item h3 { margin: 0 0 8px; font-size: 19px; font-weight: 600; }
  .mkf .feature-label { display: block; margin-bottom: 8px; color: var(--muted); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .mkf .summary-copy { margin: 0; color: var(--muted); line-height: 1.7; }

  .mkf .section { padding: 88px 0; border-top: 1px solid var(--line); }
  .mkf .section-topline { display: flex; justify-content: space-between; align-items: baseline; gap: 24px; margin-bottom: 30px; }
  .mkf .section-label { color: var(--muted); font-size: 14px; }
  .mkf .section-kicker { color: var(--warm); font-size: 14px; font-weight: 600; }

  .mkf .feature-block { display: grid; grid-template-columns: 0.95fr 1.05fr; gap: 42px; align-items: start; margin-top: 38px; }
  .mkf .feature-title { font-family: var(--font-newsreader), Georgia, serif; font-size: clamp(34px,4vw,56px); font-weight: 500; line-height: 0.98; letter-spacing: -0.03em; margin-bottom: 18px; }
  .mkf .feature-copy { max-width: 560px; font-size: 18px; color: var(--muted); line-height: 1.75; }
  .mkf .feature-list { margin: 24px 0 0; padding: 0; list-style: none; border-top: 1px solid var(--line); }
  .mkf .feature-list li { padding: 14px 0; border-bottom: 1px solid var(--line); font-size: 15px; color: var(--muted); line-height: 1.7; }

  .mkf .placeholder { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 18px 0; }
  .mkf .placeholder-stage { min-height: 420px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 16px; background: var(--wash); padding: 20px; }
  .mkf .placeholder-main, .mkf .placeholder-side, .mkf .placeholder-bottom { border: 1px solid rgba(17,17,17,0.12); background: rgba(255,255,255,0.72); }
  .mkf .placeholder-main { display: grid; grid-template-rows: auto 1fr auto; gap: 14px; padding: 18px; }
  .mkf .topline { display: flex; justify-content: space-between; gap: 16px; color: var(--muted); font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .mkf .canvas { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
  .mkf .canvas div, .mkf .stack div, .mkf .placeholder-bottom .row div { border: 1px solid rgba(17,17,17,0.08); background: rgba(244,239,232,0.9); color: var(--ink); display: flex; align-items: flex-end; }
  .mkf .canvas div { min-height: 148px; padding: 14px; font-size: 14px; }
  .mkf .placeholder-side { display: grid; grid-template-rows: auto 1fr; gap: 12px; padding: 18px; }
  .mkf .stack { display: grid; gap: 12px; }
  .mkf .stack div { min-height: 88px; padding: 14px; font-size: 14px; }
  .mkf .placeholder-bottom { margin-top: 16px; padding: 18px; display: grid; gap: 12px; }
  .mkf .placeholder-bottom .row { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; }
  .mkf .placeholder-bottom .row div { min-height: 78px; padding: 12px; font-size: 13px; }
  .mkf .placeholder-note { margin-top: 16px; font-size: 14px; color: var(--muted); line-height: 1.7; }

  .mkf .quote-band { padding: 82px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .mkf .quote-band blockquote { margin: 0; max-width: 1040px; font-family: var(--font-newsreader), Georgia, serif; font-size: clamp(36px,5vw,62px); font-weight: 500; line-height: 1.03; letter-spacing: -0.03em; }
  .mkf .quote-band footer { margin-top: 18px; color: var(--muted); font-size: 15px; }

  .mkf .cta { padding: 88px 0 96px; border-top: 1px solid var(--line); }
  .mkf .cta-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 42px; align-items: start; }
  .mkf .cta-title { font-family: var(--font-newsreader), Georgia, serif; font-size: clamp(38px,4.5vw,58px); font-weight: 500; line-height: 0.98; letter-spacing: -0.03em; margin-bottom: 18px; }
  .mkf .cta-copy { max-width: 620px; color: var(--muted); font-size: 18px; line-height: 1.75; }
  .mkf .cta-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
  .mkf .cta-rail { border-top: 1px solid var(--line); }
  .mkf .cta-rail div { display: grid; grid-template-columns: 92px minmax(0,1fr); gap: 14px; padding: 20px 0; border-bottom: 1px solid var(--line); color: var(--muted); font-size: 15px; line-height: 1.6; }
  .mkf .cta-rail strong { color: var(--ink); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }

  .mkf .site-footer { border-top: 1px solid var(--line); padding: 20px 0 36px; }
  .mkf .footer-inner { width: 100%; max-width: var(--content); margin: 0 auto; padding: 0 28px; display: flex; justify-content: space-between; gap: 24px; color: var(--muted); font-size: 14px; }
  .mkf .footer-links { display: flex; gap: 18px; flex-wrap: wrap; }

  .mkf .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .mkf .reveal.is-visible { opacity: 1; transform: translateY(0); }
  .mkf .delay-1 { transition-delay: 0.08s; }
  .mkf .delay-2 { transition-delay: 0.16s; }

  @media (max-width: 1100px) {
    .mkf .hero-grid, .mkf .feature-block, .mkf .cta-grid { grid-template-columns: 1fr; }
    .mkf .summary-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  }
  @media (max-width: 860px) {
    .mkf .nav-links { display: none; }
    .mkf .placeholder-stage, .mkf .canvas, .mkf .placeholder-bottom .row { grid-template-columns: 1fr; }
    .mkf .summary-grid { grid-template-columns: 1fr; }
    .mkf .section, .mkf .cta { padding: 72px 0; }
    .mkf .section-topline { display: grid; grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .mkf .page-shell, .mkf .nav-inner, .mkf .footer-inner { padding-left: 14px; padding-right: 14px; }
    .mkf .nav-actions .button-ghost { display: none; }
    .mkf .hero-actions .button, .mkf .cta-actions .button { width: 100%; }
    .mkf .hero-index div, .mkf .cta-rail div, .mkf .footer-inner { grid-template-columns: 1fr; display: grid; }
  }
  @media (prefers-reduced-motion: reduce) {
    .mkf .reveal, .mkf .button { transition: none !important; transform: none !important; }
  }
`;
