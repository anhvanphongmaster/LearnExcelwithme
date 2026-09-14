-- LEARNING LEADERBOARD NO-OP WRITE GUARD — 2026-09-14
-- Do not refresh updated_at or create a physical UPDATE when the effective
-- leaderboard values did not change. This reduces WAL and makes updated_at a
-- meaningful tie-break for actual progress changes rather than page opens.

create or replace function public.upsert_learning_leaderboard(
  p_display_name text,
  p_current_streak integer,
  p_total_days integer,
  p_xp integer
)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  uid uuid := auth.uid();
  v_hidden boolean := false;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  select
    coalesce(p.is_admin,false)
    or coalesce(p.exclude_from_leaderboard,false)
  into v_hidden
  from public.profiles p
  where p.id = uid;

  if coalesce(v_hidden,false) then
    delete from public.learning_leaderboard
    where user_id = uid;
    return;
  end if;

  insert into public.learning_leaderboard as t(
    user_id,
    display_name,
    current_streak,
    best_streak,
    total_days,
    xp,
    updated_at
  )
  values(
    uid,
    left(coalesce(nullif(trim(p_display_name),''),'Học viên'),40),
    greatest(coalesce(p_current_streak,0),0),
    greatest(coalesce(p_current_streak,0),0),
    greatest(coalesce(p_total_days,0),0),
    greatest(coalesce(p_xp,0),0),
    now()
  )
  on conflict(user_id) do update
  set
    display_name = excluded.display_name,
    current_streak = excluded.current_streak,
    best_streak = greatest(t.best_streak, excluded.current_streak),
    total_days = greatest(t.total_days, excluded.total_days),
    xp = greatest(t.xp, excluded.xp),
    updated_at = now()
  where t.display_name is distinct from excluded.display_name
     or t.current_streak is distinct from excluded.current_streak
     or t.best_streak is distinct from greatest(t.best_streak, excluded.current_streak)
     or t.total_days is distinct from greatest(t.total_days, excluded.total_days)
     or t.xp is distinct from greatest(t.xp, excluded.xp);
end;
$function$;
