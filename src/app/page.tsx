import Link from "next/link";
import type { Metadata } from "next";
import { LandingEffects } from "@/components/marketing/landing-effects";

export const metadata: Metadata = {
  title: "Krowdr — Social Media Marketing Platform",
  description: "Build a sharper social rhythm. Plan, predict, draft, and publish with ML-backed insights.",
};

export default function LandingPage() {
  return (
    <div className="mk">
      <LandingEffects />
      <style>{landingCSS}</style>

      <nav className="site-nav">
        <div className="nav-inner">
          <Link className="brand" href="/"><span className="brand-mark">Krowdr</span></Link>
          <div className="nav-links">
            <Link href="/features">Features</Link>
            <a href="#why">Why marketers switch</a>
            <a href="#mk-workflow">Workflow</a>
            <a href="#teams">Who it is for</a>
          </div>
          <div className="nav-actions">
            <Link className="button button-ghost" href="/login">Log In</Link>
            <Link className="button button-solid" href="/login">Get Started</Link>
          </div>
        </div>
      </nav>

        <main id="top">
          <section className="hero-stage">
            <video
              className="hero-video"
              src="/second.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
            <div className="hero-overlay page-shell">
              <div className="hero-stack">
              <div className="hero-copy">
                <div className="eyebrow hero-animate">For social media marketers who need the work to feel considered before it goes live.</div>
                <h1 className="hero-title hero-animate delay-1">
                  Build a sharper <span className="warm">social rhythm</span> without sanding off the <span className="olive">taste.</span>
                </h1>
                <p className="hero-sub hero-animate delay-2">
                  Krowdr keeps campaign planning, copy, approvals, scheduling, and reporting in one working rhythm for brand teams, agencies, and content leads.
                </p>
                <div className="hero-actions hero-animate delay-3">
                  <Link className="button button-solid" href="/login">Get Started</Link>
                  <Link className="button button-ghost" href="/features">Explore features</Link>
                </div>
              </div>
              <div className="hero-side hero-animate delay-2">
                <div><strong>Campaign direction</strong>Give every launch a clearer throughline from brief to publish.</div>
                <div><strong>Approval flow</strong>Keep comments, revisions, and signoff closer to the work.</div>
              </div>
            </div>
          </div>
        </section>

        <div className="hero-footer">
          <div className="page-shell hero-summary reveal">
            <div className="summary-item"><span>Plan</span><p>Shape campaigns with voice notes, launch context, references, and timing in one place.</p></div>
            <div className="summary-item"><span>Write</span><p>Develop captions, hooks, and cutdowns without losing the brand language along the way.</p></div>
            <div className="summary-item"><span>Approve</span><p>Move edits and signoff through a clearer chain before the deadline starts compressing.</p></div>
            <div className="summary-item"><span>Review</span><p>See what landed, what drifted, and what deserves another round with actual context.</p></div>
          </div>
        </div>

        <section className="section page-shell" id="why">
          <div className="section-topline reveal">
            <div className="section-label">Why marketers switch</div>
            <div className="section-kicker">A clearer throughline from brief to results</div>
          </div>
          <div className="story-grid">
            <h2 className="section-title reveal">The stack finally feels like one conversation instead of six separate tabs.</h2>
            <p className="section-copy reveal delay-1">Krowdr is for teams that hate choosing between craft and efficiency. It keeps the creative brief, production rhythm, approval chain, and reporting close enough together that the month feels organized without looking generic on the way out.</p>
          </div>
          <div className="line-list">
            <div className="line-row reveal">
              <span>01</span>
              <div><h3>Brand voice stays recognizable</h3><p>Keep naming, tone, references, and campaign intent close to the content while the calendar fills up.</p></div>
              <p>Useful when multiple marketers, freelancers, and clients are shaping the same campaign window.</p>
            </div>
            <div className="line-row reveal delay-1">
              <span>02</span>
              <div><h3>Approvals stop drifting across threads</h3><p>Feedback lands where the captions and assets already live, so revisions stay legible and final language does not need to be reconstructed.</p></div>
              <p>Cleaner for brand leads, faster for the people handling production every day.</p>
            </div>
            <div className="line-row reveal delay-2">
              <span>03</span>
              <div><h3>Reporting comes back with context</h3><p>Review what moved, what stalled, and which creative decisions deserve another round instead of getting flattened into a slide.</p></div>
              <p>Built for monthly recaps, client reviews, and planning meetings that need more than surface-level totals.</p>
            </div>
          </div>
        </section>

        <section className="section page-shell" id="mk-workflow">
          <div className="section-topline reveal">
            <div className="section-label">Workflow</div>
            <div className="section-kicker">Brief, write, approve, publish, review</div>
          </div>
          <div className="workflow-grid">
            <aside className="studio-rail reveal">
              <div className="studio-frame" aria-hidden="true">
                <video
                  className="studio-video"
                  src="/first.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              </div>
              <div className="studio-note">
                <p>The day-to-day pace stays visible even when the calendar gets crowded.</p>
                <p>Enough structure to keep the work moving. Enough room to keep it feeling authored.</p>
              </div>
            </aside>
            <div>
              <h2 className="section-title reveal">A calmer production loop for the people actually shipping the posts.</h2>
              <p className="workflow-copy reveal delay-1">The best social teams move quickly without looking rushed. Krowdr keeps planning, writing, approvals, scheduling, and analysis connected, so less energy gets spent re-explaining decisions and more energy stays in the work itself.</p>
              <div className="workflow-list">
                <div className="workflow-step reveal"><span>Step 1</span><div><h3>Shape the campaign before the calendar fills up</h3><p>Pull references, launch dates, audience notes, and the core message into one campaign thread before production starts branching.</p></div></div>
                <div className="workflow-step reveal delay-1"><span>Step 2</span><div><h3>Write with the brand language still in view</h3><p>Develop captions, hooks, edits, and platform variations with the voice, visual direction, and recent performance still close to hand.</p></div></div>
                <div className="workflow-step reveal delay-2"><span>Step 3</span><div><h3>Route approvals without the scavenger hunt</h3><p>Keep comments, revisions, and signoff in the workflow so nobody is piecing together final copy from several different places.</p></div></div>
                <div className="workflow-step reveal delay-3"><span>Step 4</span><div><h3>Review what deserves another round</h3><p>Use performance and creative context together to decide which ideas should keep stretching and which ones should be retired.</p></div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="quote-band">
          <div className="page-shell">
            <blockquote className="reveal">For teams who need the social calendar to move faster without coming out flatter.</blockquote>
            <footer className="reveal delay-1">Built for brand marketers, content leads, agency teams, and founders carrying a real publishing rhythm.</footer>
          </div>
        </section>

        <section className="section page-shell" id="teams">
          <div className="section-topline reveal">
            <div className="section-label">Who it is for</div>
            <div className="section-kicker">Different teams, same pressure</div>
          </div>
          <div className="teams-grid">
            <h2 className="section-title reveal">Useful for the people balancing taste, speed, and accountability every week.</h2>
            <div className="teams-list">
              <article className="reveal"><h3>In-house brand teams</h3><p>Keep launches, recurring series, approvals, and reporting inside one rhythm without losing the tone of the brand.</p></article>
              <article className="reveal delay-1"><h3>Agencies and studios</h3><p>Move across multiple clients with cleaner briefs, clearer approvals, and less repeated context-switching.</p></article>
              <article className="reveal delay-2"><h3>Lean marketing leads</h3><p>Run the full calendar with enough structure to stay on schedule and enough flexibility to keep the work interesting.</p></article>
            </div>
          </div>
        </section>

        <section className="page-shell" id="contact">
          <div className="cta-grid">
            <div>
              <div className="section-label reveal">Start here</div>
              <h2 className="cta-title reveal delay-1">Bring the next month of social into one place and keep the work feeling like yours.</h2>
              <p className="cta-copy reveal delay-2">Use Krowdr to organize the campaign, tighten the handoff, and give the team a stronger place to make decisions than scattered docs, feedback threads, and end-of-month guesswork.</p>
              <div className="cta-actions reveal delay-3">
                <Link className="button button-solid" href="/login">Get Started</Link>
                <Link className="button button-ghost" href="/login">Log In</Link>
              </div>
            </div>
            <div className="cta-rail reveal delay-2">
              <div><strong>For</strong><span>Social strategists, content directors, creative marketers, brand leads, founders</span></div>
              <div><strong>Best fit</strong><span>Teams managing multiple campaigns, recurring publishing, or approval-heavy content calendars</span></div>
              <div><strong>Start with</strong><span>Your next launch, monthly cycle, client account, or editorial reset</span></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>Krowdr, 2026</div>
          <div className="footer-links">
            <Link href="/features">Features</Link>
            <a href="#why">Why marketers switch</a>
            <a href="#mk-workflow">Workflow</a>
            <a href="#teams">Who it is for</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const landingCSS = `
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
