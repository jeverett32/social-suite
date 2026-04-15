"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setDemoSessionCookie } from "@/lib/demo-session";
import { DEMO_PROTECTED_PREFIXES } from "@/lib/demo-constants";
import { loginCSS } from "./login.styles";

type Tab = "login" | "register";

function titleCase(value: string) {
  return value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");
}

function sanitizeNextPath(raw: string | null): string {
  if (!raw) return "/overview";
  const next = raw.trim();
  if (!next) return "/overview";

  // Only allow in-app absolute paths (not scheme-relative //example.com).
  if (!next.startsWith("/")) return "/overview";
  if (next.startsWith("//")) return "/overview";
  if (/\s/.test(next)) return "/overview";

  const url = new URL(next, window.location.origin);
  if (url.origin !== window.location.origin) return "/overview";

  const ok = DEMO_PROTECTED_PREFIXES.some(
    (p) => url.pathname === p || url.pathname.startsWith(p + "/")
  );
  if (!ok) return "/overview";

  return url.pathname + url.search + url.hash;
}

export function LoginClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [loginStatus, setLoginStatus] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#register") setTab("register");

    const shell = document.querySelector<HTMLElement>(".mka");
    if (!shell) return;

    const reveals = shell.querySelectorAll<Element>(".reveal");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
    );

    reveals.forEach((el) => obs.observe(el));
    reveals.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
        (el as HTMLElement).classList.add("is-visible");
      }
    });

    return () => obs.disconnect();
  }, []);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("login-email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("login-password") as HTMLInputElement).value.trim();
    if (!email || !password) {
      setLoginStatus("Enter an email and password to open the demo workspace.");
      return;
    }

    const isDemo = email.toLowerCase() === "demo@krowdr.com" && password === "krowdr-demo";
    const localPart = email.split("@")[0] || "demo";
    const fullName = isDemo ? "Jordan Lee" : titleCase(localPart);

    setDemoSessionCookie({
      firstName: fullName.split(" ")[0] || "Demo",
      fullName,
      email,
      teamName: "Krowdr Demo Workspace",
      role: "Social strategist",
      mode: "login",
      lastLoginAt: new Date().toISOString(),
    });

    const next = sanitizeNextPath(new URLSearchParams(window.location.search).get("next"));

    setLoginStatus("Opening the demo dashboard...");
    setTimeout(() => router.push(next), 280);
  }

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const firstName = (form.elements.namedItem("first-name") as HTMLInputElement).value.trim();
    const lastName = (form.elements.namedItem("last-name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("register-email") as HTMLInputElement).value.trim();
    const teamName = (form.elements.namedItem("team-name") as HTMLInputElement).value.trim();
    const role = (form.elements.namedItem("role") as HTMLSelectElement).value.trim();
    if (!firstName || !lastName || !email || !teamName || !role) {
      setRegisterStatus("Fill in the full form to create the demo workspace.");
      return;
    }

    setDemoSessionCookie({
      firstName,
      fullName: firstName + " " + lastName,
      email,
      teamName,
      role,
      mode: "register",
      lastLoginAt: new Date().toISOString(),
    });

    const next = sanitizeNextPath(new URLSearchParams(window.location.search).get("next"));

    setRegisterStatus("Building your demo workspace...");
    setTimeout(() => router.push(next), 280);
  }

  return (
    <div className="mka">
      <style>{loginCSS}</style>

      <nav className="site-nav">
        <div className="nav-inner">
          <Link className="brand" href="/">
            <span className="brand-mark">Krowdr</span>
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/features">Features</Link>
            <Link className="is-current" href="/login">
              Access
            </Link>
          </div>
          <div className="nav-actions">
            <Link className="button button-ghost" href="/features">
              Features
            </Link>
            <Link className="button button-solid" href="/login">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="page-shell">
        <section className="auth-shell">
          <div className="auth-story">
            <div>
              <div className="eyebrow reveal">Demo access for the product flow.</div>
              <h1 className="auth-title reveal delay-1">
                Log in if you already have a workspace, or{" "}
                <span className="warm">get started</span> with a fresh{" "}
                <span className="olive">demo setup.</span>
              </h1>
              <p className="auth-copy reveal delay-2">
                This page is the entry point for the app experience. It gives Krowdr a real
                product path now, with room to connect the forms to live authentication once
                the platform is built.
              </p>
            </div>
            <div className="story-media reveal delay-1" />
            <div className="story-notes reveal delay-2">
              <div>
                <span>Log In</span>
                <p>Return to an existing team workspace and pick up the campaign rhythm where you left it.</p>
              </div>
              <div>
                <span>Register</span>
                <p>Create a demo team, set your role, and move into the app shell once the dashboard is ready.</p>
              </div>
              <div>
                <span>Later</span>
                <p>Wire these forms into real authentication, invite flows, and the first-run onboarding sequence.</p>
              </div>
            </div>
          </div>

          <div className="auth-panel">
            <div className="auth-meta reveal">
              <div>
                <strong className="demo-badge">Demo access</strong>
                <p>
                  Choose the tab that matches the next step. The forms are ready as the visual entry
                  point for the product and can connect to real auth later.
                </p>
              </div>
            </div>

            <div className="tab-bar reveal delay-1">
              <button
                className={`tab-button${tab === "login" ? " is-active" : ""}`}
                onClick={() => {
                  setTab("login");
                  history.replaceState(null, "", "#login");
                }}
                type="button"
              >
                Log In
              </button>
              <button
                className={`tab-button${tab === "register" ? " is-active" : ""}`}
                onClick={() => {
                  setTab("register");
                  history.replaceState(null, "", "#register");
                }}
                type="button"
              >
                Get Started
              </button>
            </div>

            {tab === "login" && (
              <form className="auth-form is-active reveal delay-1" onSubmit={handleLogin} noValidate>
                <div className="form-grid">
                  <label className="field">
                    <span className="field-label">Work email</span>
                    <input type="email" name="login-email" placeholder="you@company.com" />
                  </label>
                  <label className="field">
                    <span className="field-label">Password</span>
                    <input type="password" name="login-password" placeholder="Enter your password" />
                  </label>
                </div>
                <div className="demo-note">
                  <div className="meta">
                    <div>
                      <strong>Demo credentials</strong>
                      <p>Email: demo@krowdr.com</p>
                      <p>Password: krowdr-demo</p>
                    </div>
                    <div>
                      <strong>Next step</strong>
                      <p>
                        Use these credentials or any work email to enter the demo dashboard and explore
                        the frontend shell.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="form-actions">
                  <button className="button button-solid" type="submit">
                    Log In
                  </button>
                  <Link className="button button-ghost" href="/features">
                    Review features first
                  </Link>
                </div>
                {loginStatus && <p className="status-note">{loginStatus}</p>}
              </form>
            )}

            {tab === "register" && (
              <form className="auth-form is-active reveal delay-2" onSubmit={handleRegister} noValidate>
                <div className="form-grid two-col">
                  <label className="field">
                    <span className="field-label">First name</span>
                    <input type="text" name="first-name" placeholder="Jordan" />
                  </label>
                  <label className="field">
                    <span className="field-label">Last name</span>
                    <input type="text" name="last-name" placeholder="Lee" />
                  </label>
                </div>
                <div className="form-grid">
                  <label className="field">
                    <span className="field-label">Work email</span>
                    <input type="email" name="register-email" placeholder="you@company.com" />
                  </label>
                  <label className="field">
                    <span className="field-label">Team name</span>
                    <input type="text" name="team-name" placeholder="North Studio Social" />
                  </label>
                  <label className="field">
                    <span className="field-label">Your role</span>
                    <select name="role">
                      <option value="">Select a role</option>
                      <option>Social strategist</option>
                      <option>Content director</option>
                      <option>Creative marketer</option>
                      <option>Founder</option>
                      <option>Agency lead</option>
                    </select>
                    <span className="field-help">This can later seed your onboarding and default workspace setup.</span>
                  </label>
                </div>
                <div className="form-actions">
                  <button className="button button-solid" type="submit">
                    Create demo workspace
                  </button>
                  <Link className="button button-ghost" href="/">
                    Back to landing
                  </Link>
                </div>
                {registerStatus && <p className="status-note">{registerStatus}</p>}
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>Krowdr, 2026</div>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/features">Features</Link>
            <Link href="/login">Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
