import Link from "next/link";
import type { Metadata } from "next";
import { FeaturesEffects } from "@/components/marketing/features-effects";

export const metadata: Metadata = {
  title: "Krowdr — Features",
  description: "Platform features for the full social marketing workflow.",
};

export default function FeaturesPage() {
  return (
    <div className="mkf">
      <FeaturesEffects />
      <style>{featuresCSS}</style>

      <nav className="site-nav">
        <div className="nav-inner">
          <Link className="brand" href="/"><span className="brand-mark">Krowdr</span></Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link className="is-current" href="/features">Features</Link>
            <a href="#platform">Platform</a>
            <a href="#workflow">How it works</a>
          </div>
          <div className="nav-actions">
            <Link className="button button-ghost" href="/login">Log In</Link>
            <Link className="button button-solid" href="/login">Get Started</Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero page-shell">
          <div className="hero-grid">
            <div>
              <div className="eyebrow">Platform features for the full social marketing workflow.</div>
              <h1 className="hero-title">
                Everything the app can do once your <span className="warm">content operation</span> lives in one <span className="olive">working rhythm.</span>
              </h1>
              <p className="hero-copy">Krowdr is designed to keep campaign planning, writing, approvals, scheduling, reporting, and team coordination close together. This page walks through the platform now, with room to layer in real product screenshots and videos once the app is live.</p>
              <div className="hero-actions">
                <Link className="button button-solid" href="/login">Get Started</Link>
                <Link className="button button-ghost" href="/">Back to landing</Link>
              </div>
            </div>
            <div className="hero-index">
              <div><span>Plan</span><p>Campaign briefs, launch windows, goals, references, approvals, and status tracking.</p></div>
              <div><span>Create</span><p>Caption drafting, repurposing, variations, tone direction, and content iteration.</p></div>
              <div><span>Publish</span><p>Scheduling, review queues, content calendars, and cross-channel timing decisions.</p></div>
              <div><span>Review</span><p>Performance analysis, recap workflows, reporting context, and team accountability.</p></div>
            </div>
          </div>
          <div className="summary-band">
            <div className="summary-grid" id="platform">
              <div className="summary-item"><span className="feature-label">Campaign HQ</span><h3>Keep launches legible</h3><p className="summary-copy">Every campaign gets one source of truth for goals, audience, timing, references, and current status.</p></div>
              <div className="summary-item"><span className="feature-label">Content studio</span><h3>Write with context</h3><p className="summary-copy">Draft captions, platform cuts, and creative directions with the brand voice and brief still in view.</p></div>
              <div className="summary-item"><span className="feature-label">Review flow</span><h3>Approvals stay attached</h3><p className="summary-copy">Comments, signoff, and revisions stay near the work instead of scattering across channels.</p></div>
              <div className="summary-item"><span className="feature-label">Reporting</span><h3>Read the month clearly</h3><p className="summary-copy">Tie performance back to the content choices that drove it so the next cycle starts smarter.</p></div>
            </div>
          </div>
        </section>

        <section className="section page-shell" id="workflow">
          <div className="section-topline reveal">
            <div className="section-label">Walkthrough</div>
            <div className="section-kicker">A feature set built around the real social workflow</div>
          </div>

          <div className="feature-block">
            <div>
              <h2 className="feature-title reveal">Campaign planning that starts with the brief, not with a blank calendar.</h2>
              <p className="feature-copy reveal delay-1">Build campaigns around objectives, launch dates, target channels, references, stakeholders, and status. The goal is not just to track work, but to keep the reason behind the work visible while the month is moving.</p>
              <ul className="feature-list reveal delay-2">
                <li>Create campaign hubs with goals, timing, audience notes, and references.</li>
                <li>Track launch phases, content dependencies, and readiness across multiple workstreams.</li>
                <li>Keep briefs, notes, and creative direction connected to the content being produced.</li>
              </ul>
            </div>
            <div className="placeholder reveal delay-1">
              <div className="placeholder-stage">
                <div>
                  <div className="placeholder-main">
                    <div className="topline"><span>Campaign workspace</span><span>Preview space</span></div>
                    <div className="canvas"><div>Launch brief</div><div>Channel plan</div><div>Approval queue</div></div>
                    <p className="placeholder-note">Future screenshot area for campaign setup, timelines, and launch status.</p>
                  </div>
                  <div className="placeholder-bottom">
                    <div className="topline"><span>Supporting views</span><span>Future app media</span></div>
                    <div className="row"><div>Milestones</div><div>Owners</div><div>Dependencies</div><div>Status</div></div>
                  </div>
                </div>
                <div className="placeholder-side">
                  <div className="topline"><span>Quick panels</span><span>Notes</span></div>
                  <div className="stack"><div>Audience notes</div><div>Reference pulls</div><div>Launch checklist</div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-block">
            <div>
              <h2 className="feature-title reveal">A content studio for drafting, revising, and repurposing without losing the brand voice.</h2>
              <p className="feature-copy reveal delay-1">Write captions, hooks, and social variations in a workspace that keeps the brand language, source material, and platform context visible. The writing process should feel guided, not generic.</p>
              <ul className="feature-list reveal delay-2">
                <li>Draft posts for multiple channels from the same campaign source.</li>
                <li>Create alternate hooks, tonal variations, and cutdowns without losing context.</li>
                <li>Save voice notes, brand reminders, and recurring phrases the team reuses often.</li>
              </ul>
            </div>
            <div className="placeholder reveal delay-1">
              <div className="placeholder-stage">
                <div>
                  <div className="placeholder-main">
                    <div className="topline"><span>Writing canvas</span><span>Preview space</span></div>
                    <div className="canvas"><div>Main caption</div><div>Channel variation</div><div>Short-form cutdown</div></div>
                    <p className="placeholder-note">Future screenshot area for caption drafting, voice controls, and content variations.</p>
                  </div>
                  <div className="placeholder-bottom">
                    <div className="topline"><span>Connected context</span><span>Future app media</span></div>
                    <div className="row"><div>Brand voice</div><div>Asset references</div><div>Notes</div><div>Versions</div></div>
                  </div>
                </div>
                <div className="placeholder-side">
                  <div className="topline"><span>Quick panels</span><span>Notes</span></div>
                  <div className="stack"><div>Saved tone cues</div><div>Repurpose options</div><div>Revision history</div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-block">
            <div>
              <h2 className="feature-title reveal">Approvals, scheduling, and publishing in one visible chain.</h2>
              <p className="feature-copy reveal delay-1">Keep every piece of content moving through review, signoff, and scheduling with fewer handoff gaps. That means a cleaner calendar, clearer ownership, and fewer late-stage surprises.</p>
              <ul className="feature-list reveal delay-2">
                <li>Route content to specific reviewers with clear status changes and notes.</li>
                <li>Schedule by campaign, channel, or content type with a calendar view that stays readable.</li>
                <li>Track what is ready, blocked, approved, published, or waiting on feedback.</li>
              </ul>
            </div>
            <div className="placeholder reveal delay-1">
              <div className="placeholder-stage">
                <div>
                  <div className="placeholder-main">
                    <div className="topline"><span>Publishing calendar</span><span>Preview space</span></div>
                    <div className="canvas"><div>Weekly calendar</div><div>Approval states</div><div>Scheduled posts</div></div>
                    <p className="placeholder-note">Future screenshot area for review queues, scheduled content, and calendar visibility.</p>
                  </div>
                  <div className="placeholder-bottom">
                    <div className="topline"><span>Supporting views</span><span>Future app media</span></div>
                    <div className="row"><div>Queue</div><div>Channel filters</div><div>Assignees</div><div>Publish times</div></div>
                  </div>
                </div>
                <div className="placeholder-side">
                  <div className="topline"><span>Quick panels</span><span>Notes</span></div>
                  <div className="stack"><div>Reviewer notes</div><div>Pending approvals</div><div>Publishing windows</div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-block">
            <div>
              <h2 className="feature-title reveal">Reporting that ties performance back to the creative decisions behind it.</h2>
              <p className="feature-copy reveal delay-1">End the month with more than totals. Track which campaigns hit, which formats stalled, and what the team should repeat or retire based on both results and creative context.</p>
              <ul className="feature-list reveal delay-2">
                <li>Review results by campaign, channel, format, or recurring content series.</li>
                <li>Connect post performance to copy decisions, timing, and creative direction.</li>
                <li>Build recaps that help the next planning cycle instead of just documenting the last one.</li>
              </ul>
            </div>
            <div className="placeholder reveal delay-1">
              <div className="placeholder-stage">
                <div>
                  <div className="placeholder-main">
                    <div className="topline"><span>Reporting workspace</span><span>Preview space</span></div>
                    <div className="canvas"><div>Campaign recap</div><div>Channel view</div><div>Creative notes</div></div>
                    <p className="placeholder-note">Future screenshot area for analytics dashboards, reporting notes, and monthly recaps.</p>
                  </div>
                  <div className="placeholder-bottom">
                    <div className="topline"><span>Supporting views</span><span>Future app media</span></div>
                    <div className="row"><div>Top posts</div><div>Drop-offs</div><div>Recurring wins</div><div>Next steps</div></div>
                  </div>
                </div>
                <div className="placeholder-side">
                  <div className="topline"><span>Quick panels</span><span>Notes</span></div>
                  <div className="stack"><div>Monthly insights</div><div>Format trends</div><div>Follow-up actions</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="quote-band">
          <div className="page-shell">
            <blockquote className="reveal">A product for teams who want the social operation to feel tighter without making the content feel templated.</blockquote>
            <footer className="reveal delay-1">Real interface captures can replace these framed placeholders as soon as the app is ready.</footer>
          </div>
        </section>

        <section className="cta page-shell">
          <div className="cta-grid">
            <div>
              <h2 className="cta-title reveal">Ready to move from the landing page into the actual product flow?</h2>
              <p className="cta-copy reveal delay-1">Use the demo auth page to explore the entry point now, then swap in the real app routes and UI captures as the platform takes shape.</p>
              <div className="cta-actions reveal delay-2">
                <Link className="button button-solid" href="/login">Get Started</Link>
                <Link className="button button-ghost" href="/login">Log In</Link>
              </div>
            </div>
            <div className="cta-rail reveal delay-1">
              <div><strong>Use this page for</strong><span>Explaining the product clearly before the fully built app can speak for itself.</span></div>
              <div><strong>Swap in later</strong><span>Live screenshots, dashboard recordings, workflow clips, and customer-specific feature proof.</span></div>
              <div><strong>Keep</strong><span>The pacing, typography, and section structure once real product media replaces the placeholders.</span></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>Krowdr, 2026</div>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/features">Features</Link>
            <Link href="/login">Log In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const featuresCSS = `
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
