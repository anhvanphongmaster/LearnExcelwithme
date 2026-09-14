(() => {
  'use strict';
  const C = window.AVPLearningCoach;
  if (!C) return;
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));
  const skillName = s => {
    try { return C.skillMeta(s).name; } catch (_) {
      return ({basic:'Cơ bản',intermediate:'Trung cấp',advanced:'Nâng cao',case:'Case'})[s] || s || 'Excel';
    }
  };

  function showPanel(name) {
    document.querySelectorAll('.lc-tab').forEach(b => b.classList.toggle('is-active', b.dataset.panel === name));
    document.querySelectorAll('.lc-panel').forEach(p => p.classList.toggle('is-active', p.id === `panel-${name}`));
    if (name === 'mistakes') renderMistakes();
  }

  function renderMistakes() {
    const host = $('mistakesHost');
    if (!host) return;
    const rows = C.unresolvedMistakes();
    const badge = $('mistakeBadge');
    if (badge) badge.textContent = rows.length;
    if (!rows.length) {
      host.innerHTML = '<div class="lc-empty">Chưa có lỗi cần ôn. Sai ở câu hỏi gói hôm nay sẽ hiện tại đây theo đúng bài.</div>';
      return;
    }
    host.innerHTML = `<div class="lc-mistakes">${rows.slice(0, 20).map(r => `<article class="lc-mistake">
      <div class="lc-mistake-top"><strong>${esc(skillName(r.skill))}</strong><em>${r.count || 1} lần</em></div>
      <p>${esc(r.prompt || r.concept)}${r.correct ? `<br><b>Đúng:</b> ${esc(r.correct)}` : ''}${r.explain ? `<br>${esc(r.explain)}` : ''}</p>
      <div class="lc-mistake-actions">
        <button type="button" data-resolve="${esc(r.id)}">Đã hiểu</button>
      </div>
    </article>`).join('')}</div>`;
    host.querySelectorAll('[data-resolve]').forEach(b => b.addEventListener('click', () => {
      C.resolveMistake(b.dataset.resolve, true);
      C.markDaily(C.localDate(), { mistakeReviewed: true });
      renderMistakes();
    }));
  }

  function boot() {
    document.querySelectorAll('.lc-tab').forEach(b => {
      b.addEventListener('click', () => showPanel(b.dataset.panel));
    });
    window.addEventListener('avp:coach-mistakes-changed', renderMistakes);
    renderMistakes();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
