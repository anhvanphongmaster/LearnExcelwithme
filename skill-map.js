(() => {
  'use strict';

  const LAST_KEY='avp_knowledge_last_v2';
  const lessons=(window.AVPKnowledgeLessons||[]).slice().sort((a,b)=>a.order-b.order);
  const byId=new Map(lessons.map(x=>[x.id,x]));
  const ZONES=[
    {id:'foundation',number:'01',label:'FOUNDATION',name:'Nền tảng Excel',desc:'Từ số 0: giao diện, dữ liệu, định dạng, công thức, hàm và bảng nguồn.',accent:'green'},
    {id:'skills',number:'02',label:'DATA SKILLS',name:'Dữ liệu & Công thức',desc:'Logic, tổng hợp điều kiện, lookup, text, date và kiểm soát dữ liệu.',accent:'blue'},
    {id:'analysis',number:'03',label:'ANALYSIS',name:'Phân tích & Báo cáo',desc:'Table, Pivot, KPI, chart, dashboard và quy trình bàn giao.',accent:'purple'},
    {id:'advanced',number:'04',label:'ADVANCED',name:'Nâng cao & Tự động hóa',desc:'Formula nâng cao, Dynamic Array, Power Query, VBA và workflow.',accent:'sand'}
  ];
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const urlFor=id=>`knowledge.html?lesson=${encodeURIComponent(id)}`;

  function lastLesson(){
    const id=localStorage.getItem(LAST_KEY);
    return byId.get(id)||lessons[0]||null;
  }

  function renderResume(){
    const lesson=lastLesson();
    if(!lesson)return;
    const zone=ZONES.find(z=>z.id===lesson.zone);
    $('smTodayStage').textContent=zone?.name||lesson.level;
    $('smTodayTitle').textContent=`Bài ${String(lesson.order).padStart(2,'0')} · ${lesson.title}`;
    $('smTodayDesc').textContent=lesson.order===1&&!localStorage.getItem(LAST_KEY)
      ?'Nếu đây là lần đầu học, bắt đầu từ Bài 01. Nếu đã có nền tảng, chọn trực tiếp một chặng bên dưới.'
      :'Đây là bài bạn mở gần nhất. Việc ghi nhớ chỉ giúp quay lại đúng chỗ, không được tính là “đã hoàn thành”.';
    $('smTodayLink').href=urlFor(lesson.id);
    $('smTodayLink').textContent=localStorage.getItem(LAST_KEY)?'Học tiếp →':'Mở bài →';
  }

  function renderMap(){
    const root=$('smZones');
    if(!root)return;
    root.innerHTML=ZONES.map(zone=>{
      const items=lessons.filter(x=>x.zone===zone.id);
      return `<section class="sm-zone sm-zone-${zone.accent}" id="zone-${zone.id}">
        <header class="sm-zone-head">
          <div class="sm-zone-number">${zone.number}</div>
          <div><span>${zone.label}</span><h3>${esc(zone.name)}</h3><p>${esc(zone.desc)}</p></div>
        </header>
        <div class="sm-zone-lessons">
          ${items.map(lesson=>{
            const isLast=localStorage.getItem(LAST_KEY)===lesson.id;
            const qCount=lesson.sections.reduce((n,s)=>n+(s.questions?.length||0),0);
            return `<a class="sm-node ${isLast?'resume':''}" href="${urlFor(lesson.id)}" data-lesson-id="${esc(lesson.id)}">
              <span class="sm-node-num">${String(lesson.order).padStart(2,'0')}</span>
              <span class="sm-node-copy"><strong>${esc(lesson.title)}</strong><small>${esc(lesson.short)}</small></span>
              <span class="sm-node-meta">${lesson.sections.length} phần · ${qCount} câu</span>
            </a>`;
          }).join('')}
        </div>
        <footer class="sm-zone-foot"><strong>6 bài · luôn mở</strong><span>${zone.id==='foundation'?'Nên học tuần tự nếu bắt đầu từ số 0.':'Có thể vào thẳng nếu bạn đã có kiến thức nền.'}</span></footer>
      </section>`;
    }).join('');
  }

  function validateCurriculum(){
    const warnings=[];
    if(lessons.length!==24)warnings.push(`expected 24 lessons, found ${lessons.length}`);
    ZONES.forEach(zone=>{
      const count=lessons.filter(x=>x.zone===zone.id).length;
      if(count!==6)warnings.push(`${zone.id}: expected 6 lessons, found ${count}`);
    });
    if(warnings.length)console.warn('[Knowledge V2 curriculum]',warnings.join('; '));
  }

  function init(){
    validateCurriculum();
    renderResume();
    renderMap();
    if(location.hash){requestAnimationFrame(()=>document.querySelector(location.hash)?.scrollIntoView({block:'start'}))}
    window.addEventListener('storage',event=>{if(event.key===LAST_KEY){renderResume();renderMap();}});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
