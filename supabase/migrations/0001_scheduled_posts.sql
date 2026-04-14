-- Scheduled posts for the Schedule page.
-- Apply in Supabase SQL Editor (or via CLI) for your project.

create extension if not exists "pgcrypto";

create table if not exists public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  platform_id text not null,
  content text not null,
  format text not null default 'text',
  status text not null default 'draft',
  scheduled_at timestamptz,
  published_at timestamptz,
  media_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists scheduled_posts_user_id_idx on public.scheduled_posts (user_id);
create index if not exists scheduled_posts_scheduled_at_idx on public.scheduled_posts (scheduled_at);

alter table public.scheduled_posts enable row level security;

-- RLS: users can only see and mutate their own rows.
drop policy if exists "scheduled_posts_select_own" on public.scheduled_posts;
create policy "scheduled_posts_select_own" on public.scheduled_posts
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "scheduled_posts_insert_own" on public.scheduled_posts;
create policy "scheduled_posts_insert_own" on public.scheduled_posts
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "scheduled_posts_update_own" on public.scheduled_posts;
create policy "scheduled_posts_update_own" on public.scheduled_posts
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "scheduled_posts_delete_own" on public.scheduled_posts;
create policy "scheduled_posts_delete_own" on public.scheduled_posts
  for delete
  to authenticated
  using (user_id = auth.uid());

-- Keep updated_at fresh.
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists scheduled_posts_set_updated_at on public.scheduled_posts;
create trigger scheduled_posts_set_updated_at
  before update on public.scheduled_posts
  for each row
  execute function public.set_updated_at();
