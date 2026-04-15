type WorkspaceMemberRow = {
  workspace_id: string;
  role: "owner" | "member";
  is_default: boolean;
  created_at: string;
};

export async function getOrCreateDefaultWorkspaceId({
  supabase,
  userId,
}: {
  supabase: { from: (table: string) => any };
  userId: string;
}): Promise<string> {
  const { data: existingDefault, error: defaultErr } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, is_default, created_at")
    .eq("user_id", userId)
    .eq("is_default", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (defaultErr) {
    throw new Error("workspace_lookup_failed");
  }

  if (existingDefault?.workspace_id) {
    return (existingDefault as WorkspaceMemberRow).workspace_id;
  }

  const { data: anyMembership, error: anyErr } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, is_default, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (anyErr) {
    throw new Error("workspace_lookup_failed");
  }

  if (anyMembership?.workspace_id) {
    // Ensure we have a default workspace set for stability.
    const { error: setDefaultError } = await supabase
      .from("workspace_members")
      .update({ is_default: true })
      .eq("workspace_id", (anyMembership as WorkspaceMemberRow).workspace_id)
      .eq("user_id", userId);

    if (setDefaultError) {
      const { data: rechecked } = await supabase
        .from("workspace_members")
        .select("workspace_id, role, is_default, created_at")
        .eq("user_id", userId)
        .eq("is_default", true)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (rechecked?.workspace_id) {
        return (rechecked as WorkspaceMemberRow).workspace_id;
      }
    }

    return (anyMembership as WorkspaceMemberRow).workspace_id;
  }

  // No memberships yet. If a previous bootstrap created a workspace, re-use it.
  const { data: existingWorkspace, error: existingWsError } = await supabase
    .from("workspaces")
    .select("id")
    .eq("created_by", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingWsError) {
    throw new Error("workspace_lookup_failed");
  }

  if (existingWorkspace?.id) {
    const { error: insertMemberError } = await supabase.from("workspace_members").insert({
      workspace_id: existingWorkspace.id as string,
      user_id: userId,
      role: "owner",
      is_default: true,
    });

    if (!insertMemberError) {
      return existingWorkspace.id as string;
    }

    // Another request already set a default; return it.
    if (insertMemberError.code === "23505") {
      const { data: rechecked } = await supabase
        .from("workspace_members")
        .select("workspace_id, role, is_default, created_at")
        .eq("user_id", userId)
        .eq("is_default", true)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (rechecked?.workspace_id) {
        return (rechecked as WorkspaceMemberRow).workspace_id;
      }
    }
  }

  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .insert({ name: "Personal workspace", created_by: userId })
    .select("id")
    .single();

  if (wsError || !workspace?.id) {
    throw new Error("workspace_create_failed");
  }

  const workspaceId = workspace.id as string;
  const { error: memberError } = await supabase.from("workspace_members").insert({
    workspace_id: workspaceId,
    user_id: userId,
    role: "owner",
    is_default: true,
  });

  if (memberError) {
    if (memberError.code === "23505") {
      const { data: rechecked } = await supabase
        .from("workspace_members")
        .select("workspace_id, role, is_default, created_at")
        .eq("user_id", userId)
        .eq("is_default", true)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (rechecked?.workspace_id) {
        // Best-effort cleanup of the extra workspace.
        await supabase.from("workspaces").delete().eq("id", workspaceId);
        return (rechecked as WorkspaceMemberRow).workspace_id;
      }
    }

    throw new Error("workspace_bootstrap_failed");
  }

  return workspaceId;
}
