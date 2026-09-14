-- SUPABASE PERFORMANCE AUDIT CHECKPOINT — 2026-09-14
-- Project: LearnExcelwithme
-- Purpose:
--   1) Reduce repeated scans of analytics_events in Admin analytics.
--   2) Remove one unused analytics index that amplified INSERT writes.
--   3) Avoid no-op physical UPDATEs in Admin Web Push and Chat.
--   4) Throttle Admin presence writes while preserving the >=5 minute offline rule.
--
-- This file mirrors the live production definitions after the audit.
-- It is intended as an idempotent checkpoint on top of the existing schema.

begin;

-- ============================================================
-- 1) ADMIN ANALYTICS SUMMARY — single period scan
-- ============================================================
create or replace function public.admin_analytics_summary(p_days integer default 30)
returns jsonb
language plpgsql
security definer
set search_path to ''
set work_mem to '32MB'
as $function$
declare
  v_days integer := greatest(1, least(coalesce(p_days, 30), 365));
  v_start timestamptz := now() - make_interval(days => greatest(1, least(coalesce(p_days,30),365)));
  v_today timestamptz := date_trunc('day', now());
  v_registered_users bigint := 0;
  v_new_users_period bigint := 0;
  v_page_views bigint := 0;
  v_unique_visitors bigint := 0;
  v_active_logged_in_users bigint := 0;
  v_login_events bigint := 0;
  v_excel_mobile_visitors bigint := 0;
  v_excel_tool_runs bigint := 0;
  v_today_page_views bigint := 0;
  v_today_unique_visitors bigint := 0;
begin
  if not public.is_admin_user() then
    raise exception 'admin access required';
  end if;

  select
    count(*)::bigint,
    count(*) filter (where created_at >= v_start)::bigint
  into v_registered_users, v_new_users_period
  from auth.users;

  with period as materialized (
    select
      e.event_name,
      e.user_id,
      e.visitor_id,
      e.page_path,
      e.occurred_at,
      coalesce(e.user_id::text, e.visitor_id) as actor
    from public.analytics_events e
    where e.occurred_at >= v_start
  )
  select
    count(*) filter (where event_name = 'page_view')::bigint,
    count(distinct actor) filter (where actor is not null)::bigint,
    count(distinct user_id) filter (where user_id is not null)::bigint,
    count(*) filter (where event_name = 'login')::bigint,
    count(distinct actor) filter (
      where actor is not null
        and (event_name = 'excel_mobile_open' or page_path like '%excel-mobile.html%')
    )::bigint,
    count(*) filter (where event_name = 'excel_tool_used')::bigint,
    count(*) filter (
      where event_name = 'page_view' and occurred_at >= v_today
    )::bigint,
    count(distinct actor) filter (
      where actor is not null and occurred_at >= v_today
    )::bigint
  into
    v_page_views,
    v_unique_visitors,
    v_active_logged_in_users,
    v_login_events,
    v_excel_mobile_visitors,
    v_excel_tool_runs,
    v_today_page_views,
    v_today_unique_visitors
  from period;

  return jsonb_build_object(
    'registered_users', v_registered_users,
    'new_users_period', v_new_users_period,
    'page_views', v_page_views,
    'unique_visitors', v_unique_visitors,
    'active_logged_in_users', v_active_logged_in_users,
    'login_events', v_login_events,
    'excel_mobile_visitors', v_excel_mobile_visitors,
    'excel_tool_runs', v_excel_tool_runs,
    'today_page_views', v_today_page_views,
    'today_unique_visitors', v_today_unique_visitors
  );
end;
$function$;

-- ============================================================
-- 2) ADMIN ANALYTICS TREND — aggregate events once, then join days
-- ============================================================
create or replace function public.admin_analytics_trend(p_days integer default 30)
returns table(day date, page_views bigint, unique_visitors bigint, tool_runs bigint, logins bigint)
language plpgsql
security definer
set search_path to ''
set work_mem to '32MB'
as $function$
declare
  v_days integer := greatest(1, least(coalesce(p_days,30), 90));
