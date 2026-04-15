import { createClient } from "@supabase/supabase-js";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function run() {
  const nowIso = new Date().toISOString();

  const { data: due, error: dueError } = await supabase
    .from("scheduled_posts")
    .select("id")
    .eq("status", "scheduled")
    .lte("scheduled_at", nowIso);

  if (dueError) throw dueError;

  const ids = (due || []).map((r) => r.id).filter(Boolean);
  if (ids.length === 0) {
    console.log("publish-worker: no due posts");
    return;
  }

  const { error: updateError } = await supabase
    .from("scheduled_posts")
    .update({ status: "published", published_at: nowIso })
    .in("id", ids);

  if (updateError) throw updateError;
  console.log(`publish-worker: published ${ids.length} post(s)`);
}

run().catch((e) => {
  console.error("publish-worker: failed", e);
  process.exitCode = 1;
});
