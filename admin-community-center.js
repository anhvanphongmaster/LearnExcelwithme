(() => {
  "use strict";

  if (window.__AVP_ADMIN_COMMUNITY_CENTER_V1__) return;
  window.__AVP_ADMIN_COMMUNITY_CENTER_V1__ = true;

  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));

  let client = null;
  let users = [];
  let selectedUserId = null;
  let selectedNotificationId = null;

  async function waitClient(){
    for(let i=0;i<100;i++){
      if(window.avpSupabase){
        client=window.avpSupabase;
        return true;
      }
      await new Promise(r=>setTimeout(r,100));
    }
    return false;
  }

  async function rpc(name,args={}){
    const {data,error}=await client.rpc(name,args);
    if(error) throw error;
    return data;
  }

  async function isAdmin(){
    try{
      const {data:sessionData}=await client.auth.getSession();
      const currentUser=sessionData?.session?.user;
      if(!currentUser) return false;

      try{
        const {data,error}=await client.rpc("is_admin_user");
        if(!error && data===true) return true;
      }catch{}

      try{
        const {data,error}=await client
          .from("profiles")
          .select("is_admin")
          .eq("id",currentUser.id)
          .maybeSingle();
        if(!error && data?.is_admin===true) return true;
      }catch{}

      return false;
    }catch{
      return false;
    }
  }

  function fmt(v){
    if(!v) return "—";
    try{return new Date(v).toLocaleString("vi-VN")}catch{return String(v)}
  }

  function catLabel(v){
    return ({
      system:"Hệ thống",
      minigame:"Mini game",
      event:"Sự kiện",
      update:"Cập nhật",
      important:"Quan trọng"
    })[v] || v || "Hệ thống";
  }

  function mount(){
    if($("avpAdminCommunityCenter")) return;
    const dashboard=$("adminDashboard");
    if(!dashboard) return;

    const staticHost=$("avpAdminCommunityHost");
    const host=staticHost || dashboard;

    const section=document.createElement("section");
    section.id="avpAdminCommunityCenter";
    section.className="admin-panel avp-acc-panel";
    section.innerHTML=`
      <div class="admin-panel-head">
        <div>
          <span>📣 CỘNG ĐỒNG & THÔNG BÁO</span>
          <h2>Trung tâm quản trị học viên</h2>
        </div>
        <button id="avpAccRefresh" type="button" class="avp-acc-secondary">↻ Làm mới</button>
      </div>

      <div class="avp-acc-tabs">
        <button type="button" class="active" data-acc-tab="send">📢 Gửi thông báo</button>
        <button type="button" data-acc-tab="history">📚 Lịch sử</button>
        <button type="button" data-acc-tab="certs">🏅 Chứng nhận</button>
      </div>

      <div id="avpAccSendTab" class="avp-acc-tab">
        <div class="avp-acc-compose">
          <div class="avp-acc-field avp-acc-wide">
            <label>Tiêu đề</label>
            <input id="avpAccTitle" maxlength="180" placeholder="Ví dụ: Mini game Excel cuối tuần">
          </div>

          <div class="avp-acc-field">
            <label>Loại thông báo</label>
            <select id="avpAccCategory">
              <option value="system">Hệ thống</option>
              <option value="minigame">Mini game</option>
              <option value="event">Sự kiện</option>
              <option value="update">Cập nhật</option>
              <option value="important">Quan trọng</option>
            </select>
          </div>

          <div class="avp-acc-field">
            <label>Người nhận</label>
            <select id="avpAccTarget">
              <option value="all">Tất cả học viên</option>
              <option value="user">Một học viên cụ thể</option>
            </select>
          </div>

          <div id="avpAccUserPicker" class="avp-acc-user-picker avp-acc-wide" hidden>
            <label>Tìm học viên</label>
            <input id="avpAccUserSearch" type="search" placeholder="Nhập tên hoặc email...">
            <div id="avpAccUserResults" class="avp-acc-user-results"></div>
            <div id="avpAccSelectedUser" class="avp-acc-selected-user" hidden></div>
          </div>

          <div class="avp-acc-field avp-acc-wide">
            <label>Nội dung</label>
            <textarea id="avpAccContent" maxlength="5000" rows="5" placeholder="Nội dung thông báo học viên sẽ nhìn thấy..."></textarea>
          </div>

          <label class="avp-acc-check">
            <input id="avpAccPinned" type="checkbox">
            <span>📌 Ghim thông báo lên đầu</span>
          </label>

          <button id="avpAccSend" type="button" class="avp-acc-primary">Gửi thông báo</button>
        </div>
      </div>

      <div id="avpAccHistoryTab" class="avp-acc-tab" hidden>
        <div class="avp-acc-split">
          <div>
            <div class="avp-acc-subhead">
              <h3>Thông báo đã phát</h3>
              <span>Bấm một thông báo để xem người đã đọc.</span>
            </div>
            <div id="avpAccNotificationList" class="avp-acc-list"></div>
          </div>

          <div>
            <div class="avp-acc-subhead">
              <h3>Trạng thái người nhận</h3>
              <span id="avpAccAudienceHint">Chưa chọn thông báo.</span>
            </div>
            <div id="avpAccAudience" class="avp-acc-audience">
              <p class="admin-empty">Chọn một thông báo ở cột bên trái.</p>
            </div>
          </div>
        </div>
      </div>

      <div id="avpAccCertsTab" class="avp-acc-tab" hidden>
        <div class="avp-acc-subhead">
          <div>
            <h3>Chứng nhận cộng đồng</h3>
            <span>Xem mã xác minh và thu hồi / khôi phục chứng nhận.</span>
          </div>
          <input id="avpAccCertSearch" type="search" placeholder="Tìm tên, email hoặc mã xác minh...">
        </div>
        <div id="avpAccCertList" class="avp-acc-cert-list"></div>
      </div>
    `;

    if(staticHost){
      staticHost.innerHTML="";
      staticHost.appendChild(section);
    }else{
      const firstPanel=host.querySelector(".admin-panel");
      if(firstPanel) host.insertBefore(section,firstPanel);
      else host.appendChild(section);
    }

    bind();
  }

  function bind(){
    document.querySelectorAll("[data-acc-tab]").forEach(btn=>{
      btn.onclick=async()=>{
        document.querySelectorAll("[data-acc-tab]").forEach(b=>b.classList.toggle("active",b===btn));
        const tab=btn.dataset.accTab;
        $("avpAccSendTab").hidden=tab!=="send";
        $("avpAccHistoryTab").hidden=tab!=="history";
        $("avpAccCertsTab").hidden=tab!=="certs";
        if(tab==="history") await loadNotifications();
        if(tab==="certs") await loadCertificates();
      };
    });

    $("avpAccTarget").onchange=()=>{
      const isUser=$("avpAccTarget").value==="user";
      $("avpAccUserPicker").hidden=!isUser;
      if(!isUser){
        selectedUserId=null;
        $("avpAccSelectedUser").hidden=true;
      }else{
        searchUsers();
      }
    };

    let timer=null;
    $("avpAccUserSearch").oninput=()=>{
      clearTimeout(timer);
      timer=setTimeout(searchUsers,250);
    };

    $("avpAccSend").onclick=sendNotification;
    $("avpAccRefresh").onclick=async()=>{
      await loadNotifications();
      await loadCertificates();
    };

    let certTimer=null;
    $("avpAccCertSearch").oninput=()=>{
      clearTimeout(certTimer);
      certTimer=setTimeout(renderCertificates,180);
    };
  }

  async function searchUsers(){
    const q=String($("avpAccUserSearch")?.value||"").trim();
    try{
      users=await rpc("admin_notification_user_search",{p_search:q||null,p_limit:60});
      renderUsers(Array.isArray(users)?users:[]);
    }catch(e){
      console.warn("notification user search",e);
      $("avpAccUserResults").innerHTML='<p class="admin-empty">Không tải được học viên.</p>';
    }
  }

  function renderUsers(rows){
    const box=$("avpAccUserResults");
    if(!rows.length){
      box.innerHTML='<p class="admin-empty">Không tìm thấy học viên.</p>';
      return;
    }
    box.innerHTML=rows.map(r=>`
      <button type="button" data-user-id="${esc(r.user_id)}">
        <strong>${esc(r.display_name||"Học viên")}</strong>
        <small>${esc(r.email||"")}</small>
      </button>
    `).join("");

    box.querySelectorAll("[data-user-id]").forEach(btn=>{
      btn.onclick=()=>{
        selectedUserId=btn.dataset.userId;
        const row=rows.find(x=>String(x.user_id)===String(selectedUserId));
        const sel=$("avpAccSelectedUser");
        sel.hidden=false;
        sel.innerHTML=`Đang gửi cho: <strong>${esc(row?.display_name||"Học viên")}</strong> <small>${esc(row?.email||"")}</small>`;
      };
    });
  }

  async function sendNotification(){
    const title=String($("avpAccTitle")?.value||"").trim();
    const content=String($("avpAccContent")?.value||"").trim();
    const category=$("avpAccCategory")?.value||"system";
    const target=$("avpAccTarget")?.value||"all";

    if(title.length<3) return alert("Nhập tiêu đề thông báo.");
    if(content.length<2) return alert("Nhập nội dung thông báo.");
    if(target==="user"&&!selectedUserId) return alert("Chọn học viên nhận thông báo.");

    const btn=$("avpAccSend");
    btn.disabled=true;

    try{
      await rpc("admin_system_notification_create",{
        p_title:title,
        p_content:content,
        p_category:category,
        p_target_type:target,
        p_target_user_id:target==="user"?selectedUserId:null,
        p_starts_at:new Date().toISOString(),
        p_expires_at:null,
        p_is_pinned:Boolean($("avpAccPinned")?.checked)
      });

      $("avpAccTitle").value="";
      $("avpAccContent").value="";
      $("avpAccPinned").checked=false;

      alert(target==="all"?"Đã gửi thông báo cho tất cả học viên.":"Đã gửi thông báo cho học viên.");
      await loadNotifications();
    }catch(e){
      console.warn("send notification",e);
      alert("Chưa gửi được thông báo: "+String(e?.message||e));
    }finally{
      btn.disabled=false;
    }
  }

  async function loadNotifications(){
    const box=$("avpAccNotificationList");
    if(!box)return;
    box.innerHTML='<p class="admin-empty">Đang tải...</p>';

    try{
      const rows=await rpc("admin_system_notification_list",{p_limit:150});
      const data=Array.isArray(rows)?rows:[];
      if(!data.length){
        box.innerHTML='<p class="admin-empty">Chưa có thông báo hệ thống.</p>';
        return;
      }

      box.innerHTML=data.map(n=>`
        <article class="avp-acc-notification ${n.is_active?"":"inactive"} ${String(n.id)===String(selectedNotificationId)?"active":""}" data-notification="${esc(n.id)}">
          <div class="avp-acc-notification-head">
            <strong>${esc(n.title)}</strong>
            <span>${esc(catLabel(n.category))}</span>
          </div>
          <p>${esc(n.content)}</p>
          <small>${fmt(n.created_at)} · ${n.target_type==="all"?"Tất cả học viên":"Một học viên"} · Đã đọc ${Number(n.read_count||0)}</small>
          <div class="avp-acc-notification-actions">
            <button type="button" data-view="${esc(n.id)}">👁 Đã đọc / chưa đọc</button>
            <button type="button" data-toggle="${esc(n.id)}" data-active="${n.is_active?"1":"0"}">${n.is_active?"Tắt":"Bật lại"}</button>
          </div>
        </article>
      `).join("");

      box.querySelectorAll("[data-view]").forEach(btn=>{
        btn.onclick=e=>{
          e.stopPropagation();
          showAudience(btn.dataset.view);
        };
      });

      box.querySelectorAll("[data-toggle]").forEach(btn=>{
        btn.onclick=async e=>{
          e.stopPropagation();
          await toggleNotification(btn.dataset.toggle,btn.dataset.active!=="1");
        };
      });

      box.querySelectorAll("[data-notification]").forEach(item=>{
        item.onclick=()=>showAudience(item.dataset.notification);
      });
    }catch(e){
      console.warn("load notifications",e);
      box.innerHTML='<p class="admin-empty">Không tải được lịch sử thông báo.</p>';
    }
  }

  async function showAudience(id){
    selectedNotificationId=id;
    const box=$("avpAccAudience");
    box.innerHTML='<p class="admin-empty">Đang tải...</p>';

    try{
      const [audience,stats]=await Promise.all([
        rpc("admin_system_notification_audience",{p_notification_id:id}),
        rpc("admin_system_notification_stats",{p_notification_id:id})
      ]);

      const rows=Array.isArray(audience)?audience:[];
      const s=Array.isArray(stats)?stats[0]:stats;

      $("avpAccAudienceHint").textContent=
        `${Number(s?.total_recipients||0)} người nhận · ${Number(s?.read_count||0)} đã đọc · ${Number(s?.unread_count||0)} chưa đọc`;

      renderAudience(rows);
      await loadNotifications();
    }catch(e){
      console.warn("audience",e);
      box.innerHTML='<p class="admin-empty">Không tải được trạng thái đã đọc.</p>';
    }
  }

  function renderAudience(rows){
    const read=rows.filter(x=>x.is_read);
    const unread=rows.filter(x=>!x.is_read);
    const box=$("avpAccAudience");

    box.innerHTML=`
      <div class="avp-acc-audience-summary">
        <button type="button" class="active" data-af="all">Tất cả ${rows.length}</button>
        <button type="button" data-af="read">Đã đọc ${read.length}</button>
        <button type="button" data-af="unread">Chưa đọc ${unread.length}</button>
      </div>
      <div id="avpAccAudienceRows"></div>
    `;

    const render=filter=>{
      const list=filter==="read"?read:filter==="unread"?unread:rows;
      $("avpAccAudienceRows").innerHTML=list.map(r=>`
        <div class="avp-acc-audience-row ${r.is_read?"read":"unread"}">
          <i></i>
          <div>
            <strong>${esc(r.display_name||"Học viên")}</strong>
            <small>${esc(r.email||"")}</small>
          </div>
          <div>
            <b>${r.is_read?"Đã đọc":"Chưa đọc"}</b>
            <small>${r.is_read?fmt(r.read_at):"—"}</small>
          </div>
        </div>
      `).join("") || '<p class="admin-empty">Không có học viên.</p>';
    };

    render("all");

    box.querySelectorAll("[data-af]").forEach(btn=>{
      btn.onclick=()=>{
        box.querySelectorAll("[data-af]").forEach(b=>b.classList.toggle("active",b===btn));
        render(btn.dataset.af);
      };
    });
  }

  async function toggleNotification(id,active){
    try{
      await rpc("admin_system_notification_set_active",{p_id:id,p_active:active});
      await loadNotifications();
    }catch(e){
      alert("Chưa cập nhật được trạng thái.");
    }
  }

  let certRows=[];

  async function loadCertificates(){
    const box=$("avpAccCertList");
    if(!box)return;
    box.innerHTML='<p class="admin-empty">Đang tải...</p>';

    try{
      const rows=await rpc("admin_community_certificate_list",{p_limit:300});
      certRows=Array.isArray(rows)?rows:[];
      renderCertificates();
    }catch(e){
      console.warn("cert list",e);
      box.innerHTML='<p class="admin-empty">Chưa tải được chứng nhận. Nếu chưa chạy SQL V2 chứng nhận, mục này sẽ chưa hoạt động.</p>';
    }
  }

  function renderCertificates(){
    const box=$("avpAccCertList");
    if(!box)return;

    const q=String($("avpAccCertSearch")?.value||"").trim().toLowerCase();
    const rows=certRows.filter(r=>{
      if(!q)return true;
      return [
        r.display_name,r.email,r.verification_code,r.title
      ].some(v=>String(v||"").toLowerCase().includes(q));
    });

    if(!rows.length){
      box.innerHTML='<p class="admin-empty">Không có chứng nhận phù hợp.</p>';
      return;
    }

    box.innerHTML=rows.map(r=>`
      <article class="avp-acc-cert ${r.revoked_at?"revoked":""}">
        <div>
          <strong>${esc(r.display_name||"Học viên")}</strong>
          <small>${esc(r.email||"")}</small>
        </div>
        <div>
          <b>${esc(r.title)}</b>
          <small>Mã: ${esc(r.verification_code)} · ${fmt(r.issued_at)}</small>
        </div>
        <div class="avp-acc-cert-actions">
          <button type="button" data-copy="${esc(r.verification_code)}">📋 Mã</button>
          <button type="button" data-revoke="${esc(r.id)}" data-is-revoked="${r.revoked_at?"1":"0"}">
            ${r.revoked_at?"Khôi phục":"Thu hồi"}
          </button>
        </div>
      </article>
    `).join("");

    box.querySelectorAll("[data-copy]").forEach(btn=>{
      btn.onclick=async()=>{
        try{
          await navigator.clipboard.writeText(btn.dataset.copy);
          alert("Đã sao chép mã xác minh.");
        }catch{
          alert("Mã: "+btn.dataset.copy);
        }
      };
    });

    box.querySelectorAll("[data-revoke]").forEach(btn=>{
      btn.onclick=()=>setCertificateRevoked(
        btn.dataset.revoke,
        btn.dataset.isRevoked!=="1"
      );
    });
  }

  async function setCertificateRevoked(id,revoked){
    const ok=confirm(revoked
      ?"Thu hồi chứng nhận này?"
      :"Khôi phục hiệu lực chứng nhận này?");
    if(!ok)return;

    try{
      await rpc("admin_community_certificate_set_revoked",{
        p_certificate_id:id,
        p_revoked:revoked
      });
      await loadCertificates();
    }catch(e){
      alert("Chưa cập nhật được chứng nhận.");
    }
  }


  function setCommunityHealth(ok,title,detail){
    const card=document.querySelector('[data-health="community"]');
    if(!card)return;
    const strong=card.querySelector("strong");
    const small=card.querySelector("small");
    if(strong)strong.textContent=title || (ok?"Hoạt động":"Cần kiểm tra");
    if(small)small.textContent=detail || "";
    card.classList.toggle("ok",Boolean(ok));
    card.classList.toggle("bad",!ok);
  }

  async function checkCommunityHealth(){
    try{
      const tests=await Promise.allSettled([
        client.rpc("admin_system_notification_list",{p_limit:1}),
        client.rpc("admin_notification_user_search",{p_search:null,p_limit:1})
      ]);

      const errors=tests
        .filter(x=>x.status==="rejected" || x.value?.error)
        .map(x=>x.reason?.message || x.value?.error?.message || "RPC lỗi");

      if(errors.length){
        setCommunityHealth(false,"Cần kiểm tra",errors[0]);
        return;
      }

      setCommunityHealth(true,"Hoạt động","Thông báo & cộng đồng sẵn sàng");
    }catch(e){
      setCommunityHealth(false,"Cần kiểm tra",String(e?.message||e));
    }
  }

  async function init(){
    if(!(await waitClient()))return;

    let admin=false;
    for(let i=0;i<20;i++){
      admin=await isAdmin();
      if(admin) break;
      await new Promise(r=>setTimeout(r,250));
    }
    if(!admin)return;

    mount();
    await checkCommunityHealth();
    await searchUsers();
    await loadNotifications();
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",init,{once:true});
  }else{
    init();
  }
})();