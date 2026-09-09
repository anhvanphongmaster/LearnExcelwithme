/*! AVP Home Knowledge V2 — synchronize homepage learning map with the 24-lesson curriculum. */
(function(w,d){
  'use strict';
  if(w.__AVP_HOME_KNOWLEDGE_V2__)return;
  w.__AVP_HOME_KNOWLEDGE_V2__=true;

  const ZONES=[
    {
      number:'01',label:'FOUNDATION',name:'Nền tảng Excel',desc:'Từ số 0: hiểu file Excel, dữ liệu, định dạng, công thức, hàm và bảng nguồn.',tone:'green',
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
      number:'02',label:'DATA SKILLS',name:'Dữ liệu & Công thức',desc:'Logic, tổng hợp điều kiện, lookup, text, date và kiểm soát dữ liệu.',tone:'blue',
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
      number:'03',label:'ANALYSIS',name:'Phân tích & Báo cáo',desc:'Table, Pivot, KPI, biểu đồ, dashboard và kiểm tra trước khi bàn giao.',tone:'purple',
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
      number:'04',label:'ADVANCED',name:'Nâng cao & Tự động hóa',desc:'Formula nâng cao, Dynamic Array, Power Query, VBA và workflow tự động hóa.',tone:'sand',
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

  function card(zone){
    const links=zone.lessons.map(([num,icon,id,title])=>
      `<li><a href="${lessonUrl(id)}"><span class="hp-kv2-num">${num}</span><span class="hp-kv2-icon" aria-hidden="true">${icon}</span><span class="hp-kv2-title">${esc(title)}</span></a></li>`
    ).join('');
    return `<article class="home-path-card avp-home-kv2-card avp-home-kv2-${zone.tone}">
      <div class="hp-kv2-head"><span>${zone.number} · ${zone.label}</span><h3>${esc(zone.name)}</h3><p>${esc(zone.desc)}</p></div>
      <ul>${links}</ul>
      <a class="hp-kv2-more" href="skill-map.html#zone-${zone.tone==='green'?'foundation':zone.tone==='blue'?'skills':zone.tone==='purple'?'analysis':'advanced'}">6 bài · luôn mở →</a>
    </article>`;
  }

  function replaceText(){
    const section=d.getElementById('ky-nang-excel')||d.querySelector('.home-path');
    if(!section)return false;

    const h2=section.querySelector('.home-path-inner > h2')||section.querySelector('h2');
    if(h2)h2.textContent='Lộ trình 24 bài Excel';

    const intro=section.querySelector('.home-path-inner > p');
    if(intro)intro.textContent='4 chặng × 6 bài. Mọi bài đều mở — người mới có thể học tuần tự, người đã có nền tảng có thể vào thẳng phần cần học.';

    const grid=section.querySelector('.home-path-grid');
    if(!grid)return false;
    grid.classList.add('avp-home-kv2-grid');
    grid.innerHTML=ZONES.map(card).join('');
    section.dataset.knowledgeVersion='2';

    const tease=d.querySelector('#avpScrollToPath .avp-tease-title');
    if(tease){
      tease.innerHTML='<span class="avp-tease-chevs" aria-hidden="true"><span>▾</span><span>▾</span><span>▾</span></span> Lộ trình 24 bài · Bảng xếp hạng';
    }
    return true;
  }

  function boot(){
    replaceText();
    // A late legacy renderer must not put the 14-lesson cards back.
    setTimeout(replaceText,250);
    setTimeout(replaceText,900);
  }

  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})(window,document);
