import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Stub publisher: marks due scheduled posts as published.
  // Real platform publishing will be handled by a worker using platform_connections.
  const now = new Date();
  const nowIso = now.toISOString();

  const { data: due, error: dueError } = await supabase
    .from("scheduled_posts")
    .select("id")
    .eq("user_id", userData.user.id)
    .eq("status", "scheduled")
    .lte("scheduled_at", nowIso);

  if (dueError) {
    console.error("publish:due_query_failed", dueError);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  const ids = (due || []).map((r) => (r as { id: string }).id).filter(Boolean);
  if (ids.length === 0) {
    return NextResponse.json({ ok: true, published: 0 });
  }

  const { error: updateError } = await supabase
    .from("scheduled_posts")
    .update({ status: "published", published_at: nowIso })
    .in("id", ids)
    .eq("user_id", userData.user.id);

  if (updateError) {
    console.error("publish:update_failed", updateError);
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, published: ids.length });
}
