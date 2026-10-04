-- This archive is joined to auth.users by user_id when Admin reviews
-- historical leaderboard stats. The snapshot contains one non-null row per user.
alter table public.learning_leaderboard_legacy_archive_20261004
  add constraint learning_leaderboard_legacy_archive_20261004_pkey
  primary key (user_id);
