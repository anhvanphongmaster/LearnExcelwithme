-- Remove runtime references to the dropped learning_leaderboard table.
-- Preserve its restricted historical snapshot for admin review and handle collisions.

drop function public.admin_um_list_users(text, integer, integer);
create function public.admin_um_list_users(p_search text default ''::text, p_limit integer default 100, p_offset integer default 0)
returns table(
  user_id uuid,
  display_name text,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  is_admin boolean,
  exclude_from_leaderboard boolean,
  progress_data jsonb,
  legacy_leaderboard jsonb,
  topic_vote_count bigint
)
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if not public.admin_um_is_admin() then
    raise exception 'admin_required';
  end if;

  return query
  select
    u.id,
    coalesce(
      nullif(trim(p.display_name), ''),
      split_part(u.email, '@', 1),
      'Học viên'
    )::text,
    u.email::text,
    u.created_at,
    u.last_sign_in_at,
    coalesce(p.is_admin, false),
    coalesce(p.exclude_from_leaderboard, false),
    coalesce(up.data, '{}'::jsonb),
    case when lb.user_id is null then null::jsonb else
      jsonb_build_object(
        'xp', lb.xp,
        'current_streak', lb.current_streak,
        'best_streak', lb.best_streak,
        'total_days', lb.total_days,
        'updated_at', lb.updated_at,
        'archived_at', lb.archived_at
      )
    end,
    coalesce(tv.cnt, 0)::bigint
  from auth.users u
  left join public.profiles p
    on p.id = u.id
  left join public.user_progress up
    on up.user_id = u.id
  left join public.learning_leaderboard_legacy_archive_20261004 lb
    on lb.user_id = u.id
  left join lateral (
    select count(*)::bigint as cnt
    from public.practice_topic_votes v
    where v.user_id = u.id
  ) tv on true
  where
    coalesce(trim(p_search), '') = ''
    or lower(coalesce(p.display_name, '')) like
       '%' || lower(trim(p_search)) || '%'
    or lower(coalesce(u.email, '')) like
       '%' || lower(trim(p_search)) || '%'
  order by u.created_at desc
  limit greatest(1, least(coalesce(p_limit, 100), 300))
  offset greatest(coalesce(p_offset, 0), 0);
end;
$function$;
revoke all on function public.admin_um_list_users(text, integer, integer) from public, anon, authenticated;
grant execute on function public.admin_um_list_users(text, integer, integer) to authenticated;

CREATE OR REPLACE FUNCTION public.admin_um_reset_progress(p_user_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not public.admin_um_is_admin() then
    raise exception 'admin_required';
  end if;

  insert into public.user_progress(
    user_id,
    data,
    updated_at
  )
  values(
    p_user_id,
    '{}'::jsonb,
    now()
  )
  on conflict(user_id) do update
    set data = '{}'::jsonb,
        updated_at = now();


  return json_build_object(
    'ok',true
  );
end;
$function$
;
CREATE OR REPLACE FUNCTION public.admin_um_set_admin(p_user_id uuid, p_is_admin boolean)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not public.admin_um_is_admin() then
    raise exception 'admin_required';
  end if;

  if p_user_id = auth.uid()
     and coalesce(p_is_admin,false) = false then
    return json_build_object(
      'ok',false,
      'error','cannot_remove_self'
    );
  end if;

  insert into public.profiles(
    id,
    is_admin,
    exclude_from_leaderboard
  )
  values(
    p_user_id,
    coalesce(p_is_admin,false),
    coalesce(p_is_admin,false)
  )
  on conflict(id) do update
    set is_admin = excluded.is_admin,
        exclude_from_leaderboard =
          case
            when excluded.is_admin then true
            else public.profiles.exclude_from_leaderboard
          end,
        updated_at = now();

  return json_build_object(
    'ok',true,
    'is_admin',coalesce(p_is_admin,false)
  );
end;
$function$
;
CREATE OR REPLACE FUNCTION public.admin_um_set_leaderboard_visibility(p_user_id uuid, p_hidden boolean)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not public.admin_um_is_admin() then
    raise exception 'admin_required';
  end if;

  insert into public.profiles(
    id,
    exclude_from_leaderboard
  )
  values(
    p_user_id,
    coalesce(p_hidden,false)
  )
  on conflict(id) do update
    set exclude_from_leaderboard =
        excluded.exclude_from_leaderboard,
        updated_at = now();

  return json_build_object(
    'ok',true,
    'hidden',coalesce(p_hidden,false)
  );
end;
$function$
;
CREATE OR REPLACE FUNCTION public.is_account_name_taken(p_handle text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n text := public.norm_handle(p_handle);
begin
  if n is null or length(n) < 2 then return true; end if;
  if exists (select 1 from public.account_names where handle_norm = n) then return true; end if;
  if exists (select 1 from public.learning_leaderboard_legacy_archive_20261004 where lower(display_name) = n) then return true; end if;
  if exists (select 1 from public.race_leaderboard where lower(player_name) = n) then return true; end if;
  return false;
end;
$function$
;

notify pgrst, 'reload schema';
