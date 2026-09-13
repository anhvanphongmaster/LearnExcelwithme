(() => {
  'use strict';
  if (window.__AVP_KNOWLEDGE_READER_V6__) return;
  window.__AVP_KNOWLEDGE_READER_V6__ = true;

  function boot(){
    const P = window.AVPLearningPlatform || null;
    const T = window.AVPLearningTracks || null;
    const lessons = (window.AVPKnowledgeLessons || []).slice();
    const id = new URLSearchParams(location.search).get('lesson') || lessons[0]?.id || '';
    const lesson = lessons.find(item => item.id === id);
    if (!lesson) return;

    const host = document.getElementById('kvCourseNav');
    const sidebar = document.getElementById('kvSidebar');
    if (!host) return;

    const track = T?.forLesson?.(id) || null;
    const module = P?.moduleForLesson?.(id) || null;
    const DONE_KEY = 'avp_platform_completed_v2';
    const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    const doneSet = () => { try { return new Set(JSON.parse(localStorage.getItem(DONE_KEY) || '[]')); } catch (_) { return new Set(); } };

    document.documentElement.dataset.avpReader = '6';
    if (track?.id) document.documentElement.dataset.avpLearningTrack = track.id;
    if (module?.tone) document.documentElement.dataset.avpModuleTone = module.tone;

    const sections = (lesson.sections || []).map((section, index) => ({section, index}));
    const core = sections.filter(item => item.section.kind !== 'extension');
    const extra = sections.filter(item => item.section.kind === 'extension');
    const lessonCount = track ? T.lessonIds(track).length : 1;
    const backUrl = track ? T.url(track.id) : 'skill-map.html';

    function sectionButton(item, extraClass = '') {
      const num = String(item.index + 1).padStart(2, '0');
      return `<button type="button" class="kv-reader-section ${extraClass}" data-reader-section="${item.index}" aria-pressed="false"><span>${num}</span><b>${esc(item.section.title)}</b></button>`;
    }

    function activeIndex() {
      const active = sidebar?.querySelector('[data-outline].active');
      if (active) return Number(active.dataset.outline || 0);
      const match = String(location.hash || '').match(/^#sec-(\d+)$/);
      return match ? Math.max(0, Number(match[1]) - 1) : 0;
    }

    function syncActive() {
      const index = activeIndex();
      host.querySelectorAll('[data-reader-section]').forEach(button => {
        const on = Number(button.dataset.readerSection) === index;
        button.classList.toggle('is-active', on);
        button.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      const extraActive = extra.some(item => item.index === index);
      const details = host.querySelector('.kv-reader-extra');
      if (details && extraActive) details.open = true;
    }

    function renderToolbar() {
      const done = doneSet().has(id);
      const extras = extra.length ? `<details class="kv-reader-extra"><summary>HỌC THÊM <b>${extra.length} phần</b><i aria-hidden="true">▾</i></summary><div class="kv-reader-extra-menu">${extra.map(item => sectionButton(item, 'is-extra')).join('')}</div></details>` : '';
      host.innerHTML = `<a class="kv-reader-back" href="${esc(backUrl)}">← Chọn 1 trong ${lessonCount} bài</a><div class="kv-reader-sections" aria-label="Các mục trong bài">${core.map(item => sectionButton(item)).join('')}${extras}</div><button class="kv-reader-read-toggle ${done ? 'is-done' : ''}" id="kvReaderReadToggle" type="button" data-lesson-id="${esc(id)}" aria-pressed="${done ? 'true' : 'false'}">${done ? '✓ Đã đọc' : 'Đánh dấu đã đọc'}</button>`;

      host.querySelectorAll('[data-reader-section]').forEach(button => {
        button.addEventListener('click', () => {
          const index = Number(button.dataset.readerSection || 0);
          const legacy = sidebar?.querySelector(`[data-outline="${index}"]`);
          if (legacy) legacy.click();
          else location.hash = `#sec-${index + 1}`;
          requestAnimationFrame(syncActive);
        });
      });
      syncActive();
    }

    renderToolbar();

    if (sidebar && 'MutationObserver' in window) {
      const observer = new MutationObserver(syncActive);
      observer.observe(sidebar, {subtree:true, attributes:true, attributeFilter:['class','aria-current']});
      window.addEventListener('pagehide', () => observer.disconnect(), {once:true});
    }
    window.addEventListener('hashchange', syncActive);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
