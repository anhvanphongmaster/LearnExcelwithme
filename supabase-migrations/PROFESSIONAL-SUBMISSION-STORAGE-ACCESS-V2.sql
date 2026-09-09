-- Professional Track submission Storage access V2.
-- Prevent ordinary authenticated accounts from using the private Pro submission
-- bucket unless their Professional access is currently valid. Admin keeps bypass.

alter policy "professional submissions insert own"
on storage.objects
with check (
  bucket_id = 'professional-track-submissions'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.professional_track_has_access_v2()
);

alter policy "professional submissions update own"
on storage.objects
using (
  bucket_id = 'professional-track-submissions'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.professional_track_has_access_v2()
)
with check (
  bucket_id = 'professional-track-submissions'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.professional_track_has_access_v2()
);

alter policy "professional submissions read own or admin"
on storage.objects
using (
  bucket_id = 'professional-track-submissions'
  and (
    coalesce(public.is_admin_user(),false)
    or (
      (storage.foldername(name))[1] = auth.uid()::text
      and public.professional_track_has_access_v2()
    )
  )
);
