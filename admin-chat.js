(function(){
  "use strict";
  if(window.__AVP_ADMIN_CHAT_LOADED__) return;
  window.__AVP_ADMIN_CHAT_LOADED__=true;

  const $=(id)=>document.getElementById(id);
  const esc=(s)=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  const fmt=(v)=>{try{return new Date(v).toLocaleString("vi-VN",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}catch{return ""}};
  const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
  let client=null,user=null,threadId=null,pollTimer=null,realtimeChannel=null;
  let authSubscribed=false;

  const ATTACH_PREFIX="[[AVP_ATTACHMENT_V1]]";
  const CHAT_BUCKET="chat-attachments";
  const MAX_FILE_BYTES=20*1024*1024;
  const MAX_FILES_PER_SEND=5;
  const ALLOWED_EXT=new Set(["jpg","jpeg","png","webp","gif","pdf","xlsx","xls","csv","doc","docx","ppt","pptx","txt","zip"]);
  const pendingFiles={user:[],admin:[],float:[]};

  const extOf=(name)=>String(name||"").split(".").pop().toLowerCase();
  const sizeText=(n)=>{n=Number(n)||0;if(n<1024)return n+" B";if(n<1024*1024)return (n/1024).toFixed(1)+" KB";return (n/1024/1024).toFixed(1)+" MB"};
  const isImageFile=(f)=>String(f?.type||"").startsWith("image/")||["jpg","jpeg","png","webp","gif"].includes(extOf(f?.name));
  function validateFiles(files){
    const arr=[...files].slice(0,MAX_FILES_PER_SEND);
    const bad=arr.find(f=>f.size>MAX_FILE_BYTES||!ALLOWED_EXT.has(extOf(f.name)));
    if(bad) throw new Error(`File ${bad.name} không được hỗ trợ hoặc lớn hơn 20 MB.`);
    return arr;
  }
  function makeAttachmentBody(meta,caption=""){return ATTACH_PREFIX+JSON.stringify(meta)+"\n"+String(caption||"").trim()}
  function parseAttachmentBody(body){
    body=String(body||""); if(!body.startsWith(ATTACH_PREFIX))return null;
    const rest=body.slice(ATTACH_PREFIX.length),i=rest.indexOf("\n");
    const json=i<0?rest:rest.slice(0,i),caption=i<0?"":rest.slice(i+1);
    try{return {meta:JSON.parse(json),caption}}catch{return null}
  }
  function attachmentCardHtml(a){
    const m=a.meta||{},name=esc(m.name||"Tệp đính kèm"),size=esc(sizeText(m.size)),kind=m.kind==="image";
    const caption=a.caption?`<div class="avp-attach-caption">${esc(a.caption)}</div>`:"";
    if(kind)return `<div class="avp-chat-attachment avp-chat-image" data-chat-path="${esc(m.path||"")}" data-kind="image"><button type="button" class="avp-image-open" aria-label="Mở ảnh"><span>🖼️ Đang tải ảnh…</span></button><small>${name} · ${size}</small></div>${caption}`;
    return `<div class="avp-chat-attachment avp-chat-file" data-chat-path="${esc(m.path||"")}" data-kind="file"><button type="button" class="avp-file-open"><span class="avp-file-icon">📎</span><span><b>${name}</b><small>${esc((m.ext||"").toUpperCase())} · ${size}</small></span><em>Mở</em></button></div>${caption}`;
  }
  async function signPath(path){
    if(!client||!path)return null;
    try{const {data,error}=await client.storage.from(CHAT_BUCKET).createSignedUrl(path,3600);if(error)throw error;return data?.signedUrl||null}catch(e){console.warn("AVP chat signed url",e);return null}
  }
  async function hydrateAttachmentUrls(root){
    if(!root)return;
    const nodes=[...root.querySelectorAll("[data-chat-path]")];
    await Promise.all(nodes.map(async n=>{
      if(n.dataset.ready==="1")return; const url=await signPath(n.dataset.chatPath); if(!url)return; n.dataset.ready="1";
      if(n.dataset.kind==="image"){const b=n.querySelector(".avp-image-open");if(b){b.innerHTML=`<img src="${esc(url)}" alt="Ảnh trong tin nhắn" loading="lazy">`;b.onclick=()=>window.open(url,"_blank","noopener")}}
      else{const b=n.querySelector(".avp-file-open");if(b)b.onclick=()=>window.open(url,"_blank","noopener")}
    }));
  }
  async function uploadChatFile(file,scope,thread=""){
    if(!user?.id)throw new Error("Bạn cần đăng nhập để gửi file.");
    const ext=extOf(file.name),safe=(file.name||"file").replace(/[^a-zA-Z0-9._-]+/g,"_").slice(-90);
    const folder=scope==="user"?`users/${user.id}`:`admin/${String(thread||"general").replace(/[^a-zA-Z0-9_-]+/g,"_")}`;
    const path=`${folder}/${Date.now()}-${crypto.randomUUID?.()||Math.random().toString(36).slice(2)}-${safe}`;
    const {error}=await client.storage.from(CHAT_BUCKET).upload(path,file,{cacheControl:"3600",upsert:false,contentType:file.type||undefined});
    if(error)throw error;
    return {path,name:file.name,size:file.size,type:file.type||"application/octet-stream",ext,kind:isImageFile(file)?"image":"file"};
  }
  function previewFiles(scope,hostId){
    const host=$(hostId);if(!host)return;const list=pendingFiles[scope]||[];
    host.hidden=!list.length;host.innerHTML=list.map((f,i)=>`<span>${isImageFile(f)?"🖼️":"📎"} ${esc(f.name)} <small>${sizeText(f.size)}</small><button type="button" data-rm-file="${i}" aria-label="Bỏ file">×</button></span>`).join("");
    host.querySelectorAll("[data-rm-file]").forEach(b=>b.onclick=()=>{list.splice(Number(b.dataset.rmFile),1);previewFiles(scope,hostId)});
  }
  function bindFilePicker(scope,inputId,previewId){
    const input=$(inputId);if(!input)return;input.addEventListener("change",()=>{try{pendingFiles[scope]=validateFiles(input.files||[]);previewFiles(scope,previewId)}catch(e){alert(e.message);pendingFiles[scope]=[]}finally{input.value=""}});
  }

  async function waitClient(){
    // Bong bóng chat phải xuất hiện cả với khách chưa đăng nhập.
    // Vì vậy chỉ cần đợi Supabase client sẵn sàng; session có thể là null.
    for(let i=0;i<120;i++){
      if(window.avpSupabase){client=window.avpSupabase;break}
      await sleep(100);
    }
    if(!client) return false;

    // Cho Supabase một khoảng ngắn để khôi phục session nếu người dùng đã đăng nhập.
    for(let i=0;i<12;i++){
      try{
        const {data:sessionData}=await client.auth.getSession();
        user=sessionData?.session?.user||null;
        if(user) return true;
      }catch{}
      await sleep(150);
    }

    // Không có session => khách. Vẫn tiếp tục để mount bong bóng 💬.
    user=null;
    return true;
  }
  async function rpc(name,args){
    const {data,error}=await client.rpc(name,args||{});
    if(error) throw error;
    return data;
  }
  async function isAdmin(){
    // Cách 1: RPC chat.
    try{
      const v=await rpc("avp_chat_is_admin");
      if(v===true) return true;
    }catch{}

    // Cách 2: fallback đọc trực tiếp profiles.is_admin để bubble Admin
    // không biến mất nếu RPC chưa sẵn sàng/cache schema.
    try{
      if(!user?.id) return false;
      const {data,error}=await client
        .from("profiles")
        .select("is_admin")
        .eq("id",user.id)
        .maybeSingle();
      if(!error && data?.is_admin===true) return true;
    }catch{}
    return false;
  }

  function msgHtml(m, adminView=false){
    const type=m.sender_type||"system";
    let cls=type;
    if(adminView && type==="admin") cls="user";
    else if(adminView && type==="user") cls="admin";
    const who=adminView
      ? (type==="system"?"Hệ thống":type==="admin"?"Bạn (Admin)":"Học viên")
      : (type==="system"?"Hệ thống":type==="admin"?"Admin":"Bạn");
    const a=parseAttachmentBody(m.body);
    const content=a?attachmentCardHtml(a):`<div>${esc(m.body)}</div>`;
    return `<div class="avp-msg-row ${cls}"><div class="avp-msg">${content}<span class="avp-msg-meta">${esc(who)} • ${fmt(m.created_at)}</span></div></div>`;
  }

  /* ================= GUEST BUBBLE ================= */
  function mountGuestUI(){
    if($("avpAdminChatRoot")) return;
    const root=document.createElement("div");
    root.id="avpAdminChatRoot";
    root.className="avp-guest-mode";
    root.innerHTML=`
      <button class="avp-chat-bubble" id="avpChatBubble" type="button" aria-label="Chat với Admin" title="Chat với Admin">💬</button>
      <section class="avp-chat-panel avp-guest-chat-panel" id="avpGuestChatPanel" hidden aria-label="Đăng nhập để chat với Admin">
        <header class="avp-chat-head">
          <div class="avp-chat-head-icon">💬</div>
          <div class="avp-chat-head-copy"><strong>Chat với Admin</strong><small>Hỏi bài, báo lỗi file hoặc góp ý nội dung</small></div>
          <button class="avp-chat-close" id="avpGuestChatClose" type="button" aria-label="Đóng">×</button>
        </header>
        <div class="avp-guest-chat-body">
          <div class="avp-guest-chat-emoji">💬</div>
          <strong>Bạn cần đăng nhập để chat với Admin</strong>
          <p>Sau khi đăng nhập, hộp thư và lịch sử trò chuyện sẽ được đồng bộ theo tài khoản của bạn.</p>
          <div class="avp-guest-chat-actions">
            <a class="avp-guest-login" href="auth.html?mode=login">Đăng nhập</a>
            <a class="avp-guest-register" href="auth.html?mode=register">Đăng ký</a>
          </div>
        </div>
      </section>`;
    document.body.appendChild(root);
    bindDrag();
    $("avpChatBubble").addEventListener("click",()=>{
      if($("avpChatBubble")?.dataset.justDragged==="1")return;
      const p=$("avpGuestChatPanel");
      p.hidden=p.hidden===false;
    });
    $("avpGuestChatClose").addEventListener("click",()=>{$("avpGuestChatPanel").hidden=true});
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
        <div class="avp-chat-file-preview" id="avpChatFilePreview" hidden></div>
        <div class="avp-chat-compose">
          <label class="avp-chat-attach" title="Gửi ảnh hoặc file">📎<input id="avpChatFile" type="file" multiple accept="image/*,.pdf,.xlsx,.xls,.csv,.doc,.docx,.ppt,.pptx,.txt,.zip"></label>
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
    bindFilePicker("user","avpChatFile","avpChatFilePreview");
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
      await hydrateAttachmentUrls(box);
      box.scrollTop=box.scrollHeight;
    }catch(e){box.innerHTML='<div class="avp-chat-empty">Chưa tải được hộp thư. Hãy kiểm tra SQL chat trong Supabase.</div>';console.warn("AVP chat load",e)}
  }
  async function sendUserMessage(){
    const input=$("avpChatInput"),btn=$("avpChatSend"); if(!input||!btn)return;
    const body=input.value.trim(),files=[...(pendingFiles.user||[])];if(!body&&!files.length)return;
    btn.disabled=true;
    try{
      if(files.length){for(let i=0;i<files.length;i++){const meta=await uploadChatFile(files[i],"user",threadId);await rpc("avp_chat_send_user_message",{p_body:makeAttachmentBody(meta,i===0?body:"")})}}
      else await rpc("avp_chat_send_user_message",{p_body:body});
      input.value="";pendingFiles.user=[];previewFiles("user","avpChatFilePreview");await loadUserMessages();
    }catch(e){alert("Chưa gửi được tin nhắn hoặc file. Vui lòng thử lại.");console.warn(e)}finally{btn.disabled=false;input.focus()}
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
      if(box){box.innerHTML=list.length?list.map(m=>msgHtml(m,true)).join(""):'<div class="admin-chat-empty">Chưa có tin nhắn.</div>';await hydrateAttachmentUrls(box);box.scrollTop=box.scrollHeight}
      await rpc("avp_chat_admin_mark_read",{p_thread_id:id});await loadAdminThreads();
    }catch(e){console.warn(e)}
  }
  async function sendAdminMessage(){
    if(!activeThread)return;
    const input=$("adminChatReply"),btn=$("adminChatReplyBtn");if(!input||!btn)return;
    const body=input.value.trim(),files=[...(pendingFiles.admin||[])];if(!body&&!files.length)return;
    btn.disabled=true;
    try{
      if(files.length){for(let i=0;i<files.length;i++){const meta=await uploadChatFile(files[i],"admin",activeThread);await rpc("avp_chat_admin_send_message",{p_thread_id:activeThread,p_body:makeAttachmentBody(meta,i===0?body:"")})}}
      else await rpc("avp_chat_admin_send_message",{p_thread_id:activeThread,p_body:body});
      input.value="";pendingFiles.admin=[];previewFiles("admin","adminChatFilePreview");await openAdminThread(activeThread);
    }catch(e){alert("Không gửi được phản hồi hoặc file.");console.warn(e)}finally{btn.disabled=false;input.focus()}
  }
  async function initAdmin(){
    if(!(await isAdmin()))return;
    $("adminChatSearch")?.addEventListener("input",e=>renderAdminThreads(e.target.value));
    $("adminChatRefresh")?.addEventListener("click",loadAdminThreads);
    $("adminChatReplyBtn")?.addEventListener("click",sendAdminMessage);
    bindFilePicker("admin","adminChatFile","adminChatFilePreview");
    $("adminChatReply")?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendAdminMessage()}});
    await loadAdminThreads();
    adminPoll=setInterval(async()=>{await loadAdminThreads();if(activeThread)await openAdminThread(activeThread)},15000);
    try{client.channel("avp-chat-admin-live").on("postgres_changes",{event:"INSERT",schema:"public",table:"admin_chat_messages"},async()=>{await loadAdminThreads();if(activeThread)await openAdminThread(activeThread)}).subscribe()}catch{}
  }

  /* ================= ADMIN FLOATING BUBBLE ================= */
  let floatThreads=[],floatActiveThread=null,floatPoll=null,floatRealtime=null;

  function mountAdminFloatingUI(){
    if($("avpAdminChatRoot"))return;
    const root=document.createElement("div");
    root.id="avpAdminChatRoot";
    root.className="avp-admin-mode";
    root.innerHTML=`
      <button class="avp-chat-bubble avp-chat-bubble-admin" id="avpChatBubble" type="button" aria-label="Hộp thư học viên" title="Hộp thư học viên">
        💬<span class="avp-chat-badge" id="avpChatBadge" hidden>0</span>
      </button>
      <section class="avp-chat-panel avp-admin-float-panel" id="avpAdminFloatPanel" hidden aria-label="Hộp thư học viên">
        <header class="avp-chat-head">
          <div class="avp-chat-head-icon">💬</div>
          <div class="avp-chat-head-copy"><strong>Hộp thư Admin</strong><small>Trả lời học viên ngay trên trang này</small></div>
          <button class="avp-chat-close" id="avpAdminFloatClose" type="button" aria-label="Đóng">×</button>
        </header>
        <div class="avp-admin-float-tools">
          <input id="avpAdminFloatSearch" type="search" placeholder="Tìm tên hoặc email…" autocomplete="off">
          <button id="avpAdminFloatRefresh" type="button" title="Làm mới">↻</button>
        </div>
        <div class="avp-admin-float-body">
          <aside class="avp-admin-float-threads" id="avpAdminFloatThreads"><div class="avp-chat-empty">Đang tải học viên…</div></aside>
          <section class="avp-admin-float-conversation">
            <header class="avp-admin-float-person"><strong id="avpAdminFloatPerson">Chọn một học viên</strong><small id="avpAdminFloatEmail">Tin nhắn sẽ hiện ở đây.</small></header>
            <div class="avp-chat-messages" id="avpAdminFloatMessages"><div class="avp-chat-empty">💬 Chưa chọn cuộc trò chuyện.</div></div>
            <div class="avp-chat-file-preview" id="avpAdminFloatFilePreview" hidden></div>
            <div class="avp-chat-compose avp-admin-float-compose">
              <label class="avp-chat-attach" title="Gửi ảnh hoặc file">📎<input id="avpAdminFloatFile" type="file" multiple accept="image/*,.pdf,.xlsx,.xls,.csv,.doc,.docx,.ppt,.pptx,.txt,.zip"></label>
              <textarea id="avpAdminFloatReply" maxlength="3000" rows="1" placeholder="Phản hồi học viên…" disabled></textarea>
              <button class="avp-chat-send" id="avpAdminFloatSend" type="button" disabled>Gửi</button>
            </div>
          </section>
        </div>
      </section>`;
    document.body.appendChild(root);
    bindDrag();
    $("avpChatBubble").addEventListener("click",async()=>{
      if($("avpChatBubble")?.dataset.justDragged==="1")return;
      const p=$("avpAdminFloatPanel");
      const open=p?.hidden!==false;
      p.hidden=!open;
      if(open){await loadFloatingAdminThreads();}
    });
    $("avpAdminFloatClose").addEventListener("click",()=>{$("avpAdminFloatPanel").hidden=true});
    $("avpAdminFloatSearch").addEventListener("input",e=>renderFloatingAdminThreads(e.target.value));
    $("avpAdminFloatRefresh").addEventListener("click",loadFloatingAdminThreads);
    $("avpAdminFloatSend").addEventListener("click",sendFloatingAdminMessage);
    bindFilePicker("float","avpAdminFloatFile","avpAdminFloatFilePreview");
    $("avpAdminFloatReply").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendFloatingAdminMessage()}});
  }

  function setFloatingAdminBadge(){
    const n=floatThreads.reduce((sum,t)=>sum+(Number(t.admin_unread_count)||0),0);
    const badge=$("avpChatBadge");if(!badge)return;
    badge.hidden=n<=0;badge.textContent=n>99?"99+":String(n);
  }

  function renderFloatingAdminThreads(filter=""){
    const root=$("avpAdminFloatThreads");if(!root)return;
    const q=filter.trim().toLocaleLowerCase("vi-VN");
    const list=floatThreads.filter(t=>!q||String(t.display_name||"").toLocaleLowerCase("vi-VN").includes(q)||String(t.email||"").toLowerCase().includes(q));
    if(!list.length){root.innerHTML='<div class="avp-chat-empty">Chưa có cuộc trò chuyện phù hợp.</div>';return}
    root.innerHTML=list.map(t=>`<button class="avp-admin-float-thread ${floatActiveThread===t.thread_id?"active":""}" type="button" data-float-thread="${esc(t.thread_id)}"><div><b>${esc(t.display_name||"Người học")}</b>${Number(t.admin_unread_count)>0?`<span class="admin-chat-dot">${Number(t.admin_unread_count)>99?"99+":Number(t.admin_unread_count)}</span>`:""}</div><small>${esc(t.email||"")}</small><p>${esc(t.last_message||"Chưa có tin nhắn")}</p></button>`).join("");
    root.querySelectorAll("[data-float-thread]").forEach(btn=>btn.addEventListener("click",()=>openFloatingAdminThread(btn.dataset.floatThread)));
  }

  async function loadFloatingAdminThreads(){
    try{
      const rows=await rpc("avp_chat_admin_threads");
      floatThreads=Array.isArray(rows)?rows:[];
      setFloatingAdminBadge();
      renderFloatingAdminThreads($("avpAdminFloatSearch")?.value||"");
      if(floatActiveThread&&!floatThreads.some(t=>t.thread_id===floatActiveThread))floatActiveThread=null;
    }catch(e){
      const root=$("avpAdminFloatThreads");if(root)root.innerHTML='<div class="avp-chat-empty">Không tải được hộp thư Admin.</div>';
      console.warn("AVP floating admin threads",e);
    }
  }

  async function openFloatingAdminThread(id){
    floatActiveThread=id;
    renderFloatingAdminThreads($("avpAdminFloatSearch")?.value||"");
    const t=floatThreads.find(x=>x.thread_id===id);
    if($("avpAdminFloatPerson"))$("avpAdminFloatPerson").textContent=t?.display_name||"Người học";
    if($("avpAdminFloatEmail"))$("avpAdminFloatEmail").textContent=t?.email||"";
    const input=$("avpAdminFloatReply"),send=$("avpAdminFloatSend");
    if(input)input.disabled=false;if(send)send.disabled=false;
    try{
      const rows=await rpc("avp_chat_admin_messages",{p_thread_id:id,p_limit:300});
      const box=$("avpAdminFloatMessages"),list=Array.isArray(rows)?rows:[];
      if(box){box.innerHTML=list.length?list.map(m=>msgHtml(m,true)).join(""):'<div class="avp-chat-empty">Chưa có tin nhắn.</div>';await hydrateAttachmentUrls(box);box.scrollTop=box.scrollHeight;}
      await rpc("avp_chat_admin_mark_read",{p_thread_id:id});
      await loadFloatingAdminThreads();
      input?.focus();
    }catch(e){console.warn("AVP floating admin open",e)}
  }

  async function sendFloatingAdminMessage(){
    if(!floatActiveThread)return;
    const input=$("avpAdminFloatReply"),btn=$("avpAdminFloatSend");if(!input||!btn)return;
    const body=input.value.trim();if(!body)return;
    btn.disabled=true;
    try{
      await rpc("avp_chat_admin_send_message",{p_thread_id:floatActiveThread,p_body:body});
      input.value="";
      await openFloatingAdminThread(floatActiveThread);
    }catch(e){alert("Không gửi được phản hồi.");console.warn(e)}
    finally{btn.disabled=false;input.focus()}
  }

  async function initFloatingAdmin(){
    mountAdminFloatingUI();
    await loadFloatingAdminThreads();
    clearInterval(floatPoll);
    floatPoll=setInterval(async()=>{
      await loadFloatingAdminThreads();
      if(floatActiveThread&&$("avpAdminFloatPanel")&&!$("avpAdminFloatPanel").hidden){
        const rows=await rpc("avp_chat_admin_messages",{p_thread_id:floatActiveThread,p_limit:300}).catch(()=>[]);
        const box=$("avpAdminFloatMessages"),list=Array.isArray(rows)?rows:[];
        if(box){box.innerHTML=list.length?list.map(m=>msgHtml(m,true)).join(""):'<div class="avp-chat-empty">Chưa có tin nhắn.</div>';await hydrateAttachmentUrls(box);box.scrollTop=box.scrollHeight;}
      }
    },15000);
    try{
      if(floatRealtime)client.removeChannel(floatRealtime);
      floatRealtime=client.channel("avp-chat-admin-floating-"+user.id).on("postgres_changes",{event:"INSERT",schema:"public",table:"admin_chat_messages"},async()=>{
        await loadFloatingAdminThreads();
        if(floatActiveThread&&$("avpAdminFloatPanel")&&!$("avpAdminFloatPanel").hidden)await openFloatingAdminThread(floatActiveThread);
      }).subscribe();
    }catch{}
  }

  async function resetChatRuntime(){
    try{ clearInterval(pollTimer); }catch{}
    try{ clearInterval(adminPoll); }catch{}
    try{ clearInterval(floatPoll); }catch{}
    pollTimer=null;adminPoll=null;floatPoll=null;
    threadId=null;activeThread=null;floatActiveThread=null;
    try{ if(realtimeChannel&&client) await client.removeChannel(realtimeChannel); }catch{}
    try{ if(floatRealtime&&client) await client.removeChannel(floatRealtime); }catch{}
    realtimeChannel=null;floatRealtime=null;
    const root=$("avpAdminChatRoot");
    if(root) root.remove();
  }

  async function renderChatForCurrentUser(){
    // Trang admin.html dùng hộp thư lớn có sẵn, không tạo bubble nổi chồng lên.
    const onAdminPage=document.body?.dataset?.adminPage==="1"||$("adminChatInbox");

    if(!user){
      if(!onAdminPage) mountGuestUI();
      return;
    }

    let admin=false;
    for(let i=0;i<10;i++){
      admin=await isAdmin();
      if(admin) break;
      await sleep(200);
    }

    if(onAdminPage){
      if(admin) await initAdmin();
      return;
    }

    if(admin) await initFloatingAdmin();
    else await initUser();
  }

  function subscribeAuthChanges(){
    if(authSubscribed||!client?.auth) return;
    authSubscribed=true;
    client.auth.onAuthStateChange(async(event,session)=>{
      if(event!=="SIGNED_IN"&&event!=="SIGNED_OUT"&&event!=="USER_UPDATED") return;
      const nextUser=session?.user||null;
      const oldId=user?.id||null;
      const nextId=nextUser?.id||null;
      // USER_UPDATED của cùng user không cần dựng lại UI trừ khi root đang thiếu.
      if(event==="USER_UPDATED"&&oldId===nextId&&$("avpAdminChatRoot")) return;
      user=nextUser;
      await resetChatRuntime();
      await sleep(50);
      await renderChatForCurrentUser();
    });
  }

  async function start(){
    if(!(await waitClient())) return;
    subscribeAuthChanges();
    await renderChatForCurrentUser();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
