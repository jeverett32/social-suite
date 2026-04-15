-- Scope existing tables to workspaces.
-- Apply in Supabase SQL Editor (or via CLI) for your project.

alter table public.scheduled_posts
  add column if not exists workspace_id uuid;

alter table public.platform_connections
  add column if not exists workspace_id uuid;

-- Backfill: create a personal workspace per existing user.
with users_to_bootstrap as (
  select user_id
  from public.scheduled_posts
  where user_id is not null

  union

  select user_id
  from public.platform_connections
  where user_id is not null
),
users_without_membership as (
  select u.user_id
  from users_to_bootstrap u
  where not exists (
    select 1
    from public.workspace_members m
    where m.user_id = u.user_id
  )
),
inserted_workspaces as (
  insert into public.workspaces (name, created_by)
  select 'Personal workspace', user_id
  from users_without_membership
  returning id, created_by
)
insert into public.workspace_members (workspace_id, user_id, role, is_default)
select id, created_by, 'owner', true
from inserted_workspaces
on conflict (workspace_id, user_id) do nothing;

-- Choose a deterministic workspace per user (default first).
with user_workspace as (
  select distinct on (user_id)
    user_id,
    workspace_id
  from public.workspace_members
  order by user_id, is_default desc, created_at asc, workspace_id
)
update public.scheduled_posts sp
set workspace_id = uw.workspace_id
from user_workspace uw
where sp.user_id = uw.user_id
  and sp.workspace_id is null;

with user_workspace as (
  select distinct on (user_id)
    user_id,
    workspace_id
  from public.workspace_members
  order by user_id, is_default desc, created_at asc, workspace_id
)
update public.platform_connections pc
set workspace_id = uw.workspace_id
from user_workspace uw
where pc.user_id = uw.user_id
  and pc.workspace_id is null;

alter table public.scheduled_posts
  alter column workspace_id set not null;

alter table public.platform_connections
  alter column workspace_id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'scheduled_posts_workspace_id_fkey'
      and conrelid = 'public.scheduled_posts'::regclass
  ) then
    alter table public.scheduled_posts
      add constraint scheduled_posts_workspace_id_fkey
      foreign key (workspace_id)
      references public.workspaces (id)
      on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'platform_connections_workspace_id_fkey'
      and conrelid = 'public.platform_connections'::regclass
  ) then
    alter table public.platform_connections
      add constraint platform_connections_workspace_id_fkey
      foreign key (workspace_id)
      references public.workspaces (id)
      on delete cascade;
  end if;
end;
$$;

create index if not exists scheduled_posts_workspace_id_idx
  on public.scheduled_posts (workspace_id);

create index if not exists scheduled_posts_workspace_scheduled_at_idx
  on public.scheduled_posts (workspace_id, scheduled_at);

create index if not exists platform_connections_workspace_platform_idx
  on public.platform_connections (workspace_id, platform);

drop index if exists public.platform_connections_user_platform_account_idx;
create unique index if not exists platform_connections_workspace_platform_account_idx
  on public.platform_connections (workspace_id, platform, account_id);

alter table public.scheduled_posts force row level security;
alter table public.platform_connections force row level security;

-- Replace per-user RLS with workspace-membership RLS.
drop policy if exists "scheduled_posts_select_own" on public.scheduled_posts;
drop policy if exists "scheduled_posts_insert_own" on public.scheduled_posts;
drop policy if exists "scheduled_posts_update_own" on public.scheduled_posts;
drop policy if exists "scheduled_posts_delete_own" on public.scheduled_posts;

drop policy if exists "scheduled_posts_select_workspace_member" on public.scheduled_posts;
create policy "scheduled_posts_select_workspace_member" on public.scheduled_posts
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.workspace_members m
      where m.workspace_id = scheduled_posts.workspace_id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists "scheduled_posts_insert_workspace_member" on public.scheduled_posts;
create policy "scheduled_posts_insert_workspace_member" on public.scheduled_posts
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.workspace_members m
      where m.workspace_id = scheduled_posts.workspace_id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists "scheduled_posts_update_workspace_member" on public.scheduled_posts;
create policy "scheduled_posts_update_workspace_member" on public.scheduled_posts
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.workspace_members m
      where m.workspace_id = scheduled_posts.workspace_id
        and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.workspace_members m
      where m.workspace_id = scheduled_posts.workspace_id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists "scheduled_posts_delete_workspace_member" on public.scheduled_posts;
create policy "scheduled_posts_delete_workspace_member" on public.scheduled_posts
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.workspace_members m
      where m.workspace_id = scheduled_posts.workspace_id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists "platform_connections_select_own" on public.platform_connections;
drop policy if exists "platform_connections_insert_own" on public.platform_connections;
drop policy if exists "platform_connections_update_own" on public.platform_connections;
drop policy if exists "platform_connections_delete_own" on public.platform_connections;

drop policy if exists "platform_connections_select_workspace_member" on public.platform_connections;
create policy "platform_connections_select_workspace_member" on public.platform_connections
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.workspace_members m
      where m.workspace_id = platform_connections.workspace_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

-- Team safety: only workspace owners can mutate connections.
drop policy if exists "platform_connections_insert_workspace_owner" on public.platform_connections;
create policy "platform_connections_insert_workspace_owner" on public.platform_connections
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.workspace_members m
      where m.workspace_id = platform_connections.workspace_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

drop policy if exists "platform_connections_update_workspace_owner" on public.platform_connections;
create policy "platform_connections_update_workspace_owner" on public.platform_connections
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.workspace_members m
      where m.workspace_id = platform_connections.workspace_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  )
  with check (
    exists (
      select 1
      from public.workspace_members m
      where m.workspace_id = platform_connections.workspace_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

drop policy if exists "platform_connections_delete_workspace_owner" on public.platform_connections;
create policy "platform_connections_delete_workspace_owner" on public.platform_connections
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.workspace_members m
      where m.workspace_id = platform_connections.workspace_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

-- Defense in depth: prevent reassignment of tenant/creator columns.
revoke update on public.scheduled_posts from authenticated;
grant update (platform_id, content, format, status, scheduled_at, published_at, media_url)
  on public.scheduled_posts
  to authenticated;

revoke update on public.platform_connections from authenticated;
grant update (
  account_name,
  scopes,
  access_token_ciphertext,
  access_token_iv,
  access_token_tag,
  refresh_token_ciphertext,
  refresh_token_iv,
  refresh_token_tag,
  expires_at,
  refresh_expires_at,
  data
)
  on public.platform_connections
  to authenticated;
