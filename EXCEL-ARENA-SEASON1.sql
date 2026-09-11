-- Excel Arena Season 1
-- Applied to Supabase project itnnbyhlpfredaqyhlpr on 2026-09-12.
-- New leaderboard model; old Excel Race leaderboard is intentionally reset.

create table if not exists public.arena_rankings_v1 (
  id bigserial primary key,
  season integer not null default 1,
  user_id uuid not null references auth.users(id) on delete cascade,
  player_name text not null,
  topic text not null,
  best_score integer not null default 0,
  best_level integer not null default 1,
  best_perfect_streak integer not null default 0,
  best_correct_count integer not null default 0,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint arena_rankings_v1_user_topic_key unique (season,user_id,topic),
  constraint arena_rankings_v1_score_check check (best_score >= 0),
  constraint arena_rankings_v1_level_check check (best_level >= 1),
  constraint arena_rankings_v1_perfect_check check (best_perfect_streak >= 0),
  constraint arena_rankings_v1_correct_check check (best_correct_count >= 0)
);

create index if not exists arena_rankings_v1_topic_score_idx
  on public.arena_rankings_v1(season,topic,best_score desc,best_level desc,updated_at asc);

alter table public.arena_rankings_v1 enable row level security;
revoke all on table public.arena_rankings_v1 from anon, authenticated;

create or replace function public.arena_identity_v1()
returns jsonb
language plpgsql
security definer
set search_path to 'public','auth'
as $$
declare uid uuid := auth.uid(); nm text;
begin
  if uid is null then raise exception 'LOGIN_REQUIRED'; end if;
  nm := public.race_current_display_name_v4();
  return jsonb_build_object('ok',true,'user_id',uid,'player_name',coalesce(nm,'Học viên'),'season',1);
end;
$$;

create or replace function public.arena_submit_score_v1(
  p_topic text,p_score integer,p_level integer,p_perfect_streak integer,p_correct_count integer
)
returns jsonb
language plpgsql
security definer
set search_path to 'public','auth'
as $$
declare
  uid uuid := auth.uid();
  nm text;
  v_topic text := lower(trim(coalesce(p_topic,'mixed')));
  rec public.arena_rankings_v1%rowtype;
begin
  if uid is null then raise exception 'LOGIN_REQUIRED'; end if;
  if v_topic = '' or v_topic !~ '^[a-z0-9-]{1,40}$' then raise exception 'INVALID_TOPIC'; end if;
  nm := public.race_current_display_name_v4();
  insert into public.arena_rankings_v1(
    season,user_id,player_name,topic,best_score,best_level,best_perfect_streak,best_correct_count,is_hidden,updated_at
  ) values (
    1,uid,coalesce(nm,'Học viên'),v_topic,
    greatest(coalesce(p_score,0),0),greatest(coalesce(p_level,1),1),
    greatest(coalesce(p_perfect_streak,0),0),greatest(coalesce(p_correct_count,0),0),false,now()
  )
  on conflict (season,user_id,topic) do update set
    player_name=excluded.player_name,
    best_score=greatest(arena_rankings_v1.best_score,excluded.best_score),
    best_level=case when excluded.best_score>arena_rankings_v1.best_score then excluded.best_level else greatest(arena_rankings_v1.best_level,excluded.best_level) end,
    best_perfect_streak=greatest(arena_rankings_v1.best_perfect_streak,excluded.best_perfect_streak),
    best_correct_count=case when excluded.best_score>arena_rankings_v1.best_score then excluded.best_correct_count else greatest(arena_rankings_v1.best_correct_count,excluded.best_correct_count) end,
    is_hidden=false,updated_at=now()
  returning * into rec;
  return jsonb_build_object('ok',true,'season',rec.season,'topic',rec.topic,'best_score',rec.best_score,'best_level',rec.best_level,'best_perfect_streak',rec.best_perfect_streak,'best_correct_count',rec.best_correct_count);
end;
$$;

create or replace function public.arena_list_leaderboard_v1(p_topic text default 'mixed',p_limit integer default 100)
returns table(rank_no bigint,user_id uuid,player_name text,best_score integer,best_level integer,best_perfect_streak integer,best_correct_count integer,is_me boolean)
language sql
security definer
set search_path to 'public'
as $$
  with base as (
    select r.user_id,r.player_name,
      greatest(coalesce(r.best_score,0),0)::integer best_score,
      greatest(coalesce(r.best_level,1),1)::integer best_level,
      greatest(coalesce(r.best_perfect_streak,0),0)::integer best_perfect_streak,
      greatest(coalesce(r.best_correct_count,0),0)::integer best_correct_count,
      (r.user_id=auth.uid())::boolean is_me
    from public.arena_rankings_v1 r
    left join public.profiles p on p.id=r.user_id
    where r.season=1 and r.topic=lower(trim(coalesce(p_topic,'mixed')))
      and coalesce(r.is_hidden,false)=false and coalesce(p.is_admin,false)=false and r.best_score>0
  ), ranked as (
    select row_number() over(order by best_score desc,best_level desc,best_perfect_streak desc,best_correct_count desc,player_name asc)::bigint rank_no,* from base
  )
  select rank_no,user_id,player_name,best_score,best_level,best_perfect_streak,best_correct_count,is_me
  from ranked order by rank_no limit least(greatest(coalesce(p_limit,100),1),100);
$$;

create or replace function public.arena_reset_my_score_v1(p_topic text default null)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
declare uid uuid:=auth.uid(); v_count integer:=0;
begin
  if uid is null then raise exception 'LOGIN_REQUIRED'; end if;
  if p_topic is null or trim(p_topic)='' then
    delete from public.arena_rankings_v1 where user_id=uid and season=1;
  else
    delete from public.arena_rankings_v1 where user_id=uid and season=1 and topic=lower(trim(p_topic));
  end if;
  get diagnostics v_count=row_count;
  return jsonb_build_object('ok',true,'deleted',v_count,'season',1);
end;
$$;

grant execute on function public.arena_identity_v1() to authenticated;
grant execute on function public.arena_submit_score_v1(text,integer,integer,integer,integer) to authenticated;
grant execute on function public.arena_reset_my_score_v1(text) to authenticated;
grant execute on function public.arena_list_leaderboard_v1(text,integer) to anon,authenticated;

-- Hard reset former Excel Race rankings before Arena Season 1.
delete from public.race_rankings_v4;
delete from public.race_rankings_v2;
delete from public.race_leaderboard;
