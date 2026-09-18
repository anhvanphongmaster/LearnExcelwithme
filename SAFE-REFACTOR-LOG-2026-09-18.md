# Safe Refactor Log — 2026-09-18

Branch: audit-safe-refactor-2026-09-18

Safety rules:
- main branch is untouched.
- No Supabase table/function is deleted.
- No user data is modified.
- Each change must have a direct dependency reason and a rollback path.

Verified change:
- Removed the analytics-tracker load of site-rpc-dedupe-v1.js because that file currently contains only an emergency-disable flag and performs no deduplication.
- This removes one unnecessary frontend script request without changing feature RPC behavior.

Next audit targets:
1. Duplicate Supabase reads/writes.
2. Analytics event frequency and retention.
3. Versioned RPC callers and safe consolidation.
4. CSS/JS patch layers and proven-unused files.
5. Service-worker cache behavior.

Do not merge to main until runtime verification is complete.


Additional verified changes:
- cloud-sync-v11.js: added single-flight + 15s cooldown around automatic/manual progress sync requests. This prevents repeated reconnect events from starting duplicate sync work; the underlying sync engine and user_progress data are unchanged. Rollback: revert the commit.
- analytics-tracker.js: increased page-view client dedupe TTL from 30 minutes to 60 minutes. This reduces repeated page_view INSERT/RPC writes while retaining page-view tracking; no analytics rows are deleted. Rollback: restore 30-minute TTL.

- ai-chat.js: added single-flight + 15s TTL for notification unread-count refreshes. Focus, visibility, auth, and periodic refreshes can converge on one RPC instead of issuing duplicates. No notification data is changed.

- admin-chat-core-v1.js: added single-flight guards to admin thread-list loaders (main admin inbox and floating admin inbox). Concurrent realtime/poll/manual refreshes now share one RPC; sequential refresh behavior is unchanged.

- admin-chat-core-v1.js: added single-flight protection to latest unread chat preview loading. Simultaneous badge/preview triggers now share one preview request; no caching or data mutation added.

- sw.js: removed the stale site-rpc-dedupe-v1.js entry from the service-worker precache list. The script is no longer loaded by active frontend loaders and contains no dedupe logic. This prevents the obsolete asset from being prefetched/cached; no runtime feature or DB behavior changes.

- home-page-motion.css: aligned its home-ui-owner cache-buster from owner2 to owner3, matching the active homepage loader. This removes a duplicate URL/cache key for the same CSS asset; no CSS rules or behavior changed.

- index.html: replaced the runtime fetch/patch of pinned commit 194140a1... with the exact patched HTML produced by the existing loader logic. This removes the homepage's dependency on jsDelivr/raw GitHub at runtime while preserving the same patch transformations; no Supabase/data logic changed.

- Final static verification: all 7 modified JavaScript files parse successfully; index.html no longer contains document.write(), fetch(), or the pinned external homepage URL. No Supabase table/function/data changes detected on this branch.
