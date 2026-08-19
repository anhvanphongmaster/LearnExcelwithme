-- Chạy 1 lần trong Supabase SQL Editor (tài khoản admin).
-- Đếm tải file / xem video / click sách / ý tưởng & thắc mắc.

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
  if not public.is_admin_user() then
    raise exception 'not authorized';
  end if;

  return jsonb_build_object(
    'downloads', (select count(*) from public.analytics_events where event_name='practice_file_download' and occurred_at>=since),
    'video_clicks', (select count(*) from public.analytics_events where event_name='practice_video_click' and occurred_at>=since),
    'book_clicks', (select count(*) from public.analytics_events where event_name='book_click' and occurred_at>=since),
    'feedback', (select count(*) from public.analytics_events where event_name='site_feedback' and occurred_at>=since),
    'by_tool', (
      select coalesce(jsonb_agg(jsonb_build_object('name', tool_name, 'n', n) order by n desc), '[]'::jsonb)
      from (
        select coalesce(nullif(tool_name,''), '(không rõ)') as tool_name, count(*)::int as n
        from public.analytics_events
        where event_name in ('practice_file_download','practice_video_click','book_click')
          and occurred_at>=since
        group by 1
        limit 20
      ) s
    ),
    'feedback_list', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'at', occurred_at,
        'kind', coalesce(metadata->>'kind','thắc mắc'),
        'message', coalesce(metadata->>'message',''),
        'page', page_path
      ) order by occurred_at desc), '[]'::jsonb)
      from (
        select occurred_at, metadata, page_path
        from public.analytics_events
        where event_name='site_feedback' and occurred_at>=since
        order by occurred_at desc
        limit 50
      ) f
    )
  );
end;
$$;

revoke all on function public.admin_engagement_summary(integer) from public;
grant execute on function public.admin_engagement_summary(integer) to authenticated;
