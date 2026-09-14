(() => {
  'use strict';
  const A=window.__DX_BI||{}, B=window.__DX_AC||{};
  const basic=A.basic||[], intermediate=A.intermediate||[], advanced=B.advanced||[], cases=B.cases||[];
  const lessons=[...basic,...intermediate,...advanced,...cases];
  const byId=Object.fromEntries(lessons.map(x=>[x.id,x]));
  const byLevel={basic:basic.map(x=>x.id),intermediate:intermediate.map(x=>x.id),advanced:advanced.map(x=>x.id),case:cases.map(x=>x.id)};
  window.AVPDailyExpand={version:'expand-60-v1',lessons,byId,byLevel,levels:[
    {id:'basic',name:'Cơ bản',file:'downloads/daily-co-ban.xlsx'},
    {id:'intermediate',name:'Trung cấp',file:'downloads/daily-trung-cap.xlsx'},
    {id:'advanced',name:'Nâng cao',file:'downloads/daily-nang-cao.xlsx'},
    {id:'case',name:'Case',file:'downloads/daily-case.xlsx'}
  ]};
})();
