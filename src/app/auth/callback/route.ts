import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEMO_PROTECTED_PREFIXES } from "@/lib/demo-constants";

function sanitizeNextPath(raw: string | null): string {
  const fallback = "/overview";
  if (!raw) return fallback;
  const next = raw.trim();
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//")) return fallback;
  if (/\s/.test(next)) return fallback;

  const url = new URL(next, "http://local");
  const ok = DEMO_PROTECTED_PREFIXES.some(
    (p) => url.pathname === p || url.pathname.startsWith(p + "/")
  );
  if (!ok) return fallback;
  return url.pathname + url.search + url.hash;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = sanitizeNextPath(url.searchParams.get("next"));

  if (!code) {
    const redirect = new URL("/login", url.origin);
    redirect.searchParams.set("error", "missing_code");
    return NextResponse.redirect(redirect);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const redirect = new URL("/login", url.origin);
    redirect.searchParams.set("error", "auth_exchange_failed");
    return NextResponse.redirect(redirect);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
