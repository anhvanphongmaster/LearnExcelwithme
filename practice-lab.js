(function(){
 const KEY='avp.practiceLab.v14';
 const XPKEY='avp_xp_v2', QKEY='avp_quiz_done_v1';
 function state(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}}
 function save(s){localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new Event('avp-progress-updated'))}
 function update(){const s=state();document.querySelectorAll('[data-pl-project]').forEach(el=>{if(s[el.dataset.plProject])el.classList.add('pl-done')});const done=['pivot','dashboard','dax'].filter(k=>s[k]).length;const fill=document.querySelector('[data-pl-progress]');if(fill)fill.style.width=(done/3*100)+'%';const txt=document.querySelector('[data-pl-count]');if(txt)txt.textContent=done+'/3 project';}
 window.markPracticeProject=function(id){const s=state();s[id]=true;save(s);update();}
 const submit=document.getElementById('plQuizSubmit');
 if(submit)submit.addEventListener('click',()=>{
   const ans={q1:'b',q2:'c',q3:'a',q4:'b',q5:'c'};let score=0;
   Object.keys(ans).forEach(q=>{const el=document.querySelector('input[name="'+q+'"]:checked');if(el&&el.value===ans[q])score++});
   const result=document.getElementById('plQuizResult');
   const passed=score>=4;try{window.avpAnalytics?.track('quiz_attempt',{page:'practice-lab.html',metadata:{passed,score,total:5}})}catch(e){}
   if(passed){const s=state(); if(!s.quiz){s.quiz=true;save(s);let q={};try{q=JSON.parse(localStorage.getItem(QKEY)||'{}')}catch(e){}q['practice-lab.html']=true;localStorage.setItem(QKEY,JSON.stringify(q));const old=Number(localStorage.getItem(XPKEY)||0);localStorage.setItem(XPKEY,String(old+45));try{window.avpAnalytics?.track('lesson_complete',{page:'practice-lab.html',metadata:{xp:45}})}catch(e){}try{if(window.AVPGamification&&AVPGamification.addXP)AVPGamification.addXP(45,'Practice Lab')}catch(e){}} result.innerHTML='✓ '+score+'/5 — Hoàn thành Practice Lab +45 XP<a class="quiz-next-lesson" href="vba-macro.html">Bài học tiếp theo: VBA / Macro →</a>'; result.style.color='#17613a';}
   else{result.textContent=score+'/5 — Cần ít nhất 4/5';result.style.color='#9b3a2a';}
   update();
 });
 update();
})();
