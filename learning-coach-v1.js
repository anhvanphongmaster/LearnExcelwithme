(() => {
  'use strict';
  const C=window.AVPLearningCoach;
  const P=window.AVPLearningPlatform;
  if(!C)return;
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  const QUESTIONS=[
    {id:'f-ref',skill:'foundation',q:'Bạn sao chép công thức xuống nhiều dòng nhưng ô chứa thuế suất ở B1 phải luôn cố định. Tham chiếu nào đúng?',o:['B1','$B$1','B$1','$B1'],a:1,e:'$B$1 khóa cả cột B và dòng 1 khi sao chép công thức.',lesson:'f04-formulas-references'},
    {id:'f-counta',skill:'foundation',q:'Cột Mã đơn có cả chữ và số. Bạn cần đếm bao nhiêu ô đã có dữ liệu. Hàm phù hợp nhất?',o:['COUNT','COUNTA','SUM','MAX'],a:1,e:'COUNTA đếm mọi ô không trống; COUNT chỉ đếm ô chứa số.',lesson:'f05-core-functions'},
    {id:'c-trim',skill:'cleaning',q:'Tên nhân viên có khoảng trắng thừa ở đầu, cuối và giữa các từ. Bước xử lý phù hợp nhất?',o:['TRIM','ROUND','COUNTIF','SORT'],a:0,e:'TRIM loại khoảng trắng thừa và giữ một khoảng trắng giữa các từ.',lesson:'s10-text'},
    {id:'c-numbertext',skill:'cleaning',q:'Cột Doanh thu nhìn giống số nhưng SUM ra 0 vì dữ liệu đang là text. Việc nên làm trước?',o:['Đổi màu ô','Chuyển kiểu dữ liệu về số','Merge Cells','Ẩn cột'],a:1,e:'Phải chuẩn hóa kiểu dữ liệu trước khi tính toán.',lesson:'s12-clean-control'},
    {id:'fm-sumifs',skill:'formula',q:'Bạn cần tính doanh thu của Cửa hàng A trong tháng 8 với hai điều kiện Cửa hàng và Ngày. Hàm nào phù hợp nhất?',o:['SUM','SUMIF','SUMIFS','COUNTIFS'],a:2,e:'SUMIFS cộng theo nhiều điều kiện cùng lúc.',lesson:'s08-conditional-aggregation'},
    {id:'fm-xlookup',skill:'formula',q:'Bạn cần tìm Đơn giá theo Mã SP và cột trả về có thể nằm bên trái hoặc bên phải cột mã. Chọn công cụ phù hợp nhất?',o:['XLOOKUP','LEFT','COUNT','SUBTOTAL'],a:0,e:'XLOOKUP không bị giới hạn cột trả về phải nằm bên phải như VLOOKUP.',lesson:'s09-lookup'},
    {id:'a-pivot',skill:'analysis',q:'Bạn có 50.000 dòng bán hàng và cần xem tổng doanh thu theo Tháng × Cửa hàng trong vài phút. Cách phù hợp nhất?',o:['Tô màu từng dòng','PivotTable','Merge Cells','Copy từng tháng sang sheet riêng'],a:1,e:'PivotTable phù hợp để tổng hợp nhanh dữ liệu lớn theo nhiều chiều.',lesson:'a14-pivottable'},
    {id:'a-grain',skill:'analysis',q:'Bảng đơn hàng có 1 đơn bị lặp thành 3 dòng chi tiết sản phẩm. Nếu đếm số đơn bằng COUNT trên từng dòng sẽ xảy ra gì?',o:['Đúng tuyệt đối','Có nguy cơ đếm trùng','Excel tự sửa','Chỉ sai định dạng'],a:1,e:'Phải xác định grain và khóa đếm theo mã đơn duy nhất để tránh double-count.',lesson:'a18-report-audit-handover'},
    {id:'d-trend',skill:'dashboard',q:'Bạn muốn người xem nhận ra xu hướng doanh thu 12 tháng nhanh nhất. Loại biểu đồ phù hợp?',o:['Line chart','Pie chart 12 lát','Radar','3D Pie'],a:0,e:'Line chart thể hiện xu hướng theo thời gian rõ nhất.',lesson:'a16-charts-pareto'},
    {id:'d-slicer',skill:'dashboard',q:'Dashboard cần cho người dùng đổi Cửa hàng mà không sửa công thức. Điều khiển nào phù hợp với Pivot/Dashboard?',o:['Slicer','Merge Cells','WordArt','Comment'],a:0,e:'Slicer tạo bộ lọc trực quan và rõ trạng thái lọc.',lesson:'v24-slicer-timeline'},
    {id:'pq-append',skill:'powerquery',q:'Bạn có 12 file bán hàng cùng cấu trúc, mỗi file là một tháng và muốn nối thành một bảng dài. Dùng gì?',o:['Merge','Append / Combine','Conditional Formatting','Goal Seek'],a:1,e:'Append/Combine dùng để chồng các bảng cùng schema theo chiều dọc.',lesson:'x22-power-query-multi-source'},
    {id:'pq-types',skill:'powerquery',q:'Sau khi import dữ liệu, cột Ngày và Doanh thu đang nhận sai kiểu. Nên xử lý lúc nào?',o:['Sau khi làm dashboard xong','Ngay trong bước transform trước khi load','Không cần','Chỉ đổi màu cột'],a:1,e:'Kiểu dữ liệu là nền của filter, tính toán và refresh; nên sửa sớm trong Power Query.',lesson:'pq31-schema-types'},
    {id:'v-rec',skill:'vba',q:'Bạn có thao tác định dạng lặp lại mỗi ngày và muốn tạo macro đầu tiên mà chưa viết code. Cách bắt đầu hợp lý?',o:['Record Macro','PowerPoint','Goal Seek','PivotChart'],a:0,e:'Record Macro là cách an toàn để nhìn Excel ghi lại thao tác thành VBA trước khi tự viết.',lesson:'x23-macro-vba'},
    {id:'v-select',skill:'vba',q:'Trong VBA, đoạn code lặp qua 10.000 ô dùng Select/Activate liên tục thường gây vấn đề gì?',o:['Nhanh hơn','Chậm và dễ lỗi ngữ cảnh','Tăng độ chính xác','Không ảnh hưởng'],a:1,e:'Code nên thao tác trực tiếp lên object/range thay vì Select/Activate.',lesson:'vb37-performance-security'},
    {id:'w-validate',skill:'workflow',q:'Trước khi gửi báo cáo KPI cho khách, bước nào không nên bỏ qua?',o:['Đổi font lần cuối','Đối chiếu tổng số với nguồn và kiểm tra filter','Chèn thêm icon','Ẩn tất cả công thức'],a:1,e:'Validate/đối chiếu là bước bắt buộc trước bàn giao để tránh báo cáo đẹp nhưng sai số.',lesson:'a19-reconciliation'},
    {id:'w-order',skill:'workflow',q:'Workflow bền vững cho báo cáo lặp lại nên theo thứ tự nào?',o:['Report → Input → Validate','Input → Transform → Calculate → Report → Validate → Deliver','Chart → Copy → Paste → gửi','Format → Merge → Print'],a:1,e:'Tách rõ Input, Transform, Calculate, Report, Validate và Deliver giúp dễ refresh và audit.',lesson:'x24-automation-workflow'}
  ];

  const CASES=[
    {id:'case-clean',title:'Làm sạch bảng nhập liệu trước khi tính KPI',time:'15–20 phút',skill:'cleaning',file:'downloads/Practice-Lab-V14-Datasets.zip',lesson:'s12-clean-control',tasks:['Phát hiện blank/duplicate/kiểu dữ liệu sai.','Chuẩn hóa text và ngày tháng.','Tạo bản dữ liệu sạch, không sửa trực tiếp file nguồn.']},
    {id:'case-formula',title:'Tính KPI bằng IF + SUMIFS',time:'15 phút',skill:'formula',file:'downloads/if-countif-sumif-thuc-hanh.xlsx',lesson:'s08-conditional-aggregation',tasks:['Tính tổng theo điều kiện.','Gắn trạng thái Đạt/Chưa đạt.','Kiểm tra ít nhất 3 dòng bằng tính tay.']},
    {id:'case-pivot',title:'Từ dữ liệu bán hàng → Pivot báo cáo',time:'20 phút',skill:'analysis',file:'downloads/pivot-thuc-hanh.xlsx',lesson:'a14-pivottable',tasks:['Tạo Pivot theo nhóm cần phân tích.','Đổi cách tổng hợp đúng với KPI.','Đối chiếu Grand Total với dữ liệu nguồn.']},
    {id:'case-dashboard',title:'Biến báo cáo thành dashboard đọc trong 30 giây',time:'20–25 phút',skill:'dashboard',file:'downloads/pareto-thuc-hanh.xlsx',lesson:'a17-dashboard',tasks:['Chọn KPI chính, không nhồi quá nhiều biểu đồ.','Dùng biểu đồ đúng loại cho xu hướng/so sánh.','Người xem phải biết lọc ở đâu và đọc kết luận gì.']},
    {id:'case-pq',title:'Gộp nhiều file bằng Power Query',time:'25 phút',skill:'powerquery',file:'downloads/PowerQuery-Practice-10-Files.zip',lesson:'x22-power-query-multi-source',tasks:['Kết nối folder/file nguồn.','Chuẩn hóa schema trước khi gộp.','Refresh lại sau khi thêm file mới mà không copy/paste tay.']},
    {id:'case-qc',title:'QC: kiểm tra lỗi và bàn giao báo cáo',time:'20 phút',skill:'workflow',file:'downloads/bao-cao-qc.xlsx',lesson:'c41-qc-case',tasks:['Xác định lỗi cần theo dõi.','Tách dữ liệu nguồn và phần báo cáo.','Đối chiếu số cuối, ghi rõ cách refresh/bàn giao.']}
  ];

  const skillOrder=['foundation','cleaning','formula','analysis','dashboard','powerquery','vba','workflow'];
  const skillName=s=>C.skillMeta(s).name;
  const today=()=>new Date().toISOString().slice(0,10);
  const hash=s=>{let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
  const deterministic=(arr,key,count)=>{
    const pool=arr.slice();let seed=hash(key);const out=[];
    while(pool.length&&out.length<count){seed=(seed*1664525+1013904223)>>>0;out.push(pool.splice(seed%pool.length,1)[0])}
    return out;
  };

  let diagIndex=0,diagAnswers={},dailyIndex=0,dailySet=[];

  function scoreProfile(){
    const scores={};
    skillOrder.forEach(skill=>{
      const qs=QUESTIONS.filter(q=>q.skill===skill);const ok=qs.filter(q=>diagAnswers[q.id]===q.a).length;
      scores[skill]={correct:ok,total:qs.length,pct:Math.round(ok/qs.length*100)};
    });
    const overall=Math.round(Object.values(scores).reduce((a,x)=>a+x.correct,0)/QUESTIONS.length*100);
    const weak=skillOrder.filter(s=>scores[s].pct<70);
    const recommended=weak[0]||skillOrder[Math.min(skillOrder.length-1,Math.max(0,Math.floor(overall/15)))];
    return {overall,scores,recommended,completedAt:new Date().toISOString()};
  }

  function renderDiagnostic(){
    const host=$('diagnosticHost'); if(!host)return;
    const profile=C.getProfile();
    if(diagIndex>=QUESTIONS.length){
      const p=scoreProfile();C.setProfile(p);renderDiagnosticResult(p);renderFocus();return;
    }
    if(profile&&!Object.keys(diagAnswers).length){renderDiagnosticResult(profile);return}
    const q=QUESTIONS[diagIndex];
    host.innerHTML=`<div class="coach-quiz-card"><div class="coach-quiz-meta"><span>Câu ${diagIndex+1} / ${QUESTIONS.length}</span><span>${esc(skillName(q.skill))}</span></div><h3>${esc(q.q)}</h3><div class="coach-options">${q.o.map((x,i)=>`<button class="coach-option" type="button" data-diag="${i}">${String.fromCharCode(65+i)}. ${esc(x)}</button>`).join('')}</div><div class="coach-feedback" id="diagFeedback" hidden></div><div class="coach-quiz-actions"><button type="button" id="diagNext" hidden>Câu tiếp theo →</button></div></div>`;
    host.querySelectorAll('[data-diag]').forEach(btn=>btn.addEventListener('click',()=>{
      if(diagAnswers[q.id]!==undefined)return;
      const selected=Number(btn.dataset.diag);diagAnswers[q.id]=selected;
      host.querySelectorAll('[data-diag]').forEach((b,i)=>{b.disabled=true;b.classList.toggle('is-correct',i===q.a);b.classList.toggle('is-wrong',i===selected&&selected!==q.a)});
      const fb=$('diagFeedback');fb.hidden=false;fb.className=`coach-feedback ${selected===q.a?'good':'bad'}`;fb.innerHTML=`<strong>${selected===q.a?'Đúng.':'Chưa đúng.'}</strong> ${esc(q.e)}`;
      const n=$('diagNext');n.hidden=false;n.addEventListener('click',()=>{diagIndex++;renderDiagnostic()},{once:true});
    }));
  }

  function renderDiagnosticResult(profile){
    const host=$('diagnosticHost');if(!host)return;
    const meta=C.skillMeta(profile.recommended);
    host.innerHTML=`<div class="coach-quiz-card"><div class="coach-quiz-meta"><span>Kết quả gần nhất</span><span>${profile.overall}% tổng thể</span></div><h3>Nên bắt đầu từ: ${esc(meta.name)}</h3><div class="coach-result">${skillOrder.map(s=>{const x=profile.scores?.[s]||{pct:0};return `<div class="coach-skill-row"><strong>${esc(skillName(s))}</strong><span class="coach-track"><i style="width:${Math.max(3,x.pct||0)}%"></i></span><b>${x.pct||0}%</b></div>`}).join('')}</div><a class="coach-primary" href="${C.lessonUrl(meta.lesson)}">Học bài được đề xuất →</a><br><button type="button" class="coach-reset" id="resetDiagnostic">Làm lại kiểm tra trình độ</button></div>`;
    $('resetDiagnostic')?.addEventListener('click',()=>{C.resetProfile();diagIndex=0;diagAnswers={};renderDiagnostic();renderFocus()});
  }

  function dailyQuestions(profile){
    const weak=skillOrder.slice().sort((a,b)=>(profile.scores?.[a]?.pct??100)-(profile.scores?.[b]?.pct??100));
    let pool=[];weak.slice(0,3).forEach(s=>pool.push(...QUESTIONS.filter(q=>q.skill===s)));
    if(pool.length<3)pool=QUESTIONS.slice();
    return deterministic(pool,`${today()}-${profile.recommended}`,3);
  }

  function renderFocus(){
    const profile=C.getProfile();
    if(!profile){
      $('coachFocusTitle').textContent='Kiểm tra trình độ trước khi học';
      $('coachFocusText').textContent='5 phút để biết nên bắt đầu ở đâu. Sau đó web mới đưa bài và câu luyện phù hợp.';
      $('coachStatus').textContent='Bước 1 / 1';
      $('coachFocusBody').innerHTML='<button type="button" class="coach-primary" id="openDiagnostic">Bắt đầu kiểm tra 5 phút →</button>';
      $('openDiagnostic')?.addEventListener('click',()=>{const d=$('diagnosticDrawer');d.open=true;renderDiagnostic();d.scrollIntoView({behavior:'smooth',block:'start'})});
      return;
    }
    const daily=C.getDaily()[today()]||{};dailySet=dailyQuestions(profile);
    const meta=C.skillMeta(profile.recommended);const mistakes=C.unresolvedMistakes();const nextMistake=mistakes[0];
    const donePractice=!!daily.practiceDone,doneReview=!nextMistake||!!daily.mistakeReviewed;
    const doneCount=(donePractice?1:0)+(doneReview?1:0);$('coachStatus').textContent=`Hôm nay ${doneCount}/2`;
    $('coachFocusTitle').textContent=doneCount===2?'Hôm nay đã đủ. Dừng đúng lúc.':`Ưu tiên: ${meta.name}`;
    $('coachFocusText').textContent=doneCount===2?'Ngày mai web sẽ đổi bộ luyện. Muốn học thêm thì mở Case thực chiến bên dưới.':'Một bài đúng chỗ + 3 câu luyện + 1 lỗi cũ. Không cần mở thêm khu khác.';
    $('coachFocusBody').innerHTML=`<div class="coach-plan">
      <div class="coach-plan-step"><span>1</span><div><strong>Học đúng bài yếu nhất</strong><small>${esc(meta.name)} · bắt đầu ở bài phù hợp với kết quả kiểm tra.</small></div><a href="${C.lessonUrl(meta.lesson)}">Mở bài học →</a></div>
      <div class="coach-plan-step"><span>2</span><div><strong>Luyện 3 câu hôm nay</strong><small>${donePractice?'Đã hoàn thành bộ luyện hôm nay.':'Câu ngắn, có giải thích; sai sẽ tự vào Sổ lỗi.'}</small></div><button type="button" id="startDaily" ${donePractice?'disabled':''}>${donePractice?'Đã xong':'Luyện ngay'}</button></div>
      <div class="coach-plan-step"><span>3</span><div><strong>Ôn 1 lỗi cũ</strong><small>${nextMistake?`${esc(skillName(nextMistake.skill))} · đã sai ${nextMistake.count||1} lần`:'Chưa có lỗi cần ôn. Khi sai ở bài học/Arena, lỗi sẽ xuất hiện ở đây.'}</small></div>${nextMistake?`<button type="button" id="reviewMistake">Ôn lỗi</button>`:'<span></span>'}</div>
    </div><div id="dailyHost"></div>`;
    $('startDaily')?.addEventListener('click',()=>{dailyIndex=0;renderDailyQuestion()});
    $('reviewMistake')?.addEventListener('click',()=>{const d=$('mistakesDrawer');d.open=true;renderMistakes();d.scrollIntoView({behavior:'smooth',block:'start'})});
  }

  function renderDailyQuestion(){
    const host=$('dailyHost');if(!host||dailyIndex>=dailySet.length){C.markDaily(today(),{practiceDone:true});renderFocus();return}
    const q=dailySet[dailyIndex];
    host.innerHTML=`<div class="coach-quiz-card"><div class="coach-quiz-meta"><span>Luyện ${dailyIndex+1} / ${dailySet.length}</span><span>${esc(skillName(q.skill))}</span></div><h3>${esc(q.q)}</h3><div class="coach-options">${q.o.map((x,i)=>`<button class="coach-option" type="button" data-daily="${i}">${String.fromCharCode(65+i)}. ${esc(x)}</button>`).join('')}</div><div class="coach-feedback" id="dailyFeedback" hidden></div><div class="coach-quiz-actions"><button type="button" id="dailyNext" hidden>${dailyIndex===dailySet.length-1?'Hoàn thành':'Câu tiếp theo →'}</button></div></div>`;
    host.querySelectorAll('[data-daily]').forEach(btn=>btn.addEventListener('click',()=>{
      if(btn.closest('.coach-options').dataset.locked)return;btn.closest('.coach-options').dataset.locked='1';
      const selected=Number(btn.dataset.daily);host.querySelectorAll('[data-daily]').forEach((b,i)=>{b.disabled=true;b.classList.toggle('is-correct',i===q.a);b.classList.toggle('is-wrong',i===selected&&selected!==q.a)});
      if(selected!==q.a)C.logMistake({source:'daily',skill:q.skill,concept:q.id,prompt:q.q,correct:q.o[q.a],chosen:q.o[selected],explain:q.e,lessonId:q.lesson});
      const fb=$('dailyFeedback');fb.hidden=false;fb.className=`coach-feedback ${selected===q.a?'good':'bad'}`;fb.innerHTML=`<strong>${selected===q.a?'Đúng.':'Chưa đúng.'}</strong> ${esc(q.e)}`;
      const n=$('dailyNext');n.hidden=false;n.addEventListener('click',()=>{dailyIndex++;renderDailyQuestion()},{once:true});
    }));
  }

  function renderMistakes(){
    const host=$('mistakesHost');if(!host)return;const rows=C.getMistakes();const unresolved=rows.filter(x=>!x.resolved);$('mistakeCount').textContent=unresolved.length;
    if(!rows.length){host.innerHTML='<p class="coach-subcopy">Chưa có lỗi nào. Khi bạn trả lời sai trong bài lý thuyết, Arena hoặc bộ luyện hôm nay, lỗi sẽ được ghi ở đây.</p>';return}
    host.innerHTML=rows.slice(0,30).map(x=>`<article class="coach-mistake ${x.resolved?'coach-resolved':''}" data-mid="${esc(x.id)}"><div class="coach-mistake-top"><strong>${esc(skillName(x.skill))} · ${esc(x.concept)}</strong><em>${x.resolved?'Đã ôn':`Sai ${x.count||1} lần`}</em></div><p>${esc(x.prompt||'Nội dung cần ôn lại.')}</p>${x.correct?`<p><b>Đáp án/ý đúng:</b> ${esc(x.correct)}${x.explain?` · ${esc(x.explain)}`:''}</p>`:''}<div class="coach-mistake-actions">${x.lessonId?`<a href="${C.lessonUrl(x.lessonId)}">Học lại đúng bài</a>`:''}<button type="button" data-resolve="${esc(x.id)}">${x.resolved?'Mở lại':'Đã hiểu · đánh dấu đã ôn'}</button></div></article>`).join('');
    host.querySelectorAll('[data-resolve]').forEach(btn=>btn.addEventListener('click',()=>{const row=C.getMistakes().find(x=>x.id===btn.dataset.resolve);C.resolveMistake(btn.dataset.resolve,!row?.resolved);C.markDaily(today(),{mistakeReviewed:true});renderMistakes();renderFocus()}));
  }

  function renderCases(){
    const host=$('casesHost');if(!host)return;const state=C.getCases();
    host.innerHTML=CASES.map(c=>`<details class="coach-case"><summary>${state[c.id]?.done?'✓ ':''}${esc(c.title)} · ${esc(c.time)}</summary><div class="coach-case-body"><strong>Đầu ra cần có:</strong><ul>${c.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><div class="coach-case-actions"><a href="${esc(c.file)}" download>Tải file</a><a href="${C.lessonUrl(c.lesson)}">Xem bài liên quan</a><button type="button" data-case-done="${c.id}">${state[c.id]?.done?'Đã hoàn thành':'Đánh dấu hoàn thành'}</button></div></div></details>`).join('');
    host.querySelectorAll('[data-case-done]').forEach(btn=>btn.addEventListener('click',()=>{const old=C.getCases()[btn.dataset.caseDone];C.markCase(btn.dataset.caseDone,{done:!old?.done});renderCases()}));
  }

  function openHash(){
    const id=location.hash.replace('#','');if(!id)return;const el=$(id);if(el?.tagName==='DETAILS')el.open=true;setTimeout(()=>el?.scrollIntoView({behavior:'smooth',block:'start'}),120);
  }
  function boot(){renderFocus();renderDiagnostic();renderMistakes();renderCases();openHash();window.addEventListener('avp:coach-mistakes-changed',()=>{renderMistakes();renderFocus()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
