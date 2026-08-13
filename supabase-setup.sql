
-- =========================================================
-- Learn Excel with Anh Van Phong - Supabase setup
-- Run this whole file in Supabase SQL Editor.
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar text default 'initial',
  goal text,
  focus text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile"
on public.profiles for delete
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can view own progress" on public.user_progress;
create policy "Users can view own progress"
on public.user_progress for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own progress" on public.user_progress;
create policy "Users can insert own progress"
on public.user_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own progress" on public.user_progress;
create policy "Users can update own progress"
on public.user_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own progress" on public.user_progress;
create policy "Users can delete own progress"
on public.user_progress for delete
to authenticated
using ((select auth.uid()) = user_id);

-- Automatically create a profile when a new Auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.user_progress (user_id, data)
  values (new.id, '{}'::jsonb)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
