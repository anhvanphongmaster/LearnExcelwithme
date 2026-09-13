/*! AVP Home Knowledge V3 — compact one-panel 24-lesson learning map. */
(function(w,d){
  'use strict';
  if(w.__AVP_HOME_KNOWLEDGE_V3__)return;
  w.__AVP_HOME_KNOWLEDGE_V3__=true;
  w.__AVP_HOME_KNOWLEDGE_V2__=true;

  const ZONES=[
    {
      key:'foundation',number:'01',label:'FOUNDATION',name:'Nền tảng Excel',desc:'Từ số 0: hiểu file Excel, dữ liệu, định dạng, công thức, hàm và bảng nguồn.',tone:'green',
      lessons:[
        ['01','📘','f01-excel-workspace','Làm quen Excel và cách một file hoạt động'],
        ['02','⌨️','f02-data-entry-types','Nhập liệu và kiểu dữ liệu'],
        ['03','🎨','f03-formatting-display','Định dạng và hiển thị'],
        ['04','🧮','f04-formulas-references','Công thức và tham chiếu ô'],
        ['05','➕','f05-core-functions','Các hàm nền tảng'],
        ['06','🔎','f06-data-table-structure','Quản lý bảng dữ liệu']
      ]
    },
    {
      key:'skills',number:'02',label:'DATA SKILLS',name:'Dữ liệu & Công thức',desc:'Logic, tổng hợp điều kiện, lookup, text, date và kiểm soát dữ liệu.',tone:'blue',
      lessons:[
        ['07','🔀','s07-logic','Logic IF, AND, OR và xử lý lỗi'],
        ['08','Σ','s08-conditional-aggregation','SUMIFS, COUNTIFS và tổng hợp điều kiện'],
        ['09','🔍','s09-lookup','XLOOKUP, VLOOKUP và INDEX/MATCH'],
        ['10','🔤','s10-text','Xử lý văn bản và mã'],
        ['11','📅','s11-date-time','Ngày tháng và thời gian'],
        ['12','🧹','s12-clean-control','Làm sạch và kiểm soát dữ liệu']
      ]
    },
    {
      key:'analysis',number:'03',label:'ANALYSIS',name:'Phân tích & Báo cáo',desc:'Table, Pivot, KPI, biểu đồ, dashboard và kiểm tra trước khi bàn giao.',tone:'purple',
      lessons:[
        ['13','▦','a13-excel-table','Excel Table'],
        ['14','📊','a14-pivottable','PivotTable'],
        ['15','🎯','a15-kpi-analysis','Phân tích KPI'],
        ['16','📈','a16-charts-pareto','Biểu đồ và Pareto'],
        ['17','🖥️','a17-dashboard','Dashboard Excel'],
        ['18','✅','a18-report-audit-handover','Kiểm tra và bàn giao báo cáo']
      ]
    },
    {
      key:'advanced',number:'04',label:'ADVANCED',name:'Nâng cao & Tự động hóa',desc:'Formula nâng cao, Dynamic Array, Power Query, VBA và workflow tự động hóa.',tone:'sand',
      lessons:[
        ['19','🧠','x19-advanced-formulas','Công thức nâng cao'],
        ['20','⚡','x20-dynamic-array','Dynamic Array / Microsoft 365'],
        ['21','🔄','x21-power-query-basics','Power Query nền tảng'],
        ['22','🗂️','x22-power-query-multi-source','Power Query nhiều nguồn'],
        ['23','⚙️','x23-macro-vba','Macro và VBA'],
        ['24','🚀','x24-automation-workflow','Workflow Excel tự động hóa']
      ]
    }
  ];

  const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const lessonUrl=id=>`knowledge.html?lesson=${encodeURIComponent(id)}`;

  function tab(zone,index){
    return `<button class="hp-kv2-tab hp-kv2-tab-${zone.tone}" type="button" role="tab" id="hp-kv2-tab-${zone.key}" aria-controls="hp-kv2-pane-${zone.key}" aria-selected="${index===0?'true':'false'}" tabindex="${index===0?'0':'-1'}" data-zone="${zone.key}"><span>${zone.number}</span><span><small>${esc(zone.label)}</small><strong>${esc(zone.name)}</strong></span></button>`;
  }

  function pane(zone,index){
    const links=zone.lessons.map(([num,icon,id,title])=>
      `<li><a href="${lessonUrl(id)}"><span class="hp-kv2-num">${num}</span><span class="hp-kv2-icon" aria-hidden="true">${icon}</span><span class="hp-kv2-title">${esc(title)}</span></a></li>`
    ).join('');
    return `<article class="hp-kv2-pane hp-kv2-pane-${zone.tone}" id="hp-kv2-pane-${zone.key}" role="tabpanel" aria-labelledby="hp-kv2-tab-${zone.key}" data-zone="${zone.key}" ${index===0?'':'hidden'}><div class="hp-kv2-head"><div><span>${zone.number} · ${esc(zone.label)}</span><h3>${esc(zone.name)}</h3></div><p>${esc(zone.desc)}</p></div><ul>${links}</ul><a class="hp-kv2-more" href="skill-map.html#zone-${zone.key}">6 bài · luôn mở →</a></article>`;
  }

  function panel(){
    return `<section class="avp-home-kv2-panel" aria-label="Lộ trình 24 bài Excel"><div class="hp-kv2-tabs" role="tablist" aria-label="4 chặng học Excel">${ZONES.map(tab).join('')}</div><div class="hp-kv2-panels">${ZONES.map(pane).join('')}</div></section>`;
  }

  function ensureCss(){
    let link=d.querySelector('link[data-avp-home-kv2-css]');
    if(link)return;
    link=d.createElement('link');
    link.rel='stylesheet';
    link.href='avp-home-knowledge-v2.css?v=20260913-panel1';
    link.dataset.avpHomeKv2Css='1';
    d.head.appendChild(link);
  }

  function ensureMotionCss(){
    let link=d.querySelector('link[data-avp-home-motion-fix]');
    if(link)return;
    link=d.createElement('link');
    link.rel='stylesheet';
    link.href='home-mini-bounce.css?v=20260910-motion3';
    link.dataset.avpHomeMotionFix='1';
    d.head.appendChild(link);
  }

  function syncPracticeCta(){
    const cta=d.querySelector('.avp-practice-hub-cta');
    if(!cta)return;
    const copy=cta.querySelector('.avp-mobile-main-cta-copy');
    const smalls=copy?[...copy.querySelectorAll('small')]:[];
    if(smalls[0])smalls[0].textContent='5 luồng thực hành trong cùng một khu';
    if(smalls[1]){
      smalls[1].textContent='01 TikTok · 02 YouTube · 03 Homework · 04 Tự chấm · 05 Pro';
      smalls[1].style.fontSize='11px';
      smalls[1].style.lineHeight='1.45';
    }
    const badges=cta.querySelector('.avp-practice-hub-badges');
    const needsFiveMotion=badges&&(
      badges.children.length!==5 ||
      !badges.querySelector('.avp-mini-channel-hw') ||
      !badges.querySelector('.avp-mini-channel-pro')
    );
    if(needsFiveMotion){
      badges.innerHTML='<span class="avp-mini-channel avp-mini-channel-tt">♪</span><span class="avp-mini-channel avp-mini-channel-yt">▶</span><span class="avp-mini-channel avp-mini-channel-hw">✎</span><span class="avp-mini-channel avp-mini-channel-grade">✓</span><span class="avp-mini-channel avp-mini-channel-pro">◆</span>';
    }
  }

  function selectZone(grid,key,focus){
    const tabs=[...grid.querySelectorAll('.hp-kv2-tab')];
    const panes=[...grid.querySelectorAll('.hp-kv2-pane')];
    if(!tabs.some(tab=>tab.dataset.zone===key))return;
    tabs.forEach(tab=>{
      const active=tab.dataset.zone===key;
      tab.setAttribute('aria-selected',active?'true':'false');
      tab.tabIndex=active?0:-1;
      if(active&&focus)tab.focus({preventScroll:true});
    });
    panes.forEach(pane=>{pane.hidden=pane.dataset.zone!==key;});
  }

  function bindPanel(grid){
    if(grid.dataset.kv2TabsBound==='1')return;
    grid.dataset.kv2TabsBound='1';
    grid.addEventListener('click',e=>{
      const tab=e.target.closest('.hp-kv2-tab');
      if(!tab||!grid.contains(tab))return;
      selectZone(grid,tab.dataset.zone,false);
    });
    grid.addEventListener('keydown',e=>{
      const tab=e.target.closest('.hp-kv2-tab');
      if(!tab)return;
      const tabs=[...grid.querySelectorAll('.hp-kv2-tab')];
      const current=tabs.indexOf(tab);
      let next=current;
      if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(current+1)%tabs.length;
      else if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(current-1+tabs.length)%tabs.length;
      else if(e.key==='Home')next=0;
      else if(e.key==='End')next=tabs.length-1;
      else return;
      e.preventDefault();
      selectZone(grid,tabs[next].dataset.zone,true);
    });
  }

  function replaceText(){
    syncPracticeCta();
    const section=d.getElementById('ky-nang-excel')||d.querySelector('.home-path');
    if(!section)return false;

    const h2=section.querySelector('.home-path-inner > h2')||section.querySelector('h2');
    if(h2)h2.textContent='Lộ trình 24 bài Excel';

    const intro=section.querySelector('.home-path-inner > p');
    if(intro)intro.textContent='4 chặng × 6 bài. Chọn một chặng để xem bài — gọn hơn nhưng vẫn giữ đủ 24 bài.';

    const grid=section.querySelector('.home-path-grid');
    if(!grid)return false;
    grid.classList.add('avp-home-kv2-grid','avp-home-kv2-single-panel');
    if(!grid.querySelector('.avp-home-kv2-panel'))grid.innerHTML=panel();
    bindPanel(grid);
    section.dataset.knowledgeVersion='3';

    const tease=d.querySelector('#avpScrollToPath .avp-tease-title');
    if(tease)tease.innerHTML='<span class="avp-tease-chevs" aria-hidden="true"><span>▾</span><span>▾</span><span>▾</span></span> Lộ trình 24 bài · Bảng xếp hạng';
    return true;
  }

  function guardGrid(){
    const section=d.getElementById('ky-nang-excel')||d.querySelector('.home-path');
    const grid=section&&section.querySelector('.home-path-grid');
    if(!grid||grid.dataset.kv2Guard==='1')return;
    grid.dataset.kv2Guard='1';
    let queued=false;
    const observer=new MutationObserver(()=>{
      if(queued||grid.querySelector('.avp-home-kv2-panel'))return;
      queued=true;
      queueMicrotask(()=>{queued=false;replaceText();});
    });
    observer.observe(grid,{childList:true});
    w.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
  }

  function boot(){
    ensureCss();
    ensureMotionCss();
    if(replaceText())guardGrid();
  }

  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})(window,document);