begin
  if not public.is_admin_user() then
    raise exception 'admin access required';
  end if;

  return query
  with days as (
    select generate_series(
      current_date - (v_days - 1),
      current_date,
      interval '1 day'
    )::date as d
  ), agg as (
    select
      e.occurred_at::date as d,
      count(*) filter (where e.event_name = 'page_view')::bigint as page_views,
      count(distinct coalesce(e.user_id::text, e.visitor_id))
        filter (where coalesce(e.user_id::text, e.visitor_id) is not null)::bigint as unique_visitors,
      count(*) filter (where e.event_name = 'excel_tool_used')::bigint as tool_runs,
      count(*) filter (where e.event_name = 'login')::bigint as logins
    from public.analytics_events e
    where e.occurred_at >= current_date - (v_days - 1)
      and e.occurred_at < current_date + interval '1 day'
    group by e.occurred_at::date
  )
  select
    days.d,
    coalesce(agg.page_views,0)::bigint,
    coalesce(agg.unique_visitors,0)::bigint,
    coalesce(agg.tool_runs,0)::bigint,
    coalesce(agg.logins,0)::bigint
  from days
  left join agg using(d)
  order by days.d;
end;
$function$;

-- ============================================================
-- 3) ADMIN ENGAGEMENT — materialize the relevant period once
-- ============================================================
create or replace function public.admin_engagement_summary_v2(p_days integer default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public'
set work_mem to '32MB'
as $function$
declare
  d int := greatest(1,least(coalesce(p_days,30),365));
  since timestamptz := now()-make_interval(days=>d);
  v_result jsonb;
begin
  if not public.is_admin_user() then
    raise exception 'admin access required';
  end if;

  with period as materialized (
    select
      e.event_name,
      e.tool_name,
      e.metadata,
      e.occurred_at,
      e.page_path
    from public.analytics_events e
    where e.occurred_at >= since
      and e.event_name in (
        'practice_file_download','file_download_click',
        'practice_video_click','video_click',
        'book_click','site_feedback'
      )
  ), counts as (
    select
      count(*) filter (
        where event_name in ('practice_file_download','file_download_click')
      )::bigint as downloads,
      count(*) filter (
        where event_name in ('practice_video_click','video_click')
      )::bigint as video_clicks,
      count(*) filter (where event_name='book_click')::bigint as book_clicks,
      count(*) filter (where event_name='site_feedback')::bigint as feedback
    from period
  ), by_tool as (
    select coalesce(
      jsonb_agg(row_to_json(t) order by t.clicks desc),
      '[]'::jsonb
    ) as j
    from (
      select
        coalesce(tool_name,'Không rõ') as tool_name,
        count(*)::bigint as clicks
      from period
      where event_name in (
        'practice_file_download','file_download_click',
        'practice_video_click','video_click','book_click'
      )
      group by coalesce(tool_name,'Không rõ')
      order by count(*) desc
      limit 30
    ) t
  ), ideas as (
    select coalesce(
      jsonb_agg(row_to_json(x) order by x.at desc),
      '[]'::jsonb
    ) as j
    from (
      select
        occurred_at as at,
        coalesce(metadata->>'name','Ẩn danh') as name,
        coalesce(metadata->>'message','') as message,
        page_path as page
      from period
      where event_name='site_feedback'
        and coalesce(metadata->>'kind','')='idea'
      order by occurred_at desc
      limit 50
    ) x
  ), questions as (
    select coalesce(
      jsonb_agg(row_to_json(x) order by x.at desc),
      '[]'::jsonb
    ) as j
    from (
      select
        occurred_at as at,
        coalesce(metadata->>'name','Ẩn danh') as name,
        coalesce(metadata->>'message','') as message,
        page_path as page
      from period
      where event_name='site_feedback'
        and coalesce(metadata->>'kind','question')<>'idea'
      order by occurred_at desc
      limit 50
    ) x
  )
  select jsonb_build_object(
    'downloads',c.downloads,
    'video_clicks',c.video_clicks,
    'book_clicks',c.book_clicks,
    'feedback',c.feedback,
    'by_tool',b.j,
    'ideas',i.j,
    'questions',q.j
  )
  into v_result
  from counts c
  cross join by_tool b
  cross join ideas i
  cross join questions q;

  return v_result;
end;
$function$;

-- ============================================================
-- 4) UNUSED ANALYTICS INDEX — zero recorded scans during audit
-- Removes write amplification from every analytics INSERT.
-- ============================================================
drop index if exists public.analytics_events_visitor_id_idx;

