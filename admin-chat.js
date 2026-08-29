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
  const AUTO_REPLY_PREFIX="[[AVP_AUTO_REPLY]]";

  const AUTO_REPLY_PHRASES=[
    "mình đang bận một chút nên chưa thể phản hồi ngay",
    "mình đã nhận được tin nhắn của bạn nhé",
    "mình sẽ kiểm tra và phản hồi khi quay lại",
    "mình sẽ xem và trả lời sớm nhất có thể"
  ];

  function isAutomaticChatMessage(m){
    const raw=String(m?.body||"");
    const normalized=raw
      .replace(AUTO_REPLY_PREFIX,"")
      .trim()
      .toLocaleLowerCase("vi-VN");

    return !!(
      raw.startsWith(AUTO_REPLY_PREFIX) ||
      m?.is_auto_reply===true ||
      m?.auto_reply===true ||
      String(m?.message_type||"").toLowerCase()==="auto_reply" ||
      String(m?.kind||"").toLowerCase()==="auto_reply" ||
      AUTO_REPLY_PHRASES.some(x=>normalized.includes(x))
    );
  }

  const CHAT_BUCKET="chat-attachments";
  const MAX_FILE_BYTES=20*1024*1024;
  const MAX_FILES_PER_SEND=5;
  const ALLOWED_EXT=new Set(["jpg","jpeg","png","webp","gif","heic","heif","pdf","xlsx","xls","csv","doc","docx","ppt","pptx","txt","zip"]);
  const pendingFiles={user:[],admin:[],float:[]};


  function ensureAiChatAssets(){
    if(!document.getElementById("avpAiChatCss")){
      const link=document.createElement("link");
      link.id="avpAiChatCss";
      link.rel="stylesheet";
      link.href="ai-chat.css?v=20260828-ai-direct3";
      document.head.appendChild(link);
    }

    if(!document.getElementById("avpAiChatScript")){
      const script=document.createElement("script");
      script.id="avpAiChatScript";
      script.src="ai-chat.js?v=20260828-ai-direct3";
      script.defer=true;
      script.onerror=()=>console.warn("AVP AI Chat script không tải được.");
      document.head.appendChild(script);
    }
  }


  function cleanChatPreviewText(body){
    const raw=String(body||"");

    if(raw.startsWith(ATTACH_PREFIX)){
      const a=parseAttachmentBody(raw);
      if(a?.caption)return a.caption.trim();
      if(a?.meta?.kind==="image")return "Đã gửi một ảnh";
      if(a?.meta?.name)return `Đã gửi tệp ${a.meta.name}`;
      return "Đã gửi một tệp đính kèm";
    }

    if(raw.startsWith("[[AVP_AUTO_REPLY]]")){
      return raw.replace("[[AVP_AUTO_REPLY]]","").trim();
    }

    return raw.trim();
  }

  function emitChatMiniPreview(detail){
    try{
      window.dispatchEvent(
        new CustomEvent("avp:chat-new-message",{detail})
      );
    }catch(e){
      console.warn("AVP mini preview",e);
    }
  }

  async function getLatestUnreadPreview(){
    client=client||getClient();

    if(!client?.auth||!client?.rpc)return null;

    try{
      const {data:{user:me}}=await client.auth.getUser();
      if(!me)return null;

      if(isAdmin){
        const rows=await rpc("avp_chat_admin_threads")||[];
        const list=Array.isArray(rows)?rows:[];

        const unreadThread=list.find(x=>
          Number(
            x.unread_count ??
            x.unread ??
            x.unread_messages ??
            0
          )>0
        );

        if(!unreadThread)return null;

        const tid=String(
          unreadThread.thread_id ??
          unreadThread.id ??
          ""
        );

        if(!tid)return null;

        const messages=await rpc(
          "avp_chat_admin_thread_messages",
          {p_thread_id:tid}
        )||[];

        const arr=Array.isArray(messages)?messages:[];
        const msg=[...arr]
          .reverse()
          .find(m=>m.sender_type==="user");

        if(!msg)return null;

        return {
          role:"user",
          thread_id:tid,
          sender:
            unreadThread.display_name ||
            unreadThread.full_name ||
            unreadThread.email ||
            "Học viên",
          body:cleanChatPreviewText(msg.body),
          created_at:msg.created_at||null
        };
      }

      const session=await rpc("avp_chat_get_or_create_thread");
      const tid=String(
        session?.thread_id ??
        session?.id ??
        session ??
        ""
      );

      if(!tid)return null;

      const messages=await rpc(
        "avp_chat_user_messages",
        {p_thread_id:tid}
      )||[];

      const arr=Array.isArray(messages)?messages:[];
      const msg=[...arr]
        .reverse()
        .find(m=>m.sender_type==="admin");

      if(!msg)return null;

      return {
        role:"admin",
        thread_id:tid,
        sender:"Anh Văn Phòng",
        body:cleanChatPreviewText(msg.body),
        created_at:msg.created_at||null
      };
    }catch(e){
      console.warn("AVP latest unread preview",e);
      return null;
    }
  }

  window.AVPGetLatestUnreadPreview=getLatestUnreadPreview;

  const extOf=(name)=>String(name||"").split(".").pop().toLowerCase();
  const sizeText=(n)=>{n=Number(n)||0;if(n<1024)return n+" B";if(n<1024*1024)return (n/1024).toFixed(1)+" KB";return (n/1024/1024).toFixed(1)+" MB"};
  const isImageFile=(f)=>String(f?.type||"").startsWith("image/")||["jpg","jpeg","png","webp","gif","heic","heif"].includes(extOf(f?.name));
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
    return `<div class="avp-chat-attachment avp-chat-file" data-chat-path="${esc(m.path||"")}" data-chat-name="${name}" data-kind="file"><button type="button" class="avp-file-open"><span class="avp-file-icon">📎</span><span><b>${name}</b><small>${esc((m.ext||"").toUpperCase())} · ${size}</small></span><em>Tải</em></button></div>${caption}`;
  }
  async function signPath(path){
    if(!client||!path)return null;
    try{
      const {data,error}=await client.storage.from(CHAT_BUCKET).createSignedUrl(path,3600);
      if(error)throw error;
      return data?.signedUrl||null;
    }catch(e){
      console.warn("AVP chat signed url",e);
      return null;
    }
  }

  async function downloadChatFile(path,fileName){
    if(!client||!path)throw new Error("Không tìm thấy file.");
    const {data,error}=await client.storage.from(CHAT_BUCKET).download(path);
    if(error)throw error;
    const blobUrl=URL.createObjectURL(data);
    const a=document.createElement("a");
    a.href=blobUrl;
    a.download=fileName||"tep-dinh-kem";
    a.style.display="none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(blobUrl),60000);
  }

  async function hydrateAttachmentUrls(root){
    if(!root)return;
    const nodes=[...root.querySelectorAll("[data-chat-path]")];
    await Promise.all(nodes.map(async n=>{
      if(n.dataset.ready==="1")return;
      const path=n.dataset.chatPath;
      if(!path)return;

      if(n.dataset.kind==="image"){
        const url=await signPath(path);
        if(!url)return;
        n.dataset.ready="1";
        const b=n.querySelector(".avp-image-open");
        if(b){
          b.innerHTML=`<img src="${esc(url)}" alt="Ảnh trong tin nhắn" loading="lazy">`;
          b.onclick=()=>{
            const w=window.open(url,"_blank");
            if(!w)location.href=url;
          };
        }
      }else{
        n.dataset.ready="1";
        const b=n.querySelector(".avp-file-open");
        if(b){
          b.onclick=async()=>{
            const old=b.querySelector("em")?.textContent||"Tải";
            const action=b.querySelector("em");
            if(action)action.textContent="Đang tải…";
            b.disabled=true;
            try{
              await downloadChatFile(path,n.dataset.chatName||"tep-dinh-kem");
            }catch(e){
              console.warn("AVP chat download",e);
              alert("Không tải được file. Lỗi: "+(e?.message||String(e)));
            }finally{
              b.disabled=false;
              if(action)action.textContent=old;
            }
          };
        }
      }
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

  /* ================= ADMIN PRESENCE V2 =================
     ACTIVE = visible + focused + interaction within 2 minutes.
     Background tabs and idle tabs stop heartbeats, so backend auto-reply
     is no longer fooled by a browser tab that merely remains open.
  ====================================================== */
  let adminPresenceTimer=null;
  let adminLastInteractionAt=Date.now();
  let adminLastPresencePingAt=0;
  const ADMIN_IDLE_MS=2*60*1000;
  const ADMIN_PING_MIN_GAP=15000;

  function adminPresenceState(){
    const visible=document.visibilityState==="visible";
    const focused=typeof document.hasFocus==="function"?document.hasFocus():true;
    const recent=(Date.now()-adminLastInteractionAt)<ADMIN_IDLE_MS;
    if(!visible)return "away";
    if(!focused)return "away";
    if(!recent)return "idle";
    return "active";
  }

  function publishAdminPresenceState(){
    const state=adminPresenceState();
    window.AVP_ADMIN_PRESENCE_STATE=state;
    window.dispatchEvent(new CustomEvent("avp:admin-presence",{detail:{state,lastInteractionAt:adminLastInteractionAt}}));
    return state;
  }

  async function pingAdminPresence(force=false){
    const state=publishAdminPresenceState();
    if(state!=="active")return false;
    if(!force && Date.now()-adminLastPresencePingAt<ADMIN_PING_MIN_GAP)return false;
    adminLastPresencePingAt=Date.now();
    try{
      await rpc("avp_chat_admin_presence_ping");
      return true;
    }catch(e){
      console.warn("AVP admin presence",e);
      return false;
    }
  }

  function noteAdminInteraction(){
    adminLastInteractionAt=Date.now();
    const state=publishAdminPresenceState();
    if(state==="active")pingAdminPresence();
  }

  function startAdminPresence(){
    clearInterval(adminPresenceTimer);

    ["pointerdown","touchstart","keydown","mousedown"].forEach(evt=>{
      window.addEventListener(evt,noteAdminInteraction,{passive:true});
    });

    window.addEventListener("focus",()=>{
      adminLastInteractionAt=Date.now();
      publishAdminPresenceState();
      pingAdminPresence(true);
    });

    window.addEventListener("blur",publishAdminPresenceState);

    document.addEventListener("visibilitychange",()=>{
      if(document.visibilityState==="visible"){
        adminLastInteractionAt=Date.now();
        publishAdminPresenceState();
        pingAdminPresence(true);
      }else{
        publishAdminPresenceState();
      }
    });

    publishAdminPresenceState();
    pingAdminPresence(true);

    adminPresenceTimer=setInterval(()=>{
      publishAdminPresenceState();
      pingAdminPresence();
    },30000);
  }

  async function mountAutoReplySettings(){
    const toolbar=document.querySelector("#adminChatInbox .admin-chat-toolbar");
    if(!toolbar||$("avpAutoReplySettings"))return;

    const wrap=document.createElement("div");
    wrap.id="avpAutoReplySettings";
    wrap.className="avp-auto-settings";
    wrap.innerHTML=`
      <button type="button" class="avp-auto-settings-toggle" id="avpAutoSettingsToggle">⚡ Auto-reply</button>
      <div class="avp-auto-settings-panel" id="avpAutoSettingsPanel" hidden>
        <div class="avp-auto-settings-head">
          <div><strong>Trả lời tự động thông minh</strong><small>Chỉ im lặng khi Admin đang thực sự hoạt động; tab nền/idle vẫn được coi là vắng mặt.</small></div>
          <label class="avp-switch"><input id="avpAutoEnabled" type="checkbox"><span></span></label>
        </div>
        <label class="avp-auto-field"><span>Nội dung trả lời</span><textarea id="avpAutoMessage" maxlength="1000" rows="3"></textarea></label>
        <div class="avp-auto-grid">
          <label class="avp-auto-field"><span>Không gửi lại trong</span>
            <select id="avpAutoCooldown">
              <option value="3">3 giờ</option><option value="6">6 giờ</option>
              <option value="12">12 giờ</option><option value="24">24 giờ</option>
            </select>
          </label>
          <label class="avp-auto-field"><span>Coi Admin offline sau</span>
            <select id="avpAutoOffline">
              <option value="5">5 phút</option><option value="7">7 phút</option>
              <option value="10">10 phút</option><option value="15">15 phút</option>
            </select>
          </label>
        </div>
        <div class="avp-auto-settings-actions">
          <small id="avpAutoSettingsStatus"></small>
          <button type="button" id="avpAutoSettingsSave">Lưu cài đặt</button>
        </div>
      </div>`;
    toolbar.appendChild(wrap);

    const panel=$("avpAutoSettingsPanel");
    $("avpAutoSettingsToggle")?.addEventListener("click",()=>{panel.hidden=!panel.hidden});

    async function load(){
      try{
        const s=await rpc("avp_chat_admin_get_auto_reply_settings");
        $("avpAutoEnabled").checked=!!s?.enabled;
        $("avpAutoMessage").value=s?.message_text||"";
        $("avpAutoCooldown").value=String(s?.cooldown_hours||6);
        $("avpAutoOffline").value=String(s?.offline_after_minutes||7);
        const st=$("avpAutoSettingsStatus");
        if(st)st.textContent=s?.enabled?"Đang bật":"Đang tắt";
      }catch(e){console.warn("AVP auto settings load",e)}
    }

    $("avpAutoSettingsSave")?.addEventListener("click",async()=>{
      const btn=$("avpAutoSettingsSave"),st=$("avpAutoSettingsStatus");
      if(btn)btn.disabled=true;
      try{
        await rpc("avp_chat_admin_set_auto_reply_settings",{
          p_enabled:!!$("avpAutoEnabled")?.checked,
          p_message_text:String($("avpAutoMessage")?.value||"").trim(),
          p_cooldown_hours:Number($("avpAutoCooldown")?.value||6),
          p_offline_after_minutes:Number($("avpAutoOffline")?.value||7)
        });
        if(st)st.textContent="Đã lưu";
        setTimeout(()=>{if(st)st.textContent=$("avpAutoEnabled")?.checked?"Đang bật":"Đang tắt"},1400);
      }catch(e){
        if(st)st.textContent="Không lưu được";
        alert("Không lưu được Auto-reply. "+(e?.message||""));
      }finally{if(btn)btn.disabled=false}
    });
    await load();
  }

  function msgHtml(m, adminView=false){
    const type=m.sender_type||"system";
    const isAutoReply=isAutomaticChatMessage(m);

    let cls=isAutoReply?"system":type;
    if(!isAutoReply){
      if(adminView && type==="admin") cls="user";
      else if(adminView && type==="user") cls="admin";
    }

    const who=isAutoReply
      ? "Hệ thống"
      : adminView
        ? (type==="system"?"Hệ thống":type==="admin"?"Bạn (Admin)":"Học viên")
        : (type==="system"?"Hệ thống":type==="admin"?"Admin":"Bạn");

    const rawBody=String(m.body||"");
    const displayBody=rawBody.startsWith(AUTO_REPLY_PREFIX)
      ? rawBody.slice(AUTO_REPLY_PREFIX.length).trim()
      : rawBody;

    const a=parseAttachmentBody(displayBody);
    const autoBadge=isAutoReply?'<span class="avp-auto-reply-badge">Tự động</span>':"";
    const content=(a?attachmentCardHtml(a):`<div>${esc(displayBody)}</div>`)+autoBadge;
    const mid=esc(m.id||"");

    const react=type==="system"||isAutoReply||!mid?"":`<div class="avp-reaction-wrap" data-reaction-message="${mid}">
      <button class="avp-reaction-btn" type="button" data-react="like" aria-label="Thích" title="Thích">👍</button>
      <button class="avp-reaction-btn" type="button" data-react="dislike" aria-label="Không thích" title="Không thích">👎</button>
      <span class="avp-reaction-counts"></span>
    </div>`;

    const readReceipt=adminView&&!isAutoReply&&type==="admin"
      ? `<span class="avp-admin-read-receipt" data-read-created="${esc(m.created_at||"")}"></span>`
      : "";

    return `<div class="avp-msg-row ${cls}" data-message-id="${mid}"><div class="avp-msg">${content}<span class="avp-msg-meta">${esc(who)} • ${fmt(m.created_at)} ${readReceipt}</span>${react}</div></div>`;
  }


  function avpMessageSignature(list,adminView=false){
    return JSON.stringify((list||[]).map(m=>[
      String(m.id||""),
      String(m.sender_type||""),
      String(m.body||""),
      String(m.created_at||""),
      isAutomaticChatMessage(m)?1:0,
      adminView?1:0
    ]));
  }

  function avpNearBottom(box,threshold=90){
    if(!box)return true;
    return (box.scrollHeight-box.scrollTop-box.clientHeight)<=threshold;
  }

  async function avpRenderMessages(box,list,adminView=false,opts={}){
    if(!box)return false;
    const arr=Array.isArray(list)?list:[];
    const sig=avpMessageSignature(arr,adminView);

    if(box.dataset.avpMsgSignature===sig)return false;

    const nearBottom=avpNearBottom(box);
    const prevTop=box.scrollTop;

    box.innerHTML=arr.length
      ? arr.map(m=>msgHtml(m,adminView)).join("")
      : `<div class="${adminView?"admin-chat-empty":"avp-chat-empty"}">${adminView?"Chưa có tin nhắn.":"Bạn chưa có tin nhắn. Có gì cần hỗ trợ cứ nhắn cho Admin nhé."}</div>`;

    box.dataset.avpMsgSignature=sig;

    await hydrateAttachmentUrls(box);
    await hydrateReactions(box);
    if(adminView && opts.threadId){
      await hydrateAdminReadReceipts(box,opts.threadId);
    }

    if(opts.forceBottom || nearBottom) box.scrollTop=box.scrollHeight;
    else box.scrollTop=prevTop;

    return true;
  }

  async function setReaction(messageId,reaction){
    if(!messageId)return;
    try{
      await rpc("avp_chat_set_reaction",{p_message_id:String(messageId),p_reaction:reaction});
    }catch(e){console.warn("AVP reaction",e)}
  }
  async function hydrateReactions(root){
    if(!root)return;

    const wraps=[...root.querySelectorAll("[data-reaction-message]")];
    if(!wraps.length)return;

    const ids=wraps
      .map(x=>x.dataset.reactionMessage)
      .filter(Boolean);

    let rows=[];

    try{
      rows=await rpc(
        "avp_chat_reactions_for_messages",
        {p_message_ids:ids}
      )||[];
    }catch(e){
      console.warn("AVP reaction load",e);
    }

    const map=new Map(
      (Array.isArray(rows)?rows:[])
        .map(r=>[String(r.message_id),r])
    );

    wraps.forEach(w=>{
      const id=String(w.dataset.reactionMessage||"");
      const r=map.get(id)||{};

      const like=Number(r.like_count)||0;
      const dislike=Number(r.dislike_count)||0;
      const mine=String(r.my_reaction||"");

      const counts=w.querySelector(".avp-reaction-counts");

      if(counts){
        counts.textContent=[
          like?`👍 ${like}`:"",
          dislike?`👎 ${dislike}`:""
        ].filter(Boolean).join("  ");
      }

      w.querySelectorAll("[data-react]").forEach(btn=>{
        btn.classList.toggle(
          "active",
          btn.dataset.react===mine
        );

        if(btn.dataset.bound==="1")return;
        btn.dataset.bound="1";

        btn.addEventListener("click",async e=>{
          e.preventDefault();
          e.stopPropagation();

          const latestMine=
            [...w.querySelectorAll("[data-react].active")]
              .map(x=>x.dataset.react)[0]||"";

          const value=
            latestMine===btn.dataset.react
              ? null
              : btn.dataset.react;

          await setReaction(id,value);
          await hydrateReactions(root);
        });
      });
    });
  }

  async function hydrateAdminReadReceipts(root,thread){
    if(!root||!thread)return;
    let lastRead=null;
    try{lastRead=await rpc("avp_chat_admin_student_read_at",{p_thread_id:String(thread)})}catch(e){console.warn("AVP read receipt",e);return}
    const els=[...root.querySelectorAll("[data-read-created]")];
    els.forEach(el=>el.textContent="");
    if(!lastRead||!els.length)return;
    const readTime=new Date(lastRead).getTime();
    const readEls=els.filter(el=>{const sent=new Date(el.dataset.readCreated||0).getTime();return sent&&sent<=readTime});
    const last=readEls[readEls.length-1];
    if(last)last.textContent=" · Đã xem";
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
          <label class="avp-chat-attach" title="Gửi ảnh hoặc file">📎<input id="avpChatFile" type="file" multiple accept="image/*,.heic,.heif,.pdf,.xlsx,.xls,.csv,.doc,.docx,.ppt,.pptx,.txt,.zip"></label>
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
    if(open){
      await ensureThread();
      await loadUserMessages(true);
      await markUserRead();
      $("avpChatInput")?.focus();
    }
  }
  async function ensureThread(){
    if(threadId)return threadId;
    threadId=await rpc("avp_chat_get_or_create_thread");
    return threadId;
  }
  async function loadUserMessages(forceBottom=false){
    const box=$("avpChatMessages");if(!box)return;
    try{
      await ensureThread();
      const rows=await rpc("avp_chat_my_messages",{p_limit:150});
      const list=Array.isArray(rows)?rows:[];
      await avpRenderMessages(box,list,false,{forceBottom});
    }catch(e){
      if(!box.dataset.avpMsgSignature){
        box.innerHTML='<div class="avp-chat-empty">Chưa tải được hộp thư. Hãy kiểm tra SQL chat trong Supabase.</div>';
      }
      console.warn("AVP chat load",e)
    }
  }
  async function sendUserMessage(){
    const input=$("avpChatInput"),btn=$("avpChatSend"); if(!input||!btn)return;
    const body=input.value.trim(),files=[...(pendingFiles.user||[])];if(!body&&!files.length)return;
    btn.disabled=true;
    try{
      await ensureThread();
      if(files.length){
        for(let i=0;i<files.length;i++){
          const meta=await uploadChatFile(files[i],"user",threadId);
          await rpc("avp_chat_send_user_message",{p_body:makeAttachmentBody(meta,i===0?body:"")});
        }
      }else await rpc("avp_chat_send_user_message",{p_body:body});
      input.value="";pendingFiles.user=[];previewFiles("user","avpChatFilePreview");await loadUserMessages();
    }catch(e){
      const detail=e?.message||e?.error_description||String(e||"");
      alert("Chưa gửi được file. "+(detail?"Lỗi: "+detail:"Vui lòng thử lại."));
      console.warn("AVP send user attachment",e);
    }finally{btn.disabled=false;input.focus()}
  }

  let lastKnownUserUnread=-1;

  async function updateUserBadge(){
    try{
      const n=Number(await rpc("avp_chat_my_unread_count"))||0;
      const badge=$("avpChatBadge");

      if(badge){
        badge.hidden=n<=0;
        badge.textContent=n>99?"99+":String(n);
      }

      const panel=$("avpChatPanel");
      const chatOpen=!!(panel && !panel.hidden);

      /* Nếu realtime bị miss nhưng unread tăng, vẫn phát sự kiện nổi. */
      if(
        lastKnownUserUnread>=0 &&
        n>lastKnownUserUnread &&
        !chatOpen
      ){
        try{
          const detail=await getLatestUnreadPreview();
          if(detail?.body){
            emitChatMiniPreview(detail);
          }else{
            emitChatMiniPreview({
              role:"admin",
              sender:"Anh Văn Phòng",
              body:n===1
                ?"Bạn có 1 tin nhắn mới."
                :`Bạn có ${n} tin nhắn mới.`
            });
          }
        }catch(e){
          console.warn("AVP unread fallback preview",e);
        }
      }

      lastKnownUserUnread=n;
    }catch{}
  }
  async function markUserRead(){
    try{
      if(document.visibilityState!=="visible")return;
      await ensureThread();
      await rpc("avp_chat_mark_user_read");
      if(threadId)await rpc("avp_chat_mark_student_read_state",{p_thread_id:String(threadId)});
      await updateUserBadge();
    }catch(e){console.warn("AVP mark student read",e)}
  }
  function startUserLive(){
    clearInterval(pollTimer);pollTimer=setInterval(async()=>{
      await updateUserBadge();
      if($("avpChatPanel")&&!$("avpChatPanel").hidden){await loadUserMessages();await markUserRead()}
    },15000);
    try{
      if(realtimeChannel)client.removeChannel(realtimeChannel);
      realtimeChannel=client.channel("avp-chat-user-"+user.id).on(
        "postgres_changes",
        {event:"INSERT",schema:"public",table:"admin_chat_messages",filter:`thread_id=eq.${threadId}`},
        async(payload)=>{
          const incoming=payload?.new||{};

          if(incoming.sender_type==="admin"){
            const panel=$("avpChatPanel");
            const chatOpen=panel && !panel.hidden;

            if(!chatOpen){
              emitChatMiniPreview({
                role:"admin",
                thread_id:String(threadId||incoming.thread_id||""),
                sender:"Anh Văn Phòng",
                body:cleanChatPreviewText(incoming.body),
                created_at:incoming.created_at||new Date().toISOString()
              });
            }
          }

          await updateUserBadge();

          if(!$("avpChatPanel").hidden){
            await loadUserMessages();
            await markUserRead();
          }
        }
      ).subscribe();
    }catch{}
  }
  async function initUser(){
    mountUserUI();
    const syncReadIfOpen=async()=>{
      const panel=$("avpChatPanel");
      if(panel&&!panel.hidden&&document.visibilityState==="visible"){await loadUserMessages();await markUserRead()}
    };
    document.addEventListener("visibilitychange",syncReadIfOpen);
    window.addEventListener("focus",syncReadIfOpen);
    try{
      await ensureThread();
      await rpc("avp_chat_ensure_daily_greeting");
      await updateUserBadge();
      startUserLive();

      /* Cho AVP core biết chat đã sẵn sàng để hiện lời chào/tin nổi. */
      try{
        window.dispatchEvent(new CustomEvent("avp:chat-ready"));
      }catch{}
    }catch(e){
      console.warn("AVP chat init",e);
    }
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
      if(box)await avpRenderMessages(box,list,true,{threadId:id});
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
    startAdminPresence();
    await mountAutoReplySettings();
    $("adminChatSearch")?.addEventListener("input",e=>renderAdminThreads(e.target.value));
    $("adminChatRefresh")?.addEventListener("click",loadAdminThreads);
    $("adminChatReplyBtn")?.addEventListener("click",sendAdminMessage);
    bindFilePicker("admin","adminChatFile","adminChatFilePreview");
    $("adminChatReply")?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendAdminMessage()}});
    await loadAdminThreads();
    adminPoll=setInterval(async()=>{await loadAdminThreads();if(activeThread)await openAdminThread(activeThread)},15000);
    try{
      client.channel("avp-chat-admin-live")
        .on(
          "postgres_changes",
          {event:"INSERT",schema:"public",table:"admin_chat_messages"},
          async(payload)=>{
            const incoming=payload?.new||{};

            await loadAdminThreads();

            if(incoming.sender_type==="user"){
              const t=adminThreads.find(
                x=>String(x.thread_id)===String(incoming.thread_id)
              );

              const viewingSame=
                activeThread &&
                String(activeThread)===String(incoming.thread_id);

              if(!viewingSame){
                emitChatMiniPreview({
                  role:"user",
                  thread_id:String(incoming.thread_id||""),
                  sender:t?.display_name||t?.email||"Học viên",
                  body:cleanChatPreviewText(incoming.body),
                  created_at:incoming.created_at||new Date().toISOString()
                });
              }
            }

            if(activeThread)await openAdminThread(activeThread);
          }
        )
        .subscribe();
    }catch{}
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
              <label class="avp-chat-attach" title="Gửi ảnh hoặc file">📎<input id="avpAdminFloatFile" type="file" multiple accept="image/*,.heic,.heif,.pdf,.xlsx,.xls,.csv,.doc,.docx,.ppt,.pptx,.txt,.zip"></label>
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
      if(box)await avpRenderMessages(box,list,true,{threadId:id});
      await rpc("avp_chat_admin_mark_read",{p_thread_id:id});
      await loadFloatingAdminThreads();
      input?.focus();
    }catch(e){console.warn("AVP floating admin open",e)}
  }

  async function sendFloatingAdminMessage(){
    if(!floatActiveThread)return;
    const input=$("avpAdminFloatReply"),btn=$("avpAdminFloatSend");if(!input||!btn)return;
    const body=input.value.trim(),files=[...(pendingFiles.float||[])];if(!body&&!files.length)return;
    btn.disabled=true;
    try{
      if(files.length){
        for(let i=0;i<files.length;i++){
          const meta=await uploadChatFile(files[i],"admin",floatActiveThread);
          await rpc("avp_chat_admin_send_message",{p_thread_id:floatActiveThread,p_body:makeAttachmentBody(meta,i===0?body:"")});
        }
      }else await rpc("avp_chat_admin_send_message",{p_thread_id:floatActiveThread,p_body:body});
      input.value="";pendingFiles.float=[];previewFiles("float","avpAdminFloatFilePreview");
      await openFloatingAdminThread(floatActiveThread);
    }catch(e){
      const detail=e?.message||e?.error_description||String(e||"");
      alert("Không gửi được file. "+(detail?"Lỗi: "+detail:""));
      console.warn("AVP floating admin attachment",e);
    }finally{btn.disabled=false;input.focus()}
  }

  async function initFloatingAdmin(){
    startAdminPresence();
    mountAdminFloatingUI();
    await loadFloatingAdminThreads();
    clearInterval(floatPoll);
    floatPoll=setInterval(async()=>{
      await loadFloatingAdminThreads();
      if(floatActiveThread&&$("avpAdminFloatPanel")&&!$("avpAdminFloatPanel").hidden){
        const rows=await rpc("avp_chat_admin_messages",{p_thread_id:floatActiveThread,p_limit:300}).catch(()=>[]);
        const box=$("avpAdminFloatMessages"),list=Array.isArray(rows)?rows:[];
        if(box)await avpRenderMessages(box,list,true,{threadId:floatActiveThread});
      }
    },15000);
    try{
      if(floatRealtime)client.removeChannel(floatRealtime);
      floatRealtime=client.channel("avp-chat-admin-floating-"+user.id)
        .on(
          "postgres_changes",
          {event:"INSERT",schema:"public",table:"admin_chat_messages"},
          async(payload)=>{
            const incoming=payload?.new||{};

            await loadFloatingAdminThreads();

            if(incoming.sender_type==="user"){
              const t=floatThreads.find(
                x=>String(x.thread_id)===String(incoming.thread_id)
              );

              const panel=$("avpAdminFloatPanel");
              const viewingSame=
                panel &&
                !panel.hidden &&
                floatActiveThread &&
                String(floatActiveThread)===String(incoming.thread_id);

              if(!viewingSame){
                emitChatMiniPreview({
                  role:"user",
                  thread_id:String(incoming.thread_id||""),
                  sender:t?.display_name||t?.email||"Học viên",
                  body:cleanChatPreviewText(incoming.body),
                  created_at:incoming.created_at||new Date().toISOString()
                });
              }
            }

            if(
              floatActiveThread &&
              $("avpAdminFloatPanel") &&
              !$("avpAdminFloatPanel").hidden
            ){
              await openFloatingAdminThread(floatActiveThread);
            }
          }
        )
        .subscribe();
    }catch{}
  }

  async function resetChatRuntime(){
    try{ clearInterval(pollTimer); }catch{}
    try{ clearInterval(adminPoll); }catch{}
    try{ clearInterval(floatPoll); }catch{}
    try{ clearInterval(adminPresenceTimer); }catch{}
    pollTimer=null;adminPoll=null;floatPoll=null;adminPresenceTimer=null;
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
    ensureAiChatAssets();

    if(!(await waitClient())) return;

    subscribeAuthChanges();
    await renderChatForCurrentUser();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
