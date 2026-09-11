-- Excel Arena Season 1 — Admin leaderboard RPCs
-- Applied after EXCEL-ARENA-SEASON1.sql.

create or replace function public.admin_arena_list_v1(p_search text default '', p_limit integer default 300)
returns table(
  ranking_id bigint,
  user_id uuid,
  player_name text,
  email text,
  topic text,
  best_score integer,
  best_level integer,
  best_perfect_streak integer,
  best_correct_count integer,
  is_hidden boolean,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path to 'public','auth'
as $$
begin
  if not public.is_admin_user() then raise exception 'admin access required'; end if;
  return query
  select r.id,r.user_id,r.player_name,u.email::text,r.topic,r.best_score,r.best_level,
         r.best_perfect_streak,r.best_correct_count,r.is_hidden,r.updated_at
  from public.arena_rankings_v1 r
  left join auth.users u on u.id=r.user_id
  where r.season=1
    and (
      trim(coalesce(p_search,''))=''
      or r.player_name ilike '%'||trim(p_search)||'%'
      or coalesce(u.email,'') ilike '%'||trim(p_search)||'%'
      or r.topic ilike '%'||trim(p_search)||'%'
    )
  order by r.best_score desc,r.best_level desc,r.best_perfect_streak desc,r.updated_at asc
  limit greatest(1,least(coalesce(p_limit,300),500));
end;
$$;

create or replace function public.admin_arena_reset_v1(p_ranking_id bigint)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if not public.is_admin_user() then raise exception 'admin access required'; end if;
  update public.arena_rankings_v1
  set best_score=0,best_level=1,best_perfect_streak=0,best_correct_count=0,updated_at=now()
  where id=p_ranking_id and season=1;
  return jsonb_build_object('ok',true);
end;
$$;

create or replace function public.admin_arena_delete_v1(p_ranking_id bigint)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if not public.is_admin_user() then raise exception 'admin access required'; end if;
  delete from public.arena_rankings_v1 where id=p_ranking_id and season=1;
  return jsonb_build_object('ok',true);
end;
$$;

create or replace function public.admin_arena_rename_v1(p_ranking_id bigint,p_player_name text)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
declare nm text:=left(trim(coalesce(p_player_name,'')),40); uid uuid;
begin
  if not public.is_admin_user() then raise exception 'admin access required'; end if;
  if length(nm)<2 then raise exception 'name too short'; end if;
  select user_id into uid from public.arena_rankings_v1 where id=p_ranking_id and season=1;
  if uid is null then raise exception 'ranking not found'; end if;
  update public.arena_rankings_v1 set player_name=nm,updated_at=now() where season=1 and user_id=uid;
  return jsonb_build_object('ok',true);
end;
$$;

create or replace function public.admin_arena_set_hidden_v1(p_ranking_id bigint,p_hidden boolean)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if not public.is_admin_user() then raise exception 'admin access required'; end if;
  update public.arena_rankings_v1 set is_hidden=coalesce(p_hidden,false),updated_at=now()
  where id=p_ranking_id and season=1;
  return jsonb_build_object('ok',true);
end;
$$;

grant execute on function public.admin_arena_list_v1(text,integer) to authenticated;
grant execute on function public.admin_arena_reset_v1(bigint) to authenticated;
grant execute on function public.admin_arena_delete_v1(bigint) to authenticated;
grant execute on function public.admin_arena_rename_v1(bigint,text) to authenticated;
grant execute on function public.admin_arena_set_hidden_v1(bigint,boolean) to authenticated;
