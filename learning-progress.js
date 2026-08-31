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
  function renderHome(){const host=document.getElementById('learningStatus');if(!host)return;const {p,q,done}=state();const pct=Math.round(done.length/lessons.length*100);const next=lessons.find(x=>!completed(x,p,q));const xp=+(localStorage.getItem('avp_xp_v2')||0);host.innerHTML=`<div class="learn-status-box"><div class="learn-status-head"><div><h2>🎯 Tiếp tục học</h2><p>${done.length}/${lessons.length} bài • ${pct}% hoàn thành • ${xp} XP</p></div><strong>${next?'Bài tiếp theo':'Đã hoàn thành 🎉'}</strong></div><div class="learn-progress-track"><div class="learn-progress-fill" style="width:${pct}%"></div></div><div class="next-lesson"><div><strong>${next?next.title:'Bạn đã hoàn thành toàn bộ lộ trình'}</strong><br><small>${next?'Tiếp tục đúng bài chưa hoàn thành tiếp theo.':'Xem Skill Map và thành tích đã hoàn thành.'}</small></div><a href="${next?next.url:'skill-map.html'}">${next?'Học tiếp →':'Xem Skill Map →'}</a></div><div class="learn-status-quick"><a href="skill-map.html">Skill Map</a><a href="dashboard.html">📊 Dashboard</a><a href="achievements.html">Thành tích</a></div></div>`;
    document.querySelectorAll('.skill-lessons a[data-lesson-id]').forEach(a=>{const id=a.dataset.lessonId;const item=lessons.find(x=>x.id===id);if(!item)return;a.classList.remove('lesson-done','lesson-next');if(completed(item,p,q)){a.classList.add('lesson-done');const s=a.querySelector('small');if(s)s.textContent='Đã học ✓'}else if(next&&id===next.id){a.classList.add('lesson-next')}})
  }
  function renderLesson(){
    const id=currentId();
    if(!id)return;
    if(document.body.classList.contains('core-topic-page')){
      document.querySelectorAll('.lesson-action-row,.avp-page-back-wrap').forEach(function(el){el.style.display='none'});
      return;
    }
    const item=lessons.find(x=>x.id===id);
    const {p,q}=state();
    const passed=!!q[item.url],isDone=completed(item,p,q);

    // V31: one clean action row for every page using learning-progress.
    // It sits below the page hero/navigation and immediately above the XP/course panel.
    document.querySelectorAll('.lesson-progress-strip,.avp-page-back-wrap').forEach(el=>el.remove());
    const topicStatus=document.querySelector('.core-topic-status');
    if(topicStatus){topicStatus.innerHTML='';topicStatus.style.display='none';}

    let row=document.querySelector('.lesson-action-row');
    if(!row){
      row=document.createElement('div');
      row.className='lesson-action-row';
      row.innerHTML='<a class="lesson-home-link" href="index.html"><span aria-hidden="true">←</span><span>Về Trang chủ</span></a><div class="lesson-action-status"></div>';
    }
    const holder=row.querySelector('.lesson-action-status');
    holder.innerHTML='';
    const btn=document.createElement('button');
    btn.className='lesson-complete-btn'+(isDone?' is-done':'');
    btn.textContent=passed?'✓ Hoàn thành qua quiz':(isDone?'✓ Đã học':'✓ Đánh dấu đã học');
    if(passed){
      btn.disabled=true;
      btn.title='Bài này đã được ghi nhận vì bạn đã vượt quiz.';
    }else{
      btn.onclick=()=>{const v=read();v[id]=!v[id];write(v);renderLesson();emit()};
    }
    holder.appendChild(btn);

    function place(){
      const shell=document.querySelector('.course-shell');
      const main=document.querySelector('main');
      if(shell && shell.parentNode){ shell.parentNode.insertBefore(row,shell); return; }
      if(main && main.parentNode){ main.parentNode.insertBefore(row,main); return; }
      const nav=document.querySelector('.top-simple-nav');
      if(nav) nav.insertAdjacentElement('afterend',row); else document.body.prepend(row);
    }
    // course-engine may inject after this DOMContentLoaded callback, so place twice.
    place();
    setTimeout(place,0);
  }

  function renderContinue(){
    const a=document.getElementById('homeContinueLearn');
    if(!a) return;
    const title=document.getElementById('homeContinueTitle');
    const meta=document.getElementById('homeContinueMeta');
    const {p,q}=state();
    const next=lessons.find(x=>!completed(x,p,q));
    let last=null;
    try{last=JSON.parse(localStorage.getItem('avp_last_lesson_v1')||'null')}catch(e){}
    if(next){
      a.href=next.url;
      if(title) title.textContent='Tiếp tục: '+next.title;
      const i=lessons.findIndex(x=>x.url===next.url)+1;
      if(meta) meta.textContent='Bài '+i+'/'+lessons.length+(last&&last.title?' • vừa xem: '+last.title:'');
    }else{
      a.href='master-learning.html';
      if(title) title.textContent='Bạn đã hoàn thành lộ trình';
      if(meta) meta.textContent='Xem Master Learning Path và chứng nhận';
    }
  }

  function compactCatalog(root, items, limit, moreLabel){
    if(!root || items.length<=limit) return;
    if(root.dataset.compactReady) return;
    root.dataset.compactReady='1';
    function apply(open){
      items.forEach(function(el,i){ el.style.display = (!open && i>=limit) ? 'none' : ''; });
    }
    apply(false);
    var btn=document.createElement('button');
    btn.type='button';
    btn.className='lesson-show-all';
    btn.textContent=moreLabel+' ('+items.length+')';
    btn.addEventListener('click',function(){
      var open=btn.dataset.open==='1';
      apply(!open);
      btn.dataset.open=open?'0':'1';
      btn.textContent=open?(moreLabel+' ('+items.length+')'):'Thu gọn danh sách';
    });
    root.insertAdjacentElement('afterend',btn);
    return btn;
  }
  function setupShortcutCompact(){
    var box=document.getElementById('shortcutContainer');
    if(!box) return;
    function run(){
      var cards=[].slice.call(box.querySelectorAll('.shortcut-card'));
      if(!cards.length) return;
      delete box.dataset.compactReady;
      var old=box.nextElementSibling;
      if(old && old.classList.contains('lesson-show-all')) old.remove();
      var search=document.getElementById('shortcutSearch');
      var filtering=search && search.value.trim();
      var cat=document.querySelector('.shortcut-filter.active');
      var notAll=cat && cat.textContent.trim()!=='Tất cả';
      if(filtering || notAll){ cards.forEach(function(el){ el.style.display=''; }); return; }
      compactCatalog(box, cards, 10, 'Xem tất cả phím tắt');
    }
    run();
    var obs=new MutationObserver(run);
    obs.observe(box,{childList:true});
  }
  function setupFormulaCompact(){
    var table=document.getElementById('formulaTable');
    if(!table) return;
    var rows=[].slice.call(table.querySelectorAll('tbody tr'));
    compactCatalog(table, rows, 10, 'Xem tất cả công thức');
    var input=document.getElementById('searchInput');
    if(input){
      input.addEventListener('input',function(){
        var btn=table.nextElementSibling;
        if(input.value.trim()){
          rows.forEach(function(el){ /* leave filter script to hide */ });
          if(btn && btn.classList.contains('lesson-show-all')) btn.style.display='none';
        }else if(btn){ btn.style.display=''; }
      });
    }
  }
  function setupLongLesson(){
    var main=document.querySelector('main');
    if(!main) return;
    var blocks=[].slice.call(main.children).filter(function(el){
      return el.matches('section, article, div') && !el.classList.contains('course-shell') && !el.classList.contains('lesson-tips-panel');
    });
    if(blocks.length<=2) return;
    var extra=blocks.slice(2);
    extra.forEach(function(el,i){ if(i>0) el.classList.add('lesson-extra-block'); });
    var firstExtra=extra[0];
    if(!firstExtra) return;
    var btn=document.createElement('button');
    btn.type='button';
    btn.className='lesson-show-all';
    btn.textContent='Xem thêm nội dung bài học';
    firstExtra.parentNode.insertBefore(btn, extra[1]||null);
    extra.slice(1).forEach(function(el){ el.style.display='none'; });
    btn.addEventListener('click',function(){
      var open=btn.dataset.open==='1';
      extra.slice(1).forEach(function(el){ el.style.display=open?'none':''; });
      btn.dataset.open=open?'0':'1';
      btn.textContent=open?'Xem thêm nội dung bài học':'Thu gọn nội dung';
    });
  }
  function refresh(){renderHome();renderLesson();renderContinue()}
  document.addEventListener('DOMContentLoaded',function(){refresh();setupShortcutCompact();setupFormulaCompact();setupLongLesson();});
  window.addEventListener('avp:course-xp',()=>setTimeout(()=>{syncFromQuiz();refresh();emit()},50));
  window.addEventListener('avp:progress-changed',()=>{renderHome()});
  window.addEventListener('storage',e=>{if([KEY,QUIZKEY].includes(e.key))refresh()});
  window.AVPLearningProgress={lessons,state,syncFromQuiz,refresh};
})();
