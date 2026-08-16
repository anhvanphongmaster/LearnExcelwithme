-- =========================================================
-- V15 Admin Learning Analytics upgrade
-- Run AFTER analytics-setup.sql and supabase-setup.sql.
-- Safe to run more than once.
-- =========================================================

-- Learning summary from synced user_progress.
create or replace function public.admin_learning_summary()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_result jsonb;
begin
  if not public.is_admin_user() then
    raise exception 'admin access required';
  end if;

  with parsed as (
    select
      up.user_id,
      up.updated_at,
      case
        when coalesce(up.data->>'avp_xp_v2','') ~ '^[0-9]+(\\.[0-9]+)?$'
          then (up.data->>'avp_xp_v2')::numeric
        else 0
      end as xp,
      case
        when coalesce(up.data->>'avp_quiz_done_v1','') like '{%'
          then (up.data->>'avp_quiz_done_v1')::jsonb
        else '{}'::jsonb
      end as quizzes,
      case
        when coalesce(up.data->>'avp_badge_unlock_dates_v9','') like '{%'
          then (up.data->>'avp_badge_unlock_dates_v9')::jsonb
        else '{}'::jsonb
      end as badges,
      case
        when coalesce(up.data->>'avp_visit_days_v1','') like '[%'
          then (up.data->>'avp_visit_days_v1')::jsonb
        else '[]'::jsonb
      end as visit_days
    from public.user_progress up
  ), stats as (
    select
      count(*)::bigint synced_users,
      coalesce(round(avg(xp),1),0) avg_xp,
      coalesce(max(xp),0) max_xp,
      count(*) filter (where xp >= 80)::bigint explorer_plus,
      count(*) filter (where xp >= 180)::bigint analyst_plus,
      count(*) filter (where xp >= 300)::bigint pro_plus,
      count(*) filter (where xp >= 400)::bigint master_plus,
      coalesce(round(avg(jsonb_object_length(quizzes)),1),0) avg_quizzes,
      coalesce(round(avg(jsonb_object_length(badges)),1),0) avg_badges,
      count(*) filter (where updated_at >= now() - interval '7 days')::bigint active_progress_7d
    from parsed
  )
  select jsonb_build_object(
    'synced_users', synced_users,
    'avg_xp', avg_xp,
    'max_xp', max_xp,
    'explorer_plus', explorer_plus,
    'analyst_plus', analyst_plus,
    'pro_plus', pro_plus,
    'master_plus', master_plus,
    'avg_quizzes', avg_quizzes,
    'avg_badges', avg_badges,
    'active_progress_7d', active_progress_7d
  ) into v_result from stats;

  return coalesce(v_result,'{}'::jsonb);
end;
$$;

revoke all on function public.admin_learning_summary() from public;
grant execute on function public.admin_learning_summary() to authenticated;

-- Funnel by Master Learning Path stages.
create or replace function public.admin_learning_funnel()
returns table (
  stage text,
  completed_users bigint,
  total_synced_users bigint,
  completion_pct numeric
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin_user() then
    raise exception 'admin access required';
  end if;

  return query
  with q as (
    select up.user_id,
      case when coalesce(up.data->>'avp_quiz_done_v1','') like '{%'
        then (up.data->>'avp_quiz_done_v1')::jsonb else '{}'::jsonb end quizzes
    from public.user_progress up
  ), flags as (
    select user_id,
      (quizzes ?& array['excel.html','phimtatexcel.html','congthucexcel.html','filtersort.html']) beginner,
      (quizzes ?& array['pivottable.html','bieudopareto.html','baocaoexcel.html']) analyst,
      (quizzes ?& array['excel-nang-cao.html','power-query-course.html','power-pivot-dax.html','dashboard-dong.html']) advanced,
      (quizzes ?& array['vba-macro.html','solver-whatif.html']) master
    from q
  ), totals as (select count(*)::bigint n from flags), rows as (
    select 1 ord,'Beginner'::text stage,count(*) filter(where beginner)::bigint done from flags
    union all select 2,'Analyst',count(*) filter(where analyst)::bigint from flags
    union all select 3,'Advanced',count(*) filter(where advanced)::bigint from flags
    union all select 4,'Master',count(*) filter(where master)::bigint from flags
  )
  select r.stage,r.done,t.n,
    case when t.n=0 then 0 else round(r.done::numeric*100/t.n,1) end
  from rows r cross join totals t
  order by r.ord;
end;
$$;

revoke all on function public.admin_learning_funnel() from public;
grant execute on function public.admin_learning_funnel() to authenticated;

-- Most-completed lessons based on synced quiz state.
create or replace function public.admin_top_completed_lessons(p_limit integer default 10)
returns table (lesson text, completed_users bigint)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_limit integer := greatest(1, least(coalesce(p_limit,10),50));
begin
  if not public.is_admin_user() then raise exception 'admin access required'; end if;

  return query
  with q as (
    select case when coalesce(up.data->>'avp_quiz_done_v1','') like '{%'
      then (up.data->>'avp_quiz_done_v1')::jsonb else '{}'::jsonb end quizzes
    from public.user_progress up
  )
  select e.key::text, count(*)::bigint
  from q cross join lateral jsonb_each(q.quizzes) e
  where e.value = 'true'::jsonb
  group by e.key
  order by count(*) desc, e.key
  limit v_limit;
end;
$$;

revoke all on function public.admin_top_completed_lessons(integer) from public;
grant execute on function public.admin_top_completed_lessons(integer) to authenticated;

-- Quiz difficulty based on tracked quiz_attempt events. Data starts accumulating after V15 is deployed.
create or replace function public.admin_quiz_difficulty(p_days integer default 30, p_limit integer default 10)
returns table (
  lesson text,
  attempts bigint,
  passes bigint,
  pass_rate numeric
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_days integer := greatest(1, least(coalesce(p_days,30),365));
  v_limit integer := greatest(1, least(coalesce(p_limit,10),50));
begin
  if not public.is_admin_user() then raise exception 'admin access required'; end if;

  return query
  select
    coalesce(e.page_path,'(không xác định)')::text lesson,
    count(*)::bigint attempts,
    count(*) filter (
      where coalesce(e.metadata->>'passed','false') in ('true','1')
    )::bigint passes,
    round(
      100.0 * count(*) filter (where coalesce(e.metadata->>'passed','false') in ('true','1'))
      / nullif(count(*),0), 1
    ) pass_rate
  from public.analytics_events e
  where e.event_name='quiz_attempt'
    and e.occurred_at >= now() - make_interval(days => v_days)
  group by coalesce(e.page_path,'(không xác định)')
  order by pass_rate asc nulls first, attempts desc
  limit v_limit;
end;
$$;

revoke all on function public.admin_quiz_difficulty(integer,integer) from public;
grant execute on function public.admin_quiz_difficulty(integer,integer) to authenticated;

-- New-account trend for the selected period.
create or replace function public.admin_new_user_trend(p_days integer default 30)
returns table(day date, new_users bigint)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_days integer := greatest(1, least(coalesce(p_days,30),90));
begin
  if not public.is_admin_user() then raise exception 'admin access required'; end if;
  return query
  with days as (
    select generate_series(current_date-(v_days-1),current_date,interval '1 day')::date d
  )
  select days.d, count(u.id)::bigint
  from days left join auth.users u
    on u.created_at >= days.d and u.created_at < days.d + interval '1 day'
  group by days.d order by days.d;
end;
$$;

revoke all on function public.admin_new_user_trend(integer) from public;
grant execute on function public.admin_new_user_trend(integer) to authenticated;
