-- ============================================================
-- KHO TOOL V1 — LearnExcelwithme / Anh Văn Phòng
-- ============================================================
-- Một hệ duy nhất, tái sử dụng hạ tầng hiện có:
--   - public.download_assets: lưu metadata Tool (category = 'Kho Tool')
--   - storage bucket: site-downloads (Admin upload ZIP, public download)
--   - private.tool_idea_topics / private.tool_idea_votes: ý tưởng + lượt "+1"
--   - public.is_admin_user(): helper quyền Admin hiện có
--
-- Mật khẩu ZIP mặc định được UI hiển thị: anhvanphongmaster
-- LƯU Ý: website không tự đặt password cho ZIP. Admin cần tự nén ZIP
-- với password trên trước khi upload nếu muốn file thực sự có mật khẩu.
--
-- File này idempotent cho phần Tool và không tạo hệ Tool thứ hai.
-- Production 2026-09-08 đã có phần nền + Admin RPC; không cần chạy lại
-- chỉ để upload patch frontend.
-- ============================================================

create schema if not exists private;

-- Metadata Tool nằm chung Download Manager để tránh duplicate data.
alter table public.download_assets
  add column if not exists tool_application text;

-- Ý tưởng nằm trong private schema, không expose table trực tiếp qua Data API.
create table if not exists private.tool_idea_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  normalized_title text not null,
  status text not null default 'open'
    check (status in ('open','planned','building','released','hidden')),
  created_by_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists private.tool_idea_votes (
  topic_id uuid not null references private.tool_idea_topics(id) on delete cascade,
  voter_key text not null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (topic_id, voter_key)
);

alter table private.tool_idea_topics enable row level security;
alter table private.tool_idea_votes enable row level security;

create unique index if not exists tool_idea_topics_live_normalized_uidx
  on private.tool_idea_topics(normalized_title)
  where status <> 'hidden';

create index if not exists tool_idea_topics_status_created_idx
  on private.tool_idea_topics(status, created_at desc);

-- Không cho browser đọc/ghi trực tiếp private tables.
revoke all on table private.tool_idea_topics from public, anon, authenticated;
revoke all on table private.tool_idea_votes from public, anon, authenticated;

create or replace function private.tool_idea_normalize_v1(p_text text)
returns text
language sql
immutable
set search_path = 'pg_catalog'
as $$
  select lower(regexp_replace(trim(coalesce(p_text,'')), '\\s+', ' ', 'g'));
$$;

revoke execute on function private.tool_idea_normalize_v1(text)
  from public, anon, authenticated;

-- ------------------------------------------------------------
-- PUBLIC TOOL CATALOG
-- ------------------------------------------------------------
create or replace function public.tool_catalog_v1(p_search text default null)
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
  download_count bigint
)
language sql
stable
security definer
set search_path = 'public'
as $$
  select
    d.id,
    d.sort_order,
    d.title,
    coalesce(nullif(trim(d.tool_application),''),'Tiện ích Excel')::text as application,
    d.description,
    d.file_type,
    d.file_size,
    d.file_url,
    d.source_path,
    d.download_count
  from public.download_assets d
  where d.category = 'Kho Tool'
    and d.is_active = true
    and nullif(trim(d.file_url),'') is not null
    and (
      coalesce(trim(p_search),'') = ''
      or d.title ilike '%' || trim(p_search) || '%'
      or coalesce(d.tool_application,'') ilike '%' || trim(p_search) || '%'
      or coalesce(d.description,'') ilike '%' || trim(p_search) || '%'
    )
  order by d.sort_order asc, d.created_at asc
  limit 200;
$$;

