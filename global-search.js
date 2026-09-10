(() => {
  'use strict';
  if(window.__AVP_GLOBAL_SEARCH_V2__)return;
  window.__AVP_GLOBAL_SEARCH_V2__=true;

  const L=(id,title,keys,icon='📗')=>({icon,title,desc:'Bài học trong nền tảng Excel A–Z',url:`knowledge.html?lesson=${id}`,type:'Bài học',keys:`${title} ${keys}`});
  const ITEMS=[
    {icon:'🏠',title:'Trang chủ',desc:'Learn Excel with Anh Van Phong',url:'index.html',type:'Trang',keys:'trang chu home anh van phong'},
    {icon:'🧭',title:'Học Excel A–Z · 8 module · 42 bài',desc:'Lộ trình chính từ nền tảng đến case thực chiến',url:'skill-map.html',type:'Lộ trình',keys:'hoc excel a z lo trinh module 42 bai foundation power query vba dashboard'},
    L('f01-excel-workspace','01 · Làm quen Excel và cách một file hoạt động','workbook worksheet cell range ribbon name box sheet'),
    L('f02-data-entry-types','02 · Nhập liệu và kiểu dữ liệu','text number date percentage autofill data type'),
    L('f03-formatting-display','03 · Định dạng và hiển thị','format number currency percent date wrap text alignment'),
    L('f04-formulas-references','04 · Công thức và tham chiếu ô','formula reference f4 absolute relative mixed'),
    L('f05-core-functions','05 · Các hàm nền tảng','sum average min max count counta round'),
    L('f06-data-table-structure','06 · Quản lý bảng dữ liệu','source table structure header grain key blank'),
    L('d07-sort-filter','07 · Sort & Filter','filter sort loc sap xep number date text filter'),
    L('d08-find-replace','08 · Find / Replace','find replace ctrl f ctrl h tim thay the'),
    L('s10-text','09 · Xử lý văn bản và mã','left right mid trim clean substitute textjoin text'),
    L('d09-data-validation','10 · Data Validation','data validation dropdown list chan nhap sai'),
    L('s12-clean-control','11 · Làm sạch và kiểm soát dữ liệu','remove duplicates text to columns go to special clean data'),
    L('s07-logic','12 · IF, AND, OR và xử lý lỗi','if and or iferror logic dieu kien'),
    L('s08-conditional-aggregation','13 · SUMIFS, COUNTIFS và tổng hợp điều kiện','sumifs countifs averageifs criteria wildcard'),
    L('s09-lookup','14 · XLOOKUP, VLOOKUP và INDEX/MATCH','xlookup vlookup index match lookup master key'),
    L('s11-date-time','15 · Ngày tháng và thời gian','today now date year month eomonth serial'),
    L('x19-advanced-formulas','16 · Công thức nâng cao','sumproduct aggregate let evaluate formula goal seek solver'),
    L('x20-dynamic-array','17 · Dynamic Array / Microsoft 365','filter unique sort sequence spill vstack textsplit lambda'),
    L('a13-excel-table','18 · Excel Table','ctrl t structured reference calculated column total row'),
    L('a14-pivottable','19 · PivotTable','pivot rows columns values slicer refresh group date'),
    L('a15-kpi-analysis','20 · Phân tích KPI','kpi metric dimension grain target actual aov cr variance'),
    L('a18-report-audit-handover','21 · Kiểm tra và bàn giao báo cáo','audit handover print protect version qc report'),
    L('a19-reconciliation','22 · Reconciliation','control total reconcile row count exception doi chieu'),
    L('a16-charts-pareto','23 · Biểu đồ và Pareto','chart pareto combo histogram waterfall visual'),
    L('a17-dashboard','24 · Dashboard Excel','dashboard layout slicer timeline kpi card'),
    L('v23-kpi-cards','25 · KPI Cards','kpi card actual target variance status'),
    L('v24-slicer-timeline','26 · Slicer & Timeline','slicer timeline report connections filter context'),
    L('v25-dashboard-interaction','27 · Dashboard tương tác','dashboard interaction overview breakdown exception'),
    L('pq28-import-sources','28 · Power Query: kết nối nguồn','power query get data workbook csv folder table source'),
    L('x21-power-query-basics','29 · Power Query nền tảng','applied steps trim clean transform close load refresh'),
    L('pq30-transform-clean','30 · Power Query Transform','trim clean replace split filter errors applied steps'),
    L('pq31-schema-types','31 · Power Query Schema & Data Type','schema drift data type choose columns rename'),
    L('x22-power-query-multi-source','32 · Power Query nhiều nguồn','append merge folder combine join staging'),
    L('pq33-refresh-performance','33 · Power Query Refresh & Performance','refresh performance connection only staging load'),
    L('x23-macro-vba','34 · Macro và VBA','record macro xlsm developer visual basic'),
    L('vb35-object-model','35 · VBA Object Model','workbook worksheet range thisworkbook activeworkbook'),
    L('vb36-control-flow','36 · VBA If / Loop / Procedure','if loop for each sub function lastrow'),
    L('vb37-performance-security','37 · VBA Performance & Security','screenupdating calculation error handling macro security'),
    L('x24-automation-workflow','38 · Workflow Excel tự động hóa','input transform calculate report validate deliver automation'),
    L('c39-tool-selection','39 · Chọn đúng công cụ','formula pivot power query vba data model decision'),
    L('c40-sales-case','40 · Case Sales','sales revenue orders cr aov target store'),
    L('c41-qc-case','41 · Case QC / Vận hành','qc defect ng rate pareto lot line shift'),
    L('c42-end-to-end-case','42 · Case tổng hợp A–Z','raw clean model report validate deliver end to end'),
    {icon:'⌨️',title:'Kho phím tắt Excel',desc:'Tra cứu shortcut theo tình huống',url:'phimtatexcel.html',type:'Kho tra cứu',keys:'phim tat shortcut keyboard ctrl alt shift'},
    {icon:'🧮',title:'Kho công thức Excel',desc:'Thư viện hàm để tra nhanh',url:'congthucexcel.html',type:'Kho tra cứu',keys:'cong thuc ham formula function library'},
    {icon:'🧰',title:'Kho Tool',desc:'Tool thực dụng và file tải',url:'tools-library.html',type:'Công cụ',keys:'tool utility excel automation'},
    {icon:'📚',title:'Practice Hub',desc:'TikTok, YouTube, Homework và chấm file',url:'practice-video.html',type:'Thực hành',keys:'practice bai tap tiktok youtube homework cham diem'},
    {icon:'🧠',title:'Formula Finder',desc:'Tìm hàm Excel theo nhu cầu',url:'formula-finder.html',type:'Công cụ',keys:'formula finder tim cong thuc'},
    {icon:'👤',title:'Dashboard cá nhân',desc:'Tiến độ và hoạt động học',url:'dashboard.html',type:'Cá nhân',keys:'dashboard ca nhan progress'},
    {icon:'🏆',title:'Thành tích & Nhiệm vụ',desc:'Huy hiệu, nhiệm vụ, streak',url:'achievements.html',type:'Cá nhân',keys:'achievement huy hieu streak'},
    {icon:'📱',title:'Bài tập theo video TikTok',desc:'Video và file thực hành',url:'practice-tiktok.html',type:'Thực hành',keys:'tiktok practice video file'},
    {icon:'📖',title:'Tài liệu tham khảo',desc:'Sách và tài liệu học thêm',url:'tai-lieu-tham-khao.html',type:'Tài liệu',keys:'sach tai lieu tham khao'}
  ];

  const normalize=(s='')=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  const recent=()=>{try{return JSON.parse(localStorage.getItem('avpSearchRecent')||'[]')}catch{return[]}};
  const saveRecent=q=>{q=q.trim();if(!q)return;localStorage.setItem('avpSearchRecent',JSON.stringify([q,...recent().filter(x=>normalize(x)!==normalize(q))].slice(0,5)))};
  function score(item,q){if(!q)return 1;const t=normalize(item.title),k=normalize(item.keys||''),d=normalize(item.desc||''),parts=q.split(' ').filter(Boolean);let s=0;for(const p of parts){if(t===p)s+=30;else if(t.startsWith(p))s+=18;else if(t.includes(p))s+=12;if(k.includes(p))s+=7;if(d.includes(p))s+=3}if(t.includes(q))s+=18;if(k.includes(q))s+=10;return s}

  const nav=document.querySelector('nav.top-simple-nav')||document.querySelector('nav');
  if(nav&&!document.getElementById('avpSearchTrigger')){const trigger=document.createElement('button');trigger.type='button';trigger.id='avpSearchTrigger';trigger.className='avp-search-trigger';trigger.setAttribute('aria-label','Tìm kiếm toàn website');trigger.innerHTML='<span>🔎 Tìm kiếm</span><kbd>Ctrl K</kbd>';const theme=nav.querySelector('#themeToggle');theme?nav.insertBefore(trigger,theme):nav.appendChild(trigger)}

  const wrap=document.createElement('div');wrap.className='avp-spotlight-backdrop';wrap.id='avpSpotlightBackdrop';wrap.innerHTML=`<div class="avp-spotlight" role="dialog" aria-modal="true" aria-label="Tìm kiếm Learn Excel with Anh Van Phong"><div class="avp-spotlight-head"><span class="icon">🔎</span><input id="avpSpotlightInput" class="avp-spotlight-input" type="search" autocomplete="off" placeholder="Tìm XLOOKUP, Pivot, Power Query, VBA, Case Sales..."><span class="avp-esc">ESC</span></div><div class="avp-search-meta"><span id="avpSearchLabel">Gợi ý cho bạn</span><span id="avpSearchCount"></span></div><div class="avp-search-results" id="avpSearchResults"></div><div class="avp-search-footer"><span><kbd>↑</kbd> <kbd>↓</kbd> di chuyển</span><span><kbd>Enter</kbd> mở</span><span><kbd>Esc</kbd> đóng</span></div></div>`;document.body.appendChild(wrap);
  const input=document.getElementById('avpSpotlightInput'),results=document.getElementById('avpSearchResults'),label=document.getElementById('avpSearchLabel'),count=document.getElementById('avpSearchCount');let active=0,current=[];
  function render(raw=''){const q=normalize(raw);current=ITEMS.map(x=>({...x,_score:score(x,q)})).filter(x=>x._score>0).sort((a,b)=>b._score-a._score).slice(0,10);active=0;label.textContent=raw.trim()?`Kết quả cho “${raw.trim()}”`:(recent().length?'Tìm kiếm gần đây & gợi ý':'Gợi ý cho bạn');count.textContent=raw.trim()?`${current.length} kết quả`:'';if(!current.length){results.innerHTML='<div class="avp-search-empty"><b>Không tìm thấy nội dung phù hợp</b>Thử “XLOOKUP”, “Pivot”, “Power Query”, “VBA” hoặc “Case Sales”.</div>';return}results.innerHTML=current.map((x,i)=>`<a class="avp-search-result ${i===0?'active':''}" data-index="${i}" href="${x.url}"><span class="avp-search-result-icon">${x.icon}</span><span><strong>${x.title}</strong><small>${x.desc}</small></span><span class="avp-search-type">${x.type}</span></a>`).join('');results.querySelectorAll('.avp-search-result').forEach(el=>{el.addEventListener('mouseenter',()=>setActive(Number(el.dataset.index)));el.addEventListener('click',()=>saveRecent(input.value))})}
  function setActive(i){const els=[...results.querySelectorAll('.avp-search-result')];if(!els.length)return;active=(i+els.length)%els.length;els.forEach((el,n)=>el.classList.toggle('active',n===active));els[active].scrollIntoView({block:'nearest'})}
  function open(){wrap.classList.add('open');document.body.style.overflow='hidden';render('');setTimeout(()=>input.focus(),30)}
  function close(){wrap.classList.remove('open');document.body.style.overflow='';input.value=''}
  function go(){if(!current[active])return;saveRecent(input.value);location.href=current[active].url}
  window.openGlobalSearch=open;window.closeGlobalSearch=close;
  document.getElementById('avpSearchTrigger')?.addEventListener('click',open);wrap.addEventListener('click',e=>{if(e.target===wrap)close()});input.addEventListener('input',()=>render(input.value));input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();setActive(active+1)}else if(e.key==='ArrowUp'){e.preventDefault();setActive(active-1)}else if(e.key==='Enter'){e.preventDefault();go()}else if(e.key==='Escape')close()});document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();wrap.classList.contains('open')?close():open()}else if(e.key==='Escape'&&wrap.classList.contains('open'))close()});render('');
})();
