(() => {
  'use strict';
  if(window.__AVP_PLATFORM_PROGRESS_V2__)return;
  window.__AVP_PLATFORM_PROGRESS_V2__=true;
  const KEY='avp_platform_completed_v2';
  const read=()=>{try{return new Set(JSON.parse(localStorage.getItem(KEY)||'[]'))}catch{return new Set()}};
  const write=set=>{localStorage.setItem(KEY,JSON.stringify([...set]));window.dispatchEvent(new CustomEvent('avp:platform-progress',{detail:{completed:[...set]}}))};
  const isDone=id=>read().has(id);
  const toggle=id=>{const s=read();s.has(id)?s.delete(id):s.add(id);write(s);return s.has(id)};
  const P=window.AVPLearningPlatform;

  function style(){if(document.getElementById('lpProgressV2Style'))return;const s=document.createElement('style');s.id='lpProgressV2Style';s.textContent=`.lp-lesson.is-complete{border-color:#8fc6a2;background:#f7fcf9}.lp-lesson.is-complete .lp-lesson-num{background:#217346;color:#fff}.lp-module-progress-v2{margin-top:8px;color:#4c765c;font-size:9px;font-weight:900}.lp-complete-bar-v2{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px;padding:13px 14px;border:1px solid #c9dfd1;border-radius:14px;background:#fff}.lp-complete-bar-v2 div{min-width:0}.lp-complete-bar-v2 small{display:block;color:#718178;font-size:9px;font-weight:900}.lp-complete-bar-v2 strong{display:block;margin-top:3px;color:#214832;font-size:12px}.lp-complete-btn-v2{flex:0 0 auto;padding:9px 12px;border:1px solid #8ab99b;border-radius:999px;background:#f2f9f5;color:#1c6840;font:inherit;font-size:10px;font-weight:950;cursor:pointer}.lp-complete-btn-v2.is-done{background:#217346;color:#fff;border-color:#217346}body.dark-mode .lp-complete-bar-v2{background:#16231c;border-color:#30473a}body.dark-mode .lp-complete-bar-v2 strong{color:#e1eee6}@media(max-width:620px){.lp-complete-bar-v2{align-items:flex-start;flex-direction:column}.lp-complete-btn-v2{width:100%}}`;document.head.appendChild(s)}

  function decorateSkillMap(){
    if(!P)return;const done=read();
    document.querySelectorAll('.lp-lesson[data-lesson]').forEach(a=>{const id=a.dataset.lesson;a.classList.toggle('is-complete',done.has(id));const b=a.querySelector('.lp-lesson-meta b');if(b&&done.has(id)&&!b.textContent.includes('Đã học'))b.textContent='Đã học ✓ · '+b.textContent});
    document.querySelectorAll('.lp-module').forEach((a,i)=>{const m=P.modules[i];if(!m)return;let tag=a.querySelector('.lp-module-progress-v2');if(!tag){tag=document.createElement('div');tag.className='lp-module-progress-v2';a.appendChild(tag)}const count=m.lessons.filter(id=>done.has(id)).length;tag.textContent=`Tiến độ: ${count}/${m.lessons.length}`});
  }

  function decorateLesson(){
    const host=document.getElementById('kvSections');if(!host||!P)return;const id=new URLSearchParams(location.search).get('lesson')||'';if(!id)return;const all=(window.AVPKnowledgeLessons||[]).slice().sort((a,b)=>(a.order||999)-(b.order||999));const idx=all.findIndex(x=>x.id===id),next=idx>=0&&idx<all.length-1?all[idx+1]:null;
    let bar=document.querySelector('.lp-complete-bar-v2');if(!bar){bar=document.createElement('div');bar.className='lp-complete-bar-v2';host.insertAdjacentElement('afterend',bar)}
    const render=()=>{const done=isDone(id);bar.innerHTML=`<div><small>TRẠNG THÁI BÀI HỌC</small><strong>${done?'Đã đánh dấu hoàn thành.':'Khi bạn đã hiểu phần cốt lõi và làm được thao tác chính, có thể đánh dấu hoàn thành.'}</strong></div><button class="lp-complete-btn-v2 ${done?'is-done':''}" type="button">${done?'✓ Đã học':'✓ Đánh dấu đã học'}</button>${next?`<a class="lp-complete-btn-v2" href="${P.lessonUrl(next.id)}">Bài tiếp theo →</a>`:`<a class="lp-complete-btn-v2" href="practice-video.html">Sang thực hành →</a>`}`;bar.querySelector('button')?.addEventListener('click',()=>{toggle(id);render()})};render();
  }

  function boot(){style();decorateSkillMap();decorateLesson()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('avp:platform-progress',()=>{decorateSkillMap();decorateLesson()});
  window.AVPPlatformProgress={read,isDone,toggle};
})();
