(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  let loaded=false;

  function esc(s){
    return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }
  function fmt(ts){
    if(!ts)return "—";
    try{return new Intl.DateTimeFormat("vi-VN",{dateStyle:"short",timeStyle:"short"}).format(new Date(ts))}
    catch(e){return String(ts)}
  }
  function diffLabel(v){
    return v==="basic"?"🌱 Cơ bản":v==="intermediate"?"📘 Trung cấp":"🏆 Nâng cao";
  }
  async function client(){
    for(let i=0;i<30;i++){
      const sb=window.avpSupabase||window.supabaseClient||null;
      if(sb?.rpc)return sb;
      await new Promise(r=>setTimeout(r,100));
    }
    return null;
  }


  async function loadLessons(){
    const sb=await client();
    const root=$("adminGraderLessonList");
    if(!sb||!root)return;
    root.innerHTML='<div class="admin-users-empty">Đang tải…</div>';
    try{
      const {data,error}=await sb.rpc("admin_practice_grader_lessons");
      if(error)throw error;
      const rows=Array.isArray(data)?data:[];
      root.innerHTML=rows.length?rows.map(r=>`
        <div class="ag-lesson-row" data-lesson="${esc(r.lesson_key)}">
          <div class="ag-lesson-main">
            <strong>${esc(r.title)}</strong>
            <small>${esc(r.lesson_key)}</small>
          </div>
          <select data-level>
            <option value="basic"${r.difficulty==="basic"?" selected":""}>Cơ bản</option>
            <option value="intermediate"${r.difficulty==="intermediate"?" selected":""}>Trung cấp</option>
            <option value="advanced"${r.difficulty==="advanced"?" selected":""}>Nâng cao</option>
          </select>
          <label class="ag-active"><input type="checkbox" data-active ${r.is_active?"checked":""}> Mở</label>
          <button type="button" data-save-lesson>Lưu</button>
        </div>
      `).join(""):'<div class="admin-users-empty">Chưa có bài.</div>';
    }catch(e){
      root.innerHTML=`<div class="admin-users-empty">Không tải được: ${esc(e?.message||e)}</div>`;
    }
  }

  async function saveLesson(btn){
    const row=btn.closest(".ag-lesson-row");
    if(!row)return;
    const sb=await client();
    btn.disabled=true;
    btn.textContent="Đang lưu…";
    try{
      const {error}=await sb.rpc("admin_practice_grader_set_lesson",{
        p_lesson_key:row.dataset.lesson,
        p_difficulty:row.querySelector("[data-level]").value,
        p_active:row.querySelector("[data-active]").checked
      });
      if(error)throw error;
      btn.textContent="Đã lưu";
      setTimeout(()=>btn.textContent="Lưu",900);
    }catch(e){
      alert("Không lưu được: "+(e?.message||e));
      btn.textContent="Lưu";
    }finally{
      btn.disabled=false;
    }
  }



  function appealStatusLabel(v){
    return v==="approved"?"Đã chấm lại":v==="rejected"?"Giữ nguyên điểm":"Đang chờ";
  }

  async function loadAppeals(){
    const sb=await client();
    const root=$("adminGraderAppealList");
    if(!sb||!root)return;
    const status=$("adminGraderAppealStatus")?.value||null;
    root.innerHTML='<div class="admin-users-empty">Đang tải yêu cầu…</div>';
    try{
      const {data,error}=await sb.rpc("admin_practice_grader_appeals",{p_status:status,p_limit:200});
      if(error)throw error;
      const rows=Array.isArray(data)?data:[];
      root.innerHTML=rows.length?rows.map(r=>`
        <article class="ag-appeal-card ${esc(r.status)}" data-appeal-id="${esc(r.id)}" data-file="${esc(r.file_path||"")}">
          <div class="ag-appeal-head">
            <div>
              <strong>${esc(r.display_name||"Học viên")}</strong>
              <small>${esc(r.lesson_title||r.lesson_key)} · ${diffLabel(r.difficulty)}</small>
            </div>
            <span>${appealStatusLabel(r.status)}</span>
          </div>
          <div class="ag-appeal-score">
            <span>Điểm hệ thống <b>${Number(r.original_score)||0}/100</b></span>
            ${r.status!=="pending"?`<span>Điểm sau xử lý <b>${Number(r.final_score??r.original_score)||0}/100</b></span>`:""}
          </div>
          <div class="ag-appeal-reason"><b>Học viên báo:</b> ${esc(r.reason||"")}</div>
          ${r.status==="pending"?`
            <div class="ag-appeal-review">
              <label>Điểm Admin chấm lại
                <input type="number" min="0" max="100" step="1" data-manual-score value="${Number(r.original_score)||0}">
              </label>
              <label class="wide">Phản hồi cho học viên
                <textarea rows="3" maxlength="1000" data-admin-response placeholder="Giải thích ngắn gọn vì sao đổi điểm hoặc giữ nguyên..."></textarea>
              </label>
            </div>
            <div class="ag-appeal-actions">
              <button type="button" data-open-file>📄 Mở file đã nộp</button>
              <button type="button" class="reject" data-resolve="reject">Giữ nguyên điểm</button>
              <button type="button" class="approve" data-resolve="approve">✓ Duyệt & chấm lại</button>
            </div>`:
            `<div class="ag-appeal-response"><b>Admin:</b> ${esc(r.admin_response||"")}</div>`}
        </article>
      `).join(""):'<div class="admin-users-empty">Không có yêu cầu phù hợp.</div>';
    }catch(e){
      root.innerHTML=`<div class="admin-users-empty">Không tải được: ${esc(e?.message||e)}</div>`;
    }
  }

  async function openAppealFile(btn){
    const card=btn.closest(".ag-appeal-card");
    const path=card?.dataset.file;
    if(!path)return alert("Bài nộp này chưa có file lưu trên Storage.");
    const sb=await client();
    try{
      const {data,error}=await sb.storage.from("practice-submissions").createSignedUrl(path,300);
      if(error)throw error;
      if(!data?.signedUrl)throw new Error("Không tạo được link tạm.");
      window.open(data.signedUrl,"_blank","noopener");
    }catch(e){alert("Không mở được file: "+(e?.message||e))}
  }

  async function resolveAppeal(btn,approve){
    const card=btn.closest(".ag-appeal-card");
    const id=Number(card?.dataset.appealId);
    if(!id)return;
    const score=Number(card.querySelector("[data-manual-score]")?.value);
    const response=String(card.querySelector("[data-admin-response]")?.value||"").trim();
    if(response.length<3)return alert("Nhập phản hồi cho học viên.");
    if(approve&&(score<0||score>100||!Number.isFinite(score)))return alert("Điểm chấm lại phải từ 0 đến 100.");

    const ok=confirm(approve
      ? `Duyệt chấm lại thành ${score}/100 và gửi thông báo cho học viên?`
      : "Giữ nguyên điểm hệ thống và gửi phản hồi cho học viên?");
    if(!ok)return;

    const sb=await client();
    btn.disabled=true;
    try{
      const {error}=await sb.rpc("admin_practice_grader_resolve_appeal",{
        p_appeal_id:id,
        p_approve:!!approve,
        p_new_score:approve?score:null,
        p_response:response
      });
      if(error)throw error;
      await Promise.all([loadAppeals(),load(),loadLessonStats()]);
    }catch(e){alert("Chưa xử lý được: "+(e?.message||e))}
    finally{btn.disabled=false}
  }

  async function loadLessonStats(){
    const sb=await client();
    const root=$("adminGraderStatsList");
    if(!sb||!root)return;
    root.innerHTML='<div class="admin-users-empty">Đang tải…</div>';
    try{
      const {data,error}=await sb.rpc("admin_practice_grader_lesson_stats");
      if(error)throw error;
      const rows=Array.isArray(data)?data:[];
      root.innerHTML=rows.length?rows.map((r,i)=>`
        <div class="ag-stat-row">
          <span class="ag-stat-no">${i+1}</span>
          <span class="ag-stat-main"><strong>${esc(r.lesson_title)}</strong><small>${diffLabel(r.difficulty)}</small></span>
          <span><small>Lượt làm</small><b>${Number(r.submissions)||0}</b></span>
          <span><small>Điểm TB</small><b>${Number(r.avg_score)||0}</b></span>
          <span><small>Tỷ lệ đạt</small><b>${Number(r.pass_rate)||0}%</b></span>
        </div>
      `).join(""):'<div class="admin-users-empty">Chưa có dữ liệu bài nộp.</div>';
    }catch(e){
      root.innerHTML=`<div class="admin-users-empty">Không tải được: ${esc(e?.message||e)}</div>`;
    }
  }

  async function load(){
    const sb=await client();
    if(!sb)return;

    const body=$("adminGraderBody");
    if(body)body.innerHTML='<tr><td colspan="7">Đang tải…</td></tr>';

    const diff=$("adminGraderDifficulty")?.value||null;
    const search=$("adminGraderSearch")?.value?.trim()||null;

    try{
      const [sumRes,listRes]=await Promise.all([
        sb.rpc("admin_practice_grader_summary"),
        sb.rpc("admin_practice_grader_submissions",{
          p_difficulty:diff,
          p_search:search,
          p_limit:300
        })
      ]);
      if(sumRes.error)throw sumRes.error;
      if(listRes.error)throw listRes.error;

      const s=sumRes.data||{};
      if($("agActiveLessons"))$("agActiveLessons").textContent=String(s.active_lessons??0);
      if($("agSubmissions"))$("agSubmissions").textContent=String(s.submissions??0);
      if($("agUsers"))$("agUsers").textContent=String(s.users??0);
      if($("agAvgScore"))$("agAvgScore").textContent=String(s.avg_score??0);

      const rows=Array.isArray(listRes.data)?listRes.data:[];
      if(!rows.length){
        body.innerHTML='<tr><td colspan="7">Chưa có bài nộp phù hợp.</td></tr>';
      }else{
        body.innerHTML=rows.map(r=>`
          <tr data-user="${esc(r.user_id)}" data-lesson="${esc(r.lesson_key)}">
            <td><strong>${esc(r.display_name||"Học viên")}</strong></td>
            <td><strong>${esc(r.lesson_title||r.lesson_key)}</strong><small class="ag-sub">${esc(r.lesson_key)}</small></td>
            <td><span class="ag-diff ${esc(r.difficulty)}">${diffLabel(r.difficulty)}</span></td>
            <td><b class="ag-score">${Number(r.score)||0}/100</b></td>
            <td>${r.is_public?'<span class="ag-public">Công khai</span>':'<span class="ag-private">Riêng tư</span>'}</td>
            <td>${fmt(r.submitted_at)}</td>
            <td><button type="button" class="ag-reset" data-reset>↩ Cho làm lại</button></td>
          </tr>`).join("");
      }
      loaded=true;
    }catch(e){
      console.error("[admin grader]",e);
      if(body)body.innerHTML=`<tr><td colspan="7">Không tải được: ${esc(e?.message||e)}</td></tr>`;
    }
  }

  async function reset(btn){
    const tr=btn.closest("tr");
    const uid=tr?.dataset.user;
    const lesson=tr?.dataset.lesson;
    if(!uid||!lesson)return;

    const name=tr.querySelector("td strong")?.textContent||"người học";
    const ok=confirm(`Cho ${name} làm lại bài này?\n\nKết quả hiện tại sẽ bị xóa khỏi hệ thống và tài khoản được nộp lại 1 lần.`);
    if(!ok)return;

    const sb=await client();
    btn.disabled=true;
    btn.textContent="Đang reset…";
    try{
      const {data,error}=await sb.rpc("admin_practice_grader_reset",{
        p_user_id:uid,
        p_lesson_key:lesson
      });
      if(error)throw error;
      if(!data)throw new Error("Không tìm thấy bài nộp để reset.");
      await load();
    }catch(e){
      alert("Reset chưa thành công: "+(e?.message||e));
      btn.disabled=false;
      btn.textContent="↩ Cho làm lại";
    }
  }

  function bind(){
    $("adminGraderReload")?.addEventListener("click",load);
    $("adminGraderLoadStats")?.addEventListener("click",loadLessonStats);
    $("adminGraderLoadAppeals")?.addEventListener("click",loadAppeals);
    $("adminGraderAppealStatus")?.addEventListener("change",loadAppeals);
    $("adminGraderAppealList")?.addEventListener("click",e=>{
      const open=e.target.closest("[data-open-file]");
      if(open)return openAppealFile(open);
      const action=e.target.closest("[data-resolve]");
      if(action)return resolveAppeal(action,action.dataset.resolve==="approve");
    });
    $("adminGraderLoadLessons")?.addEventListener("click",loadLessons);
    $("adminGraderLessonList")?.addEventListener("click",e=>{const b=e.target.closest("[data-save-lesson]");if(b)saveLesson(b)});
    $("adminGraderSearchBtn")?.addEventListener("click",load);
    $("adminGraderDifficulty")?.addEventListener("change",load);
    $("adminGraderSearch")?.addEventListener("keydown",e=>{if(e.key==="Enter")load()});
    $("adminGraderBody")?.addEventListener("click",e=>{
      const b=e.target.closest("[data-reset]");
      if(b)reset(b);
    });
    window.addEventListener("avp:admin-grader-open",()=>{load();loadLessons();loadLessonStats();loadAppeals();});
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});
  else bind();
})();
