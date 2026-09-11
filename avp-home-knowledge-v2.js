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

  function ensureMotionCss(){
    let link=d.querySelector('link[data-avp-home-motion-fix]');
    if(link)return;
    link=d.createElement('link');
    link.rel='stylesheet';
    link.href='home-mini-bounce.css?v=20260910-motion3';
    link.dataset.avpHomeMotionFix='1';
    d.head.appendChild(link);
  }

  function ensureArenaHomeStyle(){
    if(d.getElementById('avpArenaHomeStyle'))return;
    const style=d.createElement('style');
    style.id='avpArenaHomeStyle';
    style.textContent=`
      .home-more-race.avp-arena-home{position:relative!important;border:1px solid #83b99a!important;background:linear-gradient(145deg,#f1faf4,#fff)!important;overflow:visible!important}
      .home-more-race.avp-arena-home:hover{border-color:#4f936a!important;background:#eaf7ef!important}
      .home-more-race .avp-arena-home-badge{position:absolute;right:10px;top:10px;display:inline-flex;padding:4px 7px;border-radius:999px;background:#217346;color:#fff;font-size:9px;font-weight:900;letter-spacing:.06em;line-height:1}
      .home-more-race .avp-arena-home-meta{display:block;margin-top:4px;color:#52705f;font-size:10px;font-weight:800}
      @media(prefers-reduced-motion:no-preference){.home-more-race .avp-arena-home-badge{animation:avpArenaBadgePulse 2.4s ease-in-out infinite}@keyframes avpArenaBadgePulse{0%,80%,100%{box-shadow:0 0 0 0 rgba(33,115,70,0)}90%{box-shadow:0 0 0 5px rgba(33,115,70,.12)}}}
    `;
    d.head.appendChild(style);
  }

  function syncArenaCard(){
    ensureArenaHomeStyle();
    const race=d.querySelector('a.home-more-race[href*="excel-race.html"]');
    if(!race)return;
    race.classList.add('avp-arena-home');
    race.setAttribute('aria-label','Excel Arena — Học và Rank theo nhiều chủ đề Excel');
    const icon=race.querySelector(':scope > span:not(.avp-arena-home-badge):not(.avp-arena-home-meta)');
    if(icon)icon.textContent='⚡';
    const title=race.querySelector('strong');
    if(title)title.textContent='Excel Arena';
    const small=race.querySelector('small');
    if(small)small.textContent='Bạn nhớ Excel đến đâu khi thời gian đang chạy?';
    if(!race.querySelector('.avp-arena-home-meta')){
      const meta=d.createElement('span');meta.className='avp-arena-home-meta';meta.textContent='Học · Rank · 14 chủ đề';race.appendChild(meta);
    }
    if(!race.querySelector('.avp-arena-home-badge')){
      const badge=d.createElement('span');badge.className='avp-arena-home-badge';badge.textContent='NEW GAME';race.appendChild(badge);
    }
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
      badges.children.length!==5 || !badges.querySelector('.avp-mini-channel-hw') || !badges.querySelector('.avp-mini-channel-pro')
    );
    if(needsFiveMotion){
      badges.innerHTML='<span class="avp-mini-channel avp-mini-channel-tt">♪</span><span class="avp-mini-channel avp-mini-channel-yt">▶</span><span class="avp-mini-channel avp-mini-channel-hw">✎</span><span class="avp-mini-channel avp-mini-channel-grade">✓</span><span class="avp-mini-channel avp-mini-channel-pro">◆</span>';
    }
  }

  function replaceText(){
    syncPracticeCta();
    syncArenaCard();
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
    if(tease)tease.innerHTML='<span class="avp-tease-chevs" aria-hidden="true"><span>▾</span><span>▾</span><span>▾</span></span> Lộ trình 24 bài · Bảng xếp hạng';
    return true;
  }

  function boot(){
    ensureMotionCss();
    syncArenaCard();
    replaceText();
    setTimeout(replaceText,250);
    setTimeout(replaceText,900);
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})(window,document);
