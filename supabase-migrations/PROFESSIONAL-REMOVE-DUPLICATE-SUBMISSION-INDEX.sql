-- Professional Track performance cleanup
-- Applied to production 2026-09-09.
-- The unique index on (user_id, case_key) already covers the same key order,
-- so this duplicate non-unique index only adds write/storage overhead.

drop index if exists public.professional_track_submissions_v2_user_idx;
