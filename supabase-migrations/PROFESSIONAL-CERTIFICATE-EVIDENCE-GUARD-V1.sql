-- Production migration applied 2026-09-09.
-- Harden Professional Access so an application cannot reference a fake/deleted
-- evidence path and Admin cannot approve when the evidence object is missing.

create or replace function public.professional_track_apply_v1(
  p_certificate_path text,
  p_applicant_note text default null::text
)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'auth', 'storage'
as $function$
declare
  v_user uuid := auth.uid();
  v_status jsonb;
  v_id uuid;
  v_certificate_path text := nullif(trim(p_certificate_path),'');
begin
  if v_user is null then
    raise exception 'LOGIN_REQUIRED';
  end if;

  if v_certificate_path is null then
    raise exception 'CERTIFICATE_REQUIRED';
  end if;

  if split_part(v_certificate_path,'/',1) <> v_user::text then
    raise exception 'INVALID_CERTIFICATE_PATH';
  end if;

  if not exists (
    select 1
    from storage.objects o
    where o.bucket_id = 'professional-track-certificates'
      and o.name = v_certificate_path
  ) then
    raise exception 'CERTIFICATE_OBJECT_MISSING';
  end if;

  v_status := public.professional_track_access_status_v1();

  if coalesce((v_status ->> 'can_access')::boolean,false) then
    raise exception 'ALREADY_APPROVED';
  end if;

  if not coalesce((v_status ->> 'eligible')::boolean,false) then
    raise exception 'NOT_ELIGIBLE';
  end if;

  insert into public.professional_track_applications(
    user_id,status,
    basic_score,intermediate_score,advanced_score,active_days,
    certificate_path,applicant_note,
    submitted_at,reviewed_at,reviewed_by,admin_note,unlocked_at,updated_at
  )
  values(
    v_user,'pending',
    (v_status ->> 'basic_score')::integer,
    (v_status ->> 'intermediate_score')::integer,
    (v_status ->> 'advanced_score')::integer,
    (v_status ->> 'active_days')::integer,
    v_certificate_path,
    nullif(trim(p_applicant_note),''),
    now(),null,null,null,null,now()
  )
  on conflict (user_id)
  do update set
    status='pending',
    basic_score=excluded.basic_score,
    intermediate_score=excluded.intermediate_score,
    advanced_score=excluded.advanced_score,
    active_days=excluded.active_days,
    certificate_path=excluded.certificate_path,
    applicant_note=excluded.applicant_note,
    submitted_at=now(),
    reviewed_at=null,
    reviewed_by=null,
    admin_note=null,
    unlocked_at=null,
    updated_at=now()
  where public.professional_track_applications.status <> 'approved'
  returning id into v_id;

  if v_id is null then
    raise exception 'ALREADY_APPROVED';
  end if;

  return jsonb_build_object('ok',true,'id',v_id,'status','pending');
end;
$function$;

create or replace function public.admin_professional_track_review_v1(
  p_application_id uuid,
  p_status text,
  p_admin_note text default null::text
)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'auth', 'storage'
as $function$
declare
  v_admin uuid := auth.uid();
  v_row public.professional_track_applications%rowtype;
begin
  if not coalesce(public.is_admin_user(),false) then
    raise exception 'ADMIN_REQUIRED';
  end if;

  if p_status not in ('approved','rejected') then
    raise exception 'INVALID_STATUS';
  end if;

  if p_status='rejected' and coalesce(trim(p_admin_note),'')='' then
    raise exception 'ADMIN_NOTE_REQUIRED';
  end if;

  select * into v_row
  from public.professional_track_applications
  where id=p_application_id
  for update;

  if not found then
    raise exception 'APPLICATION_NOT_FOUND';
  end if;

  if p_status='approved' then
    if not (
      v_row.basic_score >= 1500
      and v_row.intermediate_score >= 1300
      and v_row.advanced_score >= 1000
      and v_row.active_days >= 5
    ) then
      raise exception 'APPLICATION_NO_LONGER_VALID';
    end if;

    if nullif(trim(v_row.certificate_path),'') is null
       or not exists (
         select 1
         from storage.objects o
         where o.bucket_id='professional-track-certificates'
           and o.name=v_row.certificate_path
       )
    then
      raise exception 'CERTIFICATE_EVIDENCE_MISSING';
    end if;
  end if;

  update public.professional_track_applications
  set status=p_status,
      admin_note=nullif(trim(p_admin_note),''),
      reviewed_at=now(),
      reviewed_by=v_admin,
      unlocked_at=case when p_status='approved' then coalesce(unlocked_at,now()) else null end,
      updated_at=now()
  where id=p_application_id;

  return jsonb_build_object('ok',true,'status',p_status);
end;
$function$;
