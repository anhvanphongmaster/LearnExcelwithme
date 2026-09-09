(() => {
  'use strict';

  const K=(id,title,desc,keys,icon='📗')=>({icon,title,desc,url:`knowledge.html?lesson=${id}`,type:'Kiến thức Excel',keys});
  const ITEMS=[
    {icon:'🏠',title:'Trang chủ',desc:'Tổng quan Learn Excel with Anh Van Phong và nội dung nổi bật',url:'index.html',type:'Trang',keys:'trang chu home anh van phong'},
    {icon:'🧭',title:'Kiến thức Excel · Lộ trình 24 bài',desc:'4 chặng từ nền tảng tới Power Query, VBA và workflow; không khóa đường học',url:'skill-map.html',type:'Lộ trình',keys:'hoc excel kien thuc lo trinh skill map foundation data analysis advanced beginner'},

    K('f01-excel-workspace','01 · Làm quen Excel và cách một file hoạt động','Workbook, Worksheet, Cell, Range, Ribbon, Name Box và thao tác an toàn','workbook worksheet cell range ribbon name box sheet save as phim tat co ban','📘'),
    K('f02-data-entry-types','02 · Nhập liệu và kiểu dữ liệu','Text, Number, Date, Percentage, mã có số 0 đầu, AutoFill và lỗi số dạng Text','nhap lieu data type text number date percentage autofill flash fill number stored as text','⌨️'),
    K('f03-formatting-display','03 · Định dạng và hiển thị','Number Format, tiền, %, ngày, alignment, Wrap Text, Merge và trình bày bảng','format number custom format currency percent date wrap text merge alignment border','🎨'),
    K('f04-formulas-references','04 · Công thức và tham chiếu ô','Dấu =, toán tử, A1, $A$1, A$1, $A1 và F4','cong thuc formula reference absolute relative mixed f4 dollar tham chieu','🧮'),
    K('f05-core-functions','05 · Các hàm nền tảng','SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, COUNTBLANK và ROUND','sum average min max count counta countblank round roundup rounddown ham co ban','➕'),
    K('f06-data-table-structure','06 · Quản lý bảng dữ liệu','Cấu trúc nguồn, Sort, Filter, Find/Replace, Freeze Panes và pre-flight check','filter sort loc sap xep find replace freeze panes source data table structure','🔎'),

    K('s07-logic','07 · Logic IF, AND, OR và xử lý lỗi','TRUE/FALSE, IF, AND, OR, IF lồng và IFERROR có chủ đích','if and or not iferror true false logic dieu kien','🔀'),
    K('s08-conditional-aggregation','08 · SUMIFS, COUNTIFS và tổng hợp điều kiện','SUMIF/SUMIFS, COUNTIF/COUNTIFS, criteria, wildcard và date range','sumif sumifs countif countifs averageif criteria wildcard date dieu kien','Σ'),
    K('s09-lookup','09 · XLOOKUP, VLOOKUP và INDEX/MATCH','Tra cứu theo key, exact match, #N/A, duplicate key và lookup master','xlookup vlookup index match lookup tra cuu master key #n/a','🔍'),
    K('s10-text','10 · Xử lý văn bản và mã','LEFT, RIGHT, MID, LEN, TRIM, CLEAN, FIND, SEARCH, SUBSTITUTE và TEXTJOIN','left right mid len trim clean find search substitute replace textjoin concat chuoi text','🔤'),
    K('s11-date-time','11 · Ngày tháng và thời gian','Date serial, TODAY, NOW, DATE, YEAR, MONTH, EOMONTH và khoảng kỳ','date time today now year month day eomonth datedif ngay thang serial','📅'),
    K('s12-clean-control','12 · Làm sạch và kiểm soát dữ liệu','Remove Duplicates, Text to Columns, Go To Special, error/type control và reconciliation','clean data remove duplicates text to columns go to special error control lam sach','🧹'),

    K('a13-excel-table','13 · Excel Table','Ctrl+T, structured references, calculated column, Total Row và source tự mở rộng','excel table ctrl t structured reference total row calculated column','▦'),
    K('a14-pivottable','14 · PivotTable','Rows, Columns, Values, Filters, Group Date, Slicer, Refresh và Value Field Settings','pivot pivottable rows columns values filters slicer refresh group date','📊'),
    K('a15-kpi-analysis','15 · Phân tích KPI','Metric, dimension, grain, rate, target, AOV, UPT, ASP, contribution và variance','kpi metric dimension grain rate target actual aov upt asp variance contribution sales qc traffic','🎯'),
    K('a16-charts-pareto','16 · Biểu đồ và Pareto','Chọn chart đúng câu hỏi, Actual vs Target, Pareto 80/20, cumulative % và chart hygiene','chart bieu do pareto 80 20 cumulative combo line column bar actual target','📈'),
    K('a17-dashboard','17 · Dashboard Excel','KPI cards, hierarchy, Slicer/Timeline, semantic color, filter context và Data Model mở rộng','dashboard slicer timeline kpi card layout data model dax power pivot','🖥️'),
    K('a18-report-audit-handover','18 · Kiểm tra và bàn giao báo cáo','Reconciliation, formula audit, print setup, protect, versioning và checklist giao file','report bao cao audit handover print area protect sheet version reconciliation qc','✅'),

    K('x19-advanced-formulas','19 · Công thức nâng cao','SUMPRODUCT, INDEX reference, AGGREGATE, LET, Evaluate Formula, Goal Seek và Solver','advanced formula sumproduct aggregate let evaluate formula f9 name manager goal seek solver','🧠'),
    K('x20-dynamic-array','20 · Dynamic Array / Microsoft 365','FILTER, UNIQUE, SORT, SORTBY, SEQUENCE, spill range và #SPILL!','dynamic array filter unique sort sortby sequence spill microsoft 365 excel 2021','⚡'),
    K('x21-power-query-basics','21 · Power Query nền tảng','Get Data, Applied Steps, data type, Trim/Clean, Close & Load và Refresh','power query pq get data applied steps trim clean transform load refresh m','🔄'),
    K('x22-power-query-multi-source','22 · Power Query nhiều nguồn','Append, Merge, join types, Folder Combine, staging, schema drift và reconciliation','power query append merge folder combine join left anti staging schema drift gop file','🗂️'),
    K('x23-macro-vba','23 · Macro và VBA','Record Macro, .xlsm, Workbook/Worksheet/Range, If/Loop, error handling và macro security','vba macro record macro xlsm workbook worksheet range loop if automation security','⚙️'),
    K('x24-automation-workflow','24 · Workflow Excel tự động hóa','Formula/Pivot/PQ/VBA/Data Model đúng vai trò, controls, refresh order, config và exception','automation workflow excel power query vba dax data model refresh control config exception','🚀'),

    {icon:'⌨️',title:'Kho phím tắt Excel',desc:'Kho tra cứu phím tắt theo tình huống; các phím cốt lõi đã được đưa vào đúng bài học',url:'phimtatexcel.html',type:'Kho tra cứu',keys:'phim tat shortcut keyboard ctrl alt shift'},
    {icon:'🧮',title:'Kho công thức Excel',desc:'Thư viện hàm để tra nhanh theo nhu cầu',url:'congthucexcel.html',type:'Kho tra cứu',keys:'cong thuc ham formula function library'},
    {icon:'🧰',title:'Kho Tool',desc:'Tool thực dụng, file ZIP và ý tưởng cộng đồng',url:'tools-library.html',type:'Công cụ',keys:'kho tool utility zip excel automation'},
    {icon:'📚',title:'Practice Hub',desc:'TikTok, YouTube project, chấm file tự động và hướng dẫn thực hành',url:'practice-video.html',type:'Thực hành',keys:'bai tap practice tiktok youtube cham diem huong dan thuc hanh'},
    {icon:'🧠',title:'Tìm công thức',desc:'Chọn nhu cầu để tìm hàm Excel phù hợp',url:'formula-finder.html',type:'Công cụ',keys:'tim cong thuc formula finder chon ham'},
    {icon:'👤',title:'Dashboard cá nhân',desc:'Hoạt động và kết quả học tập cá nhân',url:'dashboard.html',type:'Cá nhân',keys:'dashboard ca nhan level xp streak tien do'},
    {icon:'🪪',title:'Hồ sơ người học',desc:'Tên, avatar, mục tiêu học và hoạt động cá nhân',url:'profile.html',type:'Cá nhân',keys:'ho so profile avatar muc tieu ca nhan nguoi hoc'},
    {icon:'📱',title:'Bài tập theo video TikTok',desc:'Chủ đề, video hướng dẫn và file thực hành đã phát hành',url:'practice-tiktok.html',type:'Thực hành',keys:'bai tap tiktok video file chu de huong dan'},
    {icon:'📖',title:'Tài liệu tham khảo',desc:'Sách Excel, Word, PowerPoint và tài liệu học thêm',url:'tai-lieu-tham-khao.html',type:'Tài liệu',keys:'sach combo tai lieu tham khao excel word powerpoint'},
    {icon:'ℹ️',title:'Giới thiệu',desc:'Thông tin về Learn Excel with Anh Van Phong',url:'gioithieu.html',type:'Trang',keys:'gioi thieu about'},
    {icon:'📩',title:'Liên hệ',desc:'Gửi câu hỏi hoặc góp ý cho website',url:'lienhe.html',type:'Trang',keys:'lien he contact gop y'}
  ];

  const normalize=(s='')=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  const getRecent=()=>{try{return JSON.parse(localStorage.getItem('avpSearchRecent')||'[]')}catch{return[]}};
  const saveRecent=q=>{q=q.trim();if(!q)return;const next=[q,...getRecent().filter(x=>normalize(x)!==normalize(q))].slice(0,5);localStorage.setItem('avpSearchRecent',JSON.stringify(next))};

  function score(item,q){
    if(!q)return 1;
    const title=normalize(item.title),keys=normalize(item.keys),desc=normalize(item.desc);
    const tokens=q.split(' ').filter(Boolean);let s=0;
    for(const t of tokens){
      if(title===t)s+=30;else if(title.startsWith(t))s+=18;else if(title.includes(t))s+=12;
      if(keys.includes(t))s+=7;if(desc.includes(t))s+=3;
    }
    if(title.includes(q))s+=18;if(keys.includes(q))s+=10;return s;
  }

  const nav=document.querySelector('nav.top-simple-nav')||document.querySelector('nav');
  if(nav&&!document.getElementById('avpSearchTrigger')){
    const trigger=document.createElement('button');trigger.type='button';trigger.id='avpSearchTrigger';trigger.className='avp-search-trigger';trigger.setAttribute('aria-label','Tìm kiếm toàn website');trigger.innerHTML='<span>🔎 Tìm kiếm</span><kbd>Ctrl K</kbd>';
    const theme=nav.querySelector('#themeToggle');if(theme)nav.insertBefore(trigger,theme);else nav.appendChild(trigger);
  }

  const wrap=document.createElement('div');wrap.className='avp-spotlight-backdrop';wrap.id='avpSpotlightBackdrop';wrap.innerHTML=`
    <div class="avp-spotlight" role="dialog" aria-modal="true" aria-label="Tìm kiếm Learn Excel with Anh Van Phong">
      <div class="avp-spotlight-head"><span class="icon">🔎</span><input id="avpSpotlightInput" class="avp-spotlight-input" type="search" autocomplete="off" placeholder="Tìm XLOOKUP, Pivot, Pareto, Power Query..."><span class="avp-esc">ESC</span></div>
      <div class="avp-search-meta"><span id="avpSearchLabel">Gợi ý cho bạn</span><span id="avpSearchCount"></span></div>
      <div class="avp-search-results" id="avpSearchResults"></div>
      <div class="avp-search-footer"><span><kbd>↑</kbd> <kbd>↓</kbd> di chuyển</span><span><kbd>Enter</kbd> mở</span><span><kbd>Esc</kbd> đóng</span></div>
    </div>`;
  document.body.appendChild(wrap);

  const input=document.getElementById('avpSpotlightInput'),results=document.getElementById('avpSearchResults'),label=document.getElementById('avpSearchLabel'),count=document.getElementById('avpSearchCount');let active=0,current=[];
  function render(raw=''){
    const q=normalize(raw);current=ITEMS.map(x=>({...x,_score:score(x,q)})).filter(x=>x._score>0).sort((a,b)=>b._score-a._score).slice(0,10);active=0;
    label.textContent=raw.trim()?`Kết quả cho “${raw.trim()}”`:(getRecent().length?'Tìm kiếm gần đây & gợi ý':'Gợi ý cho bạn');count.textContent=raw.trim()?`${current.length} kết quả`:'';
    if(!current.length){results.innerHTML='<div class="avp-search-empty"><b>Không tìm thấy nội dung phù hợp</b>Thử “XLOOKUP”, “Pivot”, “Pareto”, “Power Query” hoặc “VBA”.</div>';return}
    results.innerHTML=current.map((x,i)=>`<a class="avp-search-result ${i===0?'active':''}" data-index="${i}" href="${x.url}"><span class="avp-search-result-icon">${x.icon}</span><span><strong>${x.title}</strong><small>${x.desc}</small></span><span class="avp-search-type">${x.type}</span></a>`).join('');
    results.querySelectorAll('.avp-search-result').forEach(el=>{el.addEventListener('mouseenter',()=>setActive(Number(el.dataset.index)));el.addEventListener('click',()=>saveRecent(input.value))});
  }
  function setActive(i){const els=[...results.querySelectorAll('.avp-search-result')];if(!els.length)return;active=(i+els.length)%els.length;els.forEach((el,idx)=>el.classList.toggle('active',idx===active));els[active].scrollIntoView({block:'nearest'})}
  function open(){wrap.classList.add('open');document.body.style.overflow='hidden';render('');setTimeout(()=>input.focus(),30)}
  function close(){wrap.classList.remove('open');document.body.style.overflow='';input.value=''}
  function go(){if(!current[active])return;saveRecent(input.value);window.location.href=current[active].url}
  window.openGlobalSearch=open;window.closeGlobalSearch=close;
  document.getElementById('avpSearchTrigger')?.addEventListener('click',open);wrap.addEventListener('click',e=>{if(e.target===wrap)close()});input.addEventListener('input',()=>render(input.value));input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();setActive(active+1)}else if(e.key==='ArrowUp'){e.preventDefault();setActive(active-1)}else if(e.key==='Enter'){e.preventDefault();go()}else if(e.key==='Escape')close()});document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();wrap.classList.contains('open')?close():open()}else if(e.key==='Escape'&&wrap.classList.contains('open'))close()});render('');
})();
