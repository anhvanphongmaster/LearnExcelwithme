(() => {
  const ITEMS = [
    {icon:'🏠', title:'Trang chủ', desc:'Tổng quan Learn Excel with Anh Van Phong và nội dung nổi bật', url:'index.html', type:'Trang', keys:'trang chu home anh van phong'},
    {icon:'📊', title:'Học Excel', desc:'Lộ trình và các chuyên đề Excel', url:'excel.html', type:'Trang', keys:'hoc excel lo trinh co ban nang cao'},
    {icon:'⌨️', title:'Phím tắt Excel', desc:'100 phím tắt giúp thao tác nhanh hơn', url:'phimtatexcel.html', type:'Bài học', keys:'phim tat shortcut keyboard ctrl alt shift'},
    {icon:'🧮', title:'Công thức Excel', desc:'IF, SUMIF, SUMIFS, COUNTIF, COUNTIFS và nhiều hàm khác', url:'congthucexcel.html', type:'Bài học', keys:'cong thuc ham formula if sum sumif sumifs countif countifs'},
    {icon:'🔎', title:'VLOOKUP & XLOOKUP', desc:'Tra cứu dữ liệu bằng VLOOKUP và XLOOKUP', url:'congthucexcel.html', type:'Công thức', keys:'vlookup xlookup tra cuu lookup tim kiem'},
    {icon:'🧵', title:'TEXTJOIN', desc:'Ghép nhiều chuỗi văn bản trong Excel', url:'congthucexcel.html', type:'Công thức', keys:'textjoin ghep chuoi noi text'},
    {icon:'⚡', title:'FILTER', desc:'Lọc dữ liệu động bằng hàm FILTER', url:'congthucexcel.html', type:'Công thức', keys:'filter ham loc dynamic array'},
    {icon:'🎓', title:'Master Learning Path', desc:'Lộ trình Beginner đến Master có prerequisite, mở khóa và chứng nhận', url:'master-learning.html', type:'Lộ trình', keys:'master learning path beginner analyst advanced master prerequisite certificate chung nhan'},
    {icon:'🚀', title:'Excel nâng cao thực chiến', desc:'Power Query, Dynamic Array, XLOOKUP, LET, PivotTable và Data Quality', url:'excel-nang-cao.html', type:'Nâng cao', keys:'excel nang cao power query powerquery dynamic array filter unique sort xlookup let data quality master data'},
    {icon:'📐', title:'Power Pivot & DAX', desc:'Data Model, Relationship, Measure và KPI bằng DAX', url:'power-pivot-dax.html', type:'Nâng cao', keys:'power pivot dax data model relationship measure calculate divide kpi'},
    {icon:'📊', title:'Dashboard động chuyên nghiệp', desc:'KPI, PivotChart, Slicer, Timeline và dashboard thực chiến', url:'dashboard-dong.html', type:'Nâng cao', keys:'dashboard dong pivotchart slicer timeline kpi report'},
    {icon:'🤖', title:'VBA / Macro tự động hóa', desc:'Macro, VBA, Workbook, Worksheet, Range và tự động hóa báo cáo', url:'vba-macro.html', type:'Nâng cao', keys:'vba macro automation workbook worksheet range refresh all'},
    {icon:'🧪', title:'What-If Analysis & Solver', desc:'Goal Seek, Data Table, Scenario Manager và Solver', url:'solver-whatif.html', type:'Nâng cao', keys:'what if solver goal seek data table scenario manager toi uu'},
    {icon:'📊', title:'Pivot Table', desc:'Tổng hợp và phân tích dữ liệu bằng Pivot Table', url:'pivottable.html', type:'Bài học', keys:'pivot pivottable tong hop du lieu slicer'},
    {icon:'📈', title:'Biểu đồ & Pareto', desc:'Trực quan hóa dữ liệu và phân tích 80/20', url:'bieudopareto.html', type:'Bài học', keys:'bieu do chart pareto 80 20 tich luy cumulative'},
    {icon:'🔽', title:'Filter & Sort', desc:'Lọc và sắp xếp dữ liệu nhanh trong Excel', url:'filtersort.html', type:'Bài học', keys:'filter sort loc sap xep advanced filter'},
    {icon:'📋', title:'Báo cáo Excel', desc:'KPI, NG Rate, Top Defect và báo cáo QC', url:'baocaoexcel.html', type:'Bài học', keys:'bao cao report qc quality kpi ng rate top defect lot input'},
    {icon:'🧪', title:'Excel Playground', desc:'10 bài thực hành công thức có chấm điểm và XP', url:'playground.html', type:'Thực hành', keys:'playground thuc hanh bai tap formula xp'},
    {icon:'✍️', title:'Bài tập Excel', desc:'Câu hỏi luyện tập và quiz Excel', url:'baitapexcel.html', type:'Luyện tập', keys:'bai tap quiz cau hoi trac nghiem'},
    {icon:'🧠', title:'Tìm công thức', desc:'Chọn nhu cầu để tìm hàm Excel phù hợp', url:'formula-finder.html', type:'Công cụ', keys:'tim cong thuc formula finder chon ham'},
    {icon:'👤', title:'Dashboard cá nhân', desc:'XP, Level, streak, quiz và tiến độ học', url:'dashboard.html', type:'Cá nhân', keys:'dashboard ca nhan level xp streak tien do huy hieu'},
    {icon:'🪪', title:'Hồ sơ người học', desc:'Tên, avatar, mục tiêu học và hoạt động cá nhân', url:'profile.html', type:'Cá nhân', keys:'ho so profile avatar muc tieu ca nhan nguoi hoc'},
    {icon:'🏆', title:'Thành tích & Nhiệm vụ', desc:'Huy hiệu, nhiệm vụ hằng ngày, XP và streak', url:'achievements.html', type:'Cá nhân', keys:'thanh tich achievement huy hieu nhiem vu hang ngay daily quest xp streak'},
    {icon:'📥', title:'Tài liệu thực hành', desc:'Các file Excel mẫu để tải xuống và luyện tập', url:'index.html#tai-lieu', type:'Tài liệu', keys:'tai lieu download file mau excel pivot pareto qc'},
    {icon:'ℹ️', title:'Giới thiệu', desc:'Thông tin về Learn Excel with Anh Van Phong', url:'gioithieu.html', type:'Trang', keys:'gioi thieu about'},
    {icon:'📩', title:'Liên hệ', desc:'Gửi câu hỏi hoặc góp ý cho website', url:'lienhe.html', type:'Trang', keys:'lien he contact gop y'}
  ];

  const normalize = (s='') => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  const getRecent = () => { try { return JSON.parse(localStorage.getItem('avpSearchRecent') || '[]'); } catch { return []; } };
  const saveRecent = (q) => {
    q = q.trim(); if (!q) return;
    const next = [q, ...getRecent().filter(x => normalize(x) !== normalize(q))].slice(0,5);
    localStorage.setItem('avpSearchRecent', JSON.stringify(next));
  };

  function score(item, q) {
    if (!q) return 1;
    const title = normalize(item.title), keys = normalize(item.keys), desc = normalize(item.desc);
    const tokens = q.split(' ').filter(Boolean);
    let s = 0;
    for (const t of tokens) {
      if (title === t) s += 30;
      else if (title.startsWith(t)) s += 18;
      else if (title.includes(t)) s += 12;
      if (keys.includes(t)) s += 7;
      if (desc.includes(t)) s += 3;
    }
    if (normalize(item.title).includes(q)) s += 18;
    if (normalize(item.keys).includes(q)) s += 10;
    return s;
  }

  const nav = document.querySelector('nav');
  if (nav && !document.getElementById('avpSearchTrigger')) {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.id = 'avpSearchTrigger';
    trigger.className = 'avp-search-trigger';
    trigger.setAttribute('aria-label','Tìm kiếm toàn website');
    trigger.innerHTML = '<span>🔎 Tìm kiếm</span><kbd>Ctrl K</kbd>';
    const theme = nav.querySelector('#themeToggle');
    if (theme) nav.insertBefore(trigger, theme); else nav.appendChild(trigger);
  }

  const wrap = document.createElement('div');
  wrap.className = 'avp-spotlight-backdrop';
  wrap.id = 'avpSpotlightBackdrop';
  wrap.innerHTML = `
    <div class="avp-spotlight" role="dialog" aria-modal="true" aria-label="Tìm kiếm Learn Excel with Anh Van Phong">
      <div class="avp-spotlight-head">
        <span class="icon">🔎</span>
        <input id="avpSpotlightInput" class="avp-spotlight-input" type="search" autocomplete="off" placeholder="Tìm VLOOKUP, Pivot, Pareto, NG Rate...">
        <span class="avp-esc">ESC</span>
      </div>
      <div class="avp-search-meta"><span id="avpSearchLabel">Gợi ý cho bạn</span><span id="avpSearchCount"></span></div>
      <div class="avp-search-results" id="avpSearchResults"></div>
      <div class="avp-search-footer"><span><kbd>↑</kbd> <kbd>↓</kbd> di chuyển</span><span><kbd>Enter</kbd> mở</span><span><kbd>Esc</kbd> đóng</span></div>
    </div>`;
  document.body.appendChild(wrap);

  const input = document.getElementById('avpSpotlightInput');
  const results = document.getElementById('avpSearchResults');
  const label = document.getElementById('avpSearchLabel');
  const count = document.getElementById('avpSearchCount');
  let active = 0, current = [];

  function render(raw='') {
    const q = normalize(raw);
    current = ITEMS.map(x => ({...x, _score: score(x,q)})).filter(x => x._score > 0).sort((a,b) => b._score-a._score).slice(0,9);
    active = 0;
    label.textContent = raw.trim() ? `Kết quả cho “${raw.trim()}”` : (getRecent().length ? 'Tìm kiếm gần đây & gợi ý' : 'Gợi ý cho bạn');
    count.textContent = raw.trim() ? `${current.length} kết quả` : '';
    if (!current.length) {
      results.innerHTML = `<div class="avp-search-empty"><b>Không tìm thấy nội dung phù hợp</b>Thử từ khóa khác như “VLOOKUP”, “Pivot”, “Pareto” hoặc “NG Rate”.</div>`;
      return;
    }
    results.innerHTML = current.map((x,i) => `
      <a class="avp-search-result ${i===0?'active':''}" data-index="${i}" href="${x.url}">
        <span class="avp-search-result-icon">${x.icon}</span>
        <span><strong>${x.title}</strong><small>${x.desc}</small></span>
        <span class="avp-search-type">${x.type}</span>
      </a>`).join('');
    results.querySelectorAll('.avp-search-result').forEach(el => {
      el.addEventListener('mouseenter', () => setActive(Number(el.dataset.index)));
      el.addEventListener('click', () => saveRecent(input.value));
    });
  }

  function setActive(i) {
    const els = [...results.querySelectorAll('.avp-search-result')];
    if (!els.length) return;
    active = (i + els.length) % els.length;
    els.forEach((el,idx) => el.classList.toggle('active', idx===active));
    els[active].scrollIntoView({block:'nearest'});
  }
  function open() { wrap.classList.add('open'); document.body.style.overflow='hidden'; render(''); setTimeout(()=>input.focus(),30); }
  function close() { wrap.classList.remove('open'); document.body.style.overflow=''; input.value=''; }
  window.openGlobalSearch = open;
  window.closeGlobalSearch = close;
  function go() { if (!current[active]) return; saveRecent(input.value); window.location.href = current[active].url; }

  document.getElementById('avpSearchTrigger')?.addEventListener('click', open);
  wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active+1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active-1); }
    else if (e.key === 'Enter') { e.preventDefault(); go(); }
    else if (e.key === 'Escape') close();
  });
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); wrap.classList.contains('open') ? close() : open(); }
    else if (e.key === 'Escape' && wrap.classList.contains('open')) close();
  });
  render('');
})();

// Learning Path is linked from site navigation; Spotlight index may be static in this version.

// Formula library now contains 100 functions including FILTER, UNIQUE, TEXTSPLIT, XLOOKUP, SUMIFS and date functions.
