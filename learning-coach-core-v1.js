(() => {
  'use strict';
  if (window.AVPLearningCoach) return;

  const KEYS = {
    profile: 'avp_coach_profile_v1',
    mistakes: 'avp_coach_mistakes_v1',
    daily: 'avp_coach_daily_v1',
    cases: 'avp_coach_cases_v1',
    learner: 'avp_coach_learner_id'
  };

  const SKILLS = {
    foundation: {name:'Nền tảng Excel', module:'excel-foundation', lesson:'f01-excel-workspace'},
    cleaning: {name:'Dữ liệu & Làm sạch', module:'data-cleaning', lesson:'d07-sort-filter'},
    formula: {name:'Công thức & Tra cứu', module:'formula-lookup', lesson:'s07-logic'},
    analysis: {name:'Phân tích & Báo cáo', module:'analysis-reporting', lesson:'a13-excel-table'},
    dashboard: {name:'Dashboard', module:'dashboard-visual', lesson:'a16-charts-pareto'},
    powerquery: {name:'Power Query', module:'power-query', lesson:'pq28-import-sources'},
    vba: {name:'Macro / VBA', module:'vba-optimization', lesson:'x23-macro-vba'},
    workflow: {name:'Workflow & Case', module:'workflow-cases', lesson:'x24-automation-workflow'}
  };

  const TOPIC_TO_SKILL = {
    shortcuts:'foundation','basic-functions':'foundation','excel-table':'analysis',
    conditional:'formula',lookup:'formula',text:'cleaning','date-time':'formula','dynamic-array':'formula',
    cleaning:'cleaning',pivot:'analysis',dashboard:'dashboard','power-query':'powerquery',vba:'vba',workflow:'workflow'
  };

  const LESSON_TITLES = {
    'f01-excel-workspace':'Giao diện và không gian làm việc',
    'f02-data-entry-types':'Nhập liệu và kiểu dữ liệu',
    'f03-formatting-display':'Định dạng và cách hiển thị',
    'f04-formulas-references':'Công thức và tham chiếu',
    'f05-core-functions':'Hàm nền tảng',
    'f06-data-table-structure':'Cấu trúc bảng nguồn',
    'd07-sort-filter':'Sắp xếp và lọc',
    'd08-find-replace':'Tìm và thay thế',
    's10-text':'Xử lý chuỗi văn bản',
    'd09-data-validation':'Data Validation',
    's12-clean-control':'Làm sạch và kiểm soát dữ liệu',
    's07-logic':'Hàm logic',
    's08-conditional-aggregation':'Tổng hợp có điều kiện',
    's09-lookup':'Tra cứu dữ liệu',
    's11-date-time':'Ngày tháng',
    'x19-advanced-formulas':'Công thức nâng cao',
    'x20-dynamic-array':'Dynamic Array',
    'a13-excel-table':'Excel Table',
    'a14-pivottable':'PivotTable',
    'a15-kpi-analysis':'Phân tích KPI',
    'a18-report-audit-handover':'Kiểm tra và bàn giao báo cáo',
    'a19-reconciliation':'Đối chiếu số liệu',
    'a16-charts-pareto':'Biểu đồ và Pareto',
    'a17-dashboard':'Dashboard',
    'v23-kpi-cards':'Thẻ KPI',
    'v24-slicer-timeline':'Slicer và Timeline',
    'v25-dashboard-interaction':'Dashboard tương tác',
    'pq28-import-sources':'Kết nối nguồn Power Query',
    'x21-power-query-basics':'Power Query căn bản',
    'pq30-transform-clean':'Biến đổi và làm sạch trong PQ',
    'pq31-schema-types':'Schema và kiểu dữ liệu',
    'x22-power-query-multi-source':'Gộp nhiều file bằng PQ',
    'pq33-refresh-performance':'Refresh bền và hiệu năng',
    'x23-macro-vba':'Record Macro và VBA',
    'vb35-object-model':'Object Model',
    'vb36-control-flow':'If / Loop trong VBA',
    'vb37-performance-security':'Hiệu năng và bảo mật macro',
    'x24-automation-workflow':'Workflow tự động hóa',
    'c39-tool-selection':'Chọn đúng công cụ',
    'c40-sales-case':'Case Sales',
    'c41-qc-case':'Case QC / vận hành',
    'c42-end-to-end-case':'Case tổng hợp đầu-cuối'
  };

  const read = (key, fallback) => {
    try {
      const v = JSON.parse(localStorage.getItem(key) || 'null');
      return v == null ? fallback : v;
    } catch (_) { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
    return value;
  };
  const norm = v => String(v ?? '').trim();
  const safeId = v => norm(v).toLowerCase().replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80);

  function localDate(){
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  function hashStr(s){
    let h = 2166136261;
    for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function seededShuffle(arr, seedStr){
    const a = arr.slice();
    let seed = hashStr(seedStr);
    for (let i = a.length - 1; i > 0; i--) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const j = seed % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function authUserId(){
    try {
      if (window.AVPAuthUser?.id) return String(window.AVPAuthUser.id);
      if (window.__AVP_USER_ID__) return String(window.__AVP_USER_ID__);
      for (const key of Object.keys(localStorage)) {
        if (!key.startsWith('sb-') || !key.includes('auth-token')) continue;
        const raw = JSON.parse(localStorage.getItem(key) || 'null');
        const id = raw?.user?.id || raw?.currentSession?.user?.id || raw?.currentUser?.id;
        if (id) return String(id);
      }
    } catch (_) {}
    return '';
  }

  function getLearnerId(){
    const auth = authUserId();
    if (auth) return 'u:' + auth;
    let id = '';
    try { id = localStorage.getItem(KEYS.learner) || ''; } catch (_) {}
    if (!id) {
      id = (crypto.randomUUID && crypto.randomUUID()) || ('g-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10));
      try { localStorage.setItem(KEYS.learner, id); } catch (_) {}
    }
    return 'g:' + id;
  }

  function lessonTitle(id){
    const live = (window.AVPKnowledgeLessons || []).find(x => x.id === id);
    return live?.title || LESSON_TITLES[id] || id;
  }

  function lessonSequence(){
    const seq = window.AVPLearningPlatform?.lessonSequence;
    if (Array.isArray(seq) && seq.length) return seq.slice();
    return Object.keys(LESSON_TITLES);
  }

  function getProfile(){ return read(KEYS.profile, null); }
  function setProfile(profile){ return write(KEYS.profile, {...profile, updatedAt:new Date().toISOString()}); }
  function resetProfile(){ try{localStorage.removeItem(KEYS.profile)}catch(_){} }

  function getMistakes(){
    const rows = read(KEYS.mistakes, []);
    return Array.isArray(rows) ? rows.sort((a,b)=>new Date(b.lastAt||0)-new Date(a.lastAt||0)) : [];
  }
  function logMistake(input={}){
    const skill = input.skill || TOPIC_TO_SKILL[input.topic] || 'foundation';
    const concept = norm(input.concept || input.conceptId || input.correct || input.prompt || 'mistake');
    const id = safeId(`${input.source||'web'}-${skill}-${concept}`) || `mistake-${Date.now()}`;
    const rows = getMistakes();
    const idx = rows.findIndex(x=>x.id===id);
    const now = new Date().toISOString();
    const row = {
      id, source: norm(input.source || 'web'), skill, topic: norm(input.topic), concept,
      prompt: norm(input.prompt), correct: norm(input.correct), chosen: norm(input.chosen),
      explain: norm(input.explain), lessonId: norm(input.lessonId || SKILLS[skill]?.lesson),
      url: norm(input.url), count: 1, resolved: false, firstAt: now, lastAt: now
    };
    if (idx >= 0) {
      const old = rows[idx];
      rows[idx] = {...old, ...row, count:(Number(old.count)||0)+1, firstAt:old.firstAt||now, lastAt:now, resolved:false};
    } else rows.unshift(row);
    write(KEYS.mistakes, rows.slice(0,120));
    window.dispatchEvent(new CustomEvent('avp:coach-mistakes-changed'));
    return row;
  }
  function resolveMistake(id, resolved=true){
    const rows = getMistakes();
    const row = rows.find(x=>x.id===id);
    if (row) { row.resolved = !!resolved; row.resolvedAt = resolved ? new Date().toISOString() : null; write(KEYS.mistakes, rows); }
    window.dispatchEvent(new CustomEvent('avp:coach-mistakes-changed'));
    return row || null;
  }
  function clearResolved(){ write(KEYS.mistakes, getMistakes().filter(x=>!x.resolved)); }
  function unresolvedMistakes(){ return getMistakes().filter(x=>!x.resolved); }

  function getDaily(){ return read(KEYS.daily, {}); }
  function markDaily(date, data={}){
    const all = getDaily();
    all[date] = {...(all[date]||{}), ...data, updatedAt:new Date().toISOString()};
    const keys = Object.keys(all).sort().slice(-90);
    const trimmed = {};
    keys.forEach(k => { trimmed[k] = all[k]; });
    write(KEYS.daily, trimmed);
    return trimmed[date];
  }

  function usedLessonIds(exceptDate){
    const all = getDaily();
    const out = new Set();
    Object.keys(all).forEach(d => {
      if (exceptDate && d === exceptDate) return;
      if (all[d]?.lessonId) out.add(all[d].lessonId);
    });
    return out;
  }

  function uniqueDayCount(){
    const all = getDaily();
    return Object.keys(all).filter(d => all[d]?.lessonId).length;
  }

  function todayLesson(forceNew=false){
    const date = localDate();
    const existing = getDaily()[date];
    if (!forceNew && existing?.lessonId) {
      return summarizeAssignment(date, existing);
    }

    const seq = lessonSequence();
    const learner = getLearnerId();
    const used = usedLessonIds(date);
    const profile = getProfile();
    const preferModule = profile?.recommended ? (SKILLS[profile.recommended]?.module || '') : '';
    const preferIds = preferModule
      ? seq.filter(id => window.AVPLearningPlatform?.lessonToModule?.get(id) === preferModule)
      : [];

    const cycle = used.size >= seq.length ? 2 : 1;
    const deck = seededShuffle(seq, learner + ':c' + cycle);

    let lessonId;
    if (cycle === 1) {
      lessonId = preferIds.find(id => !used.has(id)) || deck.find(id => !used.has(id)) || deck[0];
    } else {
      const recent = Object.keys(getDaily()).sort().slice(-7).map(d => getDaily()[d]?.lessonId);
      lessonId = deck.find(id => !recent.includes(id)) || deck[0];
    }

    const rec = markDaily(date, {
      lessonId,
      cycle,
      learnerId: learner,
      assignedAt: new Date().toISOString()
    });
    return summarizeAssignment(date, rec);
  }

  function summarizeAssignment(date, rec){
    const id = rec.lessonId;
    const module = window.AVPLearningPlatform?.moduleForLesson?.(id) || null;
    const seq = lessonSequence();
    const order = window.AVPLearningPlatform?.displayOrder?.(id) || (seq.indexOf(id) + 1);
    return {
      date,
      lessonId: id,
      title: lessonTitle(id),
      order,
      total: seq.length,
      moduleTitle: module?.title || '',
      moduleId: module?.id || '',
      cycle: rec.cycle || 1,
      uniqueDays: uniqueDayCount(),
      practiceDone: !!rec.practiceDone,
      lessonOpened: !!rec.lessonOpened,
      lessonDone: !!rec.lessonDone,
      mistakeReviewed: !!rec.mistakeReviewed
    };
  }

  function getCases(){ return read(KEYS.cases, {}); }
  function markCase(id, data={}){ const all=getCases(); all[id]={...(all[id]||{}),...data,updatedAt:new Date().toISOString()}; write(KEYS.cases,all); return all[id]; }

  function lessonUrl(id){ return id ? `knowledge.html?lesson=${encodeURIComponent(id)}` : 'skill-map.html'; }
  function skillMeta(skill){ return SKILLS[skill] || SKILLS.foundation; }
  function skillFromTopic(topic){ return TOPIC_TO_SKILL[topic] || 'foundation'; }

  window.AVPLearningCoach = Object.freeze({
    version:'coach-v1.2', KEYS, SKILLS, TOPIC_TO_SKILL, LESSON_TITLES,
    getProfile,setProfile,resetProfile,
    getMistakes,logMistake,resolveMistake,clearResolved,unresolvedMistakes,
    getDaily,markDaily,getCases,markCase,
    lessonUrl,skillMeta,skillFromTopic,
    localDate,getLearnerId,lessonTitle,todayLesson,uniqueDayCount
  });
})();
