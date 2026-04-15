"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { loginCSS } from "./login.styles";

type Tab = "login" | "register";

export function LoginClient() {
  const [tab, setTab] = useState<Tab>("login");
  const [loginStatus, setLoginStatus] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");

  useEffect(() => {
    function syncTabFromHash() {
      const hash = window.location.hash;
      setTab(hash === "#register" ? "register" : "login");
    }

    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".mka");
    if (!shell) return;

    // Re-run reveals when tab swaps in new DOM.
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
  }, [tab]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("login-email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("login-password") as HTMLInputElement | null)?.value.trim() || "";
    if (!email || !password) {
      setLoginStatus("Enter your email and password.");
      return;
    }

    const next = new URLSearchParams(window.location.search).get("next") || "/overview";

    setLoginStatus("Signing you in...");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error) {
      const msg = error.message || "Could not sign in.";
      setLoginStatus(`${msg}${typeof error.status === "number" ? ` (HTTP ${error.status})` : ""}`);
      return;
    }

    window.location.assign(next);
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const firstName = (form.elements.namedItem("first-name") as HTMLInputElement).value.trim();
    const lastName = (form.elements.namedItem("last-name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("register-email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("register-password") as HTMLInputElement | null)?.value.trim() || "";
    const confirmPassword = (form.elements.namedItem("register-password-confirm") as HTMLInputElement | null)?.value.trim() || "";
    const teamName = (form.elements.namedItem("team-name") as HTMLInputElement).value.trim();
    const role = (form.elements.namedItem("role") as HTMLSelectElement).value.trim();
    if (!firstName || !lastName || !email || !password || !confirmPassword || !teamName || !role) {
      setRegisterStatus("Fill in the full form to create your account.");
      return;
    }

    if (password.length < 8) {
      setRegisterStatus("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setRegisterStatus("Passwords do not match.");
      return;
    }

    const next = new URLSearchParams(window.location.search).get("next") || "/overview";
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    setRegisterStatus("Creating your account...");
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        emailRedirectTo,
        data: {
          // Will be available on the auth user as metadata; we can use this later for onboarding.
          first_name: firstName,
          last_name: lastName,
          team_name: teamName,
          role,
        },
      },
    });

    if (error) {
      const msg = error.message || "Could not create account.";
      setRegisterStatus(`${msg}${typeof error.status === "number" ? ` (HTTP ${error.status})` : ""}`);
      return;
    }

    if (data.session) {
      window.location.assign(next);
      return;
    }

    setRegisterStatus("Account created. Check your email to confirm, then log in.");
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
            <Link className="button button-ghost" href="/login#login">
              Log In
            </Link>
            <Link className="button button-solid" href="/login#register">
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
                  window.location.hash = "login";
                }}
                type="button"
              >
                Log In
              </button>
              <button
                className={`tab-button${tab === "register" ? " is-active" : ""}`}
                onClick={() => {
                  setTab("register");
                  window.location.hash = "register";
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
                    <input type="password" name="login-password" placeholder="Enter your password" autoComplete="current-password" />
                  </label>
                </div>
                <div className="demo-note">
                  <div className="meta">
                    <div>
                      <strong>Email and password</strong>
                      <p>Sign in with the credentials you registered.</p>
                    </div>
                    <div>
                      <strong>Next step</strong>
                      <p>
                        If you do not have an account yet, use Get Started.
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
                    <span className="field-label">Password</span>
                    <input type="password" name="register-password" placeholder="Create a password" autoComplete="new-password" />
                    <span className="field-help">Minimum 8 characters.</span>
                  </label>
                  <label className="field">
                    <span className="field-label">Confirm password</span>
                    <input type="password" name="register-password-confirm" placeholder="Re-enter your password" autoComplete="new-password" />
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
                    Create account
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
