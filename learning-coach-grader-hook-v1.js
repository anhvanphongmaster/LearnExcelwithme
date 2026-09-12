(() => {
  'use strict';
  const C=window.AVPLearningCoach;if(!C)return;
  const text=el=>String(el?.textContent||'').trim();
  let lastSignature='';

  function skillFromTopic(label){
    const s=String(label||'').toLowerCase();
    if(s.includes('power query'))return 'powerquery';
    if(s.includes('làm sạch'))return 'cleaning';
    if(s.includes('công thức'))return 'formula';
    if(s.includes('nhập liệu'))return 'foundation';
    if(s.includes('định dạng'))return 'foundation';
    return 'workflow';
  }
  function lessonFromResultTitle(title){
    return String(title||'').replace(/\s*·\s*\d+\s*\/\s*\d+\s*$/,'').trim();
  }
  function captureResult(){
    const panel=document.getElementById('pgResult');
    const title=text(document.getElementById('pgResultTitle'));
    if(!panel||panel.hidden||!title)return false;
    const bad=[...panel.querySelectorAll('.pg-check.bad')];
    if(!bad.length)return true;
    const lessonTitle=lessonFromResultTitle(title);
    const cards=[...document.querySelectorAll('[data-lesson-card]')];
    const card=cards.find(x=>text(x.querySelector('h3'))===lessonTitle);
    const topic=text(card?.querySelector('.pg-card-topic'));
    const skill=skillFromTopic(topic);
    const signature=title+'|'+bad.map(x=>text(x.querySelector('b'))).join('|');
    if(signature===lastSignature)return true;
    lastSignature=signature;
    bad.forEach(row=>{
      const label=text(row.querySelector('b')).replace(/^×\s*/,'').replace(/\s*·\s*\d+đ\s*$/,'').trim();
      const detail=text(row.querySelector('small'));
      C.logMistake({
        source:'grader',skill,
        concept:`${lessonTitle} · ${label}`,
        prompt:`Bài tự chấm: ${lessonTitle}`,
        correct:`Cần đạt tiêu chí: ${label}`,
        explain:detail,
        lessonId:C.skillMeta(skill).lesson,
        url:location.href
      });
    });
    return true;
  }
  function watchAfterSubmit(){
    let n=0;const timer=setInterval(()=>{n++;if(captureResult()||n>=60)clearInterval(timer)},500);
  }
  function boot(){
    document.getElementById('pgSubmitConfirm')?.addEventListener('click',watchAfterSubmit);
    document.querySelectorAll('[data-review]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(captureResult,100)));
    document.addEventListener('click',e=>{if(e.target.closest?.('[data-review]'))setTimeout(captureResult,160)},false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
