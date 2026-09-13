(() => {
  "use strict";
  if(window.__AVP_ADMIN_COMMUNITY_CENTER_V2__)return;
  window.__AVP_ADMIN_COMMUNITY_CENTER_V2__=true;

  const $=id=>document.getElementById(id);
  const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  let client=null,mounted=false,activeTab="send",selectedUserId=null,selectedNotificationId=null,certRows=[];

  async function waitClient(){
    if(client?.rpc)return client;
    for(let i=0;i<60;i++){
      const c=window.avpSupabase||window.supabaseClient||null;
      if(c?.rpc){client=c;return c}
      await new Promise(r=>setTimeout(r,100));
    }
    return null;
  }
  async function rpc(name,args={}){const c=await waitClient();if(!c)throw new Error("Supabase chưa sẵn sàng");const {data,error}=await c.rpc(name,args);if(error)throw error;return data}
  const fmt=v=>{if(!v)return"—";try{return new Date(v).toLocaleString("vi-VN")}catch{return String(v)}};
  const catLabel=v=>({system:"Hệ thống",minigame:"Mini game",event:"Sự kiện",update:"Cập nhật",important:"Quan trọng"})[v]||v||"Hệ thống";

  function mount(){
    if(mounted||$("avpAdminCommunityCenter")){mounted=true;return true}
    const host=$("avpAdminCommunityHost")||$("adminDashboard");if(!host)return false;
    const section=document.createElement("section");section.id="avpAdminCommunityCenter";section.className="admin-panel avp-acc-panel";
    section.innerHTML=`
      <div class="admin-panel-head"><div><span>📣 CỘNG ĐỒNG & THÔNG BÁO</span><h2>Trung tâm quản trị học viên</h2><p>Chỉ tải dữ liệu của mục bạn đang mở để giảm tải Supabase.</p></div><button id="avpAccRefresh" type="button" class="avp-acc-secondary">↻ Làm mới</button></div>
      <div class="avp-acc-tabs">
        <button type="button" class="active" data-acc-tab="send">📢 Gửi thông báo</button>
        <button type="button" data-acc-tab="history">📚 Lịch sử</button>
        <button type="button" data-acc-tab="certs">🏅 Chứng nhận</button>
        <button type="button" data-acc-tab="moderation">🛡️ Kiểm duyệt</button>
      </div>
      <div id="avpAccSendTab" class="avp-acc-tab">
        <div class="avp-acc-compose">
          <div class="avp-acc-field avp-acc-wide"><label>Tiêu đề</label><input id="avpAccTitle" maxlength="180" placeholder="Ví dụ: Mini game Excel cuối tuần"></div>
          <div class="avp-acc-field"><label>Loại thông báo</label><select id="avpAccCategory"><option value="system">Hệ thống</option><option value="minigame">Mini game</option><option value="event">Sự kiện</option><option value="update">Cập nhật</option><option value="important">Quan trọng</option></select></div>
          <div class="avp-acc-field"><label>Người nhận</label><select id="avpAccTarget"><option value="all">Tất cả học viên</option><option value="user">Một học viên cụ thể</option></select></div>
          <div id="avpAccUserPicker" class="avp-acc-user-picker avp-acc-wide" hidden><label>Tìm học viên</label><input id="avpAccUserSearch" type="search" placeholder="Nhập tên hoặc email..."><div id="avpAccUserResults" class="avp-acc-user-results"></div><div id="avpAccSelectedUser" class="avp-acc-selected-user" hidden></div></div>
          <div class="avp-acc-field avp-acc-wide"><label>Nội dung</label><textarea id="avpAccContent" maxlength="5000" rows="5" placeholder="Nội dung thông báo học viên sẽ nhìn thấy..."></textarea></div>
          <label class="avp-acc-check"><input id="avpAccPinned" type="checkbox"><span>📌 Ghim thông báo lên đầu</span></label>
          <button id="avpAccSend" type="button" class="avp-acc-primary">Gửi thông báo</button>
        </div>
      </div>
      <div id="avpAccHistoryTab" class="avp-acc-tab" hidden>
        <div class="avp-acc-split"><div><div class="avp-acc-subhead"><h3>Thông báo đã phát</h3><span>Danh sách chỉ tải 1 RPC; chi tiết đã đọc chỉ tải khi bấm xem.</span></div><div id="avpAccNotificationList" class="avp-acc-list"><p class="admin-empty">Mở Lịch sử để tải dữ liệu.</p></div></div><div><div class="avp-acc-subhead"><h3>Trạng thái người nhận</h3><span id="avpAccAudienceHint">Chưa chọn thông báo.</span></div><div id="avpAccAudience" class="avp-acc-audience"><p class="admin-empty">Chọn một thông báo ở cột bên trái.</p></div></div></div>
      </div>
      <div id="avpAccCertsTab" class="avp-acc-tab" hidden><div class="avp-acc-subhead"><div><h3>Chứng nhận cộng đồng</h3><span>Xem mã xác minh và thu hồi / khôi phục chứng nhận.</span></div><input id="avpAccCertSearch" type="search" placeholder="Tìm tên, email hoặc mã xác minh..."></div><div id="avpAccCertList" class="avp-acc-cert-list"><p class="admin-empty">Mở Chứng nhận để tải dữ liệu.</p></div></div>
      <div id="avpAccModerationTab" class="avp-acc-tab" hidden><div class="avp-acc-subhead"><div><h3>🛡️ Hàng chờ kiểm duyệt</h3><span>Report từ học viên và cảnh báo tự động.</span></div><select id="avpModerationStatus"><option value="open">Chờ xử lý</option><option value="all">Tất cả</option><option value="resolved">Đã xử lý</option></select></div><div id="avpModerationList" class="avp-moderation-list"><p class="admin-empty">Mở Kiểm duyệt để tải dữ liệu.</p></div></div>`;
    if($("avpAdminCommunityHost")){host.innerHTML="";host.appendChild(section)}else host.appendChild(section);
    mounted=true;bind();return true;
  }

  async function openTab(tab){
    activeTab=tab;
    document.querySelectorAll("[data-acc-tab]").forEach(b=>b.classList.toggle("active",b.dataset.accTab===tab));
    [["send","avpAccSendTab"],["history","avpAccHistoryTab"],["certs","avpAccCertsTab"],["moderation","avpAccModerationTab"]].forEach(([name,id])=>{$(id).hidden=name!==tab});
    if(tab==="history")await loadNotifications();
    if(tab==="certs")await loadCertificates();
    if(tab==="moderation")await loadModeration();
  }

  function bind(){
    document.querySelectorAll("[data-acc-tab]").forEach(btn=>btn.addEventListener("click",()=>openTab(btn.dataset.accTab)));
    $("avpAccTarget").addEventListener("change",()=>{const on=$("avpAccTarget").value==="user";$("avpAccUserPicker").hidden=!on;if(!on){selectedUserId=null;$("avpAccSelectedUser").hidden=true}else searchUsers()});
    let timer=0;$("avpAccUserSearch").addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(searchUsers,300)});
    let certTimer=0;$("avpAccCertSearch").addEventListener("input",()=>{clearTimeout(certTimer);certTimer=setTimeout(renderCertificates,180)});
    $("avpAccSend").addEventListener("click",sendNotification);$("avpModerationStatus").addEventListener("change",loadModeration);
    $("avpAccRefresh").addEventListener("click",()=>openTab(activeTab));
  }

  async function searchUsers(){
    if($("avpAccTarget")?.value!=="user")return;
    const box=$("avpAccUserResults"),q=String($("avpAccUserSearch")?.value||"").trim();box.innerHTML='<p class="admin-empty">Đang tải...</p>';
    try{const rows=await rpc("admin_notification_user_search",{p_search:q||null,p_limit:30});renderUsers(Array.isArray(rows)?rows:[])}catch(e){box.innerHTML='<p class="admin-empty">Không tải được học viên.</p>'}
  }
  function renderUsers(rows){
    const box=$("avpAccUserResults");if(!rows.length){box.innerHTML='<p class="admin-empty">Không tìm thấy học viên.</p>';return}
    box.innerHTML=rows.map(r=>`<button type="button" data-user-id="${esc(r.user_id)}"><strong>${esc(r.display_name||"Học viên")}</strong><small>${esc(r.email||"")}</small></button>`).join("");
    box.querySelectorAll("[data-user-id]").forEach(btn=>btn.onclick=()=>{selectedUserId=btn.dataset.userId;const row=rows.find(x=>String(x.user_id)===String(selectedUserId)),sel=$("avpAccSelectedUser");sel.hidden=false;sel.innerHTML=`Đang gửi cho: <strong>${esc(row?.display_name||"Học viên")}</strong> <small>${esc(row?.email||"")}</small>`});
  }

  async function sendNotification(){
    const title=String($("avpAccTitle")?.value||"").trim(),content=String($("avpAccContent")?.value||"").trim(),category=$("avpAccCategory")?.value||"system",target=$("avpAccTarget")?.value||"all";
    if(title.length<3)return alert("Nhập tiêu đề thông báo.");if(content.length<2)return alert("Nhập nội dung thông báo.");if(target==="user"&&!selectedUserId)return alert("Chọn học viên nhận thông báo.");
    const btn=$("avpAccSend");btn.disabled=true;
    try{await rpc("admin_system_notification_create",{p_title:title,p_content:content,p_category:category,p_target_type:target,p_target_user_id:target==="user"?selectedUserId:null,p_starts_at:new Date().toISOString(),p_expires_at:null,p_is_pinned:Boolean($("avpAccPinned")?.checked)});$("avpAccTitle").value="";$("avpAccContent").value="";$("avpAccPinned").checked=false;alert(target==="all"?"Đã gửi thông báo cho tất cả học viên.":"Đã gửi thông báo cho học viên.")}catch(e){alert("Chưa gửi được thông báo: "+String(e?.message||e))}finally{btn.disabled=false}
  }

  async function loadNotifications(){
    const box=$("avpAccNotificationList");if(!box)return;box.innerHTML='<p class="admin-empty">Đang tải...</p>';
    try{
      const rows=await rpc("admin_system_notification_list",{p_limit:100}),data=Array.isArray(rows)?rows:[];
      if(!data.length){box.innerHTML='<p class="admin-empty">Chưa có thông báo hệ thống.</p>';return}
      box.innerHTML=data.map(n=>`<article class="avp-acc-notification ${n.is_active?"":"inactive"} ${String(n.id)===String(selectedNotificationId)?"active":""}" data-notification="${esc(n.id)}"><div class="avp-acc-notification-head"><strong>${esc(n.title)}</strong><span>${esc(catLabel(n.category))}</span></div><p>${esc(n.content)}</p><small>${fmt(n.created_at)} · ${n.target_type==="all"?"Tất cả học viên":"Một học viên"}</small><div class="avp-acc-notification-actions"><button type="button" data-view="${esc(n.id)}">👁 Xem đã đọc</button><button type="button" data-pin="${esc(n.id)}" data-pinned="${n.is_pinned?"1":"0"}">${n.is_pinned?"📍 Bỏ ghim":"📌 Ghim"}</button><button type="button" data-toggle="${esc(n.id)}" data-active="${n.is_active?"1":"0"}">${n.is_active?"Tắt":"Bật lại"}</button></div></article>`).join("");
      box.querySelectorAll("[data-view]").forEach(b=>b.onclick=e=>{e.stopPropagation();showAudience(b.dataset.view)});
      box.querySelectorAll("[data-pin]").forEach(b=>b.onclick=async e=>{e.stopPropagation();await rpc("admin_system_notification_set_pinned",{p_id:b.dataset.pin,p_pinned:b.dataset.pinned!=="1"});await loadNotifications()});
      box.querySelectorAll("[data-toggle]").forEach(b=>b.onclick=async e=>{e.stopPropagation();await rpc("admin_system_notification_set_active",{p_id:b.dataset.toggle,p_active:b.dataset.active!=="1"});await loadNotifications()});
      box.querySelectorAll("[data-notification]").forEach(item=>item.onclick=()=>showAudience(item.dataset.notification));
    }catch(e){box.innerHTML='<p class="admin-empty">Không tải được lịch sử thông báo.</p>'}
  }

  async function showAudience(id){
    selectedNotificationId=id;const box=$("avpAccAudience");box.innerHTML='<p class="admin-empty">Đang tải...</p>';
    try{const [audience,stats]=await Promise.all([rpc("admin_system_notification_audience_v2",{p_notification_id:id}),rpc("admin_system_notification_stats",{p_notification_id:id})]);const rows=Array.isArray(audience)?audience:[],s=Array.isArray(stats)?stats[0]:stats,total=Number(s?.total_recipients||rows.length),readCount=Number(s?.read_count||0),unreadCount=Number(s?.unread_count??Math.max(0,total-readCount)),rate=total?Math.round(readCount/total*1000)/10:0;$("avpAccAudienceHint").textContent=`${total} người nhận · ${readCount} đã đọc · ${unreadCount} chưa đọc · ${rate}%`;renderAudience(rows)}catch(e){box.innerHTML='<p class="admin-empty">Không tải được trạng thái đã đọc.</p>'}
  }
  function renderAudience(rows){
    const read=rows.filter(x=>x.is_read),unread=rows.filter(x=>!x.is_read),box=$("avpAccAudience");
    box.innerHTML=`<div class="avp-acc-audience-summary"><button type="button" class="active" data-af="all">Tất cả ${rows.length}</button><button type="button" data-af="read">Đã đọc ${read.length}</button><button type="button" data-af="unread">Chưa đọc ${unread.length}</button></div><div id="avpAccAudienceRows"></div>`;
    const render=filter=>{const list=filter==="read"?read:filter==="unread"?unread:rows;$("avpAccAudienceRows").innerHTML=list.map(r=>`<div class="avp-acc-audience-row ${r.is_read?"read":"unread"}"><i></i><div><strong>${esc(r.display_name||"Học viên")}</strong><small>${esc(r.email||"")}</small></div><div><b>${r.is_read?"Đã đọc":"Chưa đọc"}</b><small>${r.is_read?fmt(r.read_at):"—"}</small></div></div>`).join("")||'<p class="admin-empty">Không có học viên.</p>'};render("all");box.querySelectorAll("[data-af]").forEach(btn=>btn.onclick=()=>{box.querySelectorAll("[data-af]").forEach(b=>b.classList.toggle("active",b===btn));render(btn.dataset.af)})
  }

  async function loadModeration(){const box=$("avpModerationList");if(!box)return;box.innerHTML='<p class="admin-empty">Đang tải...</p>';try{const rows=await rpc("admin_community_moderation_queue",{p_status:$("avpModerationStatus")?.value||"open",p_limit:100});renderModeration(Array.isArray(rows)?rows:[])}catch(e){box.innerHTML='<p class="admin-empty">Chưa tải được kiểm duyệt.</p>'}}
  const reason=v=>({spam:"Spam",scam:"Lừa đảo",suspicious_link:"Link/liên hệ đáng ngờ",sensitive:"Nội dung nhạy cảm",harassment:"Quấy rối/xúc phạm",impersonation:"Giả mạo",auto_risk:"Hệ thống phát hiện rủi ro",other:"Khác"})[v]||v||"Báo cáo";
  function renderModeration(rows){const box=$("avpModerationList");if(!rows.length){box.innerHTML='<p class="admin-empty">Không có report phù hợp.</p>';return}box.innerHTML=rows.map(r=>`<article class="avp-mod-card ${r.status==="open"?"open":"closed"}"><div class="avp-mod-head"><div><strong>${esc(reason(r.reason))}</strong><span>${esc(r.target_type)} · ${fmt(r.created_at)}</span></div><b>${r.auto_flag?"🤖 Tự động":"🚩 Người dùng báo cáo"}</b></div><div class="avp-mod-user"><strong>${esc(r.target_display_name||"Học viên")}</strong><small>${esc(r.target_email||"")}</small></div><p>${esc(r.content_preview||r.detail||"Không có nội dung xem trước.")}</p><div class="avp-mod-actions">${r.status==="open"?`<button data-mod-action="dismiss" data-report="${esc(r.id)}">Bỏ qua</button>${r.target_type!=="profile"?`<button data-mod-action="hide" data-report="${esc(r.id)}">Ẩn nội dung</button>`:""}<button data-mod-action="warn" data-report="${esc(r.id)}">Cảnh cáo</button><button data-mod-action="restrict" data-report="${esc(r.id)}">Hạn chế</button><button data-mod-action="suspend" data-report="${esc(r.id)}" class="danger">Khoá Cộng đồng</button>`:`<button data-mod-action="reopen" data-report="${esc(r.id)}">Mở lại report</button>`}</div></article>`).join("");box.querySelectorAll("[data-mod-action]").forEach(btn=>btn.onclick=()=>moderationAction(btn.dataset.report,btn.dataset.modAction))}
  async function moderationAction(id,action){if(["hide","restrict","suspend"].includes(action)){const ok=await window.avpConfirm("Thao tác này tác động trực tiếp tới nội dung hoặc tài khoản cộng đồng.",{title:"Xác nhận kiểm duyệt?",tone:"danger",ok:"Xác nhận",cancel:"Hủy"});if(!ok)return}try{await rpc("admin_community_moderation_action",{p_report_id:id,p_action:action,p_note:null});await loadModeration()}catch(e){alert("Chưa thực hiện được thao tác kiểm duyệt.")}}

  async function loadCertificates(){const box=$("avpAccCertList");if(!box)return;box.innerHTML='<p class="admin-empty">Đang tải...</p>';try{const rows=await rpc("admin_community_certificate_list",{p_limit:150});certRows=Array.isArray(rows)?rows:[];renderCertificates()}catch(e){box.innerHTML='<p class="admin-empty">Chưa tải được chứng nhận.</p>'}}
  function renderCertificates(){const box=$("avpAccCertList");if(!box)return;const q=String($("avpAccCertSearch")?.value||"").trim().toLowerCase(),rows=certRows.filter(r=>!q||[r.display_name,r.email,r.verification_code,r.title].some(v=>String(v||"").toLowerCase().includes(q)));if(!rows.length){box.innerHTML='<p class="admin-empty">Không có chứng nhận phù hợp.</p>';return}box.innerHTML=rows.map(r=>`<article class="avp-acc-cert ${r.revoked_at?"revoked":""}"><div><strong>${esc(r.display_name||"Học viên")}</strong><small>${esc(r.email||"")}</small></div><div><b>${esc(r.title)}</b><small>Mã: ${esc(r.verification_code)} · ${fmt(r.issued_at)}</small></div><div class="avp-acc-cert-actions"><button type="button" data-copy="${esc(r.verification_code)}">📋 Mã</button><button type="button" data-revoke="${esc(r.id)}" data-is-revoked="${r.revoked_at?"1":"0"}">${r.revoked_at?"Khôi phục":"Thu hồi"}</button></div></article>`).join("");box.querySelectorAll("[data-copy]").forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);alert("Đã sao chép mã xác minh.")}catch{alert("Mã: "+b.dataset.copy)}});box.querySelectorAll("[data-revoke]").forEach(b=>b.onclick=()=>setCertificateRevoked(b.dataset.revoke,b.dataset.isRevoked!=="1"))}
  async function setCertificateRevoked(id,revoked){const ok=await window.avpConfirm(revoked?"Chứng nhận sẽ chuyển sang trạng thái đã thu hồi.":"Chứng nhận sẽ được khôi phục hiệu lực.",{title:revoked?"Thu hồi chứng nhận?":"Khôi phục chứng nhận?",tone:revoked?"danger":"ok",ok:revoked?"Thu hồi":"Khôi phục",cancel:"Hủy"});if(!ok)return;try{await rpc("admin_community_certificate_set_revoked",{p_certificate_id:id,p_revoked:revoked});await loadCertificates()}catch(e){alert("Chưa cập nhật được chứng nhận.")}}

  async function openCommunity(){if(!mount())return;await waitClient();if(activeTab!=="send")await openTab(activeTab)}
  window.addEventListener("avp:admin-community-open",openCommunity);
  try{if(localStorage.getItem("avp_admin_view_v1")==="community")setTimeout(()=>window.dispatchEvent(new CustomEvent("avp:admin-community-open")),80)}catch(e){}
})();