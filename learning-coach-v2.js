(() => {
  'use strict';
  const C=window.AVPLearningCoach, P=window.AVPLearningPlatform;
  if(!C)return;
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const skillOrder=['foundation','cleaning','formula','analysis','dashboard','powerquery','vba','workflow'];
  const skillName=s=>C.skillMeta(s).name;
  const localDate=()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)};

  const QUESTIONS=[
    {id:'f-ref',skill:'foundation',q:'Sao chép công thức xuống nhiều dòng nhưng ô thuế suất B1 phải luôn cố định. Tham chiếu nào đúng?',o:['B1','$B$1','B$1','$B1'],a:1,e:'$B$1 khóa cả cột B và dòng 1.',lesson:'f04-formulas-references'},
    {id:'f-counta',skill:'foundation',q:'Cột Mã đơn có cả chữ và số. Cần đếm số ô đã có dữ liệu. Hàm nào phù hợp?',o:['COUNT','COUNTA','SUM','MAX'],a:1,e:'COUNTA đếm mọi ô không trống.',lesson:'f05-core-functions'},
    {id:'c-trim',skill:'cleaning',q:'Tên nhân viên có khoảng trắng thừa ở đầu, cuối và giữa từ. Dùng gì?',o:['TRIM','ROUND','COUNTIF','SORT'],a:0,e:'TRIM loại khoảng trắng thừa.',lesson:'s10-text'},
    {id:'c-type',skill:'cleaning',q:'Doanh thu nhìn như số nhưng SUM ra 0 vì dữ liệu đang là text. Việc nên làm trước?',o:['Đổi màu','Chuyển kiểu dữ liệu về số','Merge Cells','Ẩn cột'],a:1,e:'Chuẩn hóa kiểu dữ liệu trước khi tính.',lesson:'s12-clean-control'},
    {id:'fm-sumifs',skill:'formula',q:'Tính doanh thu Cửa hàng A trong tháng 8 với điều kiện Cửa hàng và Ngày. Hàm nào phù hợp?',o:['SUM','SUMIF','SUMIFS','COUNTIFS'],a:2,e:'SUMIFS cộng theo nhiều điều kiện.',lesson:'s08-conditional-aggregation'},
    {id:'fm-xlookup',skill:'formula',q:'Tìm Đơn giá theo Mã SP, cột trả về có thể nằm bên trái hoặc bên phải. Chọn gì?',o:['XLOOKUP','LEFT','COUNT','SUBTOTAL'],a:0,e:'XLOOKUP tra cứu linh hoạt hai phía.',lesson:'s09-lookup'},
    {id:'a-pivot',skill:'analysis',q:'Có 50.000 dòng bán hàng, cần tổng doanh thu theo Tháng × Cửa hàng trong vài phút. Dùng gì?',o:['Tô màu','PivotTable','Merge Cells','Copy từng tháng'],a:1,e:'PivotTable phù hợp để tổng hợp nhanh dữ liệu lớn.',lesson:'a14-pivottable'},
    {id:'a-grain',skill:'analysis',q:'Một đơn hàng có 3 dòng sản phẩm. Đếm đơn bằng COUNT theo từng dòng sẽ thế nào?',o:['Luôn đúng','Có nguy cơ đếm trùng','Excel tự sửa','Chỉ sai định dạng'],a:1,e:'Phải xác định grain và đếm theo mã đơn duy nhất.',lesson:'a18-report-audit-handover'},
    {id:'d-line',skill:'dashboard',q:'Muốn nhìn xu hướng doanh thu 12 tháng nhanh nhất. Biểu đồ nào phù hợp?',o:['Line chart','Pie 12 lát','Radar','3D Pie'],a:0,e:'Line chart thể hiện xu hướng thời gian rõ nhất.',lesson:'a16-charts-pareto'},
    {id:'d-slicer',skill:'dashboard',q:'Dashboard cần đổi Cửa hàng mà không sửa công thức. Điều khiển nào phù hợp?',o:['Slicer','Merge Cells','WordArt','Comment'],a:0,e:'Slicer là bộ lọc trực quan cho Pivot/Dashboard.',lesson:'v24-slicer-timeline'},
    {id:'pq-append',skill:'powerquery',q:'Có 12 file cùng cấu trúc, mỗi file một tháng, cần nối thành một bảng dài. Dùng gì?',o:['Merge','Append / Combine','Conditional Formatting','Goal Seek'],a:1,e:'Append/Combine chồng bảng cùng schema theo chiều dọc.',lesson:'x22-power-query-multi-source'},
    {id:'pq-types',skill:'powerquery',q:'Sau import, cột Ngày và Doanh thu sai kiểu. Nên sửa lúc nào?',o:['Sau dashboard','Ngay trong Transform trước Load','Không cần','Chỉ đổi màu'],a:1,e:'Kiểu dữ liệu nên được sửa sớm trong Power Query.',lesson:'pq31-schema-types'},
    {id:'v-rec',skill:'vba',q:'Muốn tạo macro đầu tiên từ thao tác lặp mà chưa viết code. Bắt đầu bằng gì?',o:['Record Macro','PowerPoint','Goal Seek','PivotChart'],a:0,e:'Record Macro giúp quan sát Excel ghi thao tác thành VBA.',lesson:'x23-macro-vba'},
    {id:'v-select',skill:'vba',q:'VBA lặp 10.000 ô với Select/Activate liên tục thường gây gì?',o:['Nhanh hơn','Chậm và dễ lỗi ngữ cảnh','Chính xác hơn','Không ảnh hưởng'],a:1,e:'Nên thao tác trực tiếp lên object/range.',lesson:'vb37-performance-security'},
    {id:'w-check',skill:'workflow',q:'Trước khi gửi báo cáo KPI, bước nào không nên bỏ qua?',o:['Đổi font','Đối chiếu tổng với nguồn và filter','Thêm icon','Ẩn công thức'],a:1,e:'Validate/đối chiếu bắt buộc trước bàn giao.',lesson:'a19-reconciliation'},
    {id:'w-order',skill:'workflow',q:'Workflow báo cáo lặp lại bền vững nên theo thứ tự nào?',o:['Report → Input → Validate','Input → Transform → Calculate → Report → Validate → Deliver','Chart → Copy → Paste','Format → Merge → Print'],a:1,e:'Tách rõ Input, Transform, Calculate, Report, Validate, Deliver.',lesson:'x24-automation-workflow'}
  ];

  const CASES=[
    {id:'clean',skill:'cleaning',title:'Làm sạch bảng nhập liệu trước khi tính KPI',time:'15–20 phút',file:'downloads/Practice-Lab-V14-Datasets.zip',lesson:'s12-clean-control',tasks:['Tìm blank, duplicate và kiểu dữ liệu sai.','Chuẩn hóa text và ngày tháng.','Tạo bản dữ liệu sạch, giữ nguyên file nguồn.']},
    {id:'formula',skill:'formula',title:'Tính KPI bằng IF + SUMIFS',time:'15 phút',file:'downloads/if-countif-sumif-thuc-hanh.xlsx',lesson:'s08-conditional-aggregation',tasks:['Tính tổng theo điều kiện.','Gắn trạng thái Đạt/Chưa đạt.','Kiểm tra ít nhất 3 dòng bằng tính tay.']},
    {id:'pivot',skill:'analysis',title:'Từ dữ liệu bán hàng → Pivot báo cáo',time:'20 phút',file:'downloads/pivot-thuc-hanh.xlsx',lesson:'a14-pivottable',tasks:['Tạo Pivot đúng mục tiêu.','Chọn cách tổng hợp đúng KPI.','Đối chiếu Grand Total với nguồn.']},
    {id:'dashboard',skill:'dashboard',title:'Dashboard đọc được trong 30 giây',time:'20–25 phút',file:'downloads/pareto-thuc-hanh.xlsx',lesson:'a17-dashboard',tasks:['Giữ KPI chính.','Chọn biểu đồ đúng mục đích.','Người xem biết lọc ở đâu và kết luận gì.']},
    {id:'pq',skill:'powerquery',title:'Gộp nhiều file bằng Power Query',time:'25 phút',file:'downloads/PowerQuery-Practice-10-Files.zip',lesson:'x22-power-query-multi-source',tasks:['Kết nối nguồn.','Chuẩn hóa schema trước khi gộp.','Thêm file mới rồi Refresh, không copy/paste.']},
    {id:'qc',skill:'workflow',title:'QC: kiểm tra lỗi và bàn giao báo cáo',time:'20 phút',file:'downloads/bao-cao-qc.xlsx',lesson:'c41-qc-case',tasks:['Xác định lỗi cần theo dõi.','Tách dữ liệu nguồn và báo cáo.','Đối chiếu số cuối và ghi cách refresh.']}
  ];

  let diagIndex=0,diagAnswers={},dailyIndex=0,dailySet=[],caseId='';

  function completedLessons(){try{const a=JSON.parse(localStorage.getItem('avp_platform_completed_v2')||'[]');return new Set(Array.isArray(a)?a:[])}catch(_){return new Set()}}
  function profile(){return C.getProfile()}
  function recommendedSkill(){return profile()?.recommended||'foundation'}
  function recommendedLesson(){return C.skillMeta(recommendedSkill()).lesson}
  function resumeLesson(){return P?.resumeLessonId?.()||recommendedLesson()}

  function showPanel(name,scroll=false){
    document.querySelectorAll('.lc-tab').forEach(b=>b.classList.toggle('is-active',b.dataset.panel===name));
    document.querySelectorAll('.lc-panel').forEach(p=>p.classList.toggle('is-active',p.id===`panel-${name}`));
    if(name==='today')renderToday();
    if(name==='diagnostic')renderDiagnostic();
    if(name==='mistakes')renderMistakes();
    if(name==='cases')renderCasePanel();
    if(scroll)$(`panel-${name}`)?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function dailyQuestions(p){
    const skill=p?.recommended||'foundation';
    const own=QUESTIONS.filter(q=>q.skill===skill);
    const others=QUESTIONS.filter(q=>q.skill!==skill);
    const key=localDate();
    const pick=(arr,n,offset=0)=>{const out=[];let seed=[...key].reduce((a,c)=>a+c.charCodeAt(0),0)+offset;const pool=arr.slice();while(pool.length&&out.length<n){seed=(seed*9301+49297)%233280;out.push(pool.splice(seed%pool.length,1)[0])}return out};
    return [...pick(own,Math.min(2,own.length),7),...pick(others,1,23)].slice(0,3);
  }

  function renderToday(){
    const host=$('todayHost');if(!host)return;
    const p=profile();
    if(!p){
      host.innerHTML=`<section class="lc-focus"><div class="lc-focus-head"><div><span class="lc-label">BẮT ĐẦU Ở ĐÂY</span><h2>Kiểm tra trình độ trước</h2><p>16 câu, khoảng 5 phút. Xong là web biết nên cho bạn học từ đâu.</p></div><span class="lc-pill">Chưa có hồ sơ</span></div><button class="lc-btn blue" id="goDiagnostic" type="button">Kiểm tra 5 phút →</button></section>`;
      $('goDiagnostic')?.addEventListener('click',()=>showPanel('diagnostic',true));
      return;
    }
    const skill=p.recommended, meta=C.skillMeta(skill), lesson=meta.lesson, daily=C.getDaily()[localDate()]||{}, done=completedLessons().has(lesson), mistakes=C.unresolvedMistakes(), next=mistakes[0];
    dailySet=dailyQuestions(p);
    const completeCount=(done?1:0)+(daily.practiceDone?1:0)+((!next||daily.mistakeReviewed)?1:0);
    host.innerHTML=`<section class="lc-focus"><div class="lc-focus-head"><div><span class="lc-label">HÔM NAY · 10 PHÚT</span><h2>${esc(meta.name)}</h2><p>Chỉ 3 việc. Làm xong thì dừng; không cần đi tìm thêm nội dung.</p></div><span class="lc-pill">${completeCount} / 3 xong</span></div><div class="lc-plan">
      <div class="lc-step"><span>1</span><div><strong>${done?'Đã học bài đề xuất':'Học đúng bài cần nhất'}</strong><small>${esc(meta.name)} · bài phù hợp với kết quả kiểm tra.</small></div><a href="${C.lessonUrl(lesson)}">${done?'Mở lại':'Mở bài'} →</a></div>
      <div class="lc-step"><span>2</span><div><strong>Luyện 3 câu</strong><small>${daily.practiceDone?'Đã hoàn thành hôm nay.':'Sai sẽ tự ghi vào Sổ lỗi.'}</small></div><button id="startDaily" type="button" ${daily.practiceDone?'disabled':''}>${daily.practiceDone?'Đã xong':'Luyện ngay'}</button></div>
      <div class="lc-step"><span>3</span><div><strong>Ôn 1 lỗi cũ</strong><small>${next?`${esc(skillName(next.skill))} · sai ${next.count||1} lần`:'Không có lỗi đang chờ ôn.'}</small></div>${next?'<button id="openMistake" type="button">Ôn lỗi</button>':'<span></span>'}</div>
    </div><div id="dailyHost"></div><div class="lc-secondary-links"><a href="skill-map.html?browse=1">Tự chọn trong 42 bài</a><a href="practice-video.html">Khu thực hành</a><a href="excel-race.html">Arena</a></div></section>`;
    $('startDaily')?.addEventListener('click',()=>{dailyIndex=0;renderDailyQuestion()});
    $('openMistake')?.addEventListener('click',()=>showPanel('mistakes',true));
  }

  function renderDailyQuestion(){
    const host=$('dailyHost');if(!host)return;
    if(dailyIndex>=dailySet.length){C.markDaily(localDate(),{practiceDone:true});renderToday();return}
    const q=dailySet[dailyIndex];
    host.innerHTML=`<div class="lc-quiz"><div class="lc-quiz-meta"><span>Câu ${dailyIndex+1}/3</span><span>${esc(skillName(q.skill))}</span></div><h3>${esc(q.q)}</h3><div class="lc-options">${q.o.map((x,i)=>`<button class="lc-option" data-daily="${i}" type="button">${String.fromCharCode(65+i)}. ${esc(x)}</button>`).join('')}</div><div id="dailyFeedback"></div></div>`;
    host.querySelectorAll('[data-daily]').forEach(b=>b.addEventListener('click',()=>{
      const selected=Number(b.dataset.daily);host.querySelectorAll('[data-daily]').forEach((x,i)=>{x.disabled=true;x.classList.toggle('good',i===q.a);x.classList.toggle('bad',i===selected&&selected!==q.a)});
      if(selected!==q.a)C.logMistake({source:'daily',skill:q.skill,concept:q.id,prompt:q.q,chosen:q.o[selected],correct:q.o[q.a],explain:q.e,lessonId:q.lesson,url:location.href});
      $('dailyFeedback').innerHTML=`<div class="lc-feedback ${selected===q.a?'good':'bad'}"><strong>${selected===q.a?'Đúng.':'Chưa đúng.'}</strong> ${esc(q.e)}</div><div class="lc-next"><button class="lc-btn" id="dailyNext" type="button">${dailyIndex===2?'Hoàn thành':'Câu tiếp theo'} →</button></div>`;
      $('dailyNext')?.addEventListener('click',()=>{dailyIndex++;renderDailyQuestion()},{once:true});
    },{once:true}));
  }

  function scoreDiagnostic(){
    const scores={};skillOrder.forEach(s=>{const qs=QUESTIONS.filter(q=>q.skill===s),correct=qs.filter(q=>diagAnswers[q.id]===q.a).length;scores[s]={correct,total:qs.length,pct:Math.round(correct/qs.length*100)}});
    const overall=Math.round(Object.values(scores).reduce((n,x)=>n+x.correct,0)/QUESTIONS.length*100);
    const recommended=skillOrder.find(s=>scores[s].pct<70)||skillOrder[Math.min(skillOrder.length-1,Math.floor(overall/14))]||'foundation';
    return {overall,scores,recommended,completedAt:new Date().toISOString()};
  }

  function renderDiagnostic(){
    const host=$('diagnosticHost');if(!host)return;
    const p=profile();
    if(p&&!Object.keys(diagAnswers).length){renderDiagnosticResult(p);return}
    if(diagIndex>=QUESTIONS.length){const result=scoreDiagnostic();C.setProfile(result);diagIndex=0;diagAnswers={};renderDiagnosticResult(result);renderToday();return}
    const q=QUESTIONS[diagIndex];
    host.innerHTML=`<div class="lc-quiz"><div class="lc-quiz-meta"><span>Câu ${diagIndex+1} / ${QUESTIONS.length}</span><span>${esc(skillName(q.skill))}</span></div><h3>${esc(q.q)}</h3><div class="lc-options">${q.o.map((x,i)=>`<button class="lc-option" data-diag="${i}" type="button">${String.fromCharCode(65+i)}. ${esc(x)}</button>`).join('')}</div><div id="diagFeedback"></div></div>`;
    host.querySelectorAll('[data-diag]').forEach(b=>b.addEventListener('click',()=>{
      const selected=Number(b.dataset.diag);diagAnswers[q.id]=selected;host.querySelectorAll('[data-diag]').forEach((x,i)=>{x.disabled=true;x.classList.toggle('good',i===q.a);x.classList.toggle('bad',i===selected&&selected!==q.a)});
      $('diagFeedback').innerHTML=`<div class="lc-feedback ${selected===q.a?'good':'bad'}"><strong>${selected===q.a?'Đúng.':'Chưa đúng.'}</strong> ${esc(q.e)}</div><div class="lc-next"><button class="lc-btn" id="diagNext" type="button">Câu tiếp theo →</button></div>`;
      $('diagNext')?.addEventListener('click',()=>{diagIndex++;renderDiagnostic()},{once:true});
    },{once:true}));
  }

  function renderDiagnosticResult(p){
    const host=$('diagnosticHost');if(!host)return;const meta=C.skillMeta(p.recommended);
    host.innerHTML=`<div class="lc-panel-card"><h2>Kết quả: ${p.overall}%</h2><p>Nên bắt đầu từ <strong>${esc(meta.name)}</strong>. Đây là gợi ý học, không phải xếp hạng.</p><div class="lc-result">${skillOrder.map(s=>{const x=p.scores?.[s]||{pct:0};return `<div class="lc-skill"><strong>${esc(skillName(s))}</strong><span class="lc-track"><i style="width:${Math.max(3,x.pct||0)}%"></i></span><b>${x.pct||0}%</b></div>`}).join('')}</div><a class="lc-btn blue" href="${C.lessonUrl(meta.lesson)}">Học bài được đề xuất →</a><br><button class="lc-reset" id="resetDiag" type="button">Làm lại kiểm tra</button></div>`;
    $('resetDiag')?.addEventListener('click',()=>{C.resetProfile();diagIndex=0;diagAnswers={};renderDiagnostic();renderToday()});
  }

  function renderMistakes(){
    const host=$('mistakesHost');if(!host)return;const rows=C.unresolvedMistakes();$('mistakeBadge').textContent=rows.length;
    if(!rows.length){host.innerHTML='<div class="lc-empty">Chưa có lỗi cần ôn. Sai ở bài lý thuyết, Arena, bộ luyện hoặc bài tự chấm sẽ tự xuất hiện ở đây.</div>';return}
    host.innerHTML=`<div class="lc-mistakes">${rows.slice(0,20).map(r=>`<article class="lc-mistake"><div class="lc-mistake-top"><strong>${esc(skillName(r.skill))}</strong><em>${r.count||1} lần</em></div><p>${esc(r.prompt||r.concept)}${r.correct?`<br><b>Đúng:</b> ${esc(r.correct)}`:''}</p><div class="lc-mistake-actions"><a href="${C.lessonUrl(r.lessonId||C.skillMeta(r.skill).lesson)}">Học lại</a><button type="button" data-resolve="${esc(r.id)}">Đã hiểu</button></div></article>`).join('')}</div>`;
    host.querySelectorAll('[data-resolve]').forEach(b=>b.addEventListener('click',()=>{C.resolveMistake(b.dataset.resolve,true);C.markDaily(localDate(),{mistakeReviewed:true});renderMistakes();renderToday()}));
  }

  function renderCasePanel(){
    const host=$('casesHost');if(!host)return;const preferred=recommendedSkill();
    if(!caseId){caseId=(CASES.find(c=>c.skill===preferred)||CASES[0]).id}
    const c=CASES.find(x=>x.id===caseId)||CASES[0];
    host.innerHTML=`<div class="lc-case-picker"><select id="caseSelect" aria-label="Chọn case">${CASES.map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${esc(x.title)}</option>`).join('')}</select></div><article class="lc-case"><div class="lc-case-head"><h3>${esc(c.title)}</h3><span>${esc(c.time)}</span></div><ul>${c.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><div class="lc-case-actions"><a href="${c.file}" download>Tải file</a><a href="${C.lessonUrl(c.lesson)}">Xem bài liên quan</a><button type="button" id="caseDone">Đánh dấu đã làm</button></div></article>`;
    $('caseSelect')?.addEventListener('change',e=>{caseId=e.target.value;renderCasePanel()});
    $('caseDone')?.addEventListener('click',()=>{C.markCase(c.id,{done:true});$('caseDone').textContent='Đã hoàn thành';$('caseDone').disabled=true});
    const done=C.getCases()?.[c.id]?.done;if(done){$('caseDone').textContent='Đã hoàn thành';$('caseDone').disabled=true}
  }

  function boot(){
    document.querySelectorAll('.lc-tab').forEach(b=>b.addEventListener('click',()=>showPanel(b.dataset.panel,true)));
    window.addEventListener('avp:coach-mistakes-changed',()=>{renderMistakes();renderToday()});
    showPanel('today');renderMistakes();renderCasePanel();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
