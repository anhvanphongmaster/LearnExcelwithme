(() => {
  'use strict';
  const C = window.AVPLearningCoach;
  if (!C) return;
  const KEY = 'avp_coach_daily_start_v1';
  const RESET_KEY = 'avp_learning_reset_20261030_v1';
  if (!localStorage.getItem(RESET_KEY)) {
    ['avp_coach_exp_v2','avp_xp_v2','avp_quiz_done_v1','avp_lesson_progress_v1','avp_coach_daily_v1','avp_coach_daily_start_v1','avp_coach_cases_v1','avp_learning_achievements_v1','avp_learning_streak_v1'].forEach(k => { try { localStorage.removeItem(k); } catch (_) {} });
    try { localStorage.setItem(RESET_KEY, '1'); } catch (_) {}
  }

  const GLOBAL = () => (window.AVPDailyExpand && window.AVPDailyExpand.globalStartDate) || (window.AVPDailyExpand && window.AVPDailyExpand.startDate) || '2026-10-30';

  function readMap() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch (_) { return {}; }
  }
  function writeMap(map) {
    try { localStorage.setItem(KEY, JSON.stringify(map)); } catch (_) {}
  }
  function vnDate() {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(new Date());
    } catch (_) {
      return C.localDate ? C.localDate() : new Date().toISOString().slice(0, 10);
    }
  }
  function isSignedIn() {
    const id = C.getLearnerId ? C.getLearnerId() : '';
    return String(id).startsWith('u:');
  }
  function hadPriorPack() {
    const all = C.getDaily ? C.getDaily() : {};
    return Object.values(all || {}).some(row => row && (row.ids || row.packIndex != null || row.kind === 'expand60'));
  }
  function getDailyStartDate() {
    const learner = C.getLearnerId ? C.getLearnerId() : 'g';
    const map = readMap();
    if (map[learner]) return map[learner];
    if (!String(learner).startsWith('u:')) return GLOBAL();
    const start = hadPriorPack() ? GLOBAL() : vnDate();
    map[learner] = start;
    writeMap(map);
    return start;
  }
  function apply() {
    const E = window.AVPDailyExpand;
    if (!E) return getDailyStartDate();
    if (!E.globalStartDate) E.globalStartDate = E.startDate || '2026-10-30';
    E.startDate = getDailyStartDate();
    return E.startDate;
  }
  apply();
  [400, 1200, 2500].forEach(ms => setTimeout(apply, ms));
  window.addEventListener('storage', apply);
  window.AVPDailyStart = { getDailyStartDate, isSignedIn, vnDate, apply, KEY };
})();
