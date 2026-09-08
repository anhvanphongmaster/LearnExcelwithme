(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  const DOMAIN_MODULES={
    input:{title:"Nhập liệu & Data Quality",modules:["Thiết kế cấu trúc nhập liệu","Validation & kiểm soát đầu vào","Phát hiện dữ liệu bất thường","Chuẩn hóa Master Data","Audit trail & bàn giao"]},
    sales:{title:"Sales & Commercial",modules:["Sales Data Model","Order & Revenue Control","Sales KPI Analysis","Target vs Actual","Traffic, Conversion & Handover"]},
    hr:{title:"Human Resources",modules:["Employee Master Control","Attendance & Shift","Overtime & Payroll Inputs","Headcount & Turnover","Workforce Performance"]},
    inventory:{title:"Inventory & Warehouse",modules:["Inventory Movement","Stock Reconciliation","Aging & Slow-moving","Replenishment Control","Warehouse Performance"]},
    qc:{title:"Quality Control",modules:["Inspection Data Structure","Yield & Defect Rate","Pareto & Root Cause","Lot & Shift Control","CAPA & Quality Report"]},
    pq:{title:"Power Query Workflow",modules:["Import & Data Types","Folder Combine","Append, Merge & Mapping","Reusable Transformations","Refresh & Control"]},
    dashboard:{title:"Reporting & Dashboard",modules:["KPI & Grain Definition","Pivot Analysis Model","Dashboard Layout","Filters & Interaction","Reconciliation & Handover"]},
    automation:{title:"Automation & Control",modules:["Process Mapping","Formula-based Automation","Refresh Workflow","Alerts & Exception Control","Protected Delivery"]}
  };
  const LEVELS=[{id:"basic",title:"Level 01 · Cơ bản ứng dụng"},{id:"intermediate",title:"Level 02 · Trung cấp"},{id:"advanced",title:"Level 03 · Nâng cao"},{id:"professional",title:"Professional · Case thực tế"}];
  const GRADING_BUCKET="professional-track-grading";
  const caseRows=new Map(),submissionRows=new Map();
  let catalogData=[],submissionData=[];
  let currentMode="applications";
  let currentReferenceCaseKey="";
  let currentReferenceExists=false;

  async function client(){
    for(let i=0;i<30;i++){
      const sb=window.avpSupabase||window.supabaseClient||null;
      if(sb?.rpc)return sb;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    return null;
  }
  const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  const fmt=ts=>{try{return ts?new Date(ts).toLocaleString("vi-VN"):"—"}catch(_){return "—"}};
  const appLabel=s=>s==="approved"?"Đã phê duyệt":s==="rejected"?"Cần bổ sung":"Đang chờ";
  const isAutoFeedback=value=>String(value||"").startsWith("[AUTO PRO ");
  const isAutoReview=value=>String(value||"").startsWith("[AUTO REVIEW]");
  const submissionLabel=(s,feedback)=>s==="graded"?(isAutoFeedback(feedback)?"Auto-Grader":"Đã chấm"):s==="revision"?"Cần nộp lại":isAutoReview(feedback)?"Cần Admin kiểm tra":"Đang xử lý";
  function errorBox(box,error){if(box)box.innerHTML=`<div class="admin-users-empty">Không tải được: ${esc(error?.message||error)}</div>`}

  async function refreshCounts(sb){
    try{
      const {data,error}=await sb.rpc("admin_professional_track_summary_v1");if(error)throw error;
      const s=data||{};$("aptPending").textContent=String(s.pending||0);$("aptApproved").textContent=String(s.approved||0);$("aptRejected").textContent=String(s.rejected||0);$("aptTotal").textContent=String(s.total||0);
      const badge=$("adminProfessionalPendingBadge"),n=Number(s.pending)||0;badge.textContent=String(n);badge.hidden=!n;
    }catch(error){console.warn("[Professional applications]",error)}
  }

  async function loadApplications(sb){
    const box=$("adminProfessionalList");box.innerHTML='<div class="admin-users-empty">Đang tải hồ sơ…</div>';
    try{
      const status=$("adminProfessionalStatus")?.value||null;
      const {data,error}=await sb.rpc("admin_professional_track_applications_v1",{p_status:status,p_limit:100});if(error)throw error;
      const rows=Array.isArray(data)?data:[];
      box.innerHTML=rows.length?rows.map(row=>`<article class="apt-item" data-app="${esc(row.id)}"><div class="apt-item-head"><div class="apt-person"><strong>${esc(row.display_name||"Học viên")}</strong><small>${esc(row.email||"")} · Nộp ${fmt(row.submitted_at)}</small></div><span class="apt-status ${esc(row.status)}">${appLabel(row.status)}</span></div><div class="apt-metrics"><span>Cơ bản<b>${Number(row.basic_score)||0} / 1500</b></span><span>Trung cấp<b>${Number(row.intermediate_score)||0} / 1300</b></span><span>Nâng cao<b>${Number(row.advanced_score)||0} / 1000</b></span><span>Hoạt động<b>${Number(row.active_days)||0} / 5 ngày</b></span></div>${row.applicant_note?`<div class="apt-notes"><strong>Học viên:</strong> ${esc(row.applicant_note)}</div>`:""}${row.admin_note?`<div class="apt-notes"><strong>Admin:</strong> ${esc(row.admin_note)}</div>`:""}<div class="apt-actions"><button type="button" data-cert="${esc(row.certificate_path)}">📎 Xem chứng chỉ</button>${row.status!=="approved"?'<button type="button" class="approve" data-review="approved">✓ Phê duyệt</button>':""}${row.status!=="rejected"?'<button type="button" class="reject" data-review="rejected">Yêu cầu bổ sung</button>':""}</div></article>`).join(""):'<div class="admin-users-empty">Không có hồ sơ phù hợp.</div>';
    }catch(error){errorBox(box,error)}
  }

  function fillDomainOptions(){
    $("aptCaseDomain").innerHTML=Object.entries(DOMAIN_MODULES).map(([id,item])=>`<option value="${esc(id)}">${esc(item.title)}</option>`).join("");
    $("aptCaseLevel").innerHTML=LEVELS.map(item=>`<option value="${esc(item.id)}">${esc(item.title)}</option>`).join("");fillModuleOptions();
    $("aptCatalogDomainFilter").innerHTML='<option value="">Tất cả lĩnh vực</option>'+Object.entries(DOMAIN_MODULES).map(([id,item])=>`<option value="${esc(id)}">${esc(item.title)}</option>`).join("");
    $("aptCatalogLevelFilter").innerHTML='<option value="">Tất cả Level</option>'+LEVELS.map(item=>`<option value="${esc(item.id)}">${esc(item.title)}</option>`).join("");
  }
  function fillModuleOptions(selected="1"){
    const domain=DOMAIN_MODULES[$("aptCaseDomain")?.value]||DOMAIN_MODULES.input;
    $("aptCaseModule").innerHTML=domain.modules.map((title,index)=>`<option value="${index+1}"${String(index+1)===String(selected)?" selected":""}>${index+1}. ${esc(title)}</option>`).join("");
  }
  function selectedCaseKey(){return `${$("aptCaseDomain").value}-${$("aptCaseModule").value}-${$("aptCaseLevel").value}-${$("aptCaseIndex").value}`}
  function validLink(value){const raw=String(value||"").trim();if(!raw)return true;if(/^https?:\/\//i.test(raw))return true;return !/^[a-z][a-z0-9+.-]*:/i.test(raw)&&!raw.startsWith("//")}
  function setReferenceState(text,state=""){
    const box=$("aptCaseGraderState");if(!box)return;box.textContent=text;box.className=`apt-grader-state${state?` ${state}`:""}`;
  }
  function clearReferenceState(text="Chưa kiểm tra Auto-Grader cho Case này."){
    currentReferenceCaseKey="";currentReferenceExists=false;
    if($("aptCaseReference"))$("aptCaseReference").value="";
    if($("aptCaseReferenceRemove"))$("aptCaseReferenceRemove").disabled=true;
    setReferenceState(text);
  }
  async function checkReference(sb,key=selectedCaseKey()){
    currentReferenceCaseKey=key;currentReferenceExists=false;
    setReferenceState("Đang kiểm tra file đáp án ẩn…");
    try{
      const {data,error}=await sb.storage.from(GRADING_BUCKET).list(key,{limit:20});
      if(error)throw error;
      currentReferenceExists=(Array.isArray(data)?data:[]).some(item=>item.name==="reference.xlsx");
      if($("aptCaseReferenceRemove"))$("aptCaseReferenceRemove").disabled=!currentReferenceExists;
      setReferenceState(currentReferenceExists?"✓ Auto-Grader sẵn sàng: đã có đáp án ẩn cho Case này.":"— Chưa có đáp án ẩn. Nếu học viên nộp, bài sẽ chuyển sang hàng chờ ngoại lệ.",currentReferenceExists?"ready":"warn");
    }catch(error){
      if($("aptCaseReferenceRemove"))$("aptCaseReferenceRemove").disabled=true;
      setReferenceState("Chưa kiểm tra được kho đáp án ẩn: "+String(error?.message||error),"error");
    }
  }
  async function uploadReference(sb,key,file){
    if(!file)return false;
    if(!/\.(xlsx|xlsm)$/i.test(file.name))throw new Error("Đáp án ẩn chỉ nhận XLSX hoặc XLSM.");
    if(file.size>20*1024*1024)throw new Error("File đáp án ẩn không được vượt quá 20 MB.");
    const path=`${key}/reference.xlsx`;
    const {error}=await sb.storage.from(GRADING_BUCKET).upload(path,file,{upsert:true,contentType:file.type||"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    if(error)throw error;
    currentReferenceCaseKey=key;currentReferenceExists=true;
    if($("aptCaseReferenceRemove"))$("aptCaseReferenceRemove").disabled=false;
    setReferenceState("✓ Đã cập nhật đáp án ẩn. Auto-Grader sẽ dùng file này cho lần nộp tiếp theo.","ready");
    return true;
  }
  async function removeReference(){
    const sb=await client();if(!sb)return alert("Chưa kết nối được hệ thống.");
    const key=selectedCaseKey();
    if(!confirm(`Xóa đáp án ẩn của ${key}? Bài nộp sau đó sẽ chuyển sang hàng chờ Admin cho tới khi có đáp án mới.`))return;
    const {error}=await sb.storage.from(GRADING_BUCKET).remove([`${key}/reference.xlsx`]);
    if(error)return alert("Chưa xóa được đáp án ẩn: "+error.message);
    currentReferenceCaseKey=key;currentReferenceExists=false;
    $("aptCaseReferenceRemove").disabled=true;
    setReferenceState("— Đã xóa đáp án ẩn. Auto-Grader tạm chưa sẵn sàng cho Case này.","warn");
  }
  function resetCaseForm(){$("aptCaseForm").reset();fillModuleOptions();$("aptCaseMaxScore").value="10";$("aptCaseSubmission").checked=true;clearReferenceState()}

  function editCase(key){
    const row=caseRows.get(key);if(!row)return;
    $("aptCaseDomain").value=row.domain_key;fillModuleOptions(String(row.module_index));$("aptCaseModule").value=String(row.module_index);$("aptCaseLevel").value=row.level_id;$("aptCaseIndex").value=String(row.case_index);
    $("aptCaseTitle").value=row.title||"";$("aptCaseGoal").value=row.goal||"";$("aptCaseTasks").value=(Array.isArray(row.tasks)?row.tasks:[]).join("\n");$("aptCaseSkills").value=row.skills||"";$("aptCaseOutput").value=row.expected_output||"";$("aptCaseDuration").value=row.duration||"";$("aptCaseMaxScore").value=String(Number(row.max_score)||10);$("aptCaseSourceUrl").value=row.source_url||"";$("aptCaseGuideUrl").value=row.guide_url||"";$("aptCaseSubmission").checked=row.submission_enabled!==false;$("aptCasePublished").checked=row.published===true;
    if($("aptCaseReference"))$("aptCaseReference").value="";
    setReferenceState("Đang kiểm tra file đáp án ẩn…");
    client().then(sb=>sb&&checkReference(sb,key));
    $("aptCaseForm").scrollIntoView({behavior:"smooth",block:"start"});
  }

  function copyCase(key){
    const row=caseRows.get(key);if(!row)return;
    const used=new Set(catalogData.filter(item=>item.domain_key===row.domain_key&&Number(item.module_index)===Number(row.module_index)&&item.level_id===row.level_id).map(item=>Number(item.case_index)));
    const target=[1,2,3].find(index=>!used.has(index));
    if(!target)return alert("Level này đã có đủ 3 Case. Hãy chọn Level hoặc nội dung khác trước khi nhân bản.");
    editCase(key);$("aptCaseIndex").value=String(target);$("aptCaseTitle").value=`${row.title} — Bản mới`;$("aptCasePublished").checked=false;
    clearReferenceState("Case mới chưa có đáp án ẩn. Hãy upload đáp án dành riêng cho vị trí Case này.");
    $("aptCaseTitle").focus();
  }

  async function saveCase(event){
    event.preventDefault();const sb=await client();if(!sb)return alert("Chưa kết nối được hệ thống.");
    const caseKey=selectedCaseKey();
    const source=$("aptCaseSourceUrl").value.trim(),guide=$("aptCaseGuideUrl").value.trim();if(!validLink(source)||!validLink(guide))return alert("Link không hợp lệ. Chỉ dùng HTTPS, HTTP hoặc đường dẫn file tương đối trong website.");if($("aptCasePublished").checked&&!source)return alert("Case phát hành phải có link file thực hành.");
    const tasks=$("aptCaseTasks").value.split(/\r?\n/).map(v=>v.trim()).filter(Boolean);if(!tasks.length)return alert("Hãy nhập ít nhất một yêu cầu thực hiện.");
    const referenceFile=$("aptCaseReference")?.files?.[0]||null;
    const referenceKnown=currentReferenceCaseKey===caseKey&&currentReferenceExists;
    if($("aptCasePublished").checked&&$("aptCaseSubmission").checked&&!referenceFile&&!referenceKnown){
      const go=confirm("Case này chưa xác nhận có đáp án ẩn Auto-Grader. Nếu vẫn phát hành, bài nộp sẽ vào hàng chờ Admin thay vì được tự chấm. Vẫn tiếp tục?");
      if(!go)return;
    }
    const button=$("aptCaseSave");button.disabled=true;button.textContent="Đang lưu…";
    let caseSaved=false;
    const params={p_case_key:caseKey,p_domain_key:$("aptCaseDomain").value,p_module_index:Number($("aptCaseModule").value),p_level_id:$("aptCaseLevel").value,p_case_index:Number($("aptCaseIndex").value),p_title:$("aptCaseTitle").value.trim(),p_goal:$("aptCaseGoal").value.trim(),p_tasks:tasks,p_skills:$("aptCaseSkills").value.trim()||null,p_expected_output:$("aptCaseOutput").value.trim()||null,p_duration:$("aptCaseDuration").value.trim()||null,p_max_score:Number($("aptCaseMaxScore").value)||10,p_source_url:source||null,p_guide_url:guide||null,p_submission_enabled:$("aptCaseSubmission").checked,p_published:$("aptCasePublished").checked};
    try{
      const {data,error}=await sb.rpc("admin_professional_track_case_upsert_v2",params);if(error)throw error;
      caseSaved=true;
      const row=Array.isArray(data)?data[0]:data;
      if(row){
        const index=catalogData.findIndex(item=>String(item.case_key)===caseKey);
        if(index>=0)catalogData[index]=row;else catalogData.unshift(row);
        caseRows.set(caseKey,row);renderCatalog();
      }else{await loadCatalog(sb)}
      if(referenceFile)await uploadReference(sb,caseKey,referenceFile);
      else if(currentReferenceCaseKey!==caseKey)await checkReference(sb,caseKey);
      if($("aptCaseReference"))$("aptCaseReference").value="";
      alert(params.p_published?(currentReferenceExists?"Đã phát hành Case · Auto-Grader sẵn sàng.":"Đã phát hành Case · chưa có Auto-Grader, bài sẽ vào hàng chờ ngoại lệ."):"Đã lưu Case ở trạng thái bản nháp.");
    }catch(error){alert((caseSaved?"Case đã lưu nhưng Auto-Grader chưa cập nhật được đáp án ẩn: ":"Chưa lưu được Case: ")+String(error?.message||error))}finally{button.disabled=false;button.textContent="Lưu Case"}
  }

  function renderCatalog(){
    const box=$("aptCatalogList"),search=String($("aptCatalogSearch")?.value||"").trim().toLowerCase(),domain=$("aptCatalogDomainFilter")?.value||"",level=$("aptCatalogLevelFilter")?.value||"",publish=$("aptCatalogPublishFilter")?.value||"";
    const rows=catalogData.filter(row=>(!search||`${row.title} ${row.goal} ${row.case_key}`.toLowerCase().includes(search))&&(!domain||row.domain_key===domain)&&(!level||row.level_id===level)&&(!publish||(publish==="published")===Boolean(row.published)));
    $("aptCatalogCount").textContent=`${rows.length}/${catalogData.length} Case`;
    box.innerHTML=rows.length?rows.map(row=>`<article class="apt-item apt-case-item"><div class="apt-item-head"><div class="apt-person"><strong>${esc(row.title)}</strong><small>${esc(DOMAIN_MODULES[row.domain_key]?.title||row.domain_key)} · Nội dung ${Number(row.module_index)||0} · ${esc(row.level_id)} · Case ${Number(row.case_index)||0}</small></div><span class="apt-status ${row.published?"approved":""}">${row.published?"Đã phát hành":"Bản nháp"}</span></div><p>${esc(row.goal||"")}</p><div class="apt-link-state"><span>${row.source_url?"✓ Có file thực hành":"— Chưa có file"}</span><span>${row.guide_url?"✓ Có hướng dẫn":"— Chưa có hướng dẫn"}</span><span>${row.submission_enabled?"✓ Cho phép nộp":"— Tắt nộp bài"}</span></div><div class="apt-actions"><button type="button" data-case-edit="${esc(row.case_key)}">Chỉnh sửa Case</button><button type="button" data-case-copy="${esc(row.case_key)}">Nhân bản sang ô trống</button></div></article>`).join(""):'<div class="admin-users-empty">Không có Case phù hợp bộ lọc.</div>';
  }

  async function loadCatalog(sb){
    const box=$("aptCatalogList");box.innerHTML='<div class="admin-users-empty">Đang tải Case…</div>';
    try{const {data,error}=await sb.rpc("admin_professional_track_case_list_v2");if(error)throw error;catalogData=Array.isArray(data)?data:[];caseRows.clear();catalogData.forEach(row=>caseRows.set(String(row.case_key),row));renderCatalog()}
    catch(error){errorBox(box,error)}
  }

  async function loadSubmissions(sb){
    const box=$("aptSubmissionList");box.innerHTML='<div class="admin-users-empty">Đang tải bài nộp…</div>';
    try{
      const status=$("aptSubmissionStatus")?.value||null;const {data,error}=await sb.rpc("admin_professional_track_submissions_v2",{p_status:status,p_limit:100});if(error)throw error;submissionData=Array.isArray(data)?data:[];submissionRows.clear();submissionData.forEach(row=>submissionRows.set(String(row.id),row));
      const pendingCount=submissionData.filter(row=>row.status==="pending").length;
      const badge=$("aptSubmissionBadge");if(badge){badge.textContent=String(pendingCount);badge.hidden=!pendingCount}
      box.innerHTML=submissionData.length?submissionData.map(row=>{
        const auto=isAutoFeedback(row.feedback),review=isAutoReview(row.feedback);
        const autoNote=auto?`<div class="apt-auto-note">✓ Bài này đã được Auto-Grader chấm. Admin chỉ cần mở khi có khiếu nại hoặc muốn kiểm tra lại.</div>`:review?`<div class="apt-auto-note review">⚠ Auto-Grader chưa đủ điều kiện kết luận. Đây là trường hợp cần Admin kiểm tra.</div>`:"";
        return `<article class="apt-item apt-submission-item" data-submission="${esc(row.id)}"><div class="apt-item-head"><div class="apt-person"><strong>${esc(row.display_name||"Học viên")}</strong><small>${esc(row.email||"")} · ${fmt(row.submitted_at)} · Lần nộp ${Number(row.attempt_count)||1}</small></div><span class="apt-status ${row.status==="graded"?"approved":row.status==="revision"?"rejected":""}">${submissionLabel(row.status,row.feedback)}</span></div><div class="apt-submission-case"><b>${esc(row.case_title||row.case_key)}</b><small>${esc(row.case_key)} · ${esc(row.original_name||"File bài làm")}</small>${row.note?`<p><strong>Ghi chú học viên:</strong> ${esc(row.note)}</p>`:""}</div>${autoNote}<div class="apt-grade-grid"><label><span>Điểm</span><input type="number" data-grade-score min="0" max="${Number(row.max_score)||10}" step="0.5" value="${row.score==null?"":Number(row.score)}"></label><label><span>Phản hồi</span><textarea data-grade-feedback rows="2" maxlength="1200">${esc(row.feedback||"")}</textarea></label></div><div class="apt-actions"><button type="button" data-open-submission="${esc(row.id)}">↓ Mở file bài làm</button><button type="button" class="approve" data-grade-action="graded">Lưu điểm</button><button type="button" class="reject" data-grade-action="revision">Yêu cầu nộp lại</button></div></article>`;
      }).join(""):'<div class="admin-users-empty">Không có bài nộp phù hợp.</div>';
    }catch(error){errorBox(box,error)}
  }

  async function openCertificate(path){if(!path)return alert("Hồ sơ chưa có file chứng chỉ.");const sb=await client();if(!sb)return;const {data,error}=await sb.storage.from("professional-track-certificates").createSignedUrl(path,120);if(error)return alert("Không mở được chứng chỉ: "+error.message);window.open(data.signedUrl,"_blank","noopener")}
  async function openSubmission(id){const row=submissionRows.get(String(id));if(!row)return;const sb=await client();if(!sb)return;const {data,error}=await sb.storage.from("professional-track-submissions").createSignedUrl(row.file_path,300);if(error)return alert("Không mở được file bài làm: "+error.message);window.open(data.signedUrl,"_blank","noopener")}
  async function reviewApplication(card,status){const sb=await client();if(!sb)return;const note=prompt(status==="approved"?"Ghi chú phê duyệt (có thể để trống):":"Nhập nội dung học viên cần bổ sung:");if(note===null)return;if(status==="rejected"&&!note.trim())return alert("Hãy nhập lý do cần bổ sung.");const {error}=await sb.rpc("admin_professional_track_review_v1",{p_application_id:card.dataset.app,p_status:status,p_admin_note:note.trim()||null});if(error)return alert("Chưa cập nhật được: "+error.message);await loadApplications(sb);await refreshCounts(sb)}
  async function gradeSubmission(card,status){const sb=await client();if(!sb)return;const id=card.dataset.submission,scoreInput=card.querySelector("[data-grade-score]"),feedback=card.querySelector("[data-grade-feedback]").value.trim(),score=status==="graded"?Number(scoreInput.value):null;if(status==="graded"&&(scoreInput.value===""||!Number.isFinite(score)))return alert("Hãy nhập điểm trước khi lưu.");if(status==="revision"&&!feedback)return alert("Hãy nhập lý do cần nộp lại.");const {error}=await sb.rpc("admin_professional_track_grade_v2",{p_submission_id:id,p_status:status,p_score:score,p_feedback:feedback||null});if(error)return alert("Chưa cập nhật được bài nộp: "+error.message);await loadSubmissions(sb)}

  function exportSubmissions(){
    if(!submissionData.length)return alert("Không có dữ liệu bài nộp để xuất.");
    const quote=value=>{let text=String(value??"");if(/^[=+\-@]/.test(text))text="'"+text;return `"${text.replace(/"/g,'""')}"`};
    const rows=[["Học viên","Email","Mã Case","Tên Case","Trạng thái","Điểm","Lần nộp","Ngày nộp","Ghi chú","Phản hồi"],...submissionData.map(row=>[row.display_name,row.email,row.case_key,row.case_title,row.status,row.score,row.attempt_count,fmt(row.submitted_at),row.note,row.feedback])];
    const blob=new Blob(["\ufeff"+rows.map(row=>row.map(quote).join(",")).join("\r\n")],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download=`professional-submissions-${new Date().toISOString().slice(0,10)}.csv`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  async function showMode(mode){currentMode=mode;document.querySelectorAll("[data-apt-view]").forEach(view=>view.hidden=view.dataset.aptView!==mode);document.querySelectorAll("[data-apt-mode]").forEach(button=>button.classList.toggle("active",button.dataset.aptMode===mode));const sb=await client();if(!sb)return;if(mode==="applications")await loadApplications(sb);if(mode==="catalog")await loadCatalog(sb);if(mode==="submissions")await loadSubmissions(sb)}
  async function loadCurrent(){const sb=await client();if(!sb)return;await refreshCounts(sb);await showMode(currentMode)}

  function bind(){
    fillDomainOptions();$("aptCaseDomain")?.addEventListener("change",()=>{fillModuleOptions();clearReferenceState()});$("aptCaseModule")?.addEventListener("change",()=>clearReferenceState());$("aptCaseLevel")?.addEventListener("change",()=>clearReferenceState());$("aptCaseIndex")?.addEventListener("change",()=>clearReferenceState());$("aptCaseForm")?.addEventListener("submit",saveCase);$("aptCaseReset")?.addEventListener("click",resetCaseForm);
    $("aptCaseReference")?.addEventListener("change",event=>{const file=event.target.files?.[0];if(file)setReferenceState(`Đã chọn ${file.name}. File sẽ được upload khi lưu Case.`,"ready")});
    $("aptCaseReferenceCheck")?.addEventListener("click",async()=>{const sb=await client();if(sb)await checkReference(sb)});
    $("aptCaseReferenceRemove")?.addEventListener("click",removeReference);
    document.querySelectorAll("[data-apt-mode]").forEach(button=>button.addEventListener("click",()=>showMode(button.dataset.aptMode)));
    $("adminProfessionalReload")?.addEventListener("click",loadCurrent);$("adminProfessionalLoad")?.addEventListener("click",loadCurrent);$("adminProfessionalStatus")?.addEventListener("change",loadCurrent);$("aptCatalogReload")?.addEventListener("click",loadCurrent);$("aptSubmissionReload")?.addEventListener("click",loadCurrent);$("aptSubmissionStatus")?.addEventListener("change",loadCurrent);$("aptSubmissionExport")?.addEventListener("click",exportSubmissions);
    ["aptCatalogSearch","aptCatalogDomainFilter","aptCatalogLevelFilter","aptCatalogPublishFilter"].forEach(id=>$(id)?.addEventListener(id==="aptCatalogSearch"?"input":"change",renderCatalog));
    $("adminProfessionalList")?.addEventListener("click",event=>{const cert=event.target.closest("[data-cert]");if(cert)return openCertificate(cert.dataset.cert);const action=event.target.closest("[data-review]");if(action)return reviewApplication(action.closest(".apt-item"),action.dataset.review)});
    $("aptCatalogList")?.addEventListener("click",event=>{const edit=event.target.closest("[data-case-edit]");if(edit)return editCase(edit.dataset.caseEdit);const copy=event.target.closest("[data-case-copy]");if(copy)copyCase(copy.dataset.caseCopy)});
    $("aptSubmissionList")?.addEventListener("click",event=>{const open=event.target.closest("[data-open-submission]");if(open)return openSubmission(open.dataset.openSubmission);const action=event.target.closest("[data-grade-action]");if(action)return gradeSubmission(action.closest(".apt-submission-item"),action.dataset.gradeAction)});
  }
  window.addEventListener("avp:admin-professional-open",loadCurrent);if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});else bind();
})();
