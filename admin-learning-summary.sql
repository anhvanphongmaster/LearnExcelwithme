-- Admin learning KPIs from user_progress.data (jsonb)
-- Chạy trong Supabase SQL Editor, rồi: NOTIFY pgrst, 'reload schema';

create or replace function public.admin_learning_summary()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  -- Only admins (same pattern as other admin_* funcs if exists)
  if exists (
    select 1 from pg_proc where proname = 'is_admin_user'
  ) then
    if not coalesce(public.is_admin_user(), false) then
      raise exception 'not authorized';
    end if;
  end if;

  with base as (
    select
      user_id,
      updated_at,
      data,
      coalesce(nullif(data->>'avp_xp_v2','')::numeric, nullif(data->>'xp','')::numeric, 0) as xp,
      case
        when jsonb_typeof(data->'avp_quiz_done_v1') = 'object'
          then (select count(*) from jsonb_object_keys(data->'avp_quiz_done_v1'))
        when jsonb_typeof(data->'avp_quiz_done_v1') = 'array'
          then jsonb_array_length(data->'avp_quiz_done_v1')
        else 0
      end as quizzes,
      case
        when jsonb_typeof(data->'avp_badge_unlock_dates_v9') = 'object'
          then (select count(*) from jsonb_object_keys(data->'avp_badge_unlock_dates_v9'))
        when jsonb_typeof(data->'avp_badge_unlock_dates_v9') = 'array'
          then jsonb_array_length(data->'avp_badge_unlock_dates_v9')
        else 0
      end as badges
    from public.user_progress
    where data is not null
  ),
  agg as (
    select
      count(*)::int as synced_users,
      count(*) filter (where updated_at >= now() - interval '7 days')::int as active_progress_7d,
      coalesce(round(avg(xp)),0)::int as avg_xp,
      coalesce(max(xp),0)::int as max_xp,
      coalesce(round(avg(quizzes)),0)::int as avg_quizzes,
      coalesce(round(avg(badges)),0)::int as avg_badges,
      count(*) filter (where xp >= 320)::int as pro_plus,
      count(*) filter (where xp >= 500)::int as master_plus
    from base
  )
  select json_build_object(
    'synced_users', synced_users,
    'active_progress_7d', active_progress_7d,
    'avg_xp', avg_xp,
    'max_xp', max_xp,
    'avg_quizzes', avg_quizzes,
    'avg_badges', avg_badges,
    'pro_plus', pro_plus,
    'master_plus', master_plus
  ) into result
  from agg;

  return coalesce(result, json_build_object(
    'synced_users',0,'active_progress_7d',0,'avg_xp',0,'max_xp',0,
    'avg_quizzes',0,'avg_badges',0,'pro_plus',0,'master_plus',0
  ));
end;
$$;

grant execute on function public.admin_learning_summary() to authenticated;
