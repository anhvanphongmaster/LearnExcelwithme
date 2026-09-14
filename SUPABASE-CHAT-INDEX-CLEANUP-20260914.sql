-- WRITE-AMPLIFICATION INDEX CLEANUP CHECKPOINT — 2026-09-14
--
-- 1) admin_chat_threads_last_idx
-- Evidence before removal:
--   - 0 idx_scan since stats reset 2026-07-24.
--   - admin_chat_threads was small (~611 rows / ~208 kB at audit time).
--   - Every real chat send updates last_message_at, so the unused index was
--     maintained on message traffic without serving current query plans.
--
-- 2) download_assets_download_count_idx
-- Evidence before removal:
--   - 0 idx_scan since stats reset 2026-07-24.
--   - track_download_asset increments download_count on every tracked download.
--   - Current Admin/user catalog RPCs do not order/filter by download_count;
--     they only display/sum it, so this index added write amplification without
--     serving current reads.
--
-- Safe/idempotent cleanup. Chat ordering, download counters and RPC behavior
-- are unchanged; only unused secondary indexes are removed.

drop index if exists public.admin_chat_threads_last_idx;
drop index if exists public.download_assets_download_count_idx;
