-- Reset BXH Excel Race (chạy trong Supabase SQL Editor)

-- Xóa 1 người theo tên:
-- delete from public.race_leaderboard where player_name = 'Tuấn học Excel';

-- Xóa toàn bộ BXH Race:
-- truncate table public.race_leaderboard;

-- Về 0 điểm nhưng giữ tên:
update public.race_leaderboard
set best_streak = 0,
    best_level = 1,
    updated_at = now()
where player_name = 'Tuấn học Excel';
