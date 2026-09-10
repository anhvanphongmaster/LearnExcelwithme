(() => {
  'use strict';
  if(window.__AVP_LESSON_CONTEXT_NAV_V1__)return;
  window.__AVP_LESSON_CONTEXT_NAV_V1__=true;
  const P=window.AVPLearningPlatform;if(!P)return;
  const id=new URLSearchParams(location.search).get('lesson')||'',module=P.moduleForLesson(id),lesson=(window.AVPKnowledgeLessons||[]).find(x=>x.id===id);if(!module||!lesson)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function boot(){
    const page=document.getElementById('kvPage'),hero=document.getElementById('kvHero');if(!page||!hero)return;
    const bar=document.createElement('nav');bar.className='lp-lesson-context-v1';bar.setAttribute('aria-label','Vị trí bài học');
    bar.innerHTML=`<div class="lp-lesson-crumb-v1"><a href="index.html">Trang chủ</a><span>›</span><a href="skill-map.html">Học Excel</a><span>›</span><a href="${P.moduleUrl(module.id)}">${esc(module.title)}</a><span>›</span><strong>Bài ${String(lesson.order).padStart(2,'0')} · ${esc(lesson.title)}</strong></div><div class="lp-lesson-actions-v1"><a href="${P.moduleUrl(module.id)}">← Danh sách bài trong module</a><a href="skill-map.html">Tất cả module</a></div>`;
    page.insertBefore(bar,hero);sessionStorage.setItem('avp_learning_module_return',module.id);
    const style=document.createElement('style');style.textContent=`.lp-lesson-context-v1{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px;padding:11px 13px;border:1px solid #d6e6dc;border-radius:14px;background:#fff;box-shadow:0 5px 16px rgba(22,77,45,.04)}.lp-lesson-crumb-v1{display:flex;align-items:center;gap:6px;flex-wrap:wrap;color:#718178;font-size:10px;font-weight:850}.lp-lesson-crumb-v1 a{color:#217346;text-decoration:none}.lp-lesson-crumb-v1 strong{color:#244c35}.lp-lesson-actions-v1{display:flex;gap:7px;flex-wrap:wrap}.lp-lesson-actions-v1 a{padding:7px 9px;border:1px solid #c6dece;border-radius:999px;background:#f5faf7;color:#1d6840;text-decoration:none;font-size:9px;font-weight:950}body.dark-mode .lp-lesson-context-v1{background:#16231c;border-color:#30473a}body.dark-mode .lp-lesson-crumb-v1 strong{color:#e2f0e7}.lp-lesson-context-v1 a:focus-visible{outline:3px solid #237847;outline-offset:2px}@media(max-width:760px){.lp-lesson-context-v1{align-items:flex-start;flex-direction:column}.lp-lesson-actions-v1{width:100%}.lp-lesson-actions-v1 a{flex:1;text-align:center}}`;document.head.appendChild(style);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
