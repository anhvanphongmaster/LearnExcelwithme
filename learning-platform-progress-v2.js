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

  function style(){
    if(document.getElementById('lpProgressV2Style'))return;
    const s=document.createElement('style');s.id='lpProgressV2Style';
    s.textContent='.lp-lesson.is-complete{border-color:#8fc6a2;background:#f7fcf9}.lp-lesson.is-complete .lp-lesson-num{background:#4d715d;color:#fff}.lp-module-progress-v2{margin-top:8px;color:#62766a;font-size:9px;font-weight:900}';
    document.head.appendChild(s);
  }

  function decorateSkillMap(){
    if(!P)return;const done=read();
    document.querySelectorAll('.lp-lesson[data-lesson]').forEach(a=>{const id=a.dataset.lesson;a.classList.toggle('is-complete',done.has(id));const b=a.querySelector('.lp-lesson-meta b');if(b&&done.has(id)&&!b.textContent.includes('Đã học'))b.textContent='Đã học ✓ · '+b.textContent});
    document.querySelectorAll('.lp-module').forEach((a,i)=>{const m=P.modules[i];if(!m)return;let tag=a.querySelector('.lp-module-progress-v2');if(!tag){tag=document.createElement('div');tag.className='lp-module-progress-v2';a.appendChild(tag)}const count=m.lessons.filter(id=>done.has(id)).length;tag.textContent=`Tiến độ: ${count}/${m.lessons.length}`});
  }

  function decorateReader(){
    const id=new URLSearchParams(location.search).get('lesson')||'';if(!id)return;
    const done=read();
    document.querySelectorAll('[data-reader-lesson]').forEach(a=>{
      const lessonId=a.dataset.readerLesson||'';const on=done.has(lessonId);a.classList.toggle('is-done',on);
      let mark=a.querySelector('i');
      if(on&&!mark){mark=document.createElement('i');mark.textContent='✓';a.appendChild(mark)}
      if(!on&&mark)mark.remove();
    });
    const btn=document.getElementById('kvReaderReadToggle');if(!btn)return;
    const on=done.has(id);btn.classList.toggle('is-done',on);btn.textContent=on?'✓ Đã đọc':'Đánh dấu đã đọc';btn.setAttribute('aria-pressed',on?'true':'false');
    if(btn.dataset.progressBound!=='1'){
      btn.dataset.progressBound='1';
      btn.addEventListener('click',()=>toggle(id));
    }
  }

  function boot(){style();decorateSkillMap();decorateReader()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.addEventListener('avp:platform-progress',()=>{decorateSkillMap();decorateReader()});
  window.AVPPlatformProgress={read,isDone,toggle};
})();
