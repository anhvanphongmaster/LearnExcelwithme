(() => {
  'use strict';
  if (window.AVPLearningPlatform) return;

  const modules = [
    {
      id:'excel-foundation',order:1,number:'01',label:'FOUNDATION',title:'Nền tảng Excel',
      short:'Hiểu file Excel, nhập liệu đúng và trình bày dữ liệu rõ ràng trước khi học công thức.',
      outcome:'Mở một file lạ và biết mình đang nhìn gì, sửa gì, lưu gì.',
      tone:'green',
      lessons:['f01-excel-workspace','f02-data-entry-types','f03-formatting-display']
    },
    {
      id:'formula-core',order:2,number:'02',label:'FORMULA CORE',title:'Công thức nền tảng',
      short:'Từ dấu =, tham chiếu ô đến hàm cơ bản và logic IF dùng trong công việc.',
      outcome:'Viết công thức đúng, kéo công thức không lệch và đọc được logic trong ô.',
      tone:'blue',
      lessons:['f04-formulas-references','f05-core-functions','s07-logic']
    },
    {
      id:'data-cleaning',order:3,number:'03',label:'DATA CONTROL',title:'Dữ liệu & Làm sạch',
      short:'Tổ chức bảng nguồn, xử lý text lỗi, duplicate, blank và kiểm soát dữ liệu trước phân tích.',
      outcome:'Biến một bảng dữ liệu lộn xộn thành nguồn đủ sạch để tính toán.',
      tone:'teal',
      lessons:['f06-data-table-structure','s10-text','s12-clean-control']
    },
    {
      id:'lookup-summary',order:4,number:'04',label:'LOOKUP & SUMMARY',title:'Tra cứu & Tổng hợp',
      short:'SUMIFS, COUNTIFS, XLOOKUP/VLOOKUP và ngày tháng theo tình huống thực tế.',
      outcome:'Tra cứu đúng thông tin và tổng hợp đúng số theo điều kiện, thời gian, đối tượng.',
      tone:'indigo',
      lessons:['s08-conditional-aggregation','s09-lookup','s11-date-time']
    },
    {
      id:'analysis-reporting',order:5,number:'05',label:'ANALYSIS',title:'Phân tích & Báo cáo',
      short:'Excel Table, PivotTable và tư duy KPI để chuyển dữ liệu thành thông tin có thể kiểm tra.',
      outcome:'Từ bảng nguồn tạo được phân tích và báo cáo có cấu trúc.',
      tone:'purple',
      lessons:['a13-excel-table','a14-pivottable','a15-kpi-analysis']
    },
    {
      id:'dashboard-visual',order:6,number:'06',label:'VISUAL REPORT',title:'Dashboard & Trực quan hóa',
      short:'Biểu đồ, dashboard, kiểm tra số và quy trình bàn giao một báo cáo dùng được.',
      outcome:'Thiết kế báo cáo dễ đọc, đúng số và người nhận biết cách sử dụng.',
      tone:'rose',
      lessons:['a16-charts-pareto','a17-dashboard','a18-report-audit-handover']
    },
    {
      id:'advanced-pq',order:7,number:'07',label:'ADVANCED DATA',title:'Power Query & Dữ liệu nâng cao',
      short:'Công thức hiện đại, Dynamic Array và Power Query từ một nguồn đến nhiều nguồn.',
      outcome:'Giảm thao tác lặp và xây luồng biến đổi dữ liệu có thể Refresh.',
      tone:'sand',
      lessons:['x19-advanced-formulas','x20-dynamic-array','x21-power-query-basics','x22-power-query-multi-source']
    },
    {
      id:'automation-workflow',order:8,number:'08',label:'AUTOMATION',title:'Tự động hóa & Workflow',
      short:'Macro/VBA và tư duy chọn đúng công cụ để xây workflow Excel bền vững.',
      outcome:'Biết khi nào tự động hóa, tự động hóa bằng gì và kiểm soát rủi ro khi bàn giao.',
      tone:'orange',
      lessons:['x23-macro-vba','x24-automation-workflow']
    }
  ];

  const byModule = new Map(modules.map(m => [m.id,m]));
  const lessonToModule = new Map();
  modules.forEach(module => module.lessons.forEach(id => lessonToModule.set(id,module.id)));

  const moduleForLesson = id => byModule.get(lessonToModule.get(id)) || null;
  const moduleUrl = id => `skill-map.html?module=${encodeURIComponent(id)}`;
  const lessonUrl = id => `knowledge.html?lesson=${encodeURIComponent(id)}`;

  window.AVPLearningPlatform = {modules,byModule,lessonToModule,moduleForLesson,moduleUrl,lessonUrl};
})();
