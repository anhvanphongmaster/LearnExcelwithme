(() => {
  'use strict';
  if (window.__AVP_PRO_ACCESS_GUIDANCE_V1__) return;
  window.__AVP_PRO_ACCESS_GUIDANCE_V1__ = true;

  const LIMITS = { basic: 1500, intermediate: 1300, advanced: 1000 };
  const LABELS = { basic: 'Cơ bản', intermediate: 'Trung cấp', advanced: 'Nâng cao' };

  function pageIsProfessionalAccess() {
    const page = (location.pathname.split('/').pop() || '').toLowerCase();
    return page === 'professional-access.html';
  }

  function removeGuidance() {
    document.getElementById('ptScoreGuidance')?.remove();
  }

  function renderGuidance(state) {
    if (!pageIsProfessionalAccess()) return;
    if (!state || state.phase !== 'locked' || state.canAccess === true || state.isAdmin === true) {
      removeGuidance();
      return;
    }

    const values = {
      basic: Number(state.basicScore) || 0,
      intermediate: Number(state.intermediateScore) || 0,
      advanced: Number(state.advancedScore) || 0
    };
    const missing = Object.keys(LIMITS).filter(key => values[key] < LIMITS[key]);
    if (!missing.length) {
      removeGuidance();
      return;
    }

    const action = document.getElementById('ptActionArea');
    if (!action) return;

    let box = document.getElementById('ptScoreGuidance');
    if (!box) {
      box = document.createElement('section');
      box.id = 'ptScoreGuidance';
      box.className = 'pt-score-guidance';
      box.setAttribute('aria-label', 'Hướng dẫn tăng điểm để mở Professional Track');
      action.appendChild(box);
    }

    const gaps = missing.map(key => {
      const gap = Math.max(0, LIMITS[key] - values[key]);
      return `<span><b>${LABELS[key]}</b> còn thiếu ${gap.toLocaleString('vi-VN')} điểm</span>`;
    }).join('');

    box.innerHTML = `
      <div class="pt-score-guidance-copy">
        <span class="pt-score-guidance-kicker">CHƯA ĐỦ ĐIỂM PROFESSIONAL</span>
        <strong>Bạn cần làm thêm bài tự chấm để tăng điểm</strong>
        <p>Chọn đúng cấp độ còn thiếu, làm bài và nộp file để tích lũy điểm trước khi quay lại kiểm tra điều kiện Professional.</p>
        <div class="pt-score-gap-list">${gaps}</div>
      </div>
      <a class="pt-score-guidance-cta" href="practice-grader.html">Vào Bài tập tự chấm <span>→</span></a>
    `;
  }

  window.addEventListener('avp:professional-access-state', event => renderGuidance(event.detail || {}));

  function boot() {
    if (!pageIsProfessionalAccess()) return;
    renderGuidance(window.AVPProfessionalAccessState || null);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
