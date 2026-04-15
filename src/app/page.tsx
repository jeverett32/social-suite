import Link from "next/link";
import type { Metadata } from "next";
import { LandingEffects } from "@/components/marketing/landing-effects";
import { landingCSS } from "./landing.styles";

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
            <Link className="button button-ghost" href="/login#login">Log In</Link>
            <Link className="button button-solid" href="/login#register">Get Started</Link>
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
                  <Link className="button button-solid" href="/login#register">Get Started</Link>
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
