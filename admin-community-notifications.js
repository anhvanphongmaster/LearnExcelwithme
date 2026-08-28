(() => {
  "use strict";
  if(window.__AVP_ADMIN_SYSTEM_NOTIFICATIONS__) return;
  window.__AVP_ADMIN_SYSTEM_NOTIFICATIONS__=true;

  const $=id=>document.getElementById(id);
  const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));

  let client=null;
  let selectedNotificationId=null;

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
    if(error)throw error;
    return data;
  }

  function fmt(v){
    if(!v)return "—";
    try{return new Date(v).toLocaleString("vi-VN")}catch{return String(v)}
  }

  function categoryLabel(v){
    return ({
      system:"Hệ thống",
      minigame:"Mini game",
      event:"Sự kiện",
      update:"Cập nhật",
      important:"Quan trọng"
    })[v]||v||"Hệ thống";
  }

  function mount(){
    if($("avpAdminNotificationManager"))return;

    const host=$("adminDashboard");
    if(!host)return;

    const section=document.createElement("section");
    section.id="avpAdminNotificationManager";
    section.className="admin-panel avp-admin-notify-panel";
    section.innerHTML=`
      <div class="admin-panel-head">
        <div>
          <span>🔔 THÔNG BÁO</span>
          <h2>Phát thông báo cho học viên</h2>
        </div>
        <button id="avpAdminNotifyRefresh" type="button" class="avp-admin-notify-secondary">↻ Làm mới</button>
      </div>

      <div class="avp-admin-notify-compose">
        <div class="avp-admin-notify-field avp-admin-notify-wide">
          <label>Tiêu đề</label>
          <input id="avpAdminNotifyTitle" maxlength="180" placeholder="Ví dụ: Mini game Excel cuối tuần">
        </div>

        <div class="avp-admin-notify-field">
          <label>Loại</label>
          <select id="avpAdminNotifyCategory">
            <option value="system">Hệ thống</option>
            <option value="minigame">Mini game</option>
            <option value="event">Sự kiện</option>
            <option value="update">Cập nhật</option>
            <option value="important">Quan trọng</option>
          </select>
        </div>

        <div class="avp-admin-notify-field">
          <label>Người nhận</label>
          <select id="avpAdminNotifyTarget">
            <option value="all">Tất cả học viên</option>
            <option value="user">Một học viên</option>
          </select>
        </div>

        <div class="avp-admin-notify-field avp-admin-notify-user-field" hidden>
          <label>User ID</label>
          <input id="avpAdminNotifyUserId" placeholder="UUID học viên">
        </div>

        <div class="avp-admin-notify-field avp-admin-notify-wide">
          <label>Nội dung</label>
          <textarea id="avpAdminNotifyContent" rows="4" maxlength="5000" placeholder="Nội dung thông báo..."></textarea>
        </div>

        <label class="avp-admin-notify-check">
          <input id="avpAdminNotifyPinned" type="checkbox">
          <span>Ghim thông báo lên đầu</span>
        </label>

        <button id="avpAdminNotifySend" type="button" class="avp-admin-notify-primary">Phát thông báo</button>
      </div>

      <div class="avp-admin-notify-grid">
        <div>
          <h3>Thông báo đã phát</h3>
          <div id="avpAdminNotifyList" class="avp-admin-notify-list">
            <p class="admin-empty">Đang tải...</p>
          </div>
        </div>

        <div>
          <h3>Trạng thái người nhận</h3>
          <div id="avpAdminNotifyAudience" class="avp-admin-notify-audience">
            <p class="admin-empty">Chọn một thông báo để xem ai đã đọc / chưa đọc.</p>
          </div>
        </div>
      </div>
    `;

    const firstPanel=host.querySelector(".admin-panel");
    if(firstPanel) host.insertBefore(section, firstPanel);
    else host.appendChild(section);

    $("avpAdminNotifyTarget").onchange=()=>{
      document.querySelector(".avp-admin-notify-user-field").hidden=
        $("avpAdminNotifyTarget").value!=="user";
    };

    $("avpAdminNotifySend").onclick=createNotification;
    $("avpAdminNotifyRefresh").onclick=loadNotifications;
  }

  async function createNotification(){
    const title=String($("avpAdminNotifyTitle")?.value||"").trim();
    const content=String($("avpAdminNotifyContent")?.value||"").trim();
    const category=$("avpAdminNotifyCategory")?.value||"system";
    const target=$("avpAdminNotifyTarget")?.value||"all";
    const targetUser=String($("avpAdminNotifyUserId")?.value||"").trim();

    if(title.length<3){
      alert("Nhập tiêu đề thông báo.");
      return;
    }
    if(content.length<2){
      alert("Nhập nội dung thông báo.");
      return;
    }
    if(target==="user"&&!targetUser){
      alert("Nhập User ID của học viên.");
      return;
    }

    const btn=$("avpAdminNotifySend");
    btn.disabled=true;

    try{
      await rpc("admin_system_notification_create",{
        p_title:title,
        p_content:content,
        p_category:category,
        p_target_type:target,
        p_target_user_id:target==="user"?targetUser:null,
        p_starts_at:new Date().toISOString(),
        p_expires_at:null,
        p_is_pinned:Boolean($("avpAdminNotifyPinned")?.checked)
      });

      $("avpAdminNotifyTitle").value="";
      $("avpAdminNotifyContent").value="";
      $("avpAdminNotifyPinned").checked=false;
      await loadNotifications();
      alert("Đã phát thông báo.");
    }catch(e){
      console.warn("Admin create notification",e);
      alert("Chưa phát được thông báo: "+String(e?.message||e));
    }finally{
      btn.disabled=false;
    }
  }

  async function loadNotifications(){
    const box=$("avpAdminNotifyList");
    if(!box)return;
    box.innerHTML='<p class="admin-empty">Đang tải...</p>';

    try{
      const rows=await rpc("admin_system_notification_list",{p_limit:100});
      renderList(Array.isArray(rows)?rows:[]);
    }catch(e){
      console.warn("Admin notification list",e);
      box.innerHTML='<p class="admin-empty">Không tải được danh sách thông báo.</p>';
    }
  }

  function renderList(rows){
    const box=$("avpAdminNotifyList");
    if(!rows.length){
      box.innerHTML='<p class="admin-empty">Chưa có thông báo hệ thống.</p>';
      return;
    }

    box.innerHTML=rows.map(n=>`
      <article class="avp-admin-notify-item ${n.is_active?"":"inactive"} ${String(n.id)===String(selectedNotificationId)?"active":""}" data-notification-id="${esc(n.id)}">
        <div class="avp-admin-notify-item-head">
          <strong>${esc(n.title)}</strong>
          <span>${esc(categoryLabel(n.category))}</span>
        </div>
        <p>${esc(n.content)}</p>
        <small>
          ${fmt(n.created_at)} · Đã đọc: ${Number(n.read_count||0)}
          ${n.is_pinned?" · 📌 Đã ghim":""}
        </small>
        <div class="avp-admin-notify-item-actions">
          <button type="button" data-audience="${esc(n.id)}">👥 Ai đã đọc?</button>
          <button type="button" data-toggle="${esc(n.id)}" data-active="${n.is_active?"1":"0"}">
            ${n.is_active?"Tắt":"Bật lại"}
          </button>
        </div>
      </article>
    `).join("");

    box.querySelectorAll("[data-audience]").forEach(btn=>{
      btn.onclick=e=>{
        e.stopPropagation();
        showAudience(btn.dataset.audience);
      };
    });

    box.querySelectorAll("[data-toggle]").forEach(btn=>{
      btn.onclick=async e=>{
        e.stopPropagation();
        await setActive(btn.dataset.toggle,btn.dataset.active!=="1");
      };
    });

    box.querySelectorAll("[data-notification-id]").forEach(item=>{
      item.onclick=()=>showAudience(item.dataset.notificationId);
    });
  }

  async function setActive(id,active){
    try{
      await rpc("admin_system_notification_set_active",{
        p_id:id,
        p_active:active
      });
      await loadNotifications();
    }catch(e){
      console.warn("Admin notification active",e);
      alert("Chưa cập nhật được trạng thái.");
    }
  }

  async function showAudience(id){
    selectedNotificationId=id;
    const box=$("avpAdminNotifyAudience");
    box.innerHTML='<p class="admin-empty">Đang tải trạng thái đọc...</p>';

    try{
      const rows=await rpc("admin_system_notification_audience",{
        p_notification_id:id
      });
      renderAudience(Array.isArray(rows)?rows:[]);
      await loadNotifications();
    }catch(e){
      console.warn("Admin notification audience",e);
      box.innerHTML='<p class="admin-empty">Không tải được trạng thái. Hãy chạy SQL patch Admin Notification.</p>';
    }
  }

  function renderAudience(rows){
    const box=$("avpAdminNotifyAudience");
    if(!rows.length){
      box.innerHTML='<p class="admin-empty">Thông báo này chưa có người nhận phù hợp.</p>';
      return;
    }

    const read=rows.filter(x=>x.is_read);
    const unread=rows.filter(x=>!x.is_read);

    box.innerHTML=`
      <div class="avp-admin-notify-summary">
        <div><strong>${rows.length}</strong><span>Người nhận</span></div>
        <div class="read"><strong>${read.length}</strong><span>Đã đọc</span></div>
        <div class="unread"><strong>${unread.length}</strong><span>Chưa đọc</span></div>
      </div>

      <div class="avp-admin-audience-tabs">
        <button type="button" class="active" data-audience-filter="all">Tất cả</button>
        <button type="button" data-audience-filter="read">Đã đọc (${read.length})</button>
        <button type="button" data-audience-filter="unread">Chưa đọc (${unread.length})</button>
      </div>

      <div id="avpAdminAudienceRows"></div>
    `;

    const render=(filter)=>{
      const list=filter==="read"?read:filter==="unread"?unread:rows;
      $("avpAdminAudienceRows").innerHTML=list.map(r=>`
        <div class="avp-admin-audience-row ${r.is_read?"read":"unread"}">
          <span class="avp-admin-audience-dot"></span>
          <div>
            <strong>${esc(r.display_name||"Học viên")}</strong>
            <small>${esc(r.email||"")}</small>
          </div>
          <div class="avp-admin-audience-state">
            ${r.is_read
              ? `<b>Đã đọc</b><small>${fmt(r.read_at)}</small>`
              : `<b>Chưa đọc</b><small>—</small>`}
          </div>
        </div>
      `).join("") || '<p class="admin-empty">Không có học viên trong mục này.</p>';
    };

    render("all");

    box.querySelectorAll("[data-audience-filter]").forEach(btn=>{
      btn.onclick=()=>{
        box.querySelectorAll("[data-audience-filter]").forEach(b=>b.classList.toggle("active",b===btn));
        render(btn.dataset.audienceFilter);
      };
    });
  }

  async function init(){
    if(!(await waitClient()))return;

    try{
      const {data}=await client.auth.getSession();
      if(!data?.session?.user)return;

      const {data:isAdmin}=await client.rpc("is_admin_user");
      if(isAdmin!==true)return;
    }catch{
      return;
    }

    mount();
    await loadNotifications();
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",init,{once:true});
  }else{
    init();
  }
})();
