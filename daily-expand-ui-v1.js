(() => {
  'use strict';
  const E = window.AVPDailyExpand;
  const C = window.AVPLearningCoach;
  if (!C) return;
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[ch]));
  const LEVEL_NAME = { basic: 'Cơ bản', intermediate: 'Trung cấp', advanced: 'Nâng cao', case: 'Case' };
  function vnDate() {
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: (E && E.timezone) || 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    } catch (_) {
      return C.localDate ? C.localDate() : new Date().toISOString().slice(0, 10);
    }
  }
  function viDate(d) { const [y, m, day] = String(d).split('-'); return day + '/' + m + '/' + y; }
  function packIndex(dateStr) {
    const start = (window.AVPDailyStart && window.AVPDailyStart.getDailyStartDate && window.AVPDailyStart.getDailyStartDate()) || (E && E.startDate) || '2026-09-14';
    const n = Number(E && E.cycleDays) || 3;
    const [ys, ms, ds] = String(start).split('-').map(Number);
    const [y, m, d] = String(dateStr).split('-').map(Number);
    let i = Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(ys, ms - 1, ds)) / 86400000) % n;
    return i < 0 ? i + n : i;
  }
  function catalogOk() { return !!(E && E.byId && Array.isArray(E.packs) && E.packs.length); }
  function pickToday() {
    const date = vnDate();
    const idx = packIndex(date);
    const raw = E.packs[idx] || E.packs[0];
    const ids = [].concat(raw.basic || [], raw.intermediate ? [raw.intermediate] : [], raw.advanced ? [raw.advanced] : [], raw.case ? [raw.case] : []);
    const items = ids.map(id => E.byId[id]).filter(Boolean);
    if (C.markDaily) C.markDaily(date, { packIndex: idx, ids });
    return { date, idx, items };
  }
  function card(it, done) {
    return '<article class="dx-card" data-level="' + esc(it.level) + '"><header><span>' + esc(LEVEL_NAME[it.level] || it.level) + ' · ' + it.minutes + ' phút</span>' + (done ? '<b>Đã làm</b>' : '') + '</header><h3>' + esc(it.title) + '</h3><p>' + esc(it.outcome) + '</p><ol>' + (it.steps || []).map(s => '<li>' + esc(s) + '</li>').join('') + '</ol><p class="dx-tasks"><strong>Trên file:</strong> ' + (it.tasks || []).map(esc).join(' ') + '</p><div class="dx-actions"><a class="lc-btn solid" href="' + esc(it.file) + '" download>Tải file bài này</a><button type="button" class="lc-btn" data-dx-done="' + esc(it.id) + '"' + (done ? ' disabled' : '') + '>' + (done ? 'Đã xong' : 'Đánh dấu xong') + '</button></div></article>';
  }
  function quizBank(items) {
    const picked = []; const seen = new Set();
    const plan = items.map((_, i) => (items.length === 5 ? (i < 3 ? 2 : 1) : 2));
    function take(it, need) {
      (it.quiz || []).forEach((q, qi) => {
        if (picked.filter(x => x.lessonId === it.id).length >= need) return;
        const key = String(q.q || '').trim().toLowerCase();
        if (!key || seen.has(key)) return; seen.add(key);
        picked.push({ q: q.q, o: q.o, a: q.a, e: q.e, lessonId: it.id, skill: it.level, title: it.title, qid: it.id + '-' + qi });
      });
    }
    items.forEach((it, i) => take(it, plan[i] || 0));
    if (picked.length < 8) items.forEach(it => take(it, 2));
    return picked.slice(0, 8);
  }
  function startQuiz(items, hostId) {
    const host = $(hostId || 'dxQuizHost'); if (!host) return;
    const date = vnDate();
    const daily = ((C.getDaily && C.getDaily()) || {})[date] || {};
    if (daily.quizLocked) {
      host.innerHTML = '<div class="lc-feedback bad"><strong>Đã nộp bài hỏi nhanh hôm nay.</strong> Mỗi câu chỉ làm một lần trong ngày.</div>';
      return;
    }
    const bank = quizBank(items);
    if (bank.length !== 8) { host.innerHTML = '<div class="lc-empty">Chưa đủ 8 câu hỏi cho gói hôm nay.</div>'; return; }
    let i = Number(daily.quizIndex) || 0;
    const answers = Array.isArray(daily.quizAnswers) ? daily.quizAnswers.slice() : [];
    const ask = () => {
      if (i >= bank.length) {
        const correct = answers.filter(x => x && x.ok).length;
        C.markDaily(date, { quizDone: true, quizLocked: true, quizIndex: bank.length, quizCorrect: correct, quizAnswers: answers });
        host.innerHTML = '<div class="lc-feedback good"><strong>Đã nộp 8 câu của đúng bài hôm nay.</strong> Đúng ' + correct + '/8. Câu sai đã vào Sổ lỗi. Không làm lại trong ngày.</div>';
        return;
      }
      const q = bank[i];
      C.markDaily(date, { quizIndex: i, quizAnswers: answers });
      host.innerHTML = '<div class="lc-quiz"><div class="lc-quiz-meta"><span>Câu ' + (i + 1) + '/8</span><span>' + esc(LEVEL_NAME[q.skill] || '') + ' · ' + esc(q.title) + '</span></div><h3>' + esc(q.q) + '</h3><div class="lc-options">' + q.o.map((x, idx) => '<button class="lc-option" data-qi="' + idx + '" type="button">' + String.fromCharCode(65 + idx) + '. ' + esc(x) + '</button>').join('') + '</div><div id="dxFb"></div></div>';
      host.querySelectorAll('[data-qi]').forEach(b => b.addEventListener('click', () => {
        const sel = Number(b.dataset.qi); const ok = sel === q.a;
        answers[i] = { qid: q.qid, lessonId: q.lessonId, ok, sel };
        host.querySelectorAll('[data-qi]').forEach((x, idx) => { x.disabled = true; x.classList.toggle('good', idx === q.a); x.classList.toggle('bad', idx === sel && !ok); });
        if (!ok && C.logMistake) C.logMistake({ source: 'hom-nay', skill: q.skill, concept: q.qid, prompt: q.q, chosen: q.o[sel], correct: q.o[q.a], explain: q.e, lessonId: q.lessonId, url: location.href });
        const fb = document.getElementById('dxFb');
        if (fb) fb.innerHTML = '<div class="lc-feedback ' + (ok ? 'good' : 'bad') + '"><strong>' + (ok ? 'Đúng.' : 'Chưa đúng. Câu này không làm lại.') + '</strong> ' + esc(q.e) + '</div><div class="lc-next"><button class="lc-btn solid" id="dxNext" type="button">' + (i === bank.length - 1 ? 'Nộp bài' : 'Câu tiếp') + ' →</button></div>';
        document.getElementById('dxNext')?.addEventListener('click', () => { i += 1; ask(); }, { once: true });
      }, { once: true }));
    };
    ask();
  }
  function bindDone(root, after) {
    root.querySelectorAll('[data-dx-done]').forEach(btn => btn.addEventListener('click', () => {
      const date = vnDate();
      const map = Object.assign({}, ((C.getDaily()[date] || {}).itemDone || {}));
      map[btn.dataset.dxDone] = true;
      C.markDaily(date, { itemDone: map });
      after();
    }));
  }
  function renderToday() {
    const host = $('todayHost'); if (!host) return;
    if (!catalogOk()) { host.innerHTML = '<div class="lc-empty">Gói hôm nay chưa tải xong. Tải lại trang rồi thử nữa.</div>'; return; }
    const { date, items } = pickToday();
    const daily = (C.getDaily()[date] || {});
    const doneMap = daily.itemDone || {};
    const doneN = items.filter(x => doneMap[x.id]).length;
    host.innerHTML = '<article class="dx-hero"><div class="dx-ribbon"><span>Gói hôm nay · ' + esc(viDate(date)) + '</span><b>5 bài mới</b></div><div class="dx-hero-body"><div><span class="lc-label">HỌC MỖI NGÀY</span><h2>Năm bài mới trong ngày</h2><p>2 bài cơ bản, 1 trung cấp, 1 nâng cao, 1 case. Đổi bài lúc 00:00.</p></div><span class="lc-pill strong">' + doneN + '/5 bài</span></div></article><div class="dx-grid dx-grid-5">' + items.map(it => card(it, !!doneMap[it.id])).join('') + '</div><section class="lc-focus" style="margin-top:12px"><div class="lc-focus-head"><div><span class="lc-label">HỎI NHANH HÔM NAY</span><h2>8 câu — đúng 5 bài vừa giao</h2><p>Mỗi câu chỉ chọn một lần. Sai thì vào Sổ lỗi, không làm lại trong ngày.</p></div></div><div id="dxQuizHost"></div><div class="lc-secondary-links"><button type="button" id="dxStartQuiz">' + (daily.quizLocked ? 'Đã nộp bài hỏi nhanh' : 'Làm 8 câu hôm nay') + '</button><a href="skill-map.html">Lộ trình 42 bài vẫn ở khu Học</a></div></section>';
    bindDone(host, renderToday);
    $('dxStartQuiz')?.addEventListener('click', () => startQuiz(items, 'dxQuizHost'));
    if (daily.quizLocked) startQuiz(items, 'dxQuizHost');
  }
  function renderDiag() {
    const host = $('diagnosticHost'); if (!host || !catalogOk()) return;
    host.innerHTML = '<p>8 câu lấy từ đúng 5 bài hôm nay. Mỗi câu chỉ làm một lần trong ngày.</p><div id="dxQuizHostDiag"></div>';
    startQuiz(pickToday().items, 'dxQuizHostDiag');
  }
  function renderCase() {
    const host = $('casesHost'); if (!host || !catalogOk()) return;
    const it = pickToday().items.find(x => x.level === 'case');
    if (!it) { host.innerHTML = '<div class="lc-empty">Chưa có case hôm nay.</div>'; return; }
    host.innerHTML = card(it, !!((C.getDaily()[vnDate()] || {}).itemDone || {})[it.id]);
    bindDone(host, () => { renderCase(); if ($('todayHost')) renderToday(); });
  }
  function fillOuter() {
    const title = $('lhTodayTitle'); const meta = $('lhTodayMeta'); const cta = $('lhTodayCta'); const cardEl = $('lhTodayCard');
    if (!title || !meta || !catalogOk()) return false;
    const { date, items } = pickToday(); if (!items.length) return false;
    title.textContent = 'Hôm nay: 5 bài mới';
    meta.textContent = viDate(date) + ' · ' + items.map(x => (LEVEL_NAME[x.level] || '') + ': ' + x.title).join(' · ');
    if (cta) cta.textContent = 'Mở gói hôm nay →';
    if (cardEl) { cardEl.href = 'learning-coach.html'; cardEl.setAttribute('aria-label', 'Gói học hôm nay'); }
    return true;
  }
  function boot() {
    if ($('todayHost')) {
      document.querySelectorAll('.lc-tab').forEach(b => {
        b.addEventListener('click', () => {
          if (b.dataset.panel === 'today') renderToday();
          if (b.dataset.panel === 'diagnostic') renderDiag();
          if (b.dataset.panel === 'cases') renderCase();
        });
      });
      renderToday();
    }
    fillOuter();
    window.AVPDailyExpandUI = { pickToday, fillOuter, renderToday, vnDate, packIndex };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
