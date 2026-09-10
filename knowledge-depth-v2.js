(() => {
  'use strict';
  if (window.__AVP_KNOWLEDGE_DEPTH_V2__) return;
  window.__AVP_KNOWLEDGE_DEPTH_V2__ = true;

  const PROFILES = {
    'f01-excel-workspace': {
      path:'Excel → Workbook → Worksheet → Cell / Range → Name Box / Formula Bar',
      tab:'HOME',command:'Name Box · Formula Bar · Sheet Tabs',
      basic:'Nhận diện Workbook, Sheet, hàng, cột, ô và vùng; chọn một ô rồi đọc đúng địa chỉ trong Name Box.',
      mid:'Tổ chức file theo Data / Danh mục / Report, di chuyển nhanh bằng Name Box và phím Ctrl + Arrow, lưu đúng .xlsx/.xlsm/.csv.',
      advanced:'Audit cấu trúc workbook trước khi sửa: used range, sheet ẩn, tên sheet, liên kết ngoài và rủi ro ghi đè file gốc.',
      headers:['Mã NV','Họ tên','Phòng ban','Doanh số'],rows:[['NV001','An','Sales','12500000'],['NV002','Bình','QC','9800000'],['NV003','Chi','HR','11200000']],focus:'B2:D4'
    },
    'f02-data-entry-types': {
      path:'Home → Number / Data → Data Tools → nhập Text, Number, Date, Percentage đúng kiểu',
      tab:'HOME',command:'Number Format · AutoFill · Flash Fill',
      basic:'Phân biệt Text, Number, Date, Percentage và mã định danh; kiểm tra giá trị đang bị lưu dạng text hay số.',
      mid:'Dùng AutoFill, Flash Fill và định dạng nhập liệu để tăng tốc nhưng vẫn giữ đúng kiểu dữ liệu.',
      advanced:'Thiết kế rule đầu vào để chống mất số 0 đầu, ngày hiểu sai locale, số lưu dạng text và dữ liệu pha trộn type.',
      headers:['Mã SP','Ngày','Số lượng','Tỷ lệ'],rows:[['00125','01/09/2026','15','85%'],['00126','02/09/2026','12','91%'],['00127','03/09/2026','18','88%']],focus:'A2:D4'
    },
    'f03-formatting-display': {
      path:'Home → Font / Alignment / Number → Format Cells',
      tab:'HOME',command:'Number · Alignment · Wrap Text · Format Cells',
      basic:'Định dạng số, tiền, phần trăm, ngày và căn lề để dữ liệu đọc đúng nghĩa.',
      mid:'Dùng Custom Number Format, Wrap Text, border và hierarchy để bảng rõ mà không phá dữ liệu gốc.',
      advanced:'Tách hoàn toàn “giá trị thật” và “cách hiển thị”; kiểm soát format khi copy, export, in và bàn giao.',
      headers:['Ngày','Doanh thu','Tăng trưởng','Trạng thái'],rows:[['01/09/2026','12500000','8.5%','Đạt'],['02/09/2026','9800000','-2.1%','Gần đạt'],['03/09/2026','15400000','12.3%','Đạt']],focus:'B2:C4'
    },
    'f04-formulas-references': {
      path:'Formula Bar → nhập =… → F4 để đổi Relative / Absolute / Mixed Reference',
      tab:'FORMULAS',command:'Formula Bar · F4 · Trace Precedents',
      basic:'Viết công thức bằng =, hiểu toán tử và tham chiếu tương đối A1.',
      mid:'Dùng $A$1, A$1, $A1 đúng tình huống; sao chép công thức mà không lệch vùng chuẩn.',
      advanced:'Audit reference khi mô hình nhiều sheet: named range, dependency, circular reference và kiểm soát hardcode.',
      headers:['SL','Đơn giá','Thuế','Thành tiền'],rows:[['10','250000','8%','=A2*B2*(1+$C$2)'],['8','310000','8%','=A3*B3*(1+$C$2)'],['12','190000','8%','=A4*B4*(1+$C$2)']],focus:'D2:D4'
    },
    'f05-core-functions': {
      path:'Formulas → Function Library / AutoSum → SUM, AVERAGE, MIN, MAX, COUNT, ROUND',
      tab:'FORMULAS',command:'AutoSum · Math & Trig · Statistical',
      basic:'Dùng SUM, AVERAGE, MIN, MAX, COUNT/COUNTA và ROUND trên vùng dữ liệu đơn giản.',
      mid:'Chọn đúng hàm theo kiểu dữ liệu, hiểu blank/text/zero ảnh hưởng kết quả thế nào.',
      advanced:'Xây block kiểm soát tổng, min/max và count để đối chiếu dữ liệu trước khi phân tích sâu hơn.',
      headers:['Store','Revenue','Orders','AOV'],rows:[['HN01','12500000','125','=B2/C2'],['HN02','9800000','91','=B3/C3'],['HN03','15400000','143','=B4/C4']],focus:'B2:D4'
    },
    'f06-data-table-structure': {
      path:'Data → Sort & Filter / Home → Find & Select / View → Freeze Panes',
      tab:'DATA',command:'Sort · Filter · Find/Replace · Freeze Panes',
      basic:'Tạo bảng nguồn có một hàng header, không dòng/cột trống giữa bảng và lọc/sort đúng vùng.',
      mid:'Dùng multi-level sort, filter theo số/ngày/text, Find/Replace có kiểm soát và Freeze Panes cho bảng dài.',
      advanced:'Thực hiện pre-flight trước khi xử lý: grain, key, blank, duplicate, merged cell, hidden rows và total row lẫn dữ liệu.',
      headers:['Order_ID','Store','Date','Revenue'],rows:[['SO001','HN01','01/09','350000'],['SO002','HN02','01/09','420000'],['SO003','HN01','02/09','280000']],focus:'A1:D4'
    },
    's07-logic': {
      path:'Formulas → Logical → IF / AND / OR / IFERROR',
      tab:'FORMULAS',command:'Logical · IF · AND · OR · IFERROR',
      basic:'Viết IF một điều kiện và đọc được TRUE/FALSE.',
      mid:'Kết hợp AND/OR, nhiều nhánh điều kiện và chỉ dùng IFERROR khi biết lỗi nào đang được xử lý.',
      advanced:'Thiết kế business rule theo thứ tự ưu tiên, tách rule phức tạp và tránh IF lồng sâu khó audit.',
      headers:['Doanh số','Target','Tỷ lệ','Xếp loại'],rows:[['12000000','10000000','=A2/B2','=IF(C2>=1,"Đạt","Chưa đạt")'],['8500000','10000000','=A3/B3','=IF(C3>=1,"Đạt","Chưa đạt")'],['10500000','10000000','=A4/B4','=IF(C4>=1,"Đạt","Chưa đạt")']],focus:'D2:D4'
    },
    's08-conditional-aggregation': {
      path:'Formulas → Math & Trig / Statistical → SUMIFS, COUNTIFS, AVERAGEIFS',
      tab:'FORMULAS',command:'SUMIFS · COUNTIFS · Criteria',
      basic:'Tổng và đếm theo một điều kiện bằng SUMIF/COUNTIF.',
      mid:'Dùng nhiều criteria, wildcard, khoảng ngày và khóa đúng vùng criteria_range / sum_range.',
      advanced:'Thiết kế tổng hợp theo grain, tránh double-count và dùng control total để xác minh kết quả theo nhiều chiều.',
      headers:['Store','Ngày','Revenue','Đơn'],rows:[['HN01','01/09','350000','3'],['HN01','02/09','420000','4'],['HN02','01/09','280000','2']],focus:'A2:D4'
    },
    's09-lookup': {
      path:'Formulas → Lookup & Reference → XLOOKUP / VLOOKUP / INDEX + MATCH',
      tab:'FORMULAS',command:'XLOOKUP · VLOOKUP · INDEX/MATCH',
      basic:'Tra cứu exact match theo một key sạch và hiểu #N/A.',
      mid:'Xử lý key text/number khác type, fallback khi không tìm thấy và kiểm tra duplicate key ở bảng Master.',
      advanced:'Thiết kế lookup bền vững: composite key, two-way lookup, mapping table, audit unmatched và tránh phụ thuộc vị trí cột.',
      headers:['Mã NV','Tên','Store','Target'],rows:[['NV001','An','HN01','12000000'],['NV002','Bình','HN02','10000000'],['NV003','Chi','HN01','11500000']],focus:'A2:D4'
    },
    's10-text': {
      path:'Formulas → Text → LEFT, RIGHT, MID, TRIM, CLEAN, SEARCH, SUBSTITUTE, TEXTJOIN',
      tab:'FORMULAS',command:'Text · TRIM · CLEAN · SUBSTITUTE · TEXTJOIN',
      basic:'Cắt, đếm và ghép chuỗi bằng LEFT/RIGHT/MID/LEN/TEXTJOIN.',
      mid:'Làm sạch space/ký tự ẩn, tìm delimiter và thay thế theo pattern.',
      advanced:'Chuẩn hóa key văn bản trước lookup/merge, xử lý Unicode/non-breaking space và xây quy tắc parsing ổn định.',
      headers:['Raw_Code','Clean_Code','Region','Key'],rows:[[' HN-001 ','HN-001','HN','HN001'],['HCM–002','HCM-002','HCM','HCM002'],[' DN-003','DN-003','DN','DN003']],focus:'A2:D4'
    },
    's11-date-time': {
      path:'Formulas → Date & Time → TODAY, DATE, YEAR, MONTH, EOMONTH',
      tab:'FORMULAS',command:'Date & Time · TODAY · EOMONTH',
      basic:'Hiểu Excel lưu ngày bằng serial và lấy YEAR/MONTH/DAY.',
      mid:'Tính đầu/cuối tháng, kỳ báo cáo, số ngày và khoảng thời gian ổn định.',
      advanced:'Xử lý locale, datetime có giờ, rolling period, fiscal period và tránh so sánh ngày dạng text.',
      headers:['Ngày','Tháng','Cuối tháng','Tuổi dữ liệu'],rows:[['01/09/2026','=MONTH(A2)','=EOMONTH(A2,0)','=TODAY()-A2'],['15/09/2026','=MONTH(A3)','=EOMONTH(A3,0)','=TODAY()-A3'],['30/09/2026','=MONTH(A4)','=EOMONTH(A4,0)','=TODAY()-A4']],focus:'A2:D4'
    },
    's12-clean-control': {
      path:'Data → Data Tools → Remove Duplicates / Text to Columns / Home → Go To Special',
      tab:'DATA',command:'Remove Duplicates · Text to Columns · Go To Special',
      basic:'Phát hiện blank, duplicate, lỗi công thức và cột sai type.',
      mid:'Làm sạch có kiểm soát bằng Text to Columns, Remove Duplicates và Go To Special mà không mất dữ liệu hợp lệ.',
      advanced:'Thiết kế reconciliation trước/sau làm sạch: row count, key count, amount total và exception list.',
      headers:['Order_ID','Raw Store','Revenue','Check'],rows:[['SO001',' HN01 ','350000','OK'],['SO001','HN01','350000','DUP'],['SO003','HN02','N/A','TYPE']],focus:'A2:D4'
    },
    'a13-excel-table': {
      path:'Insert → Table hoặc Ctrl+T → Table Design',
      tab:'INSERT',command:'Table · Structured Reference · Total Row',
      basic:'Chuyển vùng dữ liệu chuẩn thành Excel Table và đặt Table Name.',
      mid:'Dùng calculated column, structured reference, Total Row và filter của Table.',
      advanced:'Dùng Table như nguồn tự mở rộng cho Pivot, validation, chart và Power Query; kiểm soát schema khi thêm cột.',
      headers:['Date','Store','Revenue','Orders'],rows:[['01/09','HN01','350000','3'],['01/09','HN02','420000','4'],['02/09','HN01','280000','2']],focus:'A1:D4'
    },
    'a14-pivottable': {
      path:'Insert → PivotTable → PivotTable Fields / Analyze → Refresh, Slicer',
      tab:'INSERT',command:'PivotTable · Rows · Values · Slicer',
      basic:'Đưa đúng field vào Rows, Columns, Values và Filters.',
      mid:'Group Date, Value Field Settings, % of total, sorting, Slicer và Refresh.',
      advanced:'Thiết kế Pivot theo grain/KPI, tránh double-count, dùng Distinct Count/Data Model khi cần và reconciliation về nguồn.',
      headers:['Store','Revenue','Orders','CR'],rows:[['HN01','12500000','125','12.5%'],['HN02','9800000','91','10.4%'],['HN03','15400000','143','13.1%']],focus:'A1:D4'
    },
    'a15-kpi-analysis': {
      path:'Data Model / công thức tổng hợp → KPI block → Actual, Target, Variance, Rate',
      tab:'DATA',command:'Metric · Dimension · Grain · Target vs Actual',
      basic:'Phân biệt metric, dimension, grain và các KPI phổ biến như Revenue, Orders, CR.',
      mid:'Tính AOV, UPT, ASP, contribution, variance và target achievement đúng mẫu số.',
      advanced:'Thiết kế KPI framework có định nghĩa, grain, nguồn, filter context và control total để không tạo số “đẹp nhưng sai”.',
      headers:['KPI','Actual','Target','Variance'],rows:[['Revenue','12500000','12000000','500000'],['CR','12.5%','11.0%','1.5%'],['AOV','350000','330000','20000']],focus:'A1:D4'
    },
    'a16-charts-pareto': {
      path:'Insert → Charts → Column / Line / Combo / Histogram; Sort giảm dần để dựng Pareto',
      tab:'INSERT',command:'Charts · Combo · Histogram · Pareto',
      basic:'Chọn chart theo câu hỏi: so sánh, xu hướng, cơ cấu, phân bố.',
      mid:'Dựng Actual vs Target, combo chart và Pareto 80/20 với cumulative %.',
      advanced:'Tối ưu visual hierarchy, accessibility, benchmark/reference line và loại bỏ chart junk để insight nổi lên.',
      headers:['Defect','Qty','%','Cum.%'],rows:[['Scratch','45','45%','45%'],['Dent','30','30%','75%'],['Stain','15','15%','90%']],focus:'A1:D4'
    },
    'a17-dashboard': {
      path:'Dashboard sheet → KPI Cards + Charts + Slicer/Timeline + vùng Control',
      tab:'INSERT',command:'PivotChart · Slicer · Timeline · KPI Cards',
      basic:'Bố trí dashboard theo hierarchy: KPI trước, trend/breakdown sau.',
      mid:'Kết nối Slicer/Timeline, đồng bộ filter và dùng semantic color có chủ đích.',
      advanced:'Thiết kế filter context, source-of-truth, reconciliation, performance và handover để dashboard dùng được lâu dài.',
      headers:['KPI','Value','Δ','Status'],rows:[['Revenue','12.5M','+4.2%','Đạt'],['CR','12.5%','+1.5pt','Đạt'],['Orders','125','-3.1%','Cần xem']],focus:'A1:D4'
    },
    'a18-report-audit-handover': {
      path:'Formulas → Error Checking / Review → Protect / Page Layout → Print Area',
      tab:'REVIEW',command:'Error Checking · Protect · Print Area · Versioning',
      basic:'Kiểm tra công thức lỗi, số tổng và bố cục trước khi gửi file.',
      mid:'Thiết lập print area, protect đúng vùng, ghi version và hướng dẫn refresh/input.',
      advanced:'Audit lineage, external links, hidden logic, hardcode, performance và tạo checklist bàn giao/reconciliation có bằng chứng.',
      headers:['Check','Expected','Actual','Status'],rows:[['Revenue total','12,500,000','12,500,000','PASS'],['#REF!','0','0','PASS'],['External link','0','1','FAIL']],focus:'A1:D4'
    },
    'x19-advanced-formulas': {
      path:'Formulas → Evaluate Formula / Name Manager; Data → What-If Analysis / Solver',
      tab:'FORMULAS',command:'SUMPRODUCT · AGGREGATE · LET · Evaluate Formula',
      basic:'Hiểu SUMPRODUCT, AGGREGATE và cách debug từng phần công thức.',
      mid:'Dùng LET/Name Manager để giảm lặp và làm công thức dễ đọc, dễ test.',
      advanced:'Xây công thức có cấu trúc, benchmark hiệu năng, kiểm soát volatile functions và dùng Goal Seek/Solver đúng bài toán.',
      headers:['Actual','Target','Weight','Score'],rows:[['95','100','40%','=A2/B2*C2'],['88','90','35%','=A3/B3*C3'],['72','80','25%','=A4/B4*C4']],focus:'D2:D4'
    },
    'x20-dynamic-array': {
      path:'Formula Bar → FILTER / UNIQUE / SORT / TEXTSPLIT / VSTACK / LAMBDA (Microsoft 365)',
      tab:'FORMULAS',command:'FILTER · UNIQUE · SORT · Spill Range',
      basic:'Hiểu một công thức có thể spill thành nhiều ô và xử lý #SPILL!.',
      mid:'Kết hợp FILTER+UNIQUE+SORT, TEXTSPLIT/VSTACK để tạo report phụ động.',
      advanced:'Dùng LET, MAP/BYROW/REDUCE và LAMBDA để đóng gói logic; cân nhắc hiệu năng và khả năng tương thích phiên bản.',
      headers:['Store','Revenue','Filter result',''],rows:[['HN01','350000','HN01','350000'],['HN02','420000','HN01','280000'],['HN01','280000','','']],focus:'C1:D3'
    },
    'x21-power-query-basics': {
      path:'Data → Get Data → Power Query Editor → Applied Steps → Close & Load',
      tab:'DATA',command:'Get Data · Transform Data · Applied Steps · Refresh',
      basic:'Import một nguồn, kiểm tra header/data type và hiểu mỗi thao tác tạo một Applied Step.',
      mid:'Làm sạch Trim/Clean, filter, split/replace, rename và load đúng nơi.',
      advanced:'Thiết kế query có bước ổn định, query staging, kiểm soát data type, privacy/source path và refresh/reconciliation.',
      headers:['Applied Step','Rows','Issue','Status'],rows:[['Source','4150','Raw','OK'],['Changed Type','4150','2 type errors','CHECK'],['Removed Errors','4148','0','OK']],focus:'A1:D4'
    },
    'x22-power-query-multi-source': {
      path:'Power Query Editor → Home → Append Queries / Merge Queries / Combine Files',
      tab:'POWER QUERY',command:'Append · Merge · Join Kind · Combine Files',
      basic:'Phân biệt Append (xếp dòng) và Merge (ghép cột theo key).',
      mid:'Chọn join type đúng, combine folder cùng schema và dùng staging/mapping table.',
      advanced:'Xử lý schema drift, duplicate key, unmatched rows, query folding/hiệu năng và reconciliation nhiều nguồn.',
      headers:['Source','Rows','Matched','Exception'],rows:[['Sales_Aug','2500','2490','10'],['Sales_Sep','2650','2638','12'],['Master','5200','5128','72']],focus:'A1:D4'
    },
    'x23-macro-vba': {
      path:'Developer → Record Macro / Visual Basic → Module → Workbook, Worksheet, Range',
      tab:'DEVELOPER',command:'Record Macro · Visual Basic · Module · Macro Security',
      basic:'Record Macro, lưu .xlsm và chạy macro đơn giản an toàn.',
      mid:'Viết Sub với Workbook/Worksheet/Range, If, Loop và biến cơ bản.',
      advanced:'Tách procedure, error handling, config, logging tối thiểu, tránh Select/Activate và kiểm soát macro security khi bàn giao.',
      headers:['Step','Action','Result','Status'],rows:[['1','RefreshAll','Completed','OK'],['2','Export PDF','Report.pdf','OK'],['3','Save copy','2026-09.xlsx','OK']],focus:'A1:D4'
    },
    'x24-automation-workflow': {
      path:'Thiết kế workflow → Input → Transform → Calculate → Report → Validate → Deliver',
      tab:'WORKFLOW',command:'Formula · Pivot · Power Query · VBA · Data Model',
      basic:'Chọn đúng công cụ cho từng loại việc thay vì tự động hóa tất cả bằng một công nghệ.',
      mid:'Thiết kế refresh order, config sheet, control totals và exception output.',
      advanced:'Xây workflow có idempotency, dependency rõ, performance budget, fail-safe, versioning và quy trình bàn giao/khôi phục.',
      headers:['Stage','Tool','Dependency','Control'],rows:[['Input','Excel Table','None','Row count'],['Transform','Power Query','Input','Error rows'],['Report','Pivot/Dashboard','Transform','Reconcile']],focus:'A1:D4'
    }
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const lessonId = () => new URLSearchParams(location.search).get('lesson') || 'f01-excel-workspace';
  const currentLesson = () => (window.AVPKnowledgeLessons || []).find(x => x.id === lessonId());

  function visual(profile, sectionTitle) {
    const cols = profile.headers.map((h,i)=>`<span class="kd-cell kd-head">${String.fromCharCode(65+i)} · ${esc(h)}</span>`).join('');
    const rows = profile.rows.map((row,r)=>row.map((v,c)=>`<span class="kd-cell ${r===0&&c===0?'kd-selected':''}">${esc(v)}</span>`).join('')).join('');
    return `<figure class="kd-visual" aria-label="Minh họa Excel cho ${esc(sectionTitle)}">
      <figcaption><span>MINH HỌA GIAO DIỆN EXCEL</span><strong>${esc(profile.path)}</strong></figcaption>
      <div class="kd-window">
        <div class="kd-titlebar"><b>Microsoft Excel</b><span>— □ ×</span></div>
        <div class="kd-tabs"><span>FILE</span><span class="active">${esc(profile.tab)}</span><span>INSERT</span><span>FORMULAS</span><span>DATA</span><span>REVIEW</span><span>VIEW</span></div>
        <div class="kd-ribbon"><span class="kd-command">${esc(profile.command)}</span><small>← vị trí / nhóm lệnh cần tìm</small></div>
        <div class="kd-formula"><span class="kd-name">${esc(profile.focus)}</span><span>fx</span><code>${esc(sectionTitle)}</code></div>
        <div class="kd-grid" style="--kd-cols:${profile.headers.length}">${cols}${rows}</div>
        <div class="kd-sheetbar"><span class="active">Data</span><span>Report</span><span>Control</span><b>+</b></div>
      </div>
      <p>Hãy đối chiếu vị trí lệnh ở trên với Excel của bạn. Tên nhóm có thể thay đổi nhẹ theo phiên bản, nhưng tab và logic thao tác giữ nguyên.</p>
    </figure>`;
  }

  function ladder(profile, sectionTitle) {
    return `<section class="kd-ladder" aria-label="Lộ trình từ cơ bản đến nâng cao">
      <div class="kd-ladder-head"><span>TỪ CƠ BẢN → NÂNG CAO</span><strong>${esc(sectionTitle)}</strong></div>
      <div class="kd-levels">
        <article><em>01</em><h3>CƠ BẢN · Nhận diện & làm đúng</h3><p>${esc(profile.basic)}</p><small>Ở phần này: xác định đúng đối tượng, vị trí lệnh và kết quả phải nhìn thấy.</small></article>
        <article><em>02</em><h3>TRUNG CẤP · Dùng trong công việc</h3><p>${esc(profile.mid)}</p><small>Ở phần này: áp dụng vào dữ liệu thực tế, có kiểm tra đầu vào và đầu ra.</small></article>
        <article><em>03</em><h3>NÂNG CAO · Kiểm soát & bàn giao</h3><p>${esc(profile.advanced)}</p><small>Ở phần này: xử lý ngoại lệ, audit rủi ro và biết khi nào không nên dùng công cụ.</small></article>
      </div>
    </section>`;
  }

  function enrichIntro() {
    const lesson = currentLesson();
    const profile = PROFILES[lessonId()];
    const intro = document.getElementById('kvIntro');
    if (!lesson || !profile || !intro || intro.querySelector('.kd-course-map')) return;
    const wrap = document.createElement('section');
    wrap.className = 'kd-course-map';
    wrap.innerHTML = `<div><span>ĐỊNH VỊ BÀI HỌC</span><strong>${esc(profile.path)}</strong></div><div class="kd-map-flow"><b>Cơ bản</b><i>→</i><b>Ứng dụng</b><i>→</i><b>Nâng cao</b><i>→</i><b>Audit / bàn giao</b></div>`;
    intro.appendChild(wrap);
  }

  function enrichSection() {
    const lesson = currentLesson();
    const profile = PROFILES[lessonId()];
    const host = document.getElementById('kvSections');
    const section = host?.querySelector('.kv-section');
    if (!lesson || !profile || !section || section.querySelector('.kd-enrichment')) return;
    const title = section.querySelector('h2')?.textContent?.trim() || lesson.title;
    const node = document.createElement('div');
    node.className = 'kd-enrichment';
    node.innerHTML = `<div class="kd-where"><span>NÓ Ở ĐÂU TRONG EXCEL?</span><strong>${esc(profile.path)}</strong></div>${ladder(profile,title)}${visual(profile,title)}`;
    const why = section.querySelector('.kv-why');
    if (why) why.insertAdjacentElement('afterend', node);
    else section.prepend(node);
  }

  function boot() {
    enrichIntro();
    enrichSection();
    const host = document.getElementById('kvSections');
    if (host) new MutationObserver(() => enrichSection()).observe(host,{childList:true,subtree:false});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();