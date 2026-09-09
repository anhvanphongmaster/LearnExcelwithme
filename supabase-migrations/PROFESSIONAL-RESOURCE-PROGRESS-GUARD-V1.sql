-- Professional Track resource progress guard V1.
-- Keep Student/Guide files private not only by Pro approval, but also by the
-- same Case/Level progression enforced by the learner UI and submission RPC.

create or replace function public.professional_track_resource_readable_v1(
  p_path text
)
returns boolean
language plpgsql
stable
security definer
set search_path to 'public', 'auth', 'storage'
as $function$
declare
  target_case_key text := split_part(coalesce(trim(p_path),''),'/',1);
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
  if auth.uid() is null then
    return false;
  end if;

  if coalesce(public.is_admin_user(),false) then
    return true;
  end if;

  if not public.professional_track_has_access_v2() then
    return false;
  end if;

  if target_case_key = '' then
    return false;
  end if;

  select c.domain_key, c.module_index, c.level_id, c.case_index
    into target_domain, target_module, target_level, target_case_index
  from public.professional_track_cases_v2 c
  where c.case_key = target_case_key
    and c.published
  limit 1;

  if not found then
    return false;
  end if;

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
      return false;
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
      return false;
    end if;
  end if;

  return true;
end;
$function$;

revoke all on function public.professional_track_resource_readable_v1(text) from public;
revoke all on function public.professional_track_resource_readable_v1(text) from anon;
grant execute on function public.professional_track_resource_readable_v1(text) to authenticated;
grant execute on function public.professional_track_resource_readable_v1(text) to service_role;

drop policy if exists "professional resources approved pro read lite" on storage.objects;
drop policy if exists "professional resources unlocked pro read" on storage.objects;

create policy "professional resources unlocked pro read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'professional-track-resources'
  and public.professional_track_resource_readable_v1(name)
);
