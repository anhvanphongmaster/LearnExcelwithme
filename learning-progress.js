(function(){
  const KEY='avp_lesson_progress_v1', QUIZKEY='avp_quiz_done_v1';
  const lessons=[
    {id:'excel',title:'Kiến thức Excel cơ bản',url:'excel.html',level:'basic'},
    {id:'shortcuts',title:'100 phím tắt Excel',url:'phimtatexcel.html',level:'basic'},
    {id:'formula',title:'100 công thức Excel',url:'congthucexcel.html',level:'basic'},
    {id:'filter',title:'Filter & Sort',url:'filtersort.html',level:'basic'},
    {id:'pivot',title:'PivotTable',url:'pivottable.html',level:'application'},
    {id:'pareto',title:'Biểu đồ Pareto',url:'bieudopareto.html',level:'application'},
    {id:'report',title:'Báo cáo Excel / QC',url:'baocaoexcel.html',level:'application'},
    {id:'path',title:'Lộ trình 30 ngày',url:'learning-path.html',level:'application'},
    {id:'advanced',title:'Excel nâng cao thực chiến',url:'excel-nang-cao.html',level:'advanced'},
    {id:'powerquery',title:'Power Query thực chiến',url:'power-query-course.html',level:'advanced'},
    {id:'dax',title:'Power Pivot & DAX',url:'power-pivot-dax.html',level:'advanced'},
    {id:'dash',title:'Dashboard động chuyên nghiệp',url:'dashboard-dong.html',level:'advanced'},
    {id:'practice',title:'Practice Lab',url:'practice-lab.html',level:'advanced'},
    {id:'vba',title:'VBA / Macro tự động hóa',url:'vba-macro.html',level:'master'},
    {id:'solver',title:'What-If Analysis & Solver',url:'solver-whatif.html',level:'master'}
  ];
  function json(k,f={}){try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(e){return f}}
  function read(){return json(KEY,{})}
  function write(v){localStorage.setItem(KEY,JSON.stringify(v))}
  function quizzes(){return json(QUIZKEY,{})}
  function currentId(){const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();const item=lessons.find(x=>x.url.toLowerCase()===file);return item?item.id:null}
  function syncFromQuiz(){const p=read(),q=quizzes();let changed=false;lessons.forEach(x=>{if(q[x.url]&&!p[x.id]){p[x.id]=true;changed=true}});if(changed)write(p);return p}
  function completed(item,p,q){return !!(p[item.id]||q[item.url])}
  function state(){const p=syncFromQuiz(),q=quizzes();return {p,q,done:lessons.filter(x=>completed(x,p,q))}}
  function emit(){window.dispatchEvent(new CustomEvent('avp:progress-changed',{detail:{state:state()}}))}
  function renderHome(){const host=document.getElementById('learningStatus');if(!host)return;const {p,q,done}=state();const pct=Math.round(done.length/lessons.length*100);const next=lessons.find(x=>!completed(x,p,q));const xp=+(localStorage.getItem('avp_xp_v2')||0);host.innerHTML=`<div class="learn-status-box"><div class="learn-status-head"><div><h2>🎯 Tiếp tục học</h2><p>${done.length}/${lessons.length} bài • ${pct}% hoàn thành • ${xp} XP</p></div><strong>${next?'Bài tiếp theo':'Đã hoàn thành 🎉'}</strong></div><div class="learn-progress-track"><div class="learn-progress-fill" style="width:${pct}%"></div></div><div class="next-lesson"><div><strong>${next?next.title:'Bạn đã hoàn thành toàn bộ lộ trình'}</strong><br><small>${next?'Tiếp tục đúng bài chưa hoàn thành tiếp theo.':'Xem chứng nhận và hành trình Master.'}</small></div><a href="${next?next.url:'master-learning.html'}">${next?'Học tiếp →':'Xem lộ trình →'}</a></div><div class="learn-status-quick"><a href="master-learning.html">🎓 Lộ trình</a><a href="my-learning.html">📊 Dashboard</a><a href="achievement-learning.html">🏅 Huy hiệu</a></div></div>`;
    document.querySelectorAll('.skill-lessons a[data-lesson-id]').forEach(a=>{const id=a.dataset.lessonId;const item=lessons.find(x=>x.id===id);if(!item)return;a.classList.remove('lesson-done','lesson-next');if(completed(item,p,q)){a.classList.add('lesson-done');const s=a.querySelector('small');if(s)s.textContent='Đã học ✓'}else if(next&&id===next.id){a.classList.add('lesson-next')}})
  }
  function renderLesson(){const id=currentId();if(!id)return;const item=lessons.find(x=>x.id===id);const {p,q}=state();const passed=!!q[item.url],isDone=completed(item,p,q);const topicStatus=document.querySelector('.core-topic-status');let wrap=topicStatus;if(topicStatus){document.querySelectorAll('.lesson-progress-strip').forEach(el=>el.remove())}else{wrap=document.querySelector('.lesson-progress-strip');if(!wrap){wrap=document.createElement('div');wrap.className='lesson-progress-strip';const nav=document.querySelector('.top-simple-nav');if(nav&&nav.parentNode)nav.parentNode.insertBefore(wrap,nav.nextSibling);else (document.querySelector('main')||document.body).prepend(wrap)}}wrap.innerHTML='';const btn=document.createElement('button');btn.className='lesson-complete-btn'+(isDone?' is-done':'');btn.textContent=passed?'✓ Hoàn thành qua quiz':(isDone?'✓ Đã học':'✓ Đánh dấu đã học');if(passed){btn.disabled=true;btn.title='Bài này đã được ghi nhận vì bạn đã vượt quiz.'}else{btn.onclick=()=>{const v=read();v[id]=!v[id];write(v);renderLesson();emit()}}wrap.appendChild(btn)}
  function refresh(){renderHome();renderLesson()}
  document.addEventListener('DOMContentLoaded',refresh);
  window.addEventListener('avp:course-xp',()=>setTimeout(()=>{syncFromQuiz();refresh();emit()},50));
  window.addEventListener('avp:progress-changed',()=>{renderHome()});
  window.addEventListener('storage',e=>{if([KEY,QUIZKEY].includes(e.key))refresh()});
  window.AVPLearningProgress={lessons,state,syncFromQuiz,refresh};
})();
