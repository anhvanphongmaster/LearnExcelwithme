(() => {
  'use strict';
  const A = window.__DAILY_PACK_A || {};
  const B = window.__DAILY_PACK_B || {};
  const lessons = [].concat(A.lessons || [], B.lessons || []);
  const byId = Object.fromEntries(lessons.map(x => [x.id, x]));
  window.AVPDailyExpand = {
    version: A.version || 'daily-12x5-v1',
    cycleDays: A.cycleDays || 12,
    timezone: A.timezone || 'Asia/Ho_Chi_Minh',
    startDate: A.startDate || '2026-09-14',
    packs: A.packs || [],
    lessons,
    byId,
    byLevel: {
      basic: lessons.filter(x => x.level === 'basic').map(x => x.id),
      intermediate: lessons.filter(x => x.level === 'intermediate').map(x => x.id),
      advanced: lessons.filter(x => x.level === 'advanced').map(x => x.id),
      case: lessons.filter(x => x.level === 'case').map(x => x.id)
    },
    levels: [
      {id:'basic', name:'Cơ bản'},
      {id:'intermediate', name:'Trung cấp'},
      {id:'advanced', name:'Nâng cao'},
      {id:'case', name:'Case'}
    ]
  };
})();
