-- Production migration for Professional Track sequential progress guard V2.
-- Enforces the same Case/Level unlock rules server-side so learners cannot bypass
-- the UI by calling professional_track_submit_case_v2 directly.

create or replace function public.professional_track_submit_case_v2(
  p_case_key text,
  p_file_path text,
  p_original_name text default null::text,
  p_note text default null::text
)
returns uuid
language plpgsql
security definer
set search_path to 'public', 'auth', 'storage'
as $function$
declare
  submission_id uuid;
  is_admin boolean := coalesce(public.is_admin_user(),false);
  target_domain text;
  target_module integer;
  target_level text;
  target_case_index integer;
  previous_level text;
  passed_prior_cases integer := 0;
  previous_level_graded integer := 0;
  previous_level_total numeric := 0;
  previous_level_min numeric := 0;
begin
  if not public.professional_track_has_access_v2() then
    raise exception 'access_denied';
  end if;

  if p_file_path is null
     or p_file_path not like auth.uid()::text || '/%'
  then
    raise exception 'invalid_file_path';
  end if;

  select c.domain_key, c.module_index, c.level_id, c.case_index
    into target_domain, target_module, target_level, target_case_index
  from public.professional_track_cases_v2 c
  where c.case_key = p_case_key
    and c.submission_enabled
    and (c.published or is_admin)
  limit 1;

  if not found then
    raise exception 'case_not_open';
  end if;

  if not is_admin then
    if target_case_index > 1 then
      select count(*)
        into passed_prior_cases
      from generate_series(1,target_case_index - 1) as g(case_index)
      join public.professional_track_case_submissions_v2 s
        on s.user_id = auth.uid()
       and s.case_key = format('%s-%s-%s-%s',target_domain,target_module,target_level,g.case_index)
       and s.status = 'graded'
       and coalesce(s.score,0) >= 7;

      if passed_prior_cases <> target_case_index - 1 then
        raise exception 'case_sequence_locked';
      end if;
    end if;

    previous_level := case target_level
      when 'intermediate' then 'basic'
      when 'advanced' then 'intermediate'
      when 'professional' then 'advanced'
      else null
    end;

    if previous_level is not null then
      select
        count(*) filter (where s.status = 'graded'),
        coalesce(sum(s.score) filter (where s.status = 'graded'),0),
        coalesce(min(s.score) filter (where s.status = 'graded'),0)
        into previous_level_graded, previous_level_total, previous_level_min
      from generate_series(1,3) as g(case_index)
      left join public.professional_track_case_submissions_v2 s
        on s.user_id = auth.uid()
       and s.case_key = format('%s-%s-%s-%s',target_domain,target_module,previous_level,g.case_index);

      if previous_level_graded <> 3
         or previous_level_min < 7
         or previous_level_total < 25
      then
        raise exception 'level_locked';
      end if;
    end if;
  end if;

  if not exists (
    select 1
    from storage.objects o
    where o.bucket_id = 'professional-track-submissions'
      and o.name = p_file_path
  ) then
    raise exception 'submission_object_missing';
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
$function$;

revoke all on function public.professional_track_submit_case_v2(text,text,text,text) from public;
revoke all on function public.professional_track_submit_case_v2(text,text,text,text) from anon;
grant execute on function public.professional_track_submit_case_v2(text,text,text,text) to authenticated;
grant execute on function public.professional_track_submit_case_v2(text,text,text,text) to service_role;
