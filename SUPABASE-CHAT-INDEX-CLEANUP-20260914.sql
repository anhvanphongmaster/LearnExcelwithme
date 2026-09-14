-- CHAT INDEX CLEANUP CHECKPOINT — 2026-09-14
-- Evidence before removal:
--   admin_chat_threads_last_idx = 0 idx_scan since stats reset 2026-07-24.
--   admin_chat_threads is small (~611 rows / ~208 kB at audit time).
--   Every real chat send updates last_message_at, so keeping an unused index on
--   last_message_at adds write amplification without serving current queries.
--
-- Safe/idempotent cleanup. The chat RPCs and ordering semantics are unchanged.

drop index if exists public.admin_chat_threads_last_idx;
