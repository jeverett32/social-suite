import Link from "next/link";
import type { Metadata } from "next";
import { FeaturesEffects } from "@/components/marketing/features-effects";
import { featuresCSS } from "./features.styles";

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
            <Link className="button button-ghost" href="/login#login">Log In</Link>
            <Link className="button button-solid" href="/login#register">Get Started</Link>
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
                <Link className="button button-solid" href="/login#register">Get Started</Link>
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
