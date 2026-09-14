-- ANALYTICS ANTI-STORM CHECKPOINT — 2026-09-14
-- Root cause found in historical frontend:
-- old AVPAccess replayed an authenticated download through temp.click(),
-- but the temporary anchor was intercepted by the same capture guard again.
-- That generated a synthetic click loop and analytics-tracker counted each
-- synthetic download click as a real file_download_click.
--
-- Current frontend commit ae4b5e62 ignores data-avp-public-download synthetic
-- anchors. This backend guard protects stale/cached clients as a second layer.

create or replace function public.track_analytics_event(
  p_event_name text,
  p_page text default null::text,
  p_tool_name text default null::text,
  p_visitor_id text default null::text,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_event text;
  v_page text;
  v_tool text;
  v_visitor text;
  v_metadata jsonb;
  v_uid uuid := (select auth.uid());
  v_actor text;
begin
  v_event := left(trim(coalesce(p_event_name, '')), 64);

  if v_event = '' then
    raise exception 'event_name is required';
  end if;

  if v_event !~ '^[a-zA-Z0-9_.:-]+$' then
    raise exception 'invalid event_name';
  end if;

  v_page := nullif(left(trim(coalesce(p_page, '')), 180), '');
  v_tool := nullif(left(trim(coalesce(p_tool_name, '')), 80), '');
  v_visitor := nullif(left(trim(coalesce(p_visitor_id, '')), 80), '');
  v_metadata := coalesce(p_metadata, '{}'::jsonb);

  if pg_column_size(v_metadata) > 4096 then
    v_metadata := '{}'::jsonb;
  end if;

  -- Only protect download-click analytics. Other analytics events are untouched.
  -- A second identical click from the same actor/page/file inside 10 seconds is
  -- almost always a replay/synthetic duplicate, not a useful separate metric.
  if v_event = 'file_download_click' then
    v_actor := coalesce(v_uid::text, v_visitor);

    if v_actor is not null and exists (
      select 1
      from public.analytics_events e
      where e.occurred_at >= now() - interval '10 seconds'
        and e.event_name = v_event
        and e.page_path is not distinct from v_page
        and e.tool_name is not distinct from v_tool
        and coalesce(e.user_id::text, e.visitor_id) = v_actor
      limit 1
    ) then
      return;
    end if;
  end if;

  insert into public.analytics_events (
    user_id,
    visitor_id,
    event_name,
    page_path,
    tool_name,
    metadata
  )
  values (
    v_uid,
    v_visitor,
    v_event,
    v_page,
    v_tool,
    v_metadata
  );
end;
$function$;
