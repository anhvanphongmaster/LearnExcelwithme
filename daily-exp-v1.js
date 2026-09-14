(() => {
  'use strict';
  const C = window.AVPLearningCoach;
  if (!C) return;
  const KEY = 'avp_coach_exp_v2';
  const RULES = { lesson: 10, quizCorrect: 5, quizWrong: 0, selfPer10: 1 };
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[ch]));
  function vnDate() {
    if (window.AVPDailyStart && window.AVPDailyStart.vnDate) return window.AVPDailyStart.vnDate();
    try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
    catch (_) { return C.localDate ? C.localDate() : new Date().toISOString().slice(0, 10); }
  }
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null') || { total: 0, days: {} }; }
    catch (_) { return { total: 0, days: {} }; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
    window.dispatchEvent(new CustomEvent('avp:exp-changed', { detail: state }));
    return state;
  }
  function dayRec(state, date) {
    if (!state.days[date]) state.days[date] = { lessons: {}, quiz: 0, penalty: 0, quizSettled: false, total: 0 };
    return state.days[date];
  }
  function recount(state) {
    let sum = 0;
    Object.keys(state.days).forEach(d => {
      const row = state.days[d];
      const lessonSum = Object.values(row.lessons || {}).reduce((a, b) => a + Number(b || 0), 0);
      row.total = Math.max(0, lessonSum + Number(row.quiz || 0));
      sum += row.total;
    });
    state.total = sum;
    return state;
  }
  function awardLesson(id, ok) {
    const date = vnDate();
    const state = load();
    const row = dayRec(state, date);
    if (Object.prototype.hasOwnProperty.call(row.lessons, id)) return { added: 0, total: state.total, today: row.total, locked: true };
    row.lessons[id] = ok ? RULES.lesson : 0;
    recount(state); save(state);
    return { added: ok ? RULES.lesson : 0, total: state.total, today: row.total, locked: false };
  }
  function settleQuiz(date) {
    const state = load();
    const row = dayRec(state, date);
    if (row.quizSettled) return row;
    const daily = (C.getDaily() || {})[date] || {};
    const answers = Array.isArray(daily.quizAnswers) ? daily.quizAnswers : [];
    if (!daily.quizLocked && answers.length < 8) return row;
    row.quiz = answers.filter(x => x && x.ok).length * RULES.quizCorrect;
    row.penalty = 0;
    row.quizSettled = true;
    recount(state); save(state);
    return row;
  }
  function snapshot() {
    const state = load();
    const date = vnDate();
    const row = state.days[date] || { lessons: {}, quiz: 0, total: 0 };
    const pts = Object.values(row.lessons || {}).reduce((a, b) => a + Number(b || 0), 0);
    return { total: state.total || 0, today: row.total || 0, lessonPts: pts, quiz: row.quiz || 0 };
  }
  function todayMaps() {
    const daily = (C.getDaily() || {})[vnDate()] || {};
    return { done: daily.itemDone || {}, tried: daily.itemTried || {} };
  }
  function markTried(id, ok) {
    const date = vnDate();
    const daily = C.getDaily()[date] || {};
    const tried = Object.assign({}, daily.itemTried || {}, { [id]: true });
    const done = Object.assign({}, daily.itemDone || {});
    if (ok) done[id] = true;
    C.markDaily(date, { itemTried: tried, itemDone: done });
  }
  function closeGate() {
    document.getElementById('dxExpModal')?.remove();
    document.body.classList.remove('dx-modal-open');
  }
  function openGate(id) {
    const maps = todayMaps();
    if (maps.tried[id] || maps.done[id]) return;
    closeGate();
    const q = (window.AVPDailyConfirm || {})[id];
    const lesson = (window.AVPDailyExpand && window.AVPDailyExpand.byId && window.AVPDailyExpand.byId[id]) || {};
    const wrap = document.createElement('div');
    wrap.id = 'dxExpModal';
    wrap.className = 'dx-modal-back';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    if (!q) {
      wrap.innerHTML = '<div class="dx-modal"><div class="dx-modal-head">Chưa có câu xác nhận</div><div class="dx-modal-body"><button type="button" class="lc-btn solid" data-dx-back>Quay lại 5 bài</button></div></div>';
      document.body.appendChild(wrap);
      wrap.querySelector('[data-dx-back]').onclick = closeGate;
      return;
    }
    wrap.innerHTML = '<div class="dx-modal"><div class="dx-modal-head"><span>Xác nhận đã làm</span><b>' + esc(lesson.title || id) + '</b></div><div class="dx-modal-body"><h3>' + esc(q.q) + '</h3><p class="dx-modal-hint">Chọn một đáp án rồi bấm Xác nhận. Chỉ được chọn một lần.</p><div class="lc-options">' + q.o.map((x, idx) => '<button class="lc-option" data-exp-qi="' + idx + '" type="button">' + String.fromCharCode(65 + idx) + '. ' + esc(x) + '</button>').join('') + '</div><div class="dx-modal-actions"><button type="button" class="lc-btn solid" id="dxExpOk" disabled>Xác nhận</button></div><div id="dxExpFb"></div></div></div>';
    document.body.appendChild(wrap);
    document.body.classList.add('dx-modal-open');
    let sel = null;
    wrap.querySelectorAll('[data-exp-qi]').forEach(b => b.addEventListener('click', () => {
      if (wrap.dataset.locked) return;
      sel = Number(b.dataset.expQi);
      wrap.querySelectorAll('[data-exp-qi]').forEach(x => x.classList.toggle('is-pick', x === b));
      const okBtn = document.getElementById('dxExpOk');
      if (okBtn) okBtn.disabled = false;
    }));
    document.getElementById('dxExpOk').addEventListener('click', () => {
      if (sel == null || wrap.dataset.locked) return;
      wrap.dataset.locked = '1';
      const ok = sel === q.a;
      wrap.querySelectorAll('[data-exp-qi]').forEach((x, idx) => {
        x.disabled = true;
        x.classList.toggle('good', idx === q.a);
        x.classList.toggle('bad', idx === sel && !ok);
      });
      markTried(id, ok);
      const got = awardLesson(id, ok);
      const fb = document.getElementById('dxExpFb');
      const review = q.e || 'Xem lại hướng dẫn và sheet LamBai của bài này.';
      fb.innerHTML = ok
        ? '<div class="lc-feedback good"><strong>Đúng.</strong> ' + esc(review) + ' Nhận ' + got.added + ' điểm.</div>'
        : '<div class="lc-feedback bad"><strong>Chưa đúng · 0 điểm.</strong> Cần kiểm tra lại: ' + esc(review) + '</div>';
      const actions = wrap.querySelector('.dx-modal-actions');
      actions.innerHTML = '<button type="button" class="lc-btn solid" data-dx-back>Quay lại 5 bài</button>';
      actions.querySelector('[data-dx-back]').addEventListener('click', () => {
        closeGate();
        if (window.AVPDailyExpandUI && window.AVPDailyExpandUI.renderToday) window.AVPDailyExpandUI.renderToday();
        lockButtons(); paintHud();
      });
    });
    wrap.addEventListener('click', ev => { if (ev.target === wrap && !wrap.dataset.locked) closeGate(); });
  }
  function lockButtons() {
    const maps = todayMaps();
    document.querySelectorAll('[data-dx-done]').forEach(btn => {
      const id = btn.dataset.dxDone;
      if (maps.done[id]) { btn.disabled = true; btn.textContent = 'Đã xong'; }
      else if (maps.tried[id]) { btn.disabled = true; btn.textContent = 'Đã xác nhận'; }
    });
  }
  function paintHud() {
    const host = document.getElementById('todayHost');
    if (!host) return;
    const snap = snapshot();
    let hud = document.getElementById('dxExpHud');
    if (!hud) {
      hud = document.createElement('p');
      hud.id = 'dxExpHud';
      const hero = host.querySelector('.dx-hero-body div') || host.querySelector('.dx-hero') || host;
      hero.appendChild(hud);
    }
    hud.textContent = 'Hôm nay ' + snap.today + ' điểm (bài ' + snap.lessonPts + ' · hỏi nhanh ' + snap.quiz + '). Tổng ' + snap.total + '. Đúng mới được điểm, sai = 0.';
    lockButtons();
  }
  function bind() {
    document.addEventListener('click', ev => {
      const btn = ev.target.closest && ev.target.closest('[data-dx-done]');
      if (!btn || btn.disabled) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      const maps = todayMaps();
      if (maps.tried[btn.dataset.dxDone] || maps.done[btn.dataset.dxDone]) return;
      openGate(btn.dataset.dxDone);
    }, true);
    const tick = () => {
      const date = vnDate();
      const daily = (C.getDaily() || {})[date] || {};
      if (daily.quizLocked) settleQuiz(date);
      paintHud();
    };
    [400, 1200, 2400].forEach(ms => setTimeout(tick, ms));
    setInterval(tick, 2500);
    window.addEventListener('avp:exp-changed', paintHud);
  }
  window.AVPDailyExp = { RULES, awardLesson, settleQuiz, snapshot, paintHud };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
})();
