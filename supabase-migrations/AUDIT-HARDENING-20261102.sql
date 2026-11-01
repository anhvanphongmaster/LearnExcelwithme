-- AUDIT HARDENING — 2026-11-02
-- Changes already applied to the linked Supabase project.
-- Kept in the repository so schema/security changes remain reviewable.
-- Safe to re-run: indexes are guarded and function grants/settings are repeatable.

-- Index foreign-key columns used by admin content audit and Office Quest review.
create index if not exists idx_content_audits_v1_content_id
  on public.content_audits_v1 (content_id);

create index if not exists idx_office_quest_applications_reviewed_by
  on public.office_quest_applications (reviewed_by);

-- Pin search_path for stable function resolution.
alter function public.avp_content_dashboard_v1() set search_path = '';
alter function public.avp_content_list_v1(text, text) set search_path = '';

-- These functions are invoked by database triggers, not by API clients.
revoke execute on function public.avp_retire_legacy_learning_progress()
  from public, anon, authenticated;
revoke execute on function public.avp_touch_updated_at()
  from public, anon, authenticated;
revoke execute on function public.youtube_projects_touch_updated_at()
  from public, anon, authenticated;

-- Restore input validation for the public lesson-vote RPC.
-- Keep all four vote types permitted by the existing table CHECK constraint.
create or replace function public.vote_practice_lesson(
  p_lesson_id text,
  p_lesson_number integer,
  p_lesson_title text,
  p_vote_type text,
  p_voter_key text
)
returns json
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_day date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  if p_lesson_id is null or length(btrim(p_lesson_id)) = 0 or length(p_lesson_id) > 120 then
    return json_build_object('ok', false, 'error', 'missing_lesson');
  end if;

  if p_voter_key is null or length(btrim(p_voter_key)) < 8 or length(p_voter_key) > 128 then
    return json_build_object('ok', false, 'error', 'missing_voter');
  end if;

  if p_vote_type not in ('need_guide', 'need_more_guide', 'focus_youtube', 'focus_tiktok') then
    return json_build_object('ok', false, 'error', 'bad_type');
  end if;

  if length(coalesce(p_lesson_title, '')) > 200 then
    return json_build_object('ok', false, 'error', 'bad_title');
  end if;

  insert into public.practice_votes (
    lesson_id, lesson_number, lesson_title, vote_type, voter_key, vote_day
  )
  values (
    p_lesson_id, p_lesson_number, p_lesson_title, p_vote_type, p_voter_key, v_day
  )
  on conflict (lesson_id, voter_key, vote_day) do nothing;

  if not found then
    return json_build_object('ok', false, 'error', 'already_voted_today');
  end if;

  return json_build_object('ok', true);
end;
$function$;
