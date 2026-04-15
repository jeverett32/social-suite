-- Social platform OAuth connections (access/refresh tokens).
-- Apply in Supabase SQL Editor (or via CLI) for your project.

create extension if not exists "pgcrypto";

create table if not exists public.platform_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text not null,
  account_id text not null,
  account_name text not null default '',
  scopes text[] not null default '{}',
  access_token_ciphertext text,
  access_token_iv text,
  access_token_tag text,
  refresh_token_ciphertext text,
  refresh_token_iv text,
  refresh_token_tag text,
  expires_at timestamptz,
  refresh_expires_at timestamptz,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint platform_connections_platform_check check (platform in ('linkedin','tiktok','instagram','facebook','youtube','x','pinterest'))
);

create unique index if not exists platform_connections_user_platform_account_idx
  on public.platform_connections (user_id, platform, account_id);

create index if not exists platform_connections_user_platform_idx
  on public.platform_connections (user_id, platform);

alter table public.platform_connections enable row level security;

drop policy if exists "platform_connections_select_own" on public.platform_connections;
create policy "platform_connections_select_own" on public.platform_connections
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "platform_connections_insert_own" on public.platform_connections;
create policy "platform_connections_insert_own" on public.platform_connections
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "platform_connections_update_own" on public.platform_connections;
create policy "platform_connections_update_own" on public.platform_connections
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "platform_connections_delete_own" on public.platform_connections;
create policy "platform_connections_delete_own" on public.platform_connections
  for delete
  to authenticated
  using (user_id = auth.uid());

-- Keep updated_at fresh.
drop trigger if exists platform_connections_set_updated_at on public.platform_connections;
create trigger platform_connections_set_updated_at
  before update on public.platform_connections
  for each row
  execute function public.set_updated_at();
