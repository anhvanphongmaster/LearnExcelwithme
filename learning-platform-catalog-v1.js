(() => {
  'use strict';

  const modules = [
    {id:'excel-foundation',order:1,number:'01',label:'FOUNDATION',title:'Nền tảng Excel',short:'Hiểu file, nhập liệu, định dạng, công thức và cấu trúc bảng trước khi đi sâu.',outcome:'Mở một file lạ, hiểu cấu trúc, nhập/sửa/lưu đúng và viết được công thức nền.',tone:'green',lessons:['f01-excel-workspace','f02-data-entry-types','f03-formatting-display','f04-formulas-references','f05-core-functions','f06-data-table-structure']},
    {id:'data-cleaning',order:2,number:'02',label:'DATA CONTROL',title:'Dữ liệu & Làm sạch',short:'Lọc, tìm, chuẩn hóa text, chặn nhập sai và kiểm soát duplicate/blank/error.',outcome:'Biến bảng dữ liệu lộn xộn thành nguồn đủ sạch và có kiểm soát để phân tích.',tone:'teal',lessons:['d07-sort-filter','d08-find-replace','s10-text','d09-data-validation','s12-clean-control']},
    {id:'formula-lookup',order:3,number:'03',label:'FORMULA & LOOKUP',title:'Công thức & Tra cứu',short:'Logic, tổng hợp điều kiện, lookup, ngày tháng, công thức nâng cao và Dynamic Array.',outcome:'Giải được phần lớn bài toán tính toán/tra cứu văn phòng bằng công thức đúng và dễ kiểm tra.',tone:'blue',lessons:['s07-logic','s08-conditional-aggregation','s09-lookup','s11-date-time','x19-advanced-formulas','x20-dynamic-array']},
    {id:'analysis-reporting',order:4,number:'04',label:'ANALYSIS',title:'Phân tích & Báo cáo',short:'Excel Table, PivotTable, KPI, kiểm tra số và quy trình bàn giao báo cáo.',outcome:'Từ bảng nguồn tạo được báo cáo có cấu trúc, đúng grain và đối chiếu được về nguồn.',tone:'purple',lessons:['a13-excel-table','a14-pivottable','a15-kpi-analysis','a18-report-audit-handover','a19-reconciliation']},
    {id:'dashboard-visual',order:5,number:'05',label:'VISUAL REPORT',title:'Dashboard & Trực quan hóa',short:'Chart đúng mục đích, KPI card, Slicer/Timeline và dashboard tương tác dễ dùng.',outcome:'Thiết kế dashboard đúng số, rõ hierarchy và người nhận biết ngay phải bấm/lọc ở đâu.',tone:'rose',lessons:['a16-charts-pareto','a17-dashboard','v23-kpi-cards','v24-slicer-timeline','v25-dashboard-interaction']},
    {id:'power-query',order:6,number:'06',label:'POWER QUERY',title:'Power Query',short:'Kết nối nguồn, làm sạch, schema/type, Append/Merge, nhiều file và Refresh bền vững.',outcome:'Xây được luồng ETL có thể Refresh thay cho copy/paste lặp lại.',tone:'sand',lessons:['pq28-import-sources','x21-power-query-basics','pq30-transform-clean','pq31-schema-types','x22-power-query-multi-source','pq33-refresh-performance']},
    {id:'vba-optimization',order:7,number:'07',label:'AUTOMATION CODE',title:'Macro / VBA & Tối ưu file',short:'Record Macro, object model, If/Loop, xử lý lỗi, bảo mật và giảm lag workbook.',outcome:'Tự động hóa đúng phần việc lặp, tránh Select/Activate và bàn giao file macro an toàn.',tone:'orange',lessons:['x23-macro-vba','vb35-object-model','vb36-control-flow','vb37-performance-security']},
    {id:'workflow-cases',order:8,number:'08',label:'WORKFLOW & CASE',title:'Workflow & Case thực chiến',short:'Chọn đúng công cụ và nối Input → Transform → Calculate → Report → Validate → Deliver.',outcome:'Tự thiết kế được workflow hoàn chỉnh và biết cách áp dụng vào Sales, QC/vận hành và case tổng hợp.',tone:'indigo',lessons:['x24-automation-workflow','c39-tool-selection','c40-sales-case','c41-qc-case','c42-end-to-end-case']}
  ];

  const byModule = new Map(modules.map(m => [m.id,m]));
  const lessonToModule = new Map();
  const lessonSequence=[];
  modules.forEach(module => module.lessons.forEach(id => {lessonToModule.set(id,module.id);lessonSequence.push(id)}));
  const sequenceIndex=new Map(lessonSequence.map((id,i)=>[id,i+1]));

  const moduleForLesson = id => byModule.get(lessonToModule.get(id)) || null;
  const moduleUrl = id => `skill-map.html?module=${encodeURIComponent(id)}`;
  const lessonUrl = id => `knowledge.html?lesson=${encodeURIComponent(id)}`;
  const displayOrder = id => sequenceIndex.get(id) || 999;

  const syncLessonOrder=()=>{
    (window.AVPKnowledgeLessons||[]).forEach(lesson=>{
      const n=sequenceIndex.get(lesson.id);
      if(n){lesson.order=n;lesson.platformOrder=n;lesson.moduleId=lessonToModule.get(lesson.id)}
    });
  };
  syncLessonOrder();

  window.AVPLearningPlatform = {modules,byModule,lessonToModule,lessonSequence,sequenceIndex,moduleForLesson,moduleUrl,lessonUrl,displayOrder,syncLessonOrder};
})();
