(() => {
  'use strict';
  const C = window.AVPLearningCoach;
  if (!C) return;
  const KEY = 'avp_coach_exp_v2';
  const RULES = { lesson: 10, quizCorrect: 5, quizWrong: 1, selfPer10: 1 };
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function vnDate() {
    if (window.AVPDailyStart && window.AVPDailyStart.vnDate) return window.AVPDailyStart.vnDate();
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    } catch (_) {
      return C.localDate ? C.localDate() : new Date().toISOString().slice(0, 10);
    }
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
      row.total = Math.max(0, lessonSum + Number(row.quiz || 0) - Number(row.penalty || 0));
      sum += row.total;
    });
    state.total = sum;
    return state;
  }
  function awardLesson(id) {
    const date = vnDate();
    const state = load();
    const row = dayRec(state, date);
    if (row.lessons[id]) return { added: 0, total: state.total, today: row.total };
    row.lessons[id] = RULES.lesson;
    recount(state); save(state);
    return { added: RULES.lesson, total: state.total, today: row.total };
  }
  function settleQuiz(date) {
    const state = load();
    const row = dayRec(state, date);
    if (row.quizSettled) return row;
    const daily = (C.getDaily() || {})[date] || {};
    const answers = Array.isArray(daily.quizAnswers) ? daily.quizAnswers : [];
    if (!daily.quizLocked && answers.length < 8) return row;
    const correct = answers.filter(x => x && x.ok).length;
    const wrong = answers.filter(x => x && x.ok === false).length;
    row.quiz = correct * RULES.quizCorrect;
    row.penalty = wrong * RULES.quizWrong;
    row.quizSettled = true;
    recount(state); save(state);
    return row;
  }
  function snapshot() {
    const state = load();
    const date = vnDate();
    const row = state.days[date] || { lessons: {}, quiz: 0, penalty: 0, total: 0 };
    const lessonN = Object.keys(row.lessons || {}).length;
    return { total: state.total || 0, today: row.total || 0, lessonN, lessonPts: lessonN * RULES.lesson, quiz: row.quiz || 0, penalty: row.penalty || 0 };
  }
  function confirmOf(id) { return (window.AVPDailyConfirm || {})[id] || null; }
  function closeGate() { document.getElementById('dxExpGate')?.remove(); }
  function openGate(id, btn) {
    closeGate();
    const q = confirmOf(id);
    const card = btn.closest('article') || btn.parentElement;
    const box = document.createElement('div');
    box.id = 'dxExpGate';
    box.className = 'lc-quiz';
    box.style.marginTop = '10px';
    if (!q) {
      box.innerHTML = '<div class="lc-feedback bad">Chưa có câu xác nhận cho bài này.</div>';
      card.appendChild(box);
      return;
    }
    const lesson = (window.AVPDailyExpand && window.AVPDailyExpand.byId && window.AVPDailyExpand.byId[id]) || {};
    box.innerHTML = '<div class="lc-quiz-meta"><span>Xác nhận đã làm</span><span>Đúng thì nhận ' + RULES.lesson + ' điểm</span></div>' +
      '<h3>' + esc(q.q) + '</h3>' +
      '<p style="margin:0 0 8px;color:inherit;opacity:.85">Câu này bám đúng bài «' + esc(lesson.title || id) + '». Trả lời sai có thể chọn lại.</p>' +
      '<div class="lc-options">' + q.o.map((x, idx) => '<button class="lc-option" data-exp-qi="' + idx + '" type="button">' + String.fromCharCode(65 + idx) + '. ' + esc(x) + '</button>').join('') +
      '</div><div id="dxExpFb"></div>';
    card.appendChild(box);
    box.querySelectorAll('[data-exp-qi]').forEach(b => b.addEventListener('click', () => {
      const sel = Number(b.dataset.expQi);
      const ok = sel === q.a;
      box.querySelectorAll('[data-exp-qi]').forEach((x, idx) => {
        x.classList.toggle('good', idx === q.a);
        x.classList.toggle('bad', idx === sel && !ok);
      });
      const fb = box.querySelector('#dxExpFb');
      if (!ok) {
        if (fb) fb.innerHTML = '<div class="lc-feedback bad"><strong>Chưa đúng.</strong> ' + esc(q.e) + ' Chọn lại để hoàn thành bài.</div>';
        return;
      }
      box.querySelectorAll('[data-exp-qi]').forEach(x => { x.disabled = true; });
      const date = vnDate();
      const map = Object.assign({}, ((C.getDaily()[date] || {}).itemDone || {}));
      map[id] = true;
      C.markDaily(date, { itemDone: map });
      const got = awardLesson(id);
      if (fb) fb.innerHTML = '<div class="lc-feedback good"><strong>Đã hoàn thành bài.</strong> ' + esc(q.e) + ' Nhận ' + got.added + ' điểm. Hôm nay ' + got.today + ' · Tổng ' + got.total + '.</div>';
      btn.disabled = true;
      btn.textContent = 'Đã xong';
      paintHud();
      setTimeout(() => {
        closeGate();
        if (window.AVPDailyExpandUI && window.AVPDailyExpandUI.renderToday) window.AVPDailyExpandUI.renderToday();
      }, 900);
    }));
  }
  function paintHud() {
    const host = document.getElementById('todayHost');
    if (!host) return;
    const snap = snapshot();
    let hud = document.getElementById('dxExpHud');
    if (!hud) {
      hud = document.createElement('p');
      hud.id = 'dxExpHud';
      hud.style.margin = '8px 0 0';
      const hero = host.querySelector('.dx-hero-body div') || host.querySelector('.dx-hero') || host;
      hero.appendChild(hud);
    }
    hud.textContent = 'Hôm nay ' + snap.today + ' điểm (bài ' + snap.lessonPts + ' · hỏi nhanh ' + snap.quiz + (snap.penalty ? ' · trừ ' + snap.penalty : '') + '). Tổng ' + snap.total + '. Hoàn thành bài hoặc trả lời đúng để nhận điểm.';
  }
  function bind() {
    document.addEventListener('click', ev => {
      const btn = ev.target.closest && ev.target.closest('[data-dx-done]');
      if (!btn || btn.disabled) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      openGate(btn.dataset.dxDone, btn);
    }, true);
    const watchQuiz = () => {
      const date = vnDate();
      const daily = (C.getDaily() || {})[date] || {};
      if (daily.quizLocked) settleQuiz(date);
      paintHud();
    };
    [600, 1600, 3200].forEach(ms => setTimeout(watchQuiz, ms));
    setInterval(watchQuiz, 2500);
    window.addEventListener('avp:exp-changed', paintHud);
  }
  window.AVPDailyExp = { RULES, awardLesson, settleQuiz, snapshot, paintHud };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
})();
