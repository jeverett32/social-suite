import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateDefaultWorkspaceId } from "@/lib/workspace/server";

type ConnectionRow = {
  id: string;
  platform: string;
  account_id: string;
  account_name: string;
  expires_at: string | null;
  created_at: string;
};

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
    console.error("workspace:init_failed", { route: "platform-connections:get", error: e });
    return NextResponse.json({ error: "workspace_unavailable" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("platform_connections")
    .select("id, platform, account_id, account_name, expires_at, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("platform-connections:list_failed", error);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  const now = Date.now();
  const connections = ((data || []) as ConnectionRow[]).map((row) => {
    const expiresAt = row.expires_at ? new Date(row.expires_at).getTime() : null;
    const status = expiresAt && expiresAt < now ? "expired" : "connected";
    return {
      id: row.id,
      platformId: row.platform,
      accountId: row.account_id,
      username: row.account_name || row.account_id,
      connectedAt: row.created_at,
      status,
    };
  });

  return NextResponse.json({ connections });
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
    console.error("workspace:init_failed", { route: "platform-connections:delete", error: e });
    return NextResponse.json({ error: "workspace_unavailable" }, { status: 503 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("platform_connections")
    .delete()
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("platform-connections:delete_failed", error);
    return NextResponse.json({ error: "delete_failed" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
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
    console.error("workspace:init_failed", { route: "platform-connections:post", error: e });
    return NextResponse.json({ error: "workspace_unavailable" }, { status: 503 });
  }

  const body = (await req.json().catch(() => null)) as { platformId?: string } | null;
  const platformId = body?.platformId;
  if (!platformId || typeof platformId !== "string") {
    return NextResponse.json({ error: "missing_platform" }, { status: 400 });
  }

  // Stub-mode connect: creates a connection row without real OAuth tokens.
  // Useful for local/demo environments without external app credentials.
  const accountId = `stub_${platformId}`;
  const { error } = await supabase
    .from("platform_connections")
    .upsert(
      {
        user_id: userData.user.id,
        workspace_id: workspaceId,
        platform: platformId,
        account_id: accountId,
        account_name: "Demo Account",
        scopes: [],
        data: { kind: "stub" },
      },
      { onConflict: "workspace_id,platform,account_id", ignoreDuplicates: true }
    );

  if (error) {
    console.error("platform-connections:stub_connect_failed", error);
    return NextResponse.json({ error: "connect_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
