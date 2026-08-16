(function(){
  const KEY='avp_lesson_progress_v1',QKEY='avp_quiz_done_v1';
  const meta={excel:'excel.html',shortcuts:'phimtatexcel.html',formula:'congthucexcel.html',filter:'filtersort.html',pivot:'pivottable.html',pareto:'bieudopareto.html',report:'baocaoexcel.html',path:'learning-path.html',advanced:'excel-nang-cao.html',powerquery:'power-query-course.html',dax:'power-pivot-dax.html',dash:'dashboard-dong.html',practice:'practice-lab.html',vba:'vba-macro.html',solver:'solver-whatif.html'};
  const stages=[
    {ids:['excel','shortcuts','formula','filter'],title:'Cơ bản',url:'excel.html'},
    {ids:['pivot','pareto','report','path'],title:'Ứng dụng',url:'pivottable.html'},
    {ids:['advanced','powerquery','dax','dash','practice'],title:'Nâng cao',url:'excel-nang-cao.html'},
    {ids:['vba','solver'],title:'Master',url:'vba-macro.html'}
  ];
  function read(k){try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(e){return{}}}
  function isDone(id,p,q){return !!(p[id]||q[meta[id]])}
  function update(){const p=read(KEY),q=read(QKEY);let total=0,done=0,current=0,found=false;
    stages.forEach((s,i)=>{const d=s.ids.filter(id=>isDone(id,p,q)).length;total+=s.ids.length;done+=d;const el=document.querySelector('[data-roadmap-stage="'+i+'"]');if(el){el.classList.toggle('is-done',d===s.ids.length);el.classList.remove('is-current');const st=el.querySelector('.roadmap-stage-status');if(st)st.textContent=d+'/'+s.ids.length+' hoàn thành'}if(!found&&d<s.ids.length){current=i;found=true}});
    if(!found)current=stages.length-1;const currentEl=document.querySelector('[data-roadmap-stage="'+current+'"]');if(currentEl&&done<total){currentEl.classList.add('is-current');const st=currentEl.querySelector('.roadmap-stage-status');if(st)st.textContent='Đang học • '+st.textContent}
    const pct=total?Math.round(done/total*100):0;const fill=document.getElementById('masterRoadmapFill');if(fill)fill.style.width=pct+'%';const txt=document.getElementById('masterRoadmapPct');if(txt)txt.textContent=pct+'%';
    let nextItem=null,nextStage=null;for(const s of stages){const id=s.ids.find(id=>!isDone(id,p,q));if(id){nextItem=id;nextStage=s;break}}
    const title=document.getElementById('roadmapNextTitle'),link=document.getElementById('roadmapNextLink');if(title)title.textContent=done===total?'Bạn đã chạm mốc Master 🎉':(nextStage?nextStage.title+' — '+(window.AVPLearningProgress?.lessons.find(x=>x.id===nextItem)?.title||'tiếp tục lộ trình'):'Tiếp tục lộ trình');if(link){link.href=done===total?'master-learning.html':(meta[nextItem]||nextStage?.url||'excel.html');link.textContent=done===total?'Xem lộ trình →':'Học tiếp →'}
  }
  document.addEventListener('DOMContentLoaded',update);window.addEventListener('avp:progress-changed',update);window.addEventListener('avp:course-xp',()=>setTimeout(update,50));window.addEventListener('storage',update);
})();
