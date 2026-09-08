-- TOOL LIBRARY V1.1 — release cadence / draft-published / TikTok guide
-- Production migration applied 2026-09-08. File kept in repo for reproducibility.

alter table public.download_assets
  add column if not exists tool_release_date date,
  add column if not exists tool_tiktok_url text;

create or replace function public.admin_tool_save_v1(p_tool jsonb)
returns uuid
language plpgsql
security definer
set search_path = 'public','auth'
as $$
declare
  v_id uuid;
  v_title text;
  v_path text;
  v_url text;
  v_tiktok text;
  v_active boolean;
  v_release date;
begin
  if not coalesce(public.is_admin_user(),false) then raise exception 'admin_required'; end if;
  v_id := coalesce(nullif(p_tool->>'id','')::uuid,gen_random_uuid());
  v_title := trim(coalesce(p_tool->>'name',''));
  v_path := trim(coalesce(p_tool->>'storage_path',''));
  v_url := trim(coalesce(p_tool->>'file_url',''));
  v_tiktok := trim(coalesce(p_tool->>'tiktok_url',''));
  v_active := coalesce((p_tool->>'is_active')::boolean,false);
  v_release := nullif(trim(coalesce(p_tool->>'release_date','')),'')::date;
  if char_length(v_title)<1 or char_length(v_title)>120 then raise exception 'invalid_name'; end if;
  if v_path='' or v_url='' then raise exception 'file_required'; end if;
  if v_tiktok<>'' and lower(v_tiktok)!~ '^https://([a-z0-9-]+\.)?tiktok\.com/' then raise exception 'invalid_tiktok_url'; end if;
  if v_active and v_tiktok='' then raise exception 'tiktok_required'; end if;
  if v_active and v_release is null then v_release := (now() at time zone 'Asia/Ho_Chi_Minh')::date; end if;
  insert into public.download_assets(id,source_path,title,category,description,file_type,file_size,file_url,storage_path,is_active,is_featured,sort_order,created_by,updated_at,tool_application,tool_release_date,tool_tiktok_url)
  values(v_id,coalesce(nullif(trim(p_tool->>'source_path'),''),v_path),v_title,'Kho Tool',left(coalesce(p_tool->>'description',''),1200),'zip',greatest(coalesce((p_tool->>'file_size')::bigint,0),0),v_url,v_path,v_active,false,coalesce((p_tool->>'sort_order')::int,0),auth.uid(),now(),left(coalesce(p_tool->>'application',''),240),v_release,nullif(v_tiktok,''))
  on conflict(id) do update set source_path=excluded.source_path,title=excluded.title,category='Kho Tool',description=excluded.description,file_type='zip',file_size=excluded.file_size,file_url=excluded.file_url,storage_path=excluded.storage_path,is_active=excluded.is_active,sort_order=excluded.sort_order,updated_at=now(),tool_application=excluded.tool_application,tool_release_date=excluded.tool_release_date,tool_tiktok_url=excluded.tool_tiktok_url;
  return v_id;
end;
$$;

create or replace function public.tool_catalog_v2(p_search text default null)
returns table(id uuid,sort_order integer,title text,application text,description text,file_type text,file_size bigint,file_url text,source_path text,download_count bigint,release_date date,tiktok_url text,created_at timestamptz)
language sql stable security definer set search_path='public' as $$
  select d.id,d.sort_order,d.title,coalesce(nullif(trim(d.tool_application),''),'Tiện ích Excel')::text,d.description,d.file_type,d.file_size,d.file_url,d.source_path,d.download_count,coalesce(d.tool_release_date,(d.created_at at time zone 'Asia/Ho_Chi_Minh')::date),d.tool_tiktok_url,d.created_at
  from public.download_assets d
  where d.category='Kho Tool' and d.is_active=true and nullif(trim(d.file_url),'') is not null
    and (coalesce(trim(p_search),'')='' or d.title ilike '%'||trim(p_search)||'%' or coalesce(d.tool_application,'') ilike '%'||trim(p_search)||'%' or coalesce(d.description,'') ilike '%'||trim(p_search)||'%')
  order by coalesce(d.tool_release_date,(d.created_at at time zone 'Asia/Ho_Chi_Minh')::date) desc,d.sort_order asc,d.created_at desc
  limit 200;
$$;

create or replace function public.admin_tools_catalog_v2()
returns table(id uuid,sort_order integer,name text,application text,description text,file_name text,storage_path text,file_url text,file_size bigint,download_count bigint,is_active boolean,release_date date,tiktok_url text,created_at timestamptz,updated_at timestamptz)
language plpgsql security definer set search_path='public' as $$
begin
  if not coalesce(public.is_admin_user(),false) then raise exception 'admin_required'; end if;
  return query
  select d.id,d.sort_order,d.title,coalesce(d.tool_application,''),coalesce(d.description,''),coalesce(nullif(regexp_replace(coalesce(d.storage_path,''),'^.*/',''),''),regexp_replace(coalesce(d.source_path,''),'^.*/','')),d.storage_path,d.file_url,coalesce(d.file_size,0),coalesce(d.download_count,0),d.is_active,d.tool_release_date,d.tool_tiktok_url,d.created_at,d.updated_at
  from public.download_assets d where d.category='Kho Tool'
  order by d.is_active desc,d.tool_release_date desc nulls last,d.sort_order asc,d.created_at desc;
end;
$$;

revoke execute on function public.tool_catalog_v2(text) from public;
grant execute on function public.tool_catalog_v2(text) to anon,authenticated,service_role;
revoke execute on function public.admin_tools_catalog_v2() from public,anon;
grant execute on function public.admin_tools_catalog_v2() to authenticated,service_role;
