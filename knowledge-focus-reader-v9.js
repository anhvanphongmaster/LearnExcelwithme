(() => {
  'use strict';
  if (window.__AVP_FOCUS_READER_V9__) return;
  window.__AVP_FOCUS_READER_V9__ = true;

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function buildSummary(){
    const intro = $('#kvIntro');
    if(!intro || $('.avp-focus-summary-v9', intro)) return;
    const grid = $('.kv-intro-grid', intro);
    const prereq = $('.kv-prereq', intro);
    if(!grid && !prereq) return;
    const details = document.createElement('details');
    details.className = 'avp-focus-summary-v9';
    details.innerHTML = '<summary>Mục tiêu, ứng dụng & kiến thức nên biết trước</summary><div class="avp-focus-summary-body-v9"></div>';
    const body = $('.avp-focus-summary-body-v9', details);
    if(grid) body.appendChild(grid);
    if(prereq) body.appendChild(prereq);
    intro.appendChild(details);
  }

  function buildVisualToggle(){
    const intro = $('#kvIntro');
    if(!intro || $('.avp-focus-visual-v9', intro)) return;
    const visual = $('.lp-visual-v3', intro);
    if(!visual) return;
    const details = document.createElement('details');
    details.className = 'avp-focus-visual-v9';
    details.innerHTML = '<summary>Xem minh họa thao tác nhanh</summary><div class="avp-focus-visual-body-v9"></div>';
    visual.classList.add('avp-moved-v9');
    $('.avp-focus-visual-body-v9', details).appendChild(visual);
    intro.appendChild(details);
  }

  function buildStepBar(){
    const sectionHost = $('#kvSections');
    const sidebar = $('#kvSidebar');
    if(!sectionHost || !sidebar) return;
    let bar = $('#avpFocusStepsV9');
    if(!bar){
      bar = document.createElement('nav');
      bar.id = 'avpFocusStepsV9';
      bar.className = 'avp-focus-steps-v9';
      bar.setAttribute('aria-label','Các bước trong bài');
      sectionHost.parentNode.insertBefore(bar, sectionHost);
    }
    const buttons = $$('[data-outline]', sidebar);
    bar.innerHTML = buttons.map((b,i)=>{
      const label = b.textContent.replace(/^\s*\d+\s*/,'').replace(/\s+/g,' ').trim();
      const ext = b.dataset.kind === 'extension';
      return `<button type="button" data-focus-step="${b.dataset.outline}" title="${esc(label)}">${ext?'Học thêm · ':''}${i+1}. ${esc(label)}</button>`;
    }).join('');
    bar.onclick = e => {
      const btn = e.target.closest('[data-focus-step]');
      if(!btn) return;
      const target = sidebar.querySelector(`[data-outline="${btn.dataset.focusStep}"]`);
      target?.click();
    };
    syncStepBar();
  }

  function syncStepBar(){
    const sidebar = $('#kvSidebar');
    const bar = $('#avpFocusStepsV9');
    if(!sidebar || !bar) return;
    const active = $('[data-outline].active', sidebar)?.dataset.outline;
    $$('[data-focus-step]', bar).forEach(b=>b.classList.toggle('active', b.dataset.focusStep===active));
    const current = $(`[data-focus-step="${active}"]`, bar);
    current?.scrollIntoView({block:'nearest', inline:'nearest'});
  }

  function simplifyLabels(){
    const hero = $('#kvHero');
    if(!hero) return;
    const help = $('.kv-hero-lead', hero);
    if(help && !help.dataset.focusTrimmed){
      help.dataset.focusTrimmed='1';
      const text = help.textContent.trim();
      if(text.length > 220) help.textContent = text.slice(0,217).replace(/\s+\S*$/,'') + '…';
    }
  }

  function enhance(){
    document.body.classList.add('avp-focus-reader-v9');
    buildSummary();
    buildVisualToggle();
    buildStepBar();
    simplifyLabels();
  }

  function observe(){
    const sectionHost = $('#kvSections');
    const sidebar = $('#kvSidebar');
    if(sectionHost) new MutationObserver(()=>syncStepBar()).observe(sectionHost,{childList:true,subtree:true});
    if(sidebar) new MutationObserver(()=>{buildStepBar();syncStepBar()}).observe(sidebar,{attributes:true,subtree:true,attributeFilter:['class','aria-current']});
  }

  const boot = () => requestAnimationFrame(()=>{enhance();observe();});
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})();
