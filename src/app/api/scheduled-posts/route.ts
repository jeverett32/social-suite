import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateDefaultWorkspaceId } from "@/lib/workspace/server";
import type { Post, PostFormat, PostStatus } from "@/types/post";

type ScheduledPostRow = {
  id: string;
  platform_id: string;
  content: string;
  format: string;
  status: string;
  scheduled_at: string | null;
  published_at: string | null;
  media_url: string | null;
};

function isPostStatus(value: unknown): value is PostStatus {
  return value === "draft" || value === "scheduled" || value === "published" || value === "failed";
}

function isPostFormat(value: unknown): value is PostFormat {
  return (
    value === "image" ||
    value === "video" ||
    value === "reel" ||
    value === "carousel" ||
    value === "text" ||
    value === "story"
  );
}

function rowToPost(row: ScheduledPostRow): Post {
  return {
    id: row.id,
    platformId: row.platform_id as Post["platformId"],
    content: row.content,
    format: (isPostFormat(row.format) ? row.format : "text") as PostFormat,
    status: (isPostStatus(row.status) ? row.status : "draft") as PostStatus,
    scheduledAt: row.scheduled_at ?? undefined,
    publishedAt: row.published_at ?? undefined,
    mediaUrl: row.media_url ?? undefined,
  };
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let workspaceId: string;
  try {
    workspaceId = await getOrCreateDefaultWorkspaceId({ supabase, userId: userData.user.id });
  } catch (e) {
    console.error("workspace:init_failed", { route: "scheduled-posts:get", error: e });
    return NextResponse.json({ error: "workspace_unavailable" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("scheduled_posts")
    .select("id, platform_id, content, format, status, scheduled_at, published_at, media_url")
    .eq("workspace_id", workspaceId)
    .order("scheduled_at", { ascending: true, nullsFirst: true });

  if (error) {
    console.error("scheduled-posts:get_failed", error);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  return NextResponse.json({ posts: (data as ScheduledPostRow[]).map(rowToPost) });
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let workspaceId: string;
  try {
    workspaceId = await getOrCreateDefaultWorkspaceId({ supabase, userId: userData.user.id });
  } catch (e) {
    console.error("workspace:init_failed", { route: "scheduled-posts:post", error: e });
    return NextResponse.json({ error: "workspace_unavailable" }, { status: 503 });
  }

  const body = (await req.json().catch(() => null)) as Partial<Post> | null;
  if (!body) {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const platformId = body.platformId;
  const content = typeof body.content === "string" ? body.content : "";
  const status: PostStatus = isPostStatus(body.status) ? body.status : "draft";
  const format: PostFormat = isPostFormat(body.format) ? body.format : "text";
  const scheduledAt = typeof body.scheduledAt === "string" ? body.scheduledAt : null;

  if (!platformId || !content.trim()) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (status === "scheduled" && !scheduledAt) {
    return NextResponse.json({ error: "scheduled_requires_time" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("scheduled_posts")
    .insert({
      user_id: userData.user.id,
      workspace_id: workspaceId,
      platform_id: platformId,
      content,
      status,
      format,
      scheduled_at: scheduledAt,
      media_url: typeof body.mediaUrl === "string" ? body.mediaUrl : null,
    })
    .select("id, platform_id, content, format, status, scheduled_at, published_at, media_url")
    .single();

  if (error) {
    console.error("scheduled-posts:create_failed", error);
    return NextResponse.json({ error: "create_failed" }, { status: 500 });
  }

  return NextResponse.json({ post: rowToPost(data as ScheduledPostRow) }, { status: 201 });
}

export async function PATCH(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let workspaceId: string;
  try {
    workspaceId = await getOrCreateDefaultWorkspaceId({ supabase, userId: userData.user.id });
  } catch (e) {
    console.error("workspace:init_failed", { route: "scheduled-posts:patch", error: e });
    return NextResponse.json({ error: "workspace_unavailable" }, { status: 503 });
  }

  const body = (await req.json().catch(() => null)) as Partial<Post> | null;
  if (!body?.id) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.content === "string") patch.content = body.content;
  if (typeof body.platformId === "string") patch.platform_id = body.platformId;
  if (typeof body.scheduledAt === "string") patch.scheduled_at = body.scheduledAt;
  if (body.scheduledAt === undefined) {
    // no-op
  } else if (body.scheduledAt === null) {
    patch.scheduled_at = null;
  }
  if (typeof body.mediaUrl === "string") patch.media_url = body.mediaUrl;
  if (isPostStatus(body.status)) patch.status = body.status;
  if (isPostFormat(body.format)) patch.format = body.format;

  // Keep the invariant: scheduled posts must have a scheduled_at.
  if (body.status === "scheduled" && body.scheduledAt === undefined) {
    const { data: existing, error: existingError } = await supabase
      .from("scheduled_posts")
      .select("scheduled_at")
      .eq("id", body.id)
      .eq("workspace_id", workspaceId)
      .single();

    if (existingError || !existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (!existing.scheduled_at) {
      return NextResponse.json({ error: "scheduled_requires_time" }, { status: 400 });
    }
  }

  if (body.status === "scheduled" && body.scheduledAt === null) {
    return NextResponse.json({ error: "scheduled_requires_time" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("scheduled_posts")
    .update(patch)
    .eq("id", body.id)
    .eq("workspace_id", workspaceId)
    .select("id, platform_id, content, format, status, scheduled_at, published_at, media_url")
    .single();

  if (error) {
    console.error("scheduled-posts:update_failed", error);
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ post: rowToPost(data as ScheduledPostRow) });
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let workspaceId: string;
  try {
    workspaceId = await getOrCreateDefaultWorkspaceId({ supabase, userId: userData.user.id });
  } catch (e) {
    console.error("workspace:init_failed", { route: "scheduled-posts:delete", error: e });
    return NextResponse.json({ error: "workspace_unavailable" }, { status: 503 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("scheduled_posts")
    .delete()
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .select("id")
    .maybeSingle();
  if (error) {
    console.error("scheduled-posts:delete_failed", error);
    return NextResponse.json({ error: "delete_failed" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
