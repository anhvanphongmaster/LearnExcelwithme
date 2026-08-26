-- BXH học tập trả Top 30
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
  select l.display_name, l.current_streak, l.best_streak, l.total_days, l.xp
  from public.learning_leaderboard l
  order by l.current_streak desc, l.xp desc, l.updated_at desc
  limit 30;
$fn$;
grant execute on function public.list_learning_leaderboard() to anon, authenticated;
