(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const MAX_DAILY = 5;

  let client = null;
  let user = null;
  let sessionId = null;
  let sending = false;

  const esc = s => String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

  function getClient(){
    return window.avpSupabase ||
           window.supabaseClient ||
           window.sb ||
           window._supabase ||
           null;
  }

  async function waitClient(){
    for(let i=0;i<80;i++){
      client=getClient();
      if(client?.auth) return true;
      await new Promise(r=>setTimeout(r,100));
    }
    return false;
  }

  function mount(){
    if($("avpAiChatRoot")) return;

    const root=document.createElement("div");
    root.id="avpAiChatRoot";
    root.innerHTML=`
      <button id="avpAiChatBubble" class="avp-ai-bubble" type="button" aria-label="Hỏi AI Excel" title="Hỏi AI Excel">✨</button>

      <section id="avpAiChatPanel" class="avp-ai-panel" hidden>
        <header class="avp-ai-head">
          <div>
            <strong>Hỏi AI Excel</strong>
            <small>AI đang ở chế độ thử nghiệm</small>
          </div>
          <button id="avpAiClose" class="avp-ai-close" type="button" aria-label="Đóng">×</button>
        </header>

        <div class="avp-ai-quota" id="avpAiQuota">Còn ${MAX_DAILY} câu hôm nay</div>

        <div class="avp-ai-messages" id="avpAiMessages">
          <div class="avp-ai-empty">
            Hỏi mình về Excel, Power Query, Pivot, công thức hoặc lỗi bạn đang gặp.
          </div>
        </div>

        <div class="avp-ai-actions-row">
          <button id="avpAiTransfer" class="avp-ai-transfer" type="button">💬 Chuyển cho Admin</button>
        </div>

        <form id="avpAiForm" class="avp-ai-form">
          <textarea id="avpAiInput" maxlength="1200" rows="1" placeholder="Nhập câu hỏi..."></textarea>
          <button id="avpAiSend" type="submit">Gửi</button>
        </form>

        <div class="avp-ai-note">Tối đa ${MAX_DAILY} câu/ngày trong giai đoạn thử nghiệm.</div>
      </section>
    `;
    document.body.appendChild(root);

    $("avpAiChatBubble").onclick=()=>toggle(true);
    $("avpAiClose").onclick=()=>toggle(false);
    $("avpAiForm").onsubmit=send;
    $("avpAiTransfer").onclick=transferToAdmin;

    $("avpAiInput").addEventListener("input",e=>{
      e.target.style.height="auto";
      e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";
    });
  }

  async function currentUser(){
    client=client||getClient();

    if(!client?.auth){
      user=null;
      return null;
    }

    try{
      const {data}=await client.auth.getUser();
      user=data?.user||null;
    }catch{
      user=null;
    }

    return user;
  }

  async function ensureSession(){
    if(sessionId) return sessionId;

    client=client||getClient();
    if(!client?.rpc) throw new Error("Supabase chưa sẵn sàng");

    const {data,error}=await client.rpc("avp_ai_get_or_create_session");
    if(error) throw error;
    sessionId=data;
    return sessionId;
  }

  async function quota(){
    try{
      const {data,error}=await client.rpc("avp_ai_quota_status");
      if(error) throw error;
      const used=Number(data?.used||0);
      const limit=Number(data?.limit||MAX_DAILY);
      const left=Math.max(0,limit-used);
      const el=$("avpAiQuota");
      if(el) el.textContent=`Còn ${left}/${limit} câu hôm nay`;
      const sendBtn=$("avpAiSend");
      if(sendBtn) sendBtn.disabled=left<=0 || sending;
      return {used,limit,left};
    }catch{
      return {used:0,limit:MAX_DAILY,left:MAX_DAILY};
    }
  }

  function msgHtml(m){
    const role=m.role==="assistant"?"assistant":"user";
    const text=esc(m.content||"").replace(/\n/g,"<br>");
    const feedback=role==="assistant" && m.id ? `
      <div class="avp-ai-feedback" data-ai-msg="${esc(m.id)}">
        <button type="button" data-fb="up" aria-label="Hữu ích">👍</button>
        <button type="button" data-fb="down" aria-label="Chưa hữu ích">👎</button>
      </div>` : "";
    return `<div class="avp-ai-msg-row ${role}">
      <div class="avp-ai-msg">${text}${feedback}</div>
    </div>`;
  }

  async function loadHistory(){
    if(!user){
      $("avpAiMessages").innerHTML=`<div class="avp-ai-empty">Đăng nhập để dùng AI Chat và lưu lịch sử.</div>`;
      return;
    }
    try{
      await ensureSession();
      const {data,error}=await client.rpc("avp_ai_history",{p_session_id:sessionId,p_limit:30});
      if(error) throw error;
      const rows=Array.isArray(data)?data:[];
      const box=$("avpAiMessages");
      box.innerHTML=rows.length?rows.map(msgHtml).join(""):`<div class="avp-ai-empty">Hỏi mình về Excel, Power Query, Pivot hoặc lỗi bạn đang gặp.</div>`;
      bindFeedback(box);
      box.scrollTop=box.scrollHeight;
      await quota();
    }catch(e){
      console.warn("AVP AI history",e);
    }
  }

  function bindFeedback(root){
    root.querySelectorAll("[data-ai-msg]").forEach(w=>{
      if(w.dataset.bound==="1") return;
      w.dataset.bound="1";
      w.querySelectorAll("[data-fb]").forEach(btn=>{
        btn.onclick=async()=>{
          try{
            const {error}=await client.rpc("avp_ai_feedback",{
              p_message_id:w.dataset.aiMsg,
              p_value:btn.dataset.fb==="up"?1:-1
            });
            if(error) throw error;
            w.querySelectorAll("[data-fb]").forEach(b=>b.classList.toggle("active",b===btn));
          }catch(e){ console.warn("AI feedback",e); }
        };
      });
    });
  }

  async function toggle(open){
    const p=$("avpAiChatPanel");
    if(!p) return;

    p.hidden=!open;

    if(open){
      client=client||getClient();
      await currentUser();

      if(client?.rpc){
        await loadHistory();
      }else{
        const box=$("avpAiMessages");
        if(box){
          box.innerHTML='<div class="avp-ai-empty">AI Chat đã được tải. Đang chờ hệ thống đăng nhập/Supabase sẵn sàng…</div>';
        }
      }

      setTimeout(()=>$("avpAiInput")?.focus(),50);
    }
  }

  async function send(e){
    e.preventDefault();
    if(sending) return;

    client=client||getClient();

    if(!client?.rpc){
      alert("AI Chat chưa kết nối được Supabase. Hãy tải lại trang rồi thử lại.");
      return;
    }

    await currentUser();
    if(!user){
      alert("Bạn cần đăng nhập để dùng AI Chat.");
      return;
    }

    const input=$("avpAiInput");
    const text=input.value.trim();
    if(!text) return;

    const q=await quota();
    if(q.left<=0){
      alert("Bạn đã dùng hết 5 câu AI hôm nay. Ngày mai hệ thống sẽ tự mở lại.");
      return;
    }

    sending=true;
    $("avpAiSend").disabled=true;

    try{
      await ensureSession();

      const {data:saveUser,error:saveErr}=await client.rpc("avp_ai_add_user_message",{
        p_session_id:sessionId,
        p_content:text
      });
      if(saveErr) throw saveErr;

      input.value="";
      input.style.height="auto";
      await loadHistory();

      const {data,error}=await client.functions.invoke("ai-chat",{
        body:{session_id:sessionId}
      });

      if(error) throw error;

      if(data?.error==="PROVIDER_NOT_CONFIGURED"){
        await client.rpc("avp_ai_add_assistant_message",{
          p_session_id:sessionId,
          p_content:"AI đang ở chế độ thử nghiệm và chưa kết nối model. Bạn vẫn có thể dùng nút “Chuyển cho Admin” để gửi câu hỏi này."
        });
      }

      await loadHistory();
    }catch(err){
      console.warn("AVP AI send",err);
      alert("AI chưa trả lời được lúc này. Bạn có thể chuyển câu hỏi cho Admin.");
    }finally{
      sending=false;
      await quota();
    }
  }

  async function transferToAdmin(){
    client=client||getClient();

    if(!client?.rpc){
      alert("Chat chưa kết nối được Supabase.");
      return;
    }

    await currentUser();
    if(!user){
      alert("Bạn cần đăng nhập để chuyển câu hỏi cho Admin.");
      return;
    }

    try{
      await ensureSession();
      const {data,error}=await client.rpc("avp_ai_last_user_question",{p_session_id:sessionId});
      if(error) throw error;
      const question=String(data||"").trim();
      if(!question){
        alert("Bạn chưa có câu hỏi nào để chuyển.");
        return;
      }

      // Dùng RPC chat Admin hiện tại nếu có.
      const body=`[Chuyển từ AI Chat]\n${question}`;
      const {error:sendErr}=await client.rpc("avp_chat_send_user_message",{p_body:body});
      if(sendErr) throw sendErr;

      alert("Đã chuyển câu hỏi gần nhất cho Admin.");
    }catch(e){
      console.warn("Transfer to admin",e);
      alert("Chưa chuyển được cho Admin.");
    }
  }

  async function start(){
    // Quan trọng: nút AI phải luôn hiện, không phụ thuộc Supabase.
    mount();

    const ready=await waitClient();

    if(!ready){
      console.warn("AVP AI: Supabase client chưa sẵn sàng, nhưng giao diện AI vẫn được giữ.");
      return;
    }

    await currentUser();

    try{
      client.auth.onAuthStateChange(async()=>{
        user=null;
        sessionId=null;
        await currentUser();

        if(!$("avpAiChatPanel")?.hidden){
          await loadHistory();
        }
      });
    }catch(e){
      console.warn("AVP AI auth listener",e);
    }
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
