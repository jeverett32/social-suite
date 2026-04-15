import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/overview";

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

  // Only allow internal redirects.
  const safeNext = next.startsWith("/") ? next : "/overview";
  return NextResponse.redirect(new URL(safeNext, url.origin));
}
