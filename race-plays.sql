-- Chạy 1 lần trong Supabase SQL Editor
create table if not exists public.race_plays (
  id bigserial primary key,
  created_at timestamptz default now(),
  event text default 'start',
  level int default 1,
  streak int default 0,
  best_streak int default 0,
  mode text default '2.5d'
);

alter table public.race_plays enable row level security;

-- Cho phép ghi từ web (anon)
drop policy if exists "race_plays_insert_anon" on public.race_plays;
create policy "race_plays_insert_anon" on public.race_plays
  for insert to anon, authenticated
  with check (true);

-- Admin đọc (authenticated) — siết theo email nếu cần
drop policy if exists "race_plays_select_auth" on public.race_plays;
create policy "race_plays_select_auth" on public.race_plays
  for select to authenticated
  using (true);
