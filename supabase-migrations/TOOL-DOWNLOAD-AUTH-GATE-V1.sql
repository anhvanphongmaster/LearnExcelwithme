-- TOOL DOWNLOAD AUTH GATE V1
-- Public catalog remains visible, but direct storage URLs/paths are no longer exposed.
-- Authenticated downloads are streamed by the tool-download Edge Function.

create or replace function public.tool_catalog_v2(p_search text default null)
returns table(
  id uuid,
  sort_order integer,
  title text,
  application text,
  description text,
  file_type text,
  file_size bigint,
  file_url text,
  source_path text,
  download_count bigint,
  release_date date,
  tiktok_url text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path='public'
as $$
  select
    d.id,
    d.sort_order,
    d.title,
    coalesce(nullif(trim(d.tool_application),''),'Tiện ích Excel')::text,
    d.description,
    d.file_type,
    d.file_size,
    null::text as file_url,
    null::text as source_path,
    d.download_count,
    coalesce(d.tool_release_date,(d.created_at at time zone 'Asia/Ho_Chi_Minh')::date),
    d.tool_tiktok_url,
    d.created_at
  from public.download_assets d
  where d.category='Kho Tool'
    and d.is_active=true
    and nullif(trim(d.storage_path),'') is not null
    and (
      coalesce(trim(p_search),'')=''
      or d.title ilike '%'||trim(p_search)||'%'
      or coalesce(d.tool_application,'') ilike '%'||trim(p_search)||'%'
      or coalesce(d.description,'') ilike '%'||trim(p_search)||'%'
    )
  order by coalesce(d.tool_release_date,(d.created_at at time zone 'Asia/Ho_Chi_Minh')::date) desc,
           d.sort_order asc,
           d.created_at desc
  limit 200;
$$;

revoke execute on function public.tool_catalog_v2(text) from public;
grant execute on function public.tool_catalog_v2(text) to anon,authenticated,service_role;
