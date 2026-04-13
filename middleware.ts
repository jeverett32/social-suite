import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { DEMO_SESSION_COOKIE } from "./src/lib/demo-constants";

const PROTECTED_PREFIXES = [
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
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!isProtected) return NextResponse.next();

  const session = req.cookies.get(DEMO_SESSION_COOKIE)?.value;
  if (session) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Avoid running on static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
