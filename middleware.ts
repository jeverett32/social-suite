import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";

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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured yet, fall back to allowing navigation.
  // (This keeps local demo UX usable while bootstrapping.)
  if (!url || !anonKey) return NextResponse.next();

  let res = NextResponse.next();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          res.cookies.set(name, value, options);
        }
      },
    },
  });

  // Ensure auth cookies are refreshed, and gate protected routes.
  return supabase.auth.getUser().then(({ data, error }) => {
    if (!error && data.user) return res;

    const redirect = req.nextUrl.clone();
    redirect.pathname = "/login";
    redirect.searchParams.set("next", pathname);
    return NextResponse.redirect(redirect);
  });
}

export const config = {
  // Avoid running on static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
