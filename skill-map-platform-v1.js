(() => {
  'use strict';
  const P=window.AVPLearningPlatform;
  P?.syncLessonOrder?.();
  const lessons=(window.AVPKnowledgeLessons||[]).slice().sort((a,b)=>(a.order||999)-(b.order||999));
  const byId=new Map(lessons.map(x=>[x.id,x]));
  const LAST='avp_knowledge_last_v2';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  if(!P)return;

  const requestedModule=()=>new URLSearchParams(location.search).get('module')||'';
  const lastLesson=()=>byId.get(localStorage.getItem(LAST))||null;

  function updateHero(){
    $('lpLessonCount').textContent=`${lessons.length} bài`;
    $('lpModuleCount').textContent=`${P.modules.length} module`;
    const last=lastLesson(),resume=$('lpResume');
    if(last&&resume){resume.href=P.lessonUrl(last.id);resume.textContent=`Tiếp tục: Bài ${String(last.order).padStart(2,'0')} →`}
  }
  function renderModules(){
    $('lpModuleGrid').innerHTML=P.modules.map(m=>`<a class="lp-module tone-${esc(m.tone)}" href="${P.moduleUrl(m.id)}"><div class="lp-module-top"><span class="lp-module-no">${esc(m.number)}</span><small>${esc(m.label)}</small></div><h3>${esc(m.title)}</h3><p>${esc(m.short)}</p><div class="lp-module-foot"><span>${m.lessons.length} bài</span><span>Xem danh sách →</span></div></a>`).join('');
  }
  function renderModule(module){
    const page=$('lpPage');page.classList.add('is-module');document.title=`${module.title} | Học Excel A–Z`;
    $('lpCrumbCurrent').textContent=module.title;$('lpModuleLabel').textContent=`${module.number} · ${module.label}`;$('lpModuleTitle').textContent=module.title;$('lpModuleDesc').textContent=module.short;$('lpModuleOutcome').textContent=`Học xong module này: ${module.outcome}`;
    const lastId=localStorage.getItem(LAST);
    $('lpLessonList').innerHTML=module.lessons.map(id=>{const lesson=byId.get(id);if(!lesson)return '';const isLast=id===lastId;return `<a class="lp-lesson ${isLast?'is-last':''}" href="${P.lessonUrl(id)}" data-lesson="${esc(id)}"><span class="lp-lesson-num">${String(lesson.order).padStart(2,'0')}</span><span class="lp-lesson-copy"><strong>Bài ${String(lesson.order).padStart(2,'0')} · ${esc(lesson.title)}</strong><p>${esc(lesson.short||lesson.hook||'')}</p></span><span class="lp-lesson-meta"><span>${esc(lesson.level||'Bài học')} · ${esc(lesson.duration||'')}</span><b>${isLast?'Bạn vừa học bài này · ':''}Mở bài →</b></span></a>`}).join('');
    const first=module.lessons.map(id=>byId.get(id)).find(Boolean),last=lastLesson(),inModule=last&&module.lessons.includes(last.id),start=$('lpModuleStart'),target=inModule?last:first;
    if(target){start.href=P.lessonUrl(target.id);start.textContent=inModule?'Tiếp tục module →':'Bắt đầu module →'}
    sessionStorage.setItem('avp_learning_module_return',module.id);
  }
  function rememberListPosition(){document.addEventListener('click',e=>{const a=e.target.closest('.lp-lesson');if(!a)return;const module=requestedModule();if(module){sessionStorage.setItem('avp_learning_module_return',module);sessionStorage.setItem(`avp_module_scroll_${module}`,String(window.scrollY||0))}})}
  function restorePosition(){const module=requestedModule();if(!module)return;const raw=sessionStorage.getItem(`avp_module_scroll_${module}`);if(raw)requestAnimationFrame(()=>window.scrollTo(0,Number(raw)||0))}
  function boot(){updateHero();renderModules();rememberListPosition();const id=requestedModule();if(id){const module=P.byModule.get(id);if(module){renderModule(module);restorePosition()}else history.replaceState(null,'','skill-map.html')}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
