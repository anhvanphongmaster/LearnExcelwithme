-- Professional Track publish guard V3 timestamp precision fix
-- Production migration: professional_grader_publish_guard_v3_ms_precision
-- Storage API exposes updated_at at millisecond precision while Postgres can retain finer precision.
-- Compare the same millisecond precision so a freshly validated Reference is not rejected as stale.

create or replace function public.admin_professional_track_case_upsert_v2(
  p_case_key text,
  p_domain_key text,
  p_module_index integer,
  p_level_id text,
  p_case_index integer,
  p_title text,
  p_goal text,
  p_tasks jsonb,
  p_skills text default null,
  p_expected_output text default null,
  p_duration text default null,
  p_max_score numeric default 10,
  p_source_url text default null,
  p_guide_url text default null,
  p_submission_enabled boolean default true,
  p_published boolean default false
)
returns public.professional_track_cases_v2
language plpgsql
security definer
set search_path to 'public','auth','storage'
as $function$
declare
  result public.professional_track_cases_v2;
  source_path text := nullif(trim(p_source_url),'');
  guide_path text := nullif(trim(p_guide_url),'');
  reference_updated_at timestamptz;
  validation_state jsonb;
  validation_reference_updated_at timestamptz;
  test_pass numeric;
  test_hardcode numeric;
  test_wrong numeric;
begin
  if not coalesce(public.is_admin_user(),false) then raise exception 'admin_required'; end if;
  if p_case_key <> p_domain_key || '-' || p_module_index::text || '-' || p_level_id || '-' || p_case_index::text then raise exception 'invalid_case_key'; end if;
  if nullif(trim(p_title),'') is null then raise exception 'title_required'; end if;
  if nullif(trim(p_goal),'') is null then raise exception 'goal_required'; end if;
  if jsonb_typeof(p_tasks) <> 'array' or jsonb_array_length(p_tasks)=0 then raise exception 'tasks_required'; end if;
  if p_max_score is distinct from 10::numeric then raise exception 'max_score_must_be_10'; end if;

  if source_path is not null and source_path not like p_case_key || '/source/%' then raise exception 'invalid_source_path'; end if;
  if guide_path is not null and guide_path not like p_case_key || '/guide/%' then raise exception 'invalid_guide_path'; end if;

  if source_path is not null and not exists (
    select 1 from storage.objects o where o.bucket_id='professional-track-resources' and o.name=source_path
  ) then raise exception 'source_object_missing'; end if;

  if guide_path is not null and not exists (
    select 1 from storage.objects o where o.bucket_id='professional-track-resources' and o.name=guide_path
  ) then raise exception 'guide_object_missing'; end if;

  if coalesce(p_published,false) then
    if source_path is null then raise exception 'published_case_requires_private_source'; end if;
    if guide_path is null then raise exception 'published_case_requires_private_guide'; end if;

    if coalesce(p_submission_enabled,true) then
      select o.updated_at into reference_updated_at
      from storage.objects o
      where o.bucket_id='professional-track-grading'
        and o.name=p_case_key || '/reference.xlsx'
      limit 1;
      if reference_updated_at is null then raise exception 'published_case_requires_reference'; end if;

      select c.grader_validation into validation_state
      from public.professional_track_cases_v2 c
      where c.case_key=p_case_key;

      if validation_state is null
        or coalesce(validation_state->>'status','') <> 'validated'
        or coalesce(validation_state->>'version','') <> 'AVP_PRO_GRADER_V3'
      then
        raise exception 'grader_validation_v3_required';
      end if;

      begin
        validation_reference_updated_at := nullif(validation_state->>'reference_updated_at','')::timestamptz;
        test_pass := nullif(validation_state #>> '{tests,pass}','')::numeric;
        test_hardcode := nullif(validation_state #>> '{tests,hardcode}','')::numeric;
        test_wrong := nullif(validation_state #>> '{tests,wrong_formula}','')::numeric;
      exception when others then
        raise exception 'grader_validation_invalid';
      end;

      if date_trunc('milliseconds', validation_reference_updated_at) is distinct from date_trunc('milliseconds', reference_updated_at) then
        raise exception 'grader_validation_stale';
      end if;

      if test_pass is distinct from 10::numeric
        or test_hardcode is null or test_hardcode >= 7
        or test_wrong is null or test_wrong >= 7
      then
        raise exception 'grader_validation_failed_tests';
      end if;
    end if;
  end if;

  insert into public.professional_track_cases_v2(
    case_key,domain_key,module_index,level_id,case_index,title,goal,tasks,
    skills,expected_output,duration,max_score,source_url,guide_url,
    submission_enabled,published,updated_by,updated_at
  ) values (
    p_case_key,p_domain_key,p_module_index,p_level_id,p_case_index,
    trim(p_title),trim(p_goal),p_tasks,
    nullif(trim(p_skills),''),nullif(trim(p_expected_output),''),nullif(trim(p_duration),''),10,
    source_path,guide_path,coalesce(p_submission_enabled,true),coalesce(p_published,false),auth.uid(),now()
  )
  on conflict(case_key) do update set
    title=excluded.title,
    goal=excluded.goal,
    tasks=excluded.tasks,
    skills=excluded.skills,
    expected_output=excluded.expected_output,
    duration=excluded.duration,
    max_score=10,
    source_url=excluded.source_url,
    guide_url=excluded.guide_url,
    submission_enabled=excluded.submission_enabled,
    published=excluded.published,
    updated_by=auth.uid(),
    updated_at=now()
  returning * into result;

  return result;
end;
$function$;
