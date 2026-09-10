-- HOMEWORK-STANDALONE-V1.sql
-- YouTube Practice / Homework is independent from youtube_projects.
-- Idempotent source-of-truth for the production schema/RPC surface.

begin;

create table if not exists public.homework_lessons_v1 (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  order_no integer not null check (order_no > 0),
  title text not null,
  file_url text,
  guide_video_url text,
  solution_video_url text,
  hint1 text,
  hint2 text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid
);

create unique index if not exists homework_lessons_v1_topic_order_uidx
  on public.homework_lessons_v1 (lower(btrim(topic)), order_no);

alter table public.homework_lessons_v1 enable row level security;
revoke all on table public.homework_lessons_v1 from anon, authenticated;
grant all on table public.homework_lessons_v1 to service_role;

create or replace function public.admin_homework_list_v1()
returns table(
  id uuid, topic text, order_no integer, title text,
  file_url text, guide_video_url text, solution_video_url text,
  hint1 text, hint2 text, status text,
  created_at timestamptz, updated_at timestamptz, updated_by uuid
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not coalesce(public.is_admin_user(), false) then
    raise exception 'admin access required';
  end if;

  return query
  select h.id,h.topic,h.order_no,h.title,h.file_url,h.guide_video_url,
         h.solution_video_url,h.hint1,h.hint2,h.status,
         h.created_at,h.updated_at,h.updated_by
  from public.homework_lessons_v1 h
  order by lower(h.topic),h.order_no,h.created_at;
end;
$$;

create or replace function public.admin_homework_upsert_v1(
  p_id uuid default null,
  p_topic text default '',
  p_order_no integer default 1,
  p_title text default '',
  p_file_url text default null,
  p_guide_video_url text default null,
  p_solution_video_url text default null,
  p_hint1 text default null,
  p_hint2 text default null,
  p_status text default 'draft'
)
returns public.homework_lessons_v1
language plpgsql
security definer
set search_path = public
as $$
declare
  v_topic text := btrim(coalesce(p_topic,''));
  v_title text := btrim(coalesce(p_title,''));
  v_status text := lower(btrim(coalesce(p_status,'draft')));
  v_guide text := nullif(btrim(coalesce(p_guide_video_url,'')),'');
  v_row public.homework_lessons_v1;
begin
  if not coalesce(public.is_admin_user(),false) then
    raise exception 'admin access required';
  end if;
  if v_topic='' then raise exception 'Chủ đề không được để trống'; end if;
  if v_title='' then raise exception 'Tên bài không được để trống'; end if;
  if coalesce(p_order_no,0)<1 then raise exception 'STT phải lớn hơn hoặc bằng 1'; end if;
  if v_status not in ('draft','published') then raise exception 'Trạng thái không hợp lệ'; end if;

  -- From lesson 02 onward, an empty guide defaults to the solution video
  -- of the immediately previous lesson in the same topic.
  if v_guide is null and p_order_no>1 then
    select nullif(btrim(coalesce(h.solution_video_url,'')),'') into v_guide
    from public.homework_lessons_v1 h
    where lower(btrim(h.topic))=lower(v_topic)
      and h.order_no=p_order_no-1
      and (p_id is null or h.id<>p_id)
    limit 1;
  end if;

  if v_status='published' and v_guide is null then
    raise exception 'Cần link video hướng dẫn trước khi phát hành. Từ bài 2 trở đi hệ thống chỉ tự lấy video giải của đúng bài liền trước nếu có.';
  end if;

  if p_id is null then
    insert into public.homework_lessons_v1(
      topic,order_no,title,file_url,guide_video_url,solution_video_url,
      hint1,hint2,status,updated_by
    ) values (
      v_topic,p_order_no,v_title,
      nullif(btrim(coalesce(p_file_url,'')),''),
      v_guide,
      nullif(btrim(coalesce(p_solution_video_url,'')),''),
      nullif(btrim(coalesce(p_hint1,'')),''),
      nullif(btrim(coalesce(p_hint2,'')),''),
      v_status,auth.uid()
    ) returning * into v_row;
  else
    update public.homework_lessons_v1 h
    set topic=v_topic,
        order_no=p_order_no,
        title=v_title,
        file_url=nullif(btrim(coalesce(p_file_url,'')),''),
        guide_video_url=v_guide,
        solution_video_url=nullif(btrim(coalesce(p_solution_video_url,'')),''),
        hint1=nullif(btrim(coalesce(p_hint1,'')),''),
        hint2=nullif(btrim(coalesce(p_hint2,'')),''),
        status=v_status,
        updated_at=now(),
        updated_by=auth.uid()
    where h.id=p_id
    returning * into v_row;

    if v_row.id is null then
      raise exception 'Không tìm thấy Homework cần cập nhật';
    end if;
  end if;

  return v_row;
exception when unique_violation then
  raise exception 'STT % đã tồn tại trong chủ đề "%"',p_order_no,v_topic;
end;
$$;

create or replace function public.admin_homework_delete_v1(p_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not coalesce(public.is_admin_user(),false) then
    raise exception 'admin access required';
  end if;
  delete from public.homework_lessons_v1 where id=p_id;
  return found;
end;
$$;

create or replace function public.homework_public_v1()
returns table(
  id uuid, topic text, order_no integer, title text,
  file_url text, guide_video_url text, solution_video_url text,
  hint1 text, hint2 text, created_at timestamptz, updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select h.id,h.topic,h.order_no,h.title,h.file_url,h.guide_video_url,
         h.solution_video_url,h.hint1,h.hint2,h.created_at,h.updated_at
  from public.homework_lessons_v1 h
  where h.status='published'
    and nullif(btrim(h.guide_video_url),'') is not null
  order by lower(h.topic),h.order_no,h.created_at;
$$;

-- Admin RPCs are callable only by logged-in users; the function itself
-- additionally checks is_admin_user(). Public listing remains available.
revoke all on function public.admin_homework_list_v1() from public, anon;
revoke all on function public.admin_homework_upsert_v1(uuid,text,integer,text,text,text,text,text,text,text) from public, anon;
revoke all on function public.admin_homework_delete_v1(uuid) from public, anon;
grant execute on function public.admin_homework_list_v1() to authenticated, service_role;
grant execute on function public.admin_homework_upsert_v1(uuid,text,integer,text,text,text,text,text,text,text) to authenticated, service_role;
grant execute on function public.admin_homework_delete_v1(uuid) to authenticated, service_role;

revoke all on function public.homework_public_v1() from public;
grant execute on function public.homework_public_v1() to anon, authenticated, service_role;

commit;
