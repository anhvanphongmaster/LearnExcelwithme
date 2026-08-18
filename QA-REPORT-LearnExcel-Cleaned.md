# QA Report — Learn Excel with Anh Van Phong (Cleaned)

**Date:** 2026-08-16  
**Source ZIP:** WebsideCuaToi - Copy.zip  
**Output ZIP:** LearnExcel-AnhVanPhong-Cleaned.zip  
**Structure:** Flat root (index.html, excel.html, downloads/, …) — no outer v21 / project / dist folder.

---

## 1. Full ZIP Audit Summary

### Present at root
- HTML: 38 pages (index, excel, 6 core lessons, power-query-course, practice-lab, master-learning, excel-mobile, dashboard, achievements, auth, profile, admin, etc.)
- CSS: ~25 (style.css, theme-polish-v33.css, simple-nav.css, avp-core, gamification-v*, learning-*, practice-*, power-query-*, excel-mobile, etc.)
- JS: ~30 (script.js, theme-unified-v32.js, gamification-*, course-engine, cloud-sync-v11, supabase-*, excel-mobile.js, …)
- downloads/: all practice xlsx + PowerQuery-Practice-10-Files.zip + Practice-Lab-V14-Datasets.zip + power-query/ (10 inputs + Master Expected) + practice-lab/ (3 projects)
- Icons, manifest, SQL setup scripts, SUPABASE-SETUP.md, ADMIN-ANALYTICS-SETUP.txt

### Removed (and why)
| File | Reason |
|------|--------|
| redesign.css / redesign.js | Completely unreferenced by any HTML/JS |
| auth-demo-localstorage-disabled.js | Not linked; demo/test only |
| V17-CHANGES.txt, V19-NAV-REPORT.json, V32-THEME-REPORT.txt, TEST-REPORT-V15.txt | Internal version notes / reports, not needed for production |
| Entire nested `v21/` tree (148 files) | Obsolete duplicate of older build; caused nested project structure and bloat |

### Protected (not touched)
- All localStorage keys (see section 6)
- Supabase auth / cloud-sync logic
- XP / quiz / lesson progress calculation
- Excel Mobile upload/edit/download flow
- All downloadable practice files

---

## 2. Bugs Fixed / Changes Made

1. **Nested obsolete version removed** — extracted only the current site; eliminated `v21/` and outer “WebsideCuaToi - Copy” folder so GitHub Pages / extract works cleanly.
2. **Design system expanded** in `theme-polish-v33.css`:
   - Full CSS variables (`--avp-primary`, `--avp-surface`, `--avp-text`, `--avp-muted`, `--avp-border`, success/warning/danger, radius).
   - Stronger dark-mode rules for cards, panels, tables, inputs, locked states, practice-file cards, progress bars, footers, XP badges.
   - Ensures no washed-out white cards and readable locked content.
3. **Navigation standardized** on `power-query-course.html` and `practice-lab.html` (previously used plain `<header><nav>`). Now use consistent `top-simple-nav` with Trang chủ / Tìm kiếm / Giới thiệu / Liên hệ / theme toggle + mobile menu.
4. **Dark-mode inline section fixed** in `master-learning.html` (Practice Lab CTA was hard-coded light green/white; now uses `.home-cta-card` so theme-polish variables apply).
5. **Broken / missing internal file links**: only hash anchors to non-existent IDs on a few pages (cosmetic). No missing download files.
6. **No accidental data wipe**: confirmed zero `localStorage.clear()` / `sessionStorage.clear()` on normal page load. Only intentional user-confirmed reset exists (learning-path 30-day reset).

---

## 3. Protected User-Data Keys

These keys are **never renamed or cleared** by normal page load:

- `theme` (light/dark)
- `avp_xp_v2`
- `avp_bonus_xp_v1`
- `quizBestScore`
- `avp_quiz_done_v1`
- `avp_lesson_progress_v1`
- `avp_learning_history_v2`
- `avp_recent_lessons_v1`
- `avp_activity_days_v1` / `avp_visit_days_v1`
- `avp_badge_unlock_dates_v9`
- `avp_bookmarks_v2`
- `avp_cloud_last_sync_v11`
- `avp_daily_rewards_v1`
- `avp_demo_session_v1` / `avp_demo_users_v1`
- `avp_excel_challenge_stats_v1`
- `avp_excel_mobile_workflows_v1`
- `avp_learning_events_v1`
- `avp_playground_completed_v1` / `avp_playground_progress_v1`
- `avpSearchRecent`
- Learning-path related keys (START_KEY, done list, etc.)
- Supabase session / user state (handled by supabase-auth.js)

---

## 4. Download Paths Tested (all exist)

**Core 6 + extras (excel.html):**
- downloads/phim-tat-thuc-hanh.xlsx
- downloads/cong-thuc-co-ban-thuc-hanh.xlsx
- downloads/pivot-thuc-hanh.xlsx
- downloads/pareto-thuc-hanh.xlsx
- downloads/filter-sort-thuc-hanh.xlsx
- downloads/bao-cao-qc.xlsx
- downloads/if-countif-sumif-thuc-hanh.xlsx
- downloads/vlookup-xlookup-thuc-hanh.xlsx
- downloads/xu-ly-text-thuc-hanh.xlsx
- downloads/ngay-gio-thuc-hanh.xlsx
- downloads/sumproduct-qc-thuc-hanh.xlsx
- downloads/conditional-formatting-qc-thuc-hanh.xlsx

**Power Query (own dataset):**
- downloads/PowerQuery-Practice-10-Files.zip
- downloads/power-query/Input_01.xlsx … Input_10.xlsx
- downloads/power-query/PowerQuery-Master-Expected.xlsx

**Practice Lab:**
- downloads/Practice-Lab-V14-Datasets.zip
- downloads/practice-lab/PivotTable-Practice.xlsx
- downloads/practice-lab/Dashboard-Practice.xlsx
- downloads/practice-lab/DAX-Practice.xlsx

All relative paths are GitHub-Pages compatible.

---

## 5. Files Modified

- `theme-polish-v33.css` — expanded design system + dark-mode coverage
- `master-learning.html` — CTA section class-based for theme support
- `power-query-course.html` — standardized top navigation
- `practice-lab.html` — standardized top navigation

---

## 6. Remaining Known Issues / Notes

- Some older pages still carry large inline `<style>` blocks (legacy). They are overridden by `theme-polish-v33.css` which is loaded last; full removal of every inline style would be a larger refactor and was intentionally avoided to preserve working features.
- A few hash-only links (e.g. `#data-quality` on excel-nang-cao.html) point to IDs that may not exist; they do not break navigation.
- Gamification has multiple versions (v8/v9 + plain). All are still referenced by different pages; consolidation would require deeper testing of XP/badge logic and was left intact.
- Full visual QA of every page in both light/dark + mobile was performed on key pages (index, excel, master-learning, power-query, practice-lab, excel-mobile, dashboard). Remaining pages inherit the same theme system and nav patterns.
- Excel Mobile, Supabase, cloud sync, quiz XP, and progress remain functional as in the original.

---

## 7. Final ZIP Location

`/home/workdir/artifacts/LearnExcel-AnhVanPhong-Cleaned.zip`

Extract → you immediately see `index.html`, `excel.html`, `downloads/`, CSS/JS at root.
