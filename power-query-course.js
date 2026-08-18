(function(){
 const QUIZKEY='avp_quiz_done_v1', XPKEY='avp_xp_v2', PAGE='power-query-course.html', REWARD=50;
 const answers={q1:'b',q2:'c',q3:'b',q4:'a',q5:'c'};
 function read(k,f){try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(e){return f}}
 function addXP(n){localStorage.setItem(XPKEY,String((+localStorage.getItem(XPKEY)||0)+n))}
 function done(){return !!read(QUIZKEY,{})[PAGE]}
 function mark(){const q=read(QUIZKEY,{});if(q[PAGE])return false;q[PAGE]=true;localStorage.setItem(QUIZKEY,JSON.stringify(q));addXP(REWARD);window.dispatchEvent(new CustomEvent('avp:course-xp',{detail:{xp:REWARD,file:PAGE}}));return true}
 function submit(){let score=0;Object.entries(answers).forEach(([name,ans])=>{const el=document.querySelector(`input[name="${name}"]:checked`);if(el&&el.value===ans)score++});const res=document.getElementById('pqQuizResult');const passed=score>=4;try{window.avpAnalytics?.track('quiz_attempt',{page:PAGE,metadata:{passed,score,total:5}})}catch(e){}if(passed){const fresh=mark();if(fresh){try{window.avpAnalytics?.track('lesson_complete',{page:PAGE,metadata:{xp:REWARD}})}catch(e){}}res.textContent=`✓ ${score}/5 câu đúng. ${fresh?'+50 XP và đã ghi nhận hoàn thành.':'Bài này đã được ghi nhận trước đó.'}`;res.style.color='#17613a';var link=document.getElementById('pqNextLesson');if(!link){link=document.createElement('a');link.id='pqNextLesson';link.className='quiz-next-lesson';res.insertAdjacentElement('afterend',link);}link.href='power-pivot-dax.html';link.textContent='Bài học tiếp theo: Power Pivot & DAX →';}else{res.textContent=`${score}/5 câu đúng. Cần ít nhất 4/5 để hoàn thành — xem lại bài rồi thử lại.`;res.style.color='#a33'}render()}
 function render(){document.querySelectorAll('[data-pq-done]').forEach(e=>e.textContent=done()?'✓ Đã hoàn thành':'Chưa hoàn thành');const xp=document.getElementById('pqXP');if(xp)xp.textContent=localStorage.getItem(XPKEY)||'0'}
 document.addEventListener('DOMContentLoaded',()=>{render();document.getElementById('pqSubmit')?.addEventListener('click',submit)});
})();
