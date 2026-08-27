-- Run ONCE in Supabase SQL Editor only if practice-video.html cannot read vote totals as a guest.
-- The RPC returns aggregated counts only; it does not expose voter_key or individual users.
grant execute on function public.admin_list_practice_votes() to anon, authenticated;
