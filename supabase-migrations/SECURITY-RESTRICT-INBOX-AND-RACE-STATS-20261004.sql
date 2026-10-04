-- Inbox uploads contain learner-submitted files. Keep submission uploads in
-- their existing inbox path, but prevent one learner from reading another's files.
drop policy if exists "practice_uploads_select_auth" on storage.objects;
drop policy if exists "practice_uploads_admin_select" on storage.objects;
create policy "practice_uploads_admin_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'practice-uploads'
  and (select public.is_admin_user())
);

-- Preserve the legacy inbox submission flow while preventing anonymous clients
-- from writing into lesson-resource folders.
drop policy if exists "practice_uploads_insert" on storage.objects;
create policy "practice_uploads_inbox_insert"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'practice-uploads'
  and (storage.foldername(name))[1] = 'inbox'
);

-- Race plays are used by the Admin analytics panel only; the current game records
-- competitive scores through arena RPCs. Keep statistics visible to admins and
-- stop public clients from forging counts directly.
drop policy if exists "race_plays_select_all" on public.race_plays;
drop policy if exists "race_plays_admin_select" on public.race_plays;
create policy "race_plays_admin_select"
on public.race_plays
for select
to authenticated
using ((select public.is_admin_user()));

drop policy if exists "race_plays_insert_anon" on public.race_plays;
revoke insert on table public.race_plays from anon, authenticated;

notify pgrst, 'reload schema';
