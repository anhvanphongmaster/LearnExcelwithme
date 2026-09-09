-- Professional Track: allow authenticated Admin to test a configured Draft Case
-- without publishing it to learners. Learner behavior is unchanged.

create or replace function public.professional_track_submit_case_v2(
  p_case_key text,
  p_file_path text,
  p_original_name text default null,
  p_note text default null
)
returns uuid
language plpgsql
security definer
set search_path to 'public','auth'
as $$
declare
  submission_id uuid;
  is_admin boolean := coalesce(public.is_admin_user(),false);
begin
  if not public.professional_track_has_access_v2() then
    raise exception 'access_denied';
  end if;

  if p_file_path is null
     or p_file_path not like auth.uid()::text || '/%'
  then
    raise exception 'invalid_file_path';
  end if;

  if not exists (
    select 1
    from public.professional_track_cases_v2 c
    where c.case_key = p_case_key
      and c.submission_enabled
      and (c.published or is_admin)
  ) then
    raise exception 'case_not_open';
  end if;

  insert into public.professional_track_case_submissions_v2 (
    user_id,
    case_key,
    file_path,
    original_name,
    note,
    status,
    submitted_at
  )
  values (
    auth.uid(),
    p_case_key,
    p_file_path,
    left(p_original_name,255),
    left(p_note,1200),
    'pending',
    now()
  )
  on conflict(user_id,case_key)
  do update set
    file_path = excluded.file_path,
    original_name = excluded.original_name,
    note = excluded.note,
    status = 'pending',
    score = null,
    feedback = null,
    attempt_count = public.professional_track_case_submissions_v2.attempt_count + 1,
    submitted_at = now(),
    graded_at = null,
    reviewed_by = null
  returning id into submission_id;

  return submission_id;
end;
$$;

revoke all on function public.professional_track_submit_case_v2(text,text,text,text) from public, anon;
grant execute on function public.professional_track_submit_case_v2(text,text,text,text) to authenticated, service_role;
