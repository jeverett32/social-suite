-- Workspaces + memberships.
-- Apply in Supabase SQL Editor (or via CLI) for your project.

create extension if not exists "pgcrypto";

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (workspace_id, user_id),
  constraint workspace_members_role_check check (role in ('owner','member'))
);

create index if not exists workspaces_created_by_idx on public.workspaces (created_by);
create index if not exists workspace_members_user_id_idx on public.workspace_members (user_id);
create index if not exists workspace_members_workspace_id_idx on public.workspace_members (workspace_id);

-- At most one default workspace per user.
create unique index if not exists workspace_members_one_default_per_user_idx
  on public.workspace_members (user_id)
  where is_default;

alter table public.workspaces enable row level security;
alter table public.workspaces force row level security;

alter table public.workspace_members enable row level security;
alter table public.workspace_members force row level security;

-- RLS: users can see workspaces they belong to.
drop policy if exists "workspaces_select_member" on public.workspaces;
create policy "workspaces_select_member" on public.workspaces
  for select
  to authenticated
  using (
    created_by = auth.uid()
    or
    exists (
      select 1
      from public.workspace_members m
      where m.workspace_id = workspaces.id
        and m.user_id = auth.uid()
    )
  );

-- Any authenticated user can create a workspace if they mark themselves as creator.
drop policy if exists "workspaces_insert_creator" on public.workspaces;
create policy "workspaces_insert_creator" on public.workspaces
  for insert
  to authenticated
  with check (created_by = auth.uid());

-- Only the creator can update/delete the workspace (MVP).
drop policy if exists "workspaces_update_creator" on public.workspaces;
create policy "workspaces_update_creator" on public.workspaces
  for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "workspaces_delete_creator" on public.workspaces;
create policy "workspaces_delete_creator" on public.workspaces
  for delete
  to authenticated
  using (created_by = auth.uid());

-- RLS: users can always read their own membership rows.
drop policy if exists "workspace_members_select_self" on public.workspace_members;
create policy "workspace_members_select_self" on public.workspace_members
  for select
  to authenticated
  using (user_id = auth.uid());

-- Bootstrap: user can add themselves as owner to a workspace they created.
-- (Also allows the user to mark that membership as default.)
drop policy if exists "workspace_members_insert_bootstrap" on public.workspace_members;
create policy "workspace_members_insert_bootstrap" on public.workspace_members
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and role = 'owner'
    and exists (
      select 1
      from public.workspaces w
      where w.id = workspace_id
        and w.created_by = auth.uid()
    )
  );

-- Users may update their own membership row, but cannot change role.
drop policy if exists "workspace_members_update_self_owner" on public.workspace_members;
create policy "workspace_members_update_self_owner" on public.workspace_members
  for update
  to authenticated
  using (user_id = auth.uid() and role = 'owner')
  with check (user_id = auth.uid() and role = 'owner');

drop policy if exists "workspace_members_update_self_member" on public.workspace_members;
create policy "workspace_members_update_self_member" on public.workspace_members
  for update
  to authenticated
  using (user_id = auth.uid() and role = 'member')
  with check (user_id = auth.uid() and role = 'member');

-- Keep updated_at fresh.
drop trigger if exists workspaces_set_updated_at on public.workspaces;
create trigger workspaces_set_updated_at
  before update on public.workspaces
  for each row
  execute function public.set_updated_at();

drop trigger if exists workspace_members_set_updated_at on public.workspace_members;
create trigger workspace_members_set_updated_at
  before update on public.workspace_members
  for each row
  execute function public.set_updated_at();
