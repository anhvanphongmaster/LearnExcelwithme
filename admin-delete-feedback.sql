-- Chạy HẾT file này, rồi: NOTIFY pgrst, 'reload schema';

create or replace function public.admin_delete_inbox_item(p_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin_user() then raise exception 'not authorized'; end if;
  delete from public.analytics_events
  where id = p_id and event_name = 'site_feedback';
end;
$$;

create or replace function public.admin_delete_inbox_match(p_at timestamptz, p_message text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin_user() then raise exception 'not authorized'; end if;
  delete from public.analytics_events
  where event_name = 'site_feedback'
    and coalesce(metadata->>'message','') = coalesce(p_message,'')
    and (p_at is null or occurred_at = p_at);
end;
$$;

revoke all on function public.admin_delete_inbox_item(bigint) from public;
revoke all on function public.admin_delete_inbox_match(timestamptz, text) from public;
grant execute on function public.admin_delete_inbox_item(bigint) to authenticated;
grant execute on function public.admin_delete_inbox_match(timestamptz, text) to authenticated;

create or replace function public.admin_engagement_summary(p_days integer default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  d int := greatest(1, least(coalesce(p_days, 30), 365));
  since timestamptz := now() - make_interval(days => d);
begin
  if not public.is_admin_user() then raise exception 'not authorized'; end if;
  return jsonb_build_object(
    'downloads', (select count(*) from public.analytics_events where event_name='practice_file_download' and occurred_at>=since),
    'video_clicks', (select count(*) from public.analytics_events where event_name='practice_video_click' and occurred_at>=since),
    'book_clicks', (select count(*) from public.analytics_events where event_name='book_click' and occurred_at>=since),
    'feedback', (select count(*) from public.analytics_events where event_name='site_feedback' and occurred_at>=since),
    'ideas', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', id, 'at', occurred_at, 'name', coalesce(metadata->>'name','Ẩn danh'),
        'message', coalesce(metadata->>'message','')
      ) order by occurred_at desc), '[]'::jsonb)
      from (
        select id, occurred_at, metadata
        from public.analytics_events
        where event_name='site_feedback' and occurred_at>=since
          and coalesce(metadata->>'kind','') = 'idea'
        order by occurred_at desc limit 50
      ) x
    ),
    'questions', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', id, 'at', occurred_at, 'name', coalesce(metadata->>'name','Ẩn danh'),
        'message', coalesce(metadata->>'message','')
      ) order by occurred_at desc), '[]'::jsonb)
      from (
        select id, occurred_at, metadata
        from public.analytics_events
        where event_name='site_feedback' and occurred_at>=since
          and coalesce(metadata->>'kind','question') <> 'idea'
        order by occurred_at desc limit 50
      ) x
    )
  );
end;
$$;
