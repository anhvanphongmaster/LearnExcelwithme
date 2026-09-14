(() => {
  'use strict';
  const C = window.AVPLearningCoach;
  if (!C) return;
  const KEY = 'avp_coach_daily_start_v1';
  const GLOBAL = () => (window.AVPDailyExpand && window.AVPDailyExpand.startDate) || '2026-09-14';

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
  window.AVPDailyStart = { getDailyStartDate, isSignedIn, vnDate, KEY };
})();
