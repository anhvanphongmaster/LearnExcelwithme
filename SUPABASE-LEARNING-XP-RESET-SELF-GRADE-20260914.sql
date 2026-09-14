-- RESET XP BXH HỌC TẬP — giữ điểm tự chấm, bỏ điểm quiz/coach cũ
-- Chạy 1 lần trên Supabase SQL Editor (role postgres / owner).
--
-- Công thức giữ lại:
--   mỗi bài tự chấm: floor(điểm / 10), lấy điểm cao nhất của từng lesson_key
--   ví dụ 100 điểm = 10 EXP, 75 điểm = 7 EXP
-- Điểm Học hôm nay (xác nhận + hỏi nhanh) cộng thêm khi học viên mở trang sau reset.

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
    xp = excluded.xp,
    updated_at = now()
  where t.display_name is distinct from excluded.display_name
     or t.current_streak is distinct from excluded.current_streak
     or t.best_streak is distinct from greatest(t.best_streak, excluded.current_streak)
     or t.total_days is distinct from greatest(t.total_days, excluded.total_days)
     or t.xp is distinct from excluded.xp;
end;
$function$;

update public.learning_leaderboard lb
set
  xp = coalesce((
    select coalesce(sum(floor(best.score / 10.0)), 0)::int
    from (
      select r.lesson_key, max(r.score)::numeric as score
      from public.practice_grader_results r
      where r.user_id = lb.user_id
      group by r.lesson_key
    ) best
  ), 0),
  updated_at = now();
