export const loginCSS = `
  .mka {
    --paper: #ffffff; --ink: #111111; --muted: #625d58;
    --line: rgba(17,17,17,0.14); --warm: #c16747; --olive: #727454; --content: 1320px;
    background: #ffffff; color: #111111; font-family: var(--font-inter), system-ui, sans-serif; overflow-x: hidden;
  }
  .mka a { color: inherit; text-decoration: none; }
  .mka .page-shell { width: 100%; max-width: var(--content); margin: 0 auto; padding: 0 28px; }

  .mka .site-nav { position: sticky; top: 0; z-index: 40; background: rgba(255,255,255,0.94); border-bottom: 1px solid var(--line); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
  .mka .nav-inner { width: 100%; max-width: var(--content); margin: 0 auto; min-height: 78px; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .mka .brand { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; }
  .mka .brand-mark { color: var(--warm); }
  .mka .nav-links, .mka .nav-actions { display: flex; align-items: center; gap: 22px; }
  .mka .nav-links a { font-size: 14px; color: var(--muted); transition: color 0.2s ease; }
  .mka .nav-links a:hover, .mka .nav-links a.is-current { color: var(--ink); }
  .mka .button { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0 18px; border: 1px solid currentColor; border-radius: 4px; font-size: 14px; font-weight: 600; transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease; cursor: pointer; }
  .mka .button:hover { transform: translateY(-1px); }
  .mka .button-ghost { background: transparent; color: var(--ink); }
  .mka .button-solid { background: var(--ink); border-color: var(--ink); color: #ffffff; }

  .mka .auth-shell { min-height: calc(100svh - 79px); display: grid; grid-template-columns: minmax(0,0.92fr) minmax(360px,0.78fr); }
  .mka .auth-story { border-right: 1px solid var(--line); display: grid; grid-template-rows: auto 1fr auto; gap: 28px; padding: 56px 28px 32px 0; }
  .mka .eyebrow { display: inline-flex; align-items: center; gap: 12px; color: var(--muted); font-size: 14px; }
  .mka .eyebrow::before { content: ""; width: 24px; height: 1px; background: var(--warm); }
  .mka .auth-title { margin: 18px 0 0; max-width: 620px; font-family: var(--font-newsreader), Georgia, serif; font-size: clamp(42px,6vw,76px); font-weight: 500; line-height: 0.96; letter-spacing: -0.03em; text-wrap: balance; }
  .mka .auth-title .warm { color: var(--warm); }
  .mka .auth-title .olive { color: var(--olive); }
  .mka .auth-copy { max-width: 560px; margin: 22px 0 0; color: var(--muted); font-size: 18px; line-height: 1.75; }
  .mka .story-media { min-height: 360px; overflow: hidden; background: #ebe4dc; }
  .mka .story-notes { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 18px; border-top: 1px solid var(--line); padding-top: 18px; }
  .mka .story-notes div { border-top: 1px solid var(--line); padding-top: 10px; }
  .mka .story-notes span { display: block; margin-bottom: 8px; color: var(--muted); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .mka .story-notes p { margin: 0; color: var(--muted); line-height: 1.7; }

  .mka .auth-panel { padding: 56px 0 32px 32px; display: grid; align-content: start; gap: 28px; }
  .mka .auth-meta { border-top: 1px solid var(--line); padding-top: 16px; display: grid; gap: 14px; }
  .mka .demo-badge { display: block; margin-bottom: 8px; color: var(--muted); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .mka .auth-meta p { margin: 0; color: var(--muted); line-height: 1.7; }

  .mka .tab-bar { display: flex; gap: 18px; border-bottom: 1px solid var(--line); padding-bottom: 10px; }
  .mka .tab-button { appearance: none; background: none; border: 0; padding: 0 0 8px; color: var(--muted); font: inherit; font-size: 16px; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; transition: color 0.2s ease, border-color 0.2s ease; }
  .mka .tab-button.is-active { color: var(--ink); border-bottom-color: var(--ink); }

  .mka .auth-form { display: grid; gap: 18px; }
  .mka .form-grid { display: grid; gap: 18px; }
  .mka .form-grid.two-col { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .mka .field { display: grid; gap: 8px; }
  .mka .field-label { display: block; color: var(--muted); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .mka .field input, .mka .field select { width: 100%; min-height: 48px; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; padding: 0 0 10px; background: transparent; color: var(--ink); font: inherit; font-size: 16px; outline: none; transition: border-color 0.2s ease; }
  .mka .field input:focus, .mka .field select:focus { border-bottom-color: var(--ink); }
  .mka .field-help { font-size: 13px; color: var(--muted); line-height: 1.7; }
  .mka .form-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 6px; }
  .mka .demo-note { display: grid; gap: 14px; border-top: 1px solid var(--line); padding-top: 18px; }
  .mka .meta { display: grid; gap: 12px; }
  .mka .meta strong { display: block; color: var(--ink); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
  .mka .meta p { margin: 0; color: var(--muted); line-height: 1.7; }
  .mka .status-note { min-height: 24px; color: var(--warm); font-size: 14px; margin: 0; }

  .mka .site-footer { border-top: 1px solid var(--line); padding: 20px 0 36px; }
  .mka .footer-inner { width: 100%; max-width: var(--content); margin: 0 auto; padding: 0 28px; display: flex; justify-content: space-between; gap: 24px; color: var(--muted); font-size: 14px; }
  .mka .footer-links { display: flex; gap: 18px; flex-wrap: wrap; }

  .mka .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .mka .reveal.is-visible { opacity: 1; transform: translateY(0); }
  .mka .delay-1 { transition-delay: 0.08s; }
  .mka .delay-2 { transition-delay: 0.16s; }

  @media (max-width: 1040px) {
    .mka .auth-shell { grid-template-columns: 1fr; }
    .mka .auth-story { border-right: 0; border-bottom: 1px solid var(--line); padding-right: 0; padding-bottom: 42px; }
    .mka .auth-panel { padding-left: 0; }
  }
  @media (max-width: 860px) {
    .mka .nav-links { display: none; }
  }
`;
