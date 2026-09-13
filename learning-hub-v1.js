(() => {
  'use strict';
  if(window.__AVP_LEARNING_HUB_V1__) return;
  window.__AVP_LEARNING_HUB_V1__=true;

  const P=window.AVPLearningPlatform;
  if(!P) return;
  P.syncLessonOrder?.();

  const TRACKS=[
    {id:'foundation-data',number:'01',label:'FOUNDATION + DATA',title:'Nền tảng & Dữ liệu',tone:'green',modules:['excel-foundation','data-cleaning'],desc:'Hiểu Excel từ gốc, nhập liệu đúng, quản lý bảng, lọc và làm sạch dữ liệu trước khi tính toán.'},
    {id:'formula-analysis',number:'02',label:'FORMULA + ANALYSIS',title:'Công thức & Phân tích',tone:'blue',modules:['formula-lookup','analysis-reporting'],desc:'Logic, lookup, tổng hợp điều kiện, Table, Pivot, KPI và kiểm tra số liệu trước khi bàn giao.'},
    {id:'dashboard-power-query',number:'03',label:'DASHBOARD + POWER QUERY',title:'Dashboard & Power Query',tone:'purple',modules:['dashboard-visual','power-query'],desc:'Trực quan hóa, dashboard tương tác và quy trình kết nối, làm sạch, gộp nguồn, Refresh bằng Power Query.'},
    {id:'automation-cases',number:'04',label:'AUTOMATION + CASE',title:'Tự động hóa & Case',tone:'sand',modules:['vba-optimization','workflow-cases'],desc:'Macro/VBA, tối ưu workbook, chọn đúng công cụ và ghép thành workflow/case thực chiến hoàn chỉnh.'}
  ];

  const byTrack=new Map(TRACKS.map(t=>[t.id,t]));
  const moduleTrack=new Map();
  TRACKS.forEach(t=>t.modules.forEach(id=>moduleTrack.set(id,t.id)));
  const lessons=(window.AVPKnowledgeLessons||[]).slice().sort((a,b)=>(a.order||999)-(b.order||999));
  const byId=new Map(lessons.map(x=>[x.id,x]));
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[ch]));
  const lastId=()=>{try{return localStorage.getItem('avp_knowledge_last_v2')||''}catch(_){return''}};

  function trackLessonIds(track){
    return track.modules.flatMap(id=>P.byModule.get(id)?.lessons||[]);
  }
  TRACKS.forEach(t=>t.lessonIds=trackLessonIds(t));

  function moduleLabel(id){
    const module=P.moduleForLesson(id);
    return module?.title||'Excel';
  }
  function requestedTrack(){
    const params=new URLSearchParams(location.search);
    const direct=params.get('track');
    if(direct&&byTrack.has(direct)) return direct;
    return moduleTrack.get(params.get('module'))||'';
  }
  function setUrl(trackId,push){
    const url=new URL(location.href);
    url.searchParams.delete('browse');
    url.searchParams.delete('module');
    if(trackId) url.searchParams.set('track',trackId); else url.searchParams.delete('track');
    const state={avpLearningTrack:trackId||''};
    if(push) history.pushState(state,'',url.pathname+url.search+url.hash);
    else history.replaceState(state,'',url.pathname+url.search+url.hash);
  }

  function flowCard(track){
    return `<button type="button" class="lh-flow-card" data-learning-track="${esc(track.id)}" data-tone="${esc(track.tone)}">
      <span>${esc(track.number)} · ${esc(track.label)}</span>
      <i class="lh-flow-no" aria-hidden="true">${esc(track.number)}</i>
      <strong>${esc(track.title)}</strong>
      <p>${esc(track.desc)}</p>
      <b>${track.lessonIds.length} bài · Chọn luồng →</b>
    </button>`;
  }

  let currentTrack=null;
  function lessonCard(id,index){
    const lesson=byId.get(id)||{id,title:id,short:'Mở bài học để xem nội dung chi tiết.',duration:'',version:''};
    const globalOrder=P.displayOrder(id);
    const current=id===lastId();
    const href=P.lessonUrl(id);
    return `<article class="lh-lesson-card ${current?'is-current-lesson':''}" data-practice-roll-card data-learning-url="${esc(href)}">
      <div class="lh-lesson-top"><span>BÀI ${String(globalOrder).padStart(2,'0')} · ${esc(moduleLabel(id).toUpperCase())}</span>${current?'<b>ĐANG HỌC</b>':''}</div>
      <h3>${esc(lesson.title||id)}</h3>
      <p>${esc(lesson.short||'Mở bài học để xem nội dung chi tiết.')}</p>
      <div class="lh-lesson-meta">${lesson.duration?`<span>${esc(lesson.duration)}</span>`:''}${lesson.level?`<span>${esc(lesson.level)}</span>`:''}${lesson.version?`<span>${esc(lesson.version)}</span>`:''}</div>
      <div class="lh-lesson-foot"><small>${index+1}/${currentTrack?.lessonIds.length||0} trong luồng</small><a class="lh-open" href="${esc(href)}">Mở bài →</a></div>
    </article>`;
  }

  const selector=document.getElementById('learningSelector');
  const grid=document.getElementById('learningFlowGrid');
  const detail=document.getElementById('learningDetail');
  const detailLabel=document.getElementById('learningDetailLabel');
  const detailTitle=document.getElementById('learningDetailTitle');
  const detailDesc=document.getElementById('learningDetailDesc');
  const detailCount=document.getElementById('learningDetailCount');
  const rollHost=document.querySelector('.lh-roll-shell');
  const back=document.getElementById('learningBack');
  let roll=document.getElementById('learningLessonRoll');

  function bindActiveCardOpen(root){
    root.addEventListener('click',e=>{
      if(e.target.closest('a,button,input,label,textarea,select')) return;
      const card=e.target.closest('[data-learning-url]');
      if(card?.classList.contains('is-roll-active')) location.href=card.dataset.learningUrl;
    });
  }

  function mountRoll(track){
    if(!rollHost) return;
    const fresh=document.createElement('div');
    fresh.className='avp-practice-roll lesson-roll lh-lesson-roll';
    fresh.id='learningLessonRoll';
    fresh.dataset.practiceRoll='';
    fresh.dataset.rollKind='lesson';
    fresh.tabIndex=0;
    fresh.setAttribute('aria-label','Cuộn danh sách bài học');
    const last=lastId();
    fresh.dataset.start=String(Math.max(0,track.lessonIds.indexOf(last)));
    fresh.innerHTML=`<div class="avp-roll-stage" id="learningLessonStage" data-practice-roll-stage>${track.lessonIds.map(lessonCard).join('')}</div><div class="avp-roll-dots" id="learningLessonDots" data-practice-roll-dots></div>`;
    if(roll) roll.replaceWith(fresh);
    else rollHost.prepend(fresh);
    roll=fresh;
    bindActiveCardOpen(roll);
    window.AVPPracticeRoll?.init?.(roll);
  }

  function showSelector(updateHistory=false,scroll=true){
    currentTrack=null;
    if(selector) selector.hidden=false;
    if(detail) detail.hidden=true;
    if(updateHistory) setUrl('',true);
    if(scroll) document.querySelector('.lh-hero')?.scrollIntoView({block:'start',behavior:'smooth'});
  }

  function showTrack(id,{push=true,scroll=true}={}){
    const track=byTrack.get(id);
    if(!track) return;
    currentTrack=track;
    if(selector) selector.hidden=true;
    if(detail) detail.hidden=false;
    if(detailLabel) detailLabel.textContent=`${track.number} · ${track.label}`;
    if(detailTitle) detailTitle.textContent=track.title;
    if(detailDesc) detailDesc.textContent=track.desc;
    if(detailCount) detailCount.textContent=`${track.lessonIds.length} bài`;
    mountRoll(track);
    setUrl(id,push);
    if(scroll) requestAnimationFrame(()=>detail?.scrollIntoView({block:'start',behavior:'smooth'}));
  }

  function boot(){
    if(!grid||!selector||!detail) return;
    grid.innerHTML=TRACKS.map(flowCard).join('');
    grid.addEventListener('click',e=>{
      const card=e.target.closest('[data-learning-track]');
      if(card) showTrack(card.dataset.learningTrack,{push:true,scroll:true});
    });
    back?.addEventListener('click',()=>showSelector(true,true));
    window.addEventListener('popstate',()=>{
      const id=requestedTrack();
      if(id) showTrack(id,{push:false,scroll:false}); else showSelector(false,false);
    });

    const initial=requestedTrack();
    if(initial) showTrack(initial,{push:false,scroll:false});
    else {selector.hidden=false;detail.hidden=true;setUrl('',false);}
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
