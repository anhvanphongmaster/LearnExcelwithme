(function(){
  const KEY='avp_lesson_progress_v1';
  const stages=[
    {ids:['excel','shortcuts','formula','filter'],title:'Cơ bản',url:'excel.html'},
    {ids:['pivot','pareto','report','path'],title:'Ứng dụng',url:'pivottable.html'},
    {ids:['advanced','dax','dash'],title:'Nâng cao',url:'excel-nang-cao.html'},
    {ids:['vba','solver'],title:'Master',url:'vba-macro.html'}
  ];
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
  function update(){
    const p=read(); let total=0,done=0,current=0;
    stages.forEach((s,i)=>{const d=s.ids.filter(id=>p[id]).length; total+=s.ids.length;done+=d;const el=document.querySelector('[data-roadmap-stage="'+i+'"]');if(el){el.classList.toggle('is-done',d===s.ids.length);el.querySelector('.roadmap-stage-status').textContent=d+'/'+s.ids.length+' hoàn thành';}if(current===0&&d===s.ids.length) current=i+1;});
    if(current>=stages.length) current=stages.length-1;
    const currentEl=document.querySelector('[data-roadmap-stage="'+current+'"]');if(currentEl){currentEl.classList.add('is-current');const st=currentEl.querySelector('.roadmap-stage-status');if(st&&!currentEl.classList.contains('is-done'))st.textContent='Đang học • '+st.textContent;}
    const pct=total?Math.round(done/total*100):0;const fill=document.getElementById('masterRoadmapFill');if(fill)fill.style.width=pct+'%';const txt=document.getElementById('masterRoadmapPct');if(txt)txt.textContent=pct+'%';
    const next=stages[current];const title=document.getElementById('roadmapNextTitle');const link=document.getElementById('roadmapNextLink');if(title)title.textContent=done===total?'Bạn đã chạm mốc Master 🎉':next.title+' — tiếp tục lộ trình';if(link){link.href=next.url;link.textContent=done===total?'Ôn lại kiến thức →':'Học tiếp →';}
  }
  document.addEventListener('DOMContentLoaded',update);
})();
