-- User retention dashboard and removal of the homepage learning streak board.
-- Apply after deploying the matching website branch.
-- This drops 200 existing learning_leaderboard rows in the current production snapshot.
-- Excel Arena/Race rankings, profile visibility controls, reviews, analytics, and Admin Chat are unchanged.

-- Preserve the current summary snapshot for reference before removing the live table.
-- These fields do not contain date-level activity, so they cannot be used to infer D1/D7/D30.
create table public.learning_leaderboard_legacy_archive_20261004 as
select *, now() as archived_at
from public.learning_leaderboard;
alter table public.learning_leaderboard_legacy_archive_20261004 enable row level security;
revoke all on table public.learning_leaderboard_legacy_archive_20261004 from public, anon, authenticated;
comment on table public.learning_leaderboard_legacy_archive_20261004 is
  'Private snapshot of learning_leaderboard captured before its removal; legacy streak summary cannot determine D1/D7/D30 activity windows.';

drop function if exists public.list_learning_leaderboard();
drop function if exists public.upsert_learning_leaderboard(text, integer, integer, integer);
drop table if exists public.learning_leaderboard;
drop function if exists public.prevent_admin_leaderboard();

create or replace function public.admin_user_retention_summary(p_days integer default 90)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_days integer := greatest(1, least(coalesce(p_days, 90), 365));
  v_tracking_since timestamptz;
  v_result jsonb;
begin
  if not public.is_admin_user() then
    raise exception 'admin access required';
  end if;

  select min(e.occurred_at)
    into v_tracking_since
  from public.analytics_events e
  where e.event_name = 'page_view';

  v_tracking_since := coalesce(v_tracking_since, now());

  with cohort as materialized (
    select
      u.id,
      u.email,
      u.created_at,
      coalesce(
        nullif(btrim(p.display_name), ''),
        nullif(split_part(coalesce(u.email, ''), '@', 1), ''),
        'Học viên'
      ) as display_name
    from auth.users u
    left join public.profiles p on p.id = u.id
    where u.created_at >= greatest(
      now() - make_interval(days => v_days),
      v_tracking_since
    )
      and u.created_at < now()
  ),
  activity as (
    select
      c.id as user_id,
      max(e.occurred_at) as last_activity_at,
      count(distinct e.occurred_at::date)::integer as active_days,
      bool_or(e.occurred_at >= c.created_at + interval '24 hours'
          and e.occurred_at < c.created_at + interval '48 hours') as d1_returned,
      bool_or(e.occurred_at >= c.created_at + interval '7 days'
          and e.occurred_at < c.created_at + interval '8 days') as d7_returned,
      bool_or(e.occurred_at >= c.created_at + interval '30 days'
          and e.occurred_at < c.created_at + interval '31 days') as d30_returned
    from cohort c
    join public.analytics_events e
      on e.user_id = c.id
     and e.event_name = 'page_view'
     and e.occurred_at >= c.created_at
    group by c.id
  ),
  cohort_activity as materialized (
    select
      c.id,
      c.email,
      c.display_name,
      c.created_at,
      a.last_activity_at,
      coalesce(a.active_days, 0) as active_days,
      case when now() >= c.created_at + interval '48 hours'
        then coalesce(a.d1_returned, false) else null end as d1_returned,
      case when now() >= c.created_at + interval '8 days'
        then coalesce(a.d7_returned, false) else null end as d7_returned,
      case when now() >= c.created_at + interval '31 days'
        then coalesce(a.d30_returned, false) else null end as d30_returned
    from cohort c
    left join activity a on a.user_id = c.id
  ),
  metrics as (
    select
      count(*)::integer as registered_users,
      count(*) filter (where created_at + interval '48 hours' <= now())::integer as d1_eligible,
      count(*) filter (where d1_returned is true)::integer as d1_returned,
      count(*) filter (where created_at + interval '8 days' <= now())::integer as d7_eligible,
      count(*) filter (where d7_returned is true)::integer as d7_returned,
      count(*) filter (where created_at + interval '31 days' <= now())::integer as d30_eligible,
      count(*) filter (where d30_returned is true)::integer as d30_returned
    from cohort_activity
  ),
  user_rows as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'email', email,
          'display_name', display_name,
          'created_at', created_at,
          'last_activity_at', last_activity_at,
          'active_days', active_days,
          'd1_returned', d1_returned,
          'd7_returned', d7_returned,
          'd30_returned', d30_returned
        ) order by created_at desc
      ),
      '[]'::jsonb
    ) as rows
    from (
      select *
      from cohort_activity
      order by created_at desc
      limit 100
    ) recent
  )
  select jsonb_build_object(
    'days', v_days,
    'tracking_since', v_tracking_since,
    'registered_users', m.registered_users,
    'd1_eligible', m.d1_eligible,
    'd1_returned', m.d1_returned,
    'd1_rate', round(100.0 * m.d1_returned / nullif(m.d1_eligible, 0), 1),
    'd7_eligible', m.d7_eligible,
    'd7_returned', m.d7_returned,
    'd7_rate', round(100.0 * m.d7_returned / nullif(m.d7_eligible, 0), 1),
    'd30_eligible', m.d30_eligible,
    'd30_returned', m.d30_returned,
    'd30_rate', round(100.0 * m.d30_returned / nullif(m.d30_eligible, 0), 1),
    'users', u.rows
  )
  into v_result
  from metrics m
  cross join user_rows u;

  return v_result;
end;
$function$;

revoke all on function public.admin_user_retention_summary(integer) from public, anon;
grant execute on function public.admin_user_retention_summary(integer) to authenticated;

notify pgrst, 'reload schema';