-- ------------------------------------------------------------
-- PUBLIC IDEA BOARD
-- ------------------------------------------------------------
create or replace function public.tool_idea_board_v1(
  p_search text default null,
  p_limit integer default 12
)
returns table(
  id uuid,
  title text,
  status text,
  votes bigint,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = 'public','private'
as $$
  select
    t.id,
    t.title,
    t.status,
    count(v.topic_id)::bigint as votes,
    t.created_at
  from private.tool_idea_topics t
  left join private.tool_idea_votes v on v.topic_id = t.id
  where t.status <> 'hidden'
    and (
      coalesce(trim(p_search),'') = ''
      or t.title ilike '%' || trim(p_search) || '%'
    )
  group by t.id, t.title, t.status, t.created_at
  order by count(v.topic_id) desc, t.created_at asc
  limit greatest(1, least(coalesce(p_limit,12),40));
$$;

create or replace function public.tool_idea_suggest_v1(
  p_title text,
  p_browser_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = 'public','private','auth'
as $$
declare
  v_uid uuid := auth.uid();
  v_key text;
  v_title text := regexp_replace(trim(coalesce(p_title,'')), '\\s+', ' ', 'g');
  v_norm text;
  v_topic private.tool_idea_topics%rowtype;
  v_added integer := 0;
  v_votes bigint := 0;
  v_created boolean := false;
begin
  if length(v_title) < 5 or length(v_title) > 140 then
    raise exception 'idea_title_length';
  end if;

  if v_uid is not null then
    v_key := 'u:' || v_uid::text;
  else
    if coalesce(trim(p_browser_id),'') = '' or length(trim(p_browser_id)) > 80 then
      raise exception 'browser_id_required';
    end if;
    v_key := 'b:' || lower(trim(p_browser_id));
  end if;

  v_norm := private.tool_idea_normalize_v1(v_title);

  select * into v_topic
  from private.tool_idea_topics
  where normalized_title = v_norm
    and status <> 'hidden'
  order by created_at asc
  limit 1;

  if v_topic.id is null then
    if (
      select count(*)
      from private.tool_idea_topics
      where created_by_key = v_key
        and created_at >= now() - interval '24 hours'
    ) >= 3 then
      raise exception 'idea_daily_limit';
    end if;

    begin
      insert into private.tool_idea_topics(title,normalized_title,status,created_by_key)
      values(v_title,v_norm,'open',v_key)
      returning * into v_topic;
      v_created := true;
    exception when unique_violation then
      select * into v_topic
      from private.tool_idea_topics
      where normalized_title = v_norm
        and status <> 'hidden'
      order by created_at asc
      limit 1;
    end;
  end if;

  if v_topic.status = 'released' then
    return jsonb_build_object(
      'ok',true,'topic_id',v_topic.id,'created',false,
      'voted',false,'released',true
    );
  end if;

  insert into private.tool_idea_votes(topic_id,voter_key,user_id)
  values(v_topic.id,v_key,v_uid)
  on conflict(topic_id,voter_key) do nothing;
  get diagnostics v_added = row_count;

  select count(*) into v_votes
  from private.tool_idea_votes
  where topic_id = v_topic.id;

  return jsonb_build_object(
    'ok',true,
    'topic_id',v_topic.id,
    'created',v_created,
    'voted',(v_added > 0),
    'released',false,
    'votes',v_votes
  );
end;
$$;

create or replace function public.tool_idea_vote_v1(
  p_topic_id uuid,
  p_browser_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = 'public','private','auth'
as $$
declare
  v_uid uuid := auth.uid();
  v_key text;
  v_status text;
  v_added integer := 0;
  v_votes bigint := 0;
begin
  if v_uid is not null then
    v_key := 'u:' || v_uid::text;
  else
    if coalesce(trim(p_browser_id),'') = '' or length(trim(p_browser_id)) > 80 then
      raise exception 'browser_id_required';
    end if;
    v_key := 'b:' || lower(trim(p_browser_id));
  end if;

  select status into v_status
  from private.tool_idea_topics
  where id = p_topic_id
    and status <> 'hidden';

  if v_status is null then raise exception 'idea_not_found'; end if;
  if v_status = 'released' then raise exception 'idea_released'; end if;

  insert into private.tool_idea_votes(topic_id,voter_key,user_id)
  values(p_topic_id,v_key,v_uid)
  on conflict(topic_id,voter_key) do nothing;
  get diagnostics v_added = row_count;

  select count(*) into v_votes
  from private.tool_idea_votes
  where topic_id = p_topic_id;

  return jsonb_build_object('ok',true,'voted',(v_added > 0),'votes',v_votes);
end;
$$;

-- ------------------------------------------------------------
-- ADMIN TOOL PANEL
-- ------------------------------------------------------------
create or replace function public.admin_tools_catalog_v1()
returns table(
  id uuid,
  sort_order integer,
  name text,
  application text,
  description text,
  file_name text,
  storage_path text,
  file_url text,
  file_size bigint,
  download_count bigint,
  is_active boolean,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  if not coalesce(public.is_admin_user(),false) then
    raise exception 'admin_required';
  end if;

  return query
  select
    d.id,
    d.sort_order,
    d.title,
    coalesce(d.tool_application,''),
    coalesce(d.description,''),
    coalesce(
      nullif(regexp_replace(coalesce(d.storage_path,''),'^.*/',''),''),
      regexp_replace(coalesce(d.source_path,''),'^.*/','')
    ),
    d.storage_path,
    d.file_url,
    coalesce(d.file_size,0),
    coalesce(d.download_count,0),
    d.is_active,
    d.created_at,
    d.updated_at
  from public.download_assets d
  where d.category = 'Kho Tool'
  order by d.sort_order asc,d.created_at asc;
end;
$$;

create or replace function public.admin_tool_save_v1(p_tool jsonb)
returns uuid
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_id uuid;
  v_title text;
  v_path text;
  v_url text;
begin
  if not coalesce(public.is_admin_user(),false) then
    raise exception 'admin_required';
  end if;

  v_id := coalesce(nullif(p_tool->>'id','')::uuid,gen_random_uuid());
  v_title := trim(coalesce(p_tool->>'name',''));
  v_path := trim(coalesce(p_tool->>'storage_path',''));
  v_url := trim(coalesce(p_tool->>'file_url',''));

  if char_length(v_title) < 1 or char_length(v_title) > 120 then
    raise exception 'invalid_name';
  end if;
  if v_path = '' or v_url = '' then
    raise exception 'file_required';
  end if;

  insert into public.download_assets(
    id,source_path,title,category,description,file_type,file_size,file_url,
    storage_path,is_active,is_featured,sort_order,created_by,updated_at,tool_application
  ) values (
    v_id,
    coalesce(nullif(trim(p_tool->>'source_path'),''),v_path),
    v_title,
    'Kho Tool',
    left(coalesce(p_tool->>'description',''),1200),
    'zip',
    greatest(coalesce((p_tool->>'file_size')::bigint,0),0),
    v_url,
    v_path,
    coalesce((p_tool->>'is_active')::boolean,true),
    false,
    coalesce((p_tool->>'sort_order')::int,0),
    auth.uid(),
    now(),
    left(coalesce(p_tool->>'application',''),240)
  )
  on conflict(id) do update set
    source_path = excluded.source_path,
    title = excluded.title,
    category = 'Kho Tool',
    description = excluded.description,
    file_type = 'zip',
    file_size = excluded.file_size,
    file_url = excluded.file_url,
    storage_path = excluded.storage_path,
    is_active = excluded.is_active,
    sort_order = excluded.sort_order,
    updated_at = now(),
    tool_application = excluded.tool_application;

  return v_id;
end;
$$;

create or replace function public.admin_tool_delete_v1(p_id uuid)
returns text
language plpgsql
security definer
set search_path = 'public'
as $$
declare v_path text;
begin
  if not coalesce(public.is_admin_user(),false) then
    raise exception 'admin_required';
  end if;

  delete from public.download_assets
  where id = p_id and category = 'Kho Tool'
  returning storage_path into v_path;

  return v_path;
end;
$$;

create or replace function public.admin_tool_ideas_v1()
returns table(
  id uuid,
  title text,
  status text,
  supporters bigint,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = 'public','private'
as $$
begin
  if not coalesce(public.is_admin_user(),false) then
    raise exception 'admin_required';
  end if;

  return query
  select
    t.id,t.title,t.status,count(v.topic_id)::bigint,t.created_at,t.updated_at
  from private.tool_idea_topics t
  left join private.tool_idea_votes v on v.topic_id = t.id
  group by t.id
  order by count(v.topic_id) desc,t.updated_at desc;
end;
$$;

create or replace function public.admin_tool_idea_status_v1(p_id uuid,p_status text)
returns boolean
language plpgsql
security definer
set search_path = 'public','private'
as $$
begin
  if not coalesce(public.is_admin_user(),false) then
    raise exception 'admin_required';
  end if;
  if p_status not in ('open','planned','building','released','hidden') then
    raise exception 'invalid_status';
  end if;

  update private.tool_idea_topics
  set status = p_status,updated_at = now()
  where id = p_id;

  return found;
end;
$$;

create or replace function public.admin_tool_idea_rename_v1(p_id uuid,p_title text)
returns boolean
language plpgsql
security definer
set search_path = 'public','private'
as $$
declare
  v_title text := regexp_replace(trim(coalesce(p_title,'')),'\s+',' ','g');
  v_norm text;
begin
  if not coalesce(public.is_admin_user(),false) then
    raise exception 'admin_required';
  end if;
  if length(v_title) < 5 or length(v_title) > 140 then
    raise exception 'invalid_idea';
  end if;

  v_norm := private.tool_idea_normalize_v1(v_title);
  if exists(
    select 1
    from private.tool_idea_topics
    where normalized_title = v_norm
      and status <> 'hidden'
      and id <> p_id
  ) then
    raise exception 'duplicate_idea';
  end if;

  update private.tool_idea_topics
  set title = v_title,normalized_title = v_norm,updated_at = now()
  where id = p_id;

  return found;
end;
$$;

create or replace function public.admin_tool_idea_merge_v1(p_source_id uuid,p_target_id uuid)
returns bigint
language plpgsql
security definer
set search_path = 'public','private'
as $$
declare v_total bigint;
begin
  if not coalesce(public.is_admin_user(),false) then
    raise exception 'admin_required';
  end if;
  if p_source_id is null or p_target_id is null or p_source_id = p_target_id then
    raise exception 'invalid_merge';
  end if;
  if not exists(select 1 from private.tool_idea_topics where id = p_source_id) then
    raise exception 'source_not_found';
  end if;
  if not exists(select 1 from private.tool_idea_topics where id = p_target_id and status <> 'hidden') then
    raise exception 'target_not_found';
  end if;

  insert into private.tool_idea_votes(topic_id,voter_key,user_id,created_at)
  select p_target_id,v.voter_key,v.user_id,v.created_at
  from private.tool_idea_votes v
  where v.topic_id = p_source_id
  on conflict(topic_id,voter_key) do nothing;

  delete from private.tool_idea_topics where id = p_source_id;
  update private.tool_idea_topics set updated_at = now() where id = p_target_id;

  select count(*)::bigint into v_total
  from private.tool_idea_votes
  where topic_id = p_target_id;

  return v_total;
end;
$$;

-- ------------------------------------------------------------
-- ACL
-- ------------------------------------------------------------
-- Public Tool page endpoints: intentionally callable by anon/authenticated.
revoke execute on function public.tool_catalog_v1(text) from public;
revoke execute on function public.tool_idea_board_v1(text,integer) from public;
revoke execute on function public.tool_idea_suggest_v1(text,text) from public;
revoke execute on function public.tool_idea_vote_v1(uuid,text) from public;

grant execute on function public.tool_catalog_v1(text) to anon, authenticated, service_role;
grant execute on function public.tool_idea_board_v1(text,integer) to anon, authenticated, service_role;
grant execute on function public.tool_idea_suggest_v1(text,text) to anon, authenticated, service_role;
grant execute on function public.tool_idea_vote_v1(uuid,text) to anon, authenticated, service_role;

-- Admin panel endpoints: browser must be signed in AND function verifies Admin.
revoke execute on function public.admin_tools_catalog_v1() from public, anon;
revoke execute on function public.admin_tool_save_v1(jsonb) from public, anon;
revoke execute on function public.admin_tool_delete_v1(uuid) from public, anon;
revoke execute on function public.admin_tool_ideas_v1() from public, anon;
revoke execute on function public.admin_tool_idea_status_v1(uuid,text) from public, anon;
revoke execute on function public.admin_tool_idea_rename_v1(uuid,text) from public, anon;
revoke execute on function public.admin_tool_idea_merge_v1(uuid,uuid) from public, anon;

grant execute on function public.admin_tools_catalog_v1() to authenticated, service_role;
grant execute on function public.admin_tool_save_v1(jsonb) to authenticated, service_role;
grant execute on function public.admin_tool_delete_v1(uuid) to authenticated, service_role;
grant execute on function public.admin_tool_ideas_v1() to authenticated, service_role;
grant execute on function public.admin_tool_idea_status_v1(uuid,text) to authenticated, service_role;
grant execute on function public.admin_tool_idea_rename_v1(uuid,text) to authenticated, service_role;
grant execute on function public.admin_tool_idea_merge_v1(uuid,uuid) to authenticated, service_role;

-- PostgREST schema cache refresh after DDL/RPC changes.
notify pgrst, 'reload schema';
