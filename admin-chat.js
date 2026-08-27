(function(){
  "use strict";
  if(window.__AVP_ADMIN_CHAT_LOADED__) return;
  window.__AVP_ADMIN_CHAT_LOADED__=true;

  const $=(id)=>document.getElementById(id);
  const esc=(s)=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  const fmt=(v)=>{try{return new Date(v).toLocaleString("vi-VN",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}catch{return ""}};
  const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
  let client=null,user=null,threadId=null,pollTimer=null,realtimeChannel=null;

  async function waitClient(){
    for(let i=0;i<80;i++){
      if(window.avpSupabase){client=window.avpSupabase;break}
      await sleep(100);
    }
    if(!client) return false;
    const {data}=await client.auth.getUser();
    user=data?.user||null;
    return !!user;
  }
  async function rpc(name,args){
    const {data,error}=await client.rpc(name,args||{});
    if(error) throw error;
    return data;
  }
  async function isAdmin(){
    try{return !!(await rpc("avp_chat_is_admin"))}catch{return false}
  }

  function msgHtml(m, adminView=false){
    const type=m.sender_type||"system";
    let cls=type;
    if(adminView && type==="admin") cls="user";
    else if(adminView && type==="user") cls="admin";
    const who=type==="system"?"Hệ thống":type==="admin"?"Admin":"Bạn";
    return `<div class="avp-msg-row ${cls}"><div class="avp-msg"><div>${esc(m.body)}</div><span class="avp-msg-meta">${esc(who)} • ${fmt(m.created_at)}</span></div></div>`;
  }

  /* ================= USER BUBBLE ================= */
  function mountUserUI(){
    if($("avpAdminChatRoot")) return;
    const root=document.createElement("div");
    root.id="avpAdminChatRoot";
    root.innerHTML=`
      <button class="avp-chat-bubble" id="avpChatBubble" type="button" aria-label="Chat với Admin" title="Chat với Admin">
        💬<span class="avp-chat-badge" id="avpChatBadge" hidden>0</span>
      </button>
      <section class="avp-chat-panel" id="avpChatPanel" hidden aria-label="Hộp thư với Admin">
        <header class="avp-chat-head">
          <div class="avp-chat-head-icon">💬</div>
          <div class="avp-chat-head-copy"><strong>Chat với Admin</strong><small>Hỏi bài, báo lỗi file hoặc góp ý nội dung</small></div>
          <button class="avp-chat-close" id="avpChatClose" type="button" aria-label="Đóng">×</button>
        </header>
        <div class="avp-chat-messages" id="avpChatMessages"><div class="avp-chat-empty">Đang tải hộp thư…</div></div>
        <div class="avp-chat-compose">
          <textarea id="avpChatInput" maxlength="3000" rows="1" placeholder="Nhắn cho Admin…"></textarea>
          <button class="avp-chat-send" id="avpChatSend" type="button">Gửi</button>
        </div>
        <div class="avp-chat-note">Tin nhắn gắn với tài khoản đang đăng nhập và đồng bộ trên các thiết bị.</div>
      </section>`;
    document.body.appendChild(root);
    bindDrag();
    $("avpChatBubble").addEventListener("click",onBubbleClick);
    $("avpChatClose").addEventListener("click",()=>togglePanel(false));
    $("avpChatSend").addEventListener("click",sendUserMessage);
    $("avpChatInput").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendUserMessage()}});
  }

  function bindDrag(){
    const b=$("avpChatBubble"); if(!b)return;
    const saved=(()=>{try{return JSON.parse(localStorage.getItem("avp_admin_chat_pos_v1")||"null")}catch{return null}})();
    if(saved&&Number.isFinite(saved.x)&&Number.isFinite(saved.y)){b.style.left=saved.x+"px";b.style.top=saved.y+"px";b.style.right="auto";b.style.bottom="auto"}
    let drag=false,moved=false,sx=0,sy=0,bx=0,by=0;
    b.addEventListener("pointerdown",e=>{if(e.button!==0)return;drag=true;moved=false;sx=e.clientX;sy=e.clientY;const r=b.getBoundingClientRect();bx=r.left;by=r.top;b.setPointerCapture?.(e.pointerId)});
    b.addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)+Math.abs(dy)>6)moved=true;const x=Math.max(6,Math.min(innerWidth-b.offsetWidth-6,bx+dx));const y=Math.max(6,Math.min(innerHeight-b.offsetHeight-6,by+dy));b.style.left=x+"px";b.style.top=y+"px";b.style.right="auto";b.style.bottom="auto"});
    b.addEventListener("pointerup",()=>{if(!drag)return;drag=false;const r=b.getBoundingClientRect();localStorage.setItem("avp_admin_chat_pos_v1",JSON.stringify({x:r.left,y:r.top}));b.dataset.justDragged=moved?"1":"0";setTimeout(()=>delete b.dataset.justDragged,0)});
  }

  async function onBubbleClick(e){
    const b=$("avpChatBubble"); if(b?.dataset.justDragged==="1") return;
    const open=$("avpChatPanel")?.hidden!==false;
    await togglePanel(open);
  }
  async function togglePanel(open){
    const p=$("avpChatPanel"); if(!p)return;
    p.hidden=!open;
    if(open){await loadUserMessages();await markUserRead();$("avpChatInput")?.focus()}
  }
  async function ensureThread(){
    if(threadId)return threadId;
    threadId=await rpc("avp_chat_get_or_create_thread");
    return threadId;
  }
  async function loadUserMessages(){
    const box=$("avpChatMessages");if(!box)return;
    try{
      await ensureThread();
      const rows=await rpc("avp_chat_my_messages",{p_limit:150});
      const list=Array.isArray(rows)?rows:[];
      box.innerHTML=list.length?list.map(m=>msgHtml(m,false)).join(""):'<div class="avp-chat-empty">Bạn chưa có tin nhắn. Có gì cần hỗ trợ cứ nhắn cho Admin nhé.</div>';
      box.scrollTop=box.scrollHeight;
    }catch(e){box.innerHTML='<div class="avp-chat-empty">Chưa tải được hộp thư. Hãy kiểm tra SQL chat trong Supabase.</div>';console.warn("AVP chat load",e)}
  }
  async function sendUserMessage(){
    const input=$("avpChatInput"),btn=$("avpChatSend"); if(!input||!btn)return;
    const body=input.value.trim();if(!body)return;
    btn.disabled=true;
    try{await rpc("avp_chat_send_user_message",{p_body:body});input.value="";await loadUserMessages()}catch(e){alert("Chưa gửi được tin nhắn. Vui lòng thử lại.");console.warn(e)}finally{btn.disabled=false;input.focus()}
  }
  async function updateUserBadge(){
    try{
      const n=Number(await rpc("avp_chat_my_unread_count"))||0;
      const badge=$("avpChatBadge");if(!badge)return;
      badge.hidden=n<=0;badge.textContent=n>99?"99+":String(n);
    }catch{}
  }
  async function markUserRead(){try{await rpc("avp_chat_mark_user_read");await updateUserBadge()}catch{}}
  function startUserLive(){
    clearInterval(pollTimer);pollTimer=setInterval(async()=>{await updateUserBadge();if($("avpChatPanel")&&!$("avpChatPanel").hidden)await loadUserMessages()},20000);
    try{
      if(realtimeChannel)client.removeChannel(realtimeChannel);
      realtimeChannel=client.channel("avp-chat-user-"+user.id).on("postgres_changes",{event:"INSERT",schema:"public",table:"admin_chat_messages",filter:`thread_id=eq.${threadId}`},async()=>{await updateUserBadge();if(!$("avpChatPanel").hidden){await loadUserMessages();await markUserRead()}}).subscribe();
    }catch{}
  }
  async function initUser(){
    mountUserUI();
    try{await ensureThread();await rpc("avp_chat_ensure_daily_greeting");await updateUserBadge();startUserLive()}catch(e){console.warn("AVP chat init",e)}
  }

  /* ================= ADMIN INBOX ================= */
  let adminThreads=[],activeThread=null,adminPoll=null;
  function renderAdminThreads(filter=""){
    const root=$("adminChatThreads");if(!root)return;
    const q=filter.trim().toLocaleLowerCase("vi-VN");
    const list=adminThreads.filter(t=>!q||String(t.display_name||"").toLocaleLowerCase("vi-VN").includes(q)||String(t.email||"").toLowerCase().includes(q));
    if(!list.length){root.innerHTML='<div class="admin-chat-empty">Không tìm thấy cuộc trò chuyện.</div>';return}
    root.innerHTML=list.map(t=>`<button class="admin-chat-thread ${activeThread===t.thread_id?"active":""}" type="button" data-thread="${esc(t.thread_id)}"><div class="admin-chat-thread-top"><b>${esc(t.display_name||"Người học")}</b>${Number(t.admin_unread_count)>0?`<span class="admin-chat-dot">${Number(t.admin_unread_count)>99?"99+":Number(t.admin_unread_count)}</span>`:""}<time>${fmt(t.last_message_at)}</time></div><small>${esc(t.email||"")}</small><p>${esc(t.last_message||"Chưa có tin nhắn")}</p></button>`).join("");
    root.querySelectorAll("[data-thread]").forEach(b=>b.onclick=()=>openAdminThread(b.dataset.thread));
  }
  function setAdminBadge(){
    const n=adminThreads.reduce((s,t)=>s+(Number(t.admin_unread_count)||0),0);
    const badge=$("adminChatUnread");if(badge){badge.hidden=n<=0;badge.textContent=n>99?"99+":String(n)}
    const tab=document.querySelector('[data-admin-view="inbox"]');
    if(tab){let pill=tab.querySelector(".admin-chat-unread-pill");if(!pill){pill=document.createElement("span");pill.className="admin-chat-unread-pill";tab.querySelector("b")?.appendChild(pill)}pill.hidden=n<=0;pill.textContent=n>99?"99+":String(n)}
  }
  async function loadAdminThreads(){
    try{const rows=await rpc("avp_chat_admin_threads");adminThreads=Array.isArray(rows)?rows:[];setAdminBadge();renderAdminThreads($("adminChatSearch")?.value||"");if(activeThread&&!adminThreads.some(t=>t.thread_id===activeThread))activeThread=null}
    catch(e){const r=$("adminChatThreads");if(r)r.innerHTML='<div class="admin-chat-empty">Chưa tải được Chat. Hãy chạy admin-chat-setup.sql.</div>';console.warn(e)}
  }
  async function openAdminThread(id){
    activeThread=id;renderAdminThreads($("adminChatSearch")?.value||"");
    const t=adminThreads.find(x=>x.thread_id===id);
    if($("adminChatPerson"))$("adminChatPerson").textContent=t?.display_name||"Người học";
    if($("adminChatEmail"))$("adminChatEmail").textContent=t?.email||"";
    try{
      const rows=await rpc("avp_chat_admin_messages",{p_thread_id:id,p_limit:300});
      const box=$("adminChatMessages");const list=Array.isArray(rows)?rows:[];
      if(box){box.innerHTML=list.length?list.map(m=>msgHtml(m,true)).join(""):'<div class="admin-chat-empty">Chưa có tin nhắn.</div>';box.scrollTop=box.scrollHeight}
      await rpc("avp_chat_admin_mark_read",{p_thread_id:id});await loadAdminThreads();
    }catch(e){console.warn(e)}
  }
  async function sendAdminMessage(){
    if(!activeThread)return;
    const input=$("adminChatReply"),btn=$("adminChatReplyBtn");if(!input||!btn)return;
    const body=input.value.trim();if(!body)return;
    btn.disabled=true;
    try{await rpc("avp_chat_admin_send_message",{p_thread_id:activeThread,p_body:body});input.value="";await openAdminThread(activeThread)}catch(e){alert("Không gửi được phản hồi.");console.warn(e)}finally{btn.disabled=false;input.focus()}
  }
  async function initAdmin(){
    if(!(await isAdmin()))return;
    $("adminChatSearch")?.addEventListener("input",e=>renderAdminThreads(e.target.value));
    $("adminChatRefresh")?.addEventListener("click",loadAdminThreads);
    $("adminChatReplyBtn")?.addEventListener("click",sendAdminMessage);
    $("adminChatReply")?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendAdminMessage()}});
    await loadAdminThreads();
    adminPoll=setInterval(async()=>{await loadAdminThreads();if(activeThread)await openAdminThread(activeThread)},15000);
    try{client.channel("avp-chat-admin-live").on("postgres_changes",{event:"INSERT",schema:"public",table:"admin_chat_messages"},async()=>{await loadAdminThreads();if(activeThread)await openAdminThread(activeThread)}).subscribe()}catch{}
  }

  async function start(){
    if(!(await waitClient()))return;
    if(document.body?.dataset?.adminPage==="1"||$("adminChatInbox")){await initAdmin();return}
    if(await isAdmin())return; // Admin khong can bong bong chat nguoi dung.
    await initUser();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
