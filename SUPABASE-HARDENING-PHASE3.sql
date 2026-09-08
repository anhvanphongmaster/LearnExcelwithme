-- LearnExcelwithme — Supabase Hardening Phase 3
-- Applied to production on 2026-09-08.
-- Keep this file in the repo as migration/audit history. DO NOT run again unless restoring a fresh database.

-- =========================================================
-- 1) Lock Admin-only SECURITY DEFINER RPCs from anon.
--    Authenticated remains allowed because the functions' own Admin guard
--    determines whether the signed-in user is actually an Admin.
-- =========================================================
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure::text as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef
      and (p.proname like 'admin\_%' escape '\' or p.proname like 'avp\_chat\_admin\_%' escape '\')
  loop
    execute format('revoke execute on function %s from public, anon', r.sig);
    execute format('grant execute on function %s to authenticated, service_role', r.sig);
  end loop;

  -- Trigger functions are internal implementation details, never REST endpoints.
  for r in
    select distinct p.oid::regprocedure::text as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef
      and p.prorettype = 'trigger'::regtype
      and exists (
        select 1 from pg_trigger t
        where t.tgfoid = p.oid and not t.tgisinternal
      )
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', r.sig);
    execute format('grant execute on function %s to service_role', r.sig);
  end loop;
end
$$;

-- =========================================================
-- 2) Session-bound RPCs: require a signed-in user.
-- =========================================================
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure::text as sig
    from pg_proc p
    join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public'
      and p.prosecdef
      and p.proname = any(array[
        'avp_ai_add_assistant_message','avp_ai_feedback','avp_ai_get_or_create_session','avp_ai_history','avp_ai_history_v2','avp_ai_last_user_question',
        'avp_chat_ensure_daily_greeting','avp_chat_get_or_create_thread','avp_chat_mark_student_read_state','avp_chat_mark_user_read','avp_chat_my_messages','avp_chat_my_unread_count','avp_chat_reactions_for_messages','avp_chat_save_push_subscription','avp_chat_send_user_message','avp_chat_set_reaction',
        'claim_account_name',
        'community_answer_accept','community_answer_create','community_answer_rate','community_answer_vote','community_certificate_issue','community_question_create','community_report_create','community_user_profile_update',
        'notification_center_list','notification_mark_all_read','notification_mark_read','notification_unread_count',
        'practice_grader_create_appeal','practice_grader_gift_star','practice_grader_my_stats','practice_grader_my_submission','practice_grader_my_submission_v12','practice_grader_my_submissions_v18','practice_grader_record_attempt','practice_grader_send_star','practice_grader_set_result_visibility','practice_grader_set_visibility','practice_grader_submit_once','practice_grader_submit_once_v12',
        'professional_track_access_status_v1','professional_track_apply_v1','professional_track_mark_activity_v1','professional_track_score_snapshot_v1',
        'upsert_learning_leaderboard','vote_practice_topic','weekly_league_my_rank_v74'
      ])
  loop
    execute format('revoke execute on function %s from public, anon', r.sig);
    execute format('grant execute on function %s to authenticated, service_role', r.sig);
  end loop;

  -- Event-trigger helpers are internal infrastructure.
  for r in
    select p.oid::regprocedure::text as sig
    from pg_proc p
    join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public'
      and p.prosecdef
      and p.prorettype='event_trigger'::regtype
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', r.sig);
    execute format('grant execute on function %s to service_role', r.sig);
  end loop;
end
$$;

-- =========================================================
-- 3) Community profile privacy.
--    Public feed/answers/leaderboards remain public, but detailed profile/wallet
--    requires login. warning_count is visible only to self or Admin.
-- =========================================================
revoke execute on function public.community_profile(uuid) from public, anon;
grant execute on function public.community_profile(uuid) to authenticated, service_role;
revoke execute on function public.community_certificate_status(uuid) from public, anon;
grant execute on function public.community_certificate_status(uuid) to authenticated, service_role;
revoke execute on function public.community_certificate_wallet(uuid) from public, anon;
grant execute on function public.community_certificate_wallet(uuid) to authenticated, service_role;
revoke execute on function public.community_user_profile_get(uuid) from public, anon;
grant execute on function public.community_user_profile_get(uuid) to authenticated, service_role;

create or replace function public.community_user_profile_get(p_user_id uuid default null::uuid)
returns table(
  user_id uuid,
  display_name text,
  avatar_path text,
  bio text,
  trust_status text,
  community_status text,
  warning_count integer
)
language sql
stable security definer
set search_path to 'public'
as $function$
select
  p.id,
  coalesce(nullif(trim(p.display_name),''),'Học viên')::text as display_name,
  c.avatar_path,
  c.bio,
  coalesce(c.trust_status,'normal')::text as trust_status,
  coalesce(c.community_status,'active')::text as community_status,
  case
    when p.id = auth.uid() or coalesce(public.is_admin_user(),false)
      then coalesce(c.warning_count,0)::integer
    else 0::integer
  end as warning_count
from public.profiles p
left join public.community_user_profiles c on c.user_id=p.id
where p.id=coalesce(p_user_id,auth.uid())
limit 1;
$function$;

revoke execute on function public.community_user_profile_get(uuid) from public, anon;
grant execute on function public.community_user_profile_get(uuid) to authenticated, service_role;

-- =========================================================
-- 4) Race: leaderboard read remains public; identity/score mutations require login.
-- =========================================================
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure::text as sig
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.prosecdef
      and p.proname = any(array[
        'race_current_display_name_v4','race_rank_activate_v4',
        'race_reset_my_score_v2','race_reset_my_score_v4',
        'race_submit_score_v2','race_submit_score_v4',
        'race_sync_identity_v4','race_unhide_my_rank_v4'
      ])
  loop
    execute format('revoke execute on function %s from public, anon', r.sig);
    execute format('grant execute on function %s to authenticated, service_role', r.sig);
  end loop;
end
$$;

revoke execute on function public.race_v4_migration_report() from public, anon, authenticated;
grant execute on function public.race_v4_migration_report() to service_role;

-- =========================================================
-- 5) Fixed search_path for helper functions flagged by Supabase Advisor.
-- =========================================================
alter function public.norm_handle(text) set search_path = '';
alter function public.admin_vote_period_start(text) set search_path = '';
alter function public.avp_touch_updated_at() set search_path = '';
alter function public.week_start_v74() set search_path = '';
