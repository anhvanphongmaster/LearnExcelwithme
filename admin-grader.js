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
    $("adminGraderSearchBtn")?.addEventListener("click",load);
    $("adminGraderDifficulty")?.addEventListener("change",load);
    $("adminGraderSearch")?.addEventListener("keydown",e=>{if(e.key==="Enter")load()});
    $("adminGraderBody")?.addEventListener("click",e=>{
      const b=e.target.closest("[data-reset]");
      if(b)reset(b);
    });
    window.addEventListener("avp:admin-grader-open",()=>load());
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});
  else bind();
})();
