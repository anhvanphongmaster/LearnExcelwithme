-- Keep legacy race leaderboard data available only to privileged database routines.
-- The current site checks its names through is_account_name_taken(); it does not use
-- direct REST table access. The broad policies exposed claim_token and allowed score edits.
revoke all on table public.race_leaderboard from anon, authenticated;
drop policy if exists race_board_insert on public.race_leaderboard;
drop policy if exists race_board_select on public.race_leaderboard;
drop policy if exists race_board_update on public.race_leaderboard;

-- Vote writes go through vote_practice_lesson() so clients cannot bypass its
-- per-day uniqueness behavior with direct REST inserts.
revoke all on table public.practice_votes from anon, authenticated;
drop policy if exists practice_votes_insert_anon on public.practice_votes;

-- Chat attachments are private. Users may read their own uploads and files sent
-- by admins in their own thread; admins retain access to all chat attachments.
drop policy if exists "avp chat authenticated read" on storage.objects;
create policy "avp chat thread scoped read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'chat-attachments'
  and (
    (select public.avp_chat_is_admin())
    or (
      (storage.foldername(name))[1] = 'users'
      and (storage.foldername(name))[2] = (select auth.uid())::text
    )
    or (
      (storage.foldername(name))[1] = 'admin'
      and exists (
        select 1
        from public.admin_chat_threads t
        where t.id::text = (storage.foldername(name))[2]
          and t.user_id = (select auth.uid())
      )
    )
  )
);

notify pgrst, 'reload schema';
