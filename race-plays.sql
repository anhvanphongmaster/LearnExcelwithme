-- Chạy trong Supabase SQL Editor (copy hết)
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

drop policy if exists "race_plays_insert_anon" on public.race_plays;
drop policy if exists "race_plays_select_auth" on public.race_plays;
drop policy if exists "race_plays_select_anon" on public.race_plays;
drop policy if exists "race_plays_insert_all" on public.race_plays;
drop policy if exists "race_plays_select_all" on public.race_plays;

-- Ai cũng ghi + đọc được số liệu (chỉ là đếm minigame, không nhạy cảm)
create policy "race_plays_insert_all" on public.race_plays
  for insert to anon, authenticated with check (true);

create policy "race_plays_select_all" on public.race_plays
  for select to anon, authenticated using (true);

grant usage on schema public to anon, authenticated;
grant insert, select on public.race_plays to anon, authenticated;
grant usage, select on sequence public.race_plays_id_seq to anon, authenticated;
