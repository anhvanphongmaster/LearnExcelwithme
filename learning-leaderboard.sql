-- Learning leaderboard (streak đăng nhập) — chạy 1 lần trên Supabase SQL Editor

create table if not exists public.learning_leaderboard (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  current_streak int not null default 0,
  best_streak int not null default 0,
  total_days int not null default 0,
  xp int not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists learning_leaderboard_streak_idx
  on public.learning_leaderboard (current_streak desc, xp desc);

alter table public.learning_leaderboard enable row level security;

drop policy if exists "llb_select" on public.learning_leaderboard;
create policy "llb_select"
  on public.learning_leaderboard for select
  to anon, authenticated
  using (true);

drop policy if exists "llb_upsert_own" on public.learning_leaderboard;
create policy "llb_upsert_own"
  on public.learning_leaderboard for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Upsert điểm (bỏ qua admin)
create or replace function public.upsert_learning_leaderboard(
  p_display_name text,
  p_current_streak int,
  p_total_days int,
  p_xp int
)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  uid uuid := auth.uid();
  prev_best int;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  -- admin không vào BXH học viên
  if coalesce(public.is_admin_user(), false) then
    return;
  end if;

  select best_streak into prev_best
  from public.learning_leaderboard
  where user_id = uid;

  insert into public.learning_leaderboard as t (
    user_id, display_name, current_streak, best_streak, total_days, xp, updated_at
  ) values (
    uid,
    left(coalesce(nullif(trim(p_display_name), ''), 'Học viên'), 40),
    greatest(coalesce(p_current_streak, 0), 0),
    greatest(coalesce(p_current_streak, 0), 0),
    greatest(coalesce(p_total_days, 0), 0),
    greatest(coalesce(p_xp, 0), 0),
    now()
  )
  on conflict (user_id) do update set
    display_name = excluded.display_name,
    current_streak = excluded.current_streak,
    best_streak = greatest(t.best_streak, excluded.current_streak),
    total_days = greatest(t.total_days, excluded.total_days),
    xp = greatest(t.xp, excluded.xp),
    updated_at = now();
end;
$fn$;

revoke all on function public.upsert_learning_leaderboard(text, int, int, int) from public;
grant execute on function public.upsert_learning_leaderboard(text, int, int, int) to authenticated;

-- List BXH (loại admin nếu lỡ có dòng)
create or replace function public.list_learning_leaderboard()
returns table (
  display_name text,
  current_streak int,
  best_streak int,
  total_days int,
  xp int
)
language sql
security definer
set search_path = public
as $fn$
  -- Admin không được insert (upsert_learning_leaderboard return sớm)
  select
    l.display_name,
    l.current_streak,
    l.best_streak,
    l.total_days,
    l.xp
  from public.learning_leaderboard l
  order by l.current_streak desc, l.xp desc, l.updated_at desc
  limit 15;
$fn$;

revoke all on function public.list_learning_leaderboard() from public;
grant execute on function public.list_learning_leaderboard() to anon, authenticated;
