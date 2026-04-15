import { DEMO_SESSION_COOKIE, DEMO_TIMEZONE_COOKIE } from "@/lib/demo-constants";

export const WORKSPACE_TIMEZONE_CHANGED_EVENT = "krowdr:timezone-changed";

export type DemoSession = {
  firstName: string;
  fullName: string;
  email: string;
  teamName: string;
  role: string;
  mode: "login" | "register";
  lastLoginAt: string;
};

function base64UrlEncode(input: string) {
  // btoa expects latin1; TextEncoder gives us bytes we can base64 safely.
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(input: string) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  // Lax is enough for demo auth; httpOnly would require server-side set.
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split(/;\s*/);
  for (const part of parts) {
    if (!part) continue;
    const idx = part.indexOf("=");
    const k = idx === -1 ? part : part.slice(0, idx);
    if (k === name) return idx === -1 ? "" : part.slice(idx + 1);
  }
  return null;
}

export function setDemoSessionCookie(session: DemoSession) {
  const value = base64UrlEncode(JSON.stringify(session));
  setCookie(DEMO_SESSION_COOKIE, value, 60 * 60 * 24 * 14);
}

export function clearDemoSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${DEMO_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getDemoSessionClient(): DemoSession | null {
  const raw = getCookie(DEMO_SESSION_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(base64UrlDecode(raw)) as DemoSession;
  } catch {
    return null;
  }
}

export function setWorkspaceTimezoneClient(tz: string) {
  setCookie(DEMO_TIMEZONE_COOKIE, encodeURIComponent(tz), 60 * 60 * 24 * 365);

  // Let client layouts/widgets react without requiring a full reload.
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new CustomEvent(WORKSPACE_TIMEZONE_CHANGED_EVENT, { detail: tz }));
    } catch {
      window.dispatchEvent(new Event(WORKSPACE_TIMEZONE_CHANGED_EVENT));
    }
  }
}

export function getWorkspaceTimezoneClient(): string {
  const raw = getCookie(DEMO_TIMEZONE_COOKIE);
  if (raw) return decodeURIComponent(raw);
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
