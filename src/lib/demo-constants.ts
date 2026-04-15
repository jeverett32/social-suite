export const DEMO_SESSION_COOKIE = "krowdr_demo_session";
export const DEMO_TIMEZONE_COOKIE = "krowdr_demo_timezone";

// Dashboard routes that require the demo session cookie.
export const DEMO_PROTECTED_PREFIXES = [
  "/overview",
  "/learn",
  "/plan",
  "/predict",
  "/draft",
  "/inbox",
  "/schedule",
  "/listen",
  "/voice",
  "/settings",
] as const;