-- ============================================================
-- 5) ADMIN WEB PUSH — no physical UPDATE when payload is unchanged
-- ============================================================
create or replace function public.admin_push_subscription_upsert(
  p_endpoint text,
  p_p256dh text,
  p_auth text,
  p_user_agent text default null::text,
  p_device_label text default null::text
)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'LOGIN_REQUIRED';
  end if;

  if not coalesce(public.is_admin_user(), false) then
    raise exception 'ADMIN_REQUIRED';
  end if;

  if coalesce(trim(p_endpoint),'') = ''
     or coalesce(trim(p_p256dh),'') = ''
     or coalesce(trim(p_auth),'') = '' then
    raise exception 'PUSH_SUBSCRIPTION_INVALID';
  end if;

  if left(lower(trim(p_endpoint)), 8) <> 'https://' then
    raise exception 'PUSH_ENDPOINT_HTTPS_REQUIRED';
  end if;

  insert into public.admin_push_subscriptions(
    user_id, endpoint, p256dh, auth,
    user_agent, device_label,
    enabled, created_at, updated_at
  )
  values(
    v_uid,
    trim(p_endpoint),
    trim(p_p256dh),
    trim(p_auth),
    nullif(trim(p_user_agent),''),
    nullif(trim(p_device_label),''),
    true,
    now(),
    now()
  )
  on conflict (endpoint)
  do update set
    user_id=excluded.user_id,
    p256dh=excluded.p256dh,
    auth=excluded.auth,
    user_agent=excluded.user_agent,
    device_label=excluded.device_label,
    enabled=true,
    updated_at=now()
  where public.admin_push_subscriptions.user_id is distinct from excluded.user_id
     or public.admin_push_subscriptions.p256dh is distinct from excluded.p256dh
     or public.admin_push_subscriptions.auth is distinct from excluded.auth
     or public.admin_push_subscriptions.user_agent is distinct from excluded.user_agent
     or public.admin_push_subscriptions.device_label is distinct from excluded.device_label
     or public.admin_push_subscriptions.enabled is distinct from true;

  return jsonb_build_object('ok',true);
end;
$function$;

-- ============================================================
-- 6) CHAT THREAD — avoid fake UPDATE on get/create
-- ============================================================
create or replace function public.avp_chat_get_or_create_thread()
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_uid uuid := auth.uid();
  v_thread uuid;
begin
  if v_uid is null then
    raise exception 'login_required';
  end if;

  insert into public.admin_chat_threads(user_id)
  values (v_uid)
  on conflict (user_id) do nothing
  returning id into v_thread;

  if v_thread is null then
    select id
    into v_thread
    from public.admin_chat_threads
    where user_id = v_uid;
  end if;

  return v_thread;
end;
$function$;

-- ============================================================
-- 7) CHAT READ STATE — update thread only when unread count changes
-- ============================================================
create or replace function public.avp_chat_admin_mark_read(p_thread_id uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if not public.avp_chat_is_admin() then
    raise exception 'admin_required';
  end if;

  update public.admin_chat_messages
  set read_by_admin = true
  where thread_id = p_thread_id
    and sender_type = 'user'
    and not read_by_admin;

  update public.admin_chat_threads
  set admin_unread_count = 0,
      updated_at = now()
  where id = p_thread_id
    and admin_unread_count <> 0;
end;
$function$;

create or replace function public.avp_chat_mark_user_read()
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_thread uuid;
begin
  if auth.uid() is null then
    return;
  end if;

  select id
  into v_thread
  from public.admin_chat_threads
  where user_id = auth.uid();

  if v_thread is null then
    return;
  end if;

  update public.admin_chat_messages
  set read_by_user = true
  where thread_id = v_thread
    and sender_type in ('admin','system')
    and not read_by_user;

  update public.admin_chat_threads
  set user_unread_count = 0,
      updated_at = now()
  where id = v_thread
    and user_unread_count <> 0;
end;
$function$;

-- ============================================================
-- 8) ADMIN PRESENCE — physical heartbeat write at most every 90s
-- Auto-reply minimum offline threshold remains 5 minutes.
-- ============================================================
create or replace function public.avp_chat_admin_presence_ping()
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if auth.uid() is null
     or not coalesce(public.is_admin_user(), false)
  then
    raise exception 'ADMIN_ONLY';
  end if;

  insert into public.avp_chat_admin_presence(
    admin_user_id,
    last_seen_at
  )
  values(
    auth.uid(),
    now()
  )
  on conflict(admin_user_id)
  do update
  set last_seen_at = excluded.last_seen_at
  where public.avp_chat_admin_presence.last_seen_at
        < now() - interval '90 seconds';
end;
$function$;

commit;

-- Refresh planner statistics after applying the checkpoint.
analyze public.analytics_events;
analyze public.user_progress;
analyze public.practice_grader_results;
analyze public.practice_grader_lessons;
analyze public.learning_leaderboard;
analyze public.admin_chat_threads;
analyze public.admin_chat_messages;
analyze public.admin_push_subscriptions;
