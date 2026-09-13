(() => {
  'use strict';
  if(window.AVPLearningTracks)return;
  const defs=[
    {id:'foundation-data',number:'01',label:'FOUNDATION + DATA',title:'Nền tảng & Dữ liệu',tone:'green',modules:['excel-foundation','data-cleaning'],short:'Hiểu Excel từ gốc, nhập liệu đúng, quản lý bảng, lọc và làm sạch dữ liệu trước khi tính toán.'},
    {id:'formula-analysis',number:'02',label:'FORMULA + ANALYSIS',title:'Công thức & Phân tích',tone:'blue',modules:['formula-lookup','analysis-reporting'],short:'Logic, lookup, tổng hợp điều kiện, Table, Pivot, KPI và kiểm tra số liệu trước khi bàn giao.'},
    {id:'dashboard-power-query',number:'03',label:'DASHBOARD + POWER QUERY',title:'Dashboard & Power Query',tone:'purple',modules:['dashboard-visual','power-query'],short:'Trực quan hóa, dashboard tương tác và quy trình kết nối, làm sạch, gộp nguồn, Refresh bằng Power Query.'},
    {id:'automation-cases',number:'04',label:'AUTOMATION + CASE',title:'Tự động hóa & Case',tone:'sand',modules:['vba-optimization','workflow-cases'],short:'Macro/VBA, tối ưu workbook, chọn đúng công cụ và ghép thành workflow/case thực chiến hoàn chỉnh.'}
  ];
  const byId=new Map(defs.map(t=>[t.id,t]));
  const moduleToTrack=new Map();
  defs.forEach(t=>t.modules.forEach(id=>moduleToTrack.set(id,t.id)));
  const platform=()=>window.AVPLearningPlatform||null;
  const lessonIds=track=>track.modules.flatMap(id=>platform()?.byModule?.get?.(id)?.lessons||[]);
  const forModule=id=>byId.get(moduleToTrack.get(id))||null;
  const forLesson=id=>forModule(platform()?.lessonToModule?.get?.(id)||'');
  const url=id=>`skill-map.html?track=${encodeURIComponent(id)}`;
  window.AVPLearningTracks={defs,byId,moduleToTrack,lessonIds,forModule,forLesson,url};
})();
