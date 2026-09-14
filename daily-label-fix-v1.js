(() => {
  'use strict';
  const DAY = /Ngày\s*\d+\s*\/\s*\d+/i;
  const SAME = /cùng bài cho mọi người/i;
  function clean(el) {
    if (!el) return;
    const s = el.textContent || '';
    if (!DAY.test(s) && !SAME.test(s)) return;
    el.textContent = s.replace(DAY, '').replace(/\s*[·•]\s*cùng bài cho mọi người/ig, '').replace(SAME, '').replace(/\s{2,}/g, ' ').replace(/^[\s·•]+|[\s·•]+$/g, '').trim();
  }
  function fill() {
    const title = document.getElementById('lhTodayTitle');
    const meta = document.getElementById('lhTodayMeta');
    const cta = document.getElementById('lhTodayCta');
    if (title && (DAY.test(title.textContent || '') || /Bài hôm nay:/i.test(title.textContent || ''))) {
      title.textContent = 'Hôm nay: 5 bài mới';
    }
    if (meta && (DAY.test(meta.textContent || '') || SAME.test(meta.textContent || ''))) {
      meta.textContent = '2 cơ bản · 1 trung cấp · 1 nâng cao · 1 case. Đổi lúc 00:00.';
    }
    if (cta) cta.textContent = 'Mở gói hôm nay →';
    document.querySelectorAll('.dx-ribbon b, .dx-ribbon span, .lc-today-ribbon, #lhTodayTitle, #lhTodayMeta').forEach(clean);
  }
  function boot() {
    fill();
    [200, 600, 1200, 2400].forEach(ms => setTimeout(fill, ms));
    const host = document.getElementById('todayHost');
    if (host && window.MutationObserver) {
      const obs = new MutationObserver(fill);
      obs.observe(host, { childList: true, subtree: true, characterData: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
