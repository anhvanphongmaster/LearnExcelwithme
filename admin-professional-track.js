(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  let loaded=false;

  async function client(){
    for(let i=0;i<30;i++){
      const sb=window.avpSupabase||window.supabaseClient||null;
      if(sb?.rpc)return sb;
      await new Promise(r=>setTimeout(r,100));
    }
    return null;
  }
  function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
  function fmt(ts){try{return ts?new Date(ts).toLocaleString("vi-VN"):"—"}catch{return "—"}}
  function label(s){return s==="approved"?"Đã phê duyệt":s==="rejected"?"Cần bổ sung":"Đang chờ"}

  async function refreshCounts(sb){
    const {data,error}=await sb.rpc("admin_professional_track_summary_v1");
    if(error)throw error;
    const s=data||{};
    $("aptPending").textContent=String(s.pending||0);
    $("aptApproved").textContent=String(s.approved||0);
    $("aptRejected").textContent=String(s.rejected||0);
    $("aptTotal").textContent=String(s.total||0);
    const badge=$("adminProfessionalPendingBadge");
    const n=Number(s.pending)||0;
    badge.textContent=String(n);
    badge.hidden=!n;
  }

  async function load(){
    const sb=await client(),box=$("adminProfessionalList");
    if(!sb||!box)return;
    box.innerHTML='<div class="admin-users-empty">Đang tải…</div>';
    try{
      await refreshCounts(sb);
      const status=$("adminProfessionalStatus")?.value||null;
      const {data,error}=await sb.rpc("admin_professional_track_applications_v1",{p_status:status,p_limit:200});
      if(error)throw error;
      const rows=Array.isArray(data)?data:[];
      box.innerHTML=rows.length?rows.map(r=>`
        <article class="apt-item" data-app="${esc(r.id)}">
          <div class="apt-item-head">
            <div class="apt-person">
              <strong>${esc(r.display_name||"Học viên")}</strong>
              <small>${esc(r.email||"")} · Nộp ${fmt(r.submitted_at)}</small>
            </div>
            <span class="apt-status ${esc(r.status)}">${label(r.status)}</span>
          </div>
          <div class="apt-metrics">
            <span>Cơ bản<b>${Number(r.basic_score)||0} / 1500</b></span>
            <span>Trung cấp<b>${Number(r.intermediate_score)||0} / 1300</b></span>
            <span>Nâng cao<b>${Number(r.advanced_score)||0} / 1000</b></span>
            <span>Hoạt động<b>${Number(r.active_days)||0} / 5 ngày</b></span>
          </div>
          ${r.applicant_note?`<div class="apt-notes"><strong>Học viên:</strong> ${esc(r.applicant_note)}</div>`:""}
          ${r.admin_note?`<div class="apt-notes"><strong>Admin:</strong> ${esc(r.admin_note)}</div>`:""}
          <div class="apt-actions">
            <button type="button" data-cert="${esc(r.certificate_path)}">📎 Xem chứng chỉ</button>
            ${r.status!=="approved"?'<button type="button" class="approve" data-review="approved">✓ Phê duyệt</button>':""}
            ${r.status!=="rejected"?'<button type="button" class="reject" data-review="rejected">Yêu cầu bổ sung</button>':""}
          </div>
        </article>
      `).join(""):'<div class="admin-users-empty">Không có hồ sơ phù hợp.</div>';
      loaded=true;
    }catch(e){
      box.innerHTML=`<div class="admin-users-empty">Không tải được: ${esc(e?.message||e)}</div>`;
    }
  }

  async function openCertificate(path){
    if(!path)return alert("Hồ sơ chưa có file chứng chỉ.");
    const sb=await client();if(!sb)return;
    const {data,error}=await sb.storage.from("professional-track-certificates").createSignedUrl(path,120);
    if(error)return alert("Không mở được chứng chỉ: "+error.message);
    window.open(data.signedUrl,"_blank","noopener");
  }

  async function review(card,status){
    const sb=await client();if(!sb)return;
    const note=prompt(status==="approved"?"Ghi chú phê duyệt (có thể để trống):":"Nhập nội dung học viên cần bổ sung:");
    if(note===null)return;
    if(status==="rejected"&&!note.trim())return alert("Hãy nhập lý do cần bổ sung.");
    const {error}=await sb.rpc("admin_professional_track_review_v1",{
      p_application_id:card.dataset.app,
      p_status:status,
      p_admin_note:note.trim()||null
    });
    if(error)return alert("Chưa cập nhật được: "+error.message);
    await load();
  }

  function bind(){
    $("adminProfessionalReload")?.addEventListener("click",load);
    $("adminProfessionalLoad")?.addEventListener("click",load);
    $("adminProfessionalStatus")?.addEventListener("change",load);
    $("adminProfessionalList")?.addEventListener("click",e=>{
      const cert=e.target.closest("[data-cert]");
      if(cert)return openCertificate(cert.dataset.cert);
      const act=e.target.closest("[data-review]");
      if(act)return review(act.closest(".apt-item"),act.dataset.review);
    });
  }

  window.addEventListener("avp:admin-professional-open",()=>load());
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});else bind();
})();
