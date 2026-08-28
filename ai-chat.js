(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const MAX_DAILY = 5;

  let client = null;
  let user = null;
  let sessionId = null;
  let sending = false;
  let selectedImage = null;

  let activeMode = "ai";
  let communityFilter = "latest";
  let communityQuestions = [];
  let currentCommunityQuestion = null;

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
      <button id="avpAiChatBubble" class="avp-ai-bubble" type="button" aria-label="Anh Văn Phòng" title="Anh Văn Phòng">
        ✨
        <span id="avpNotifyBubbleBadge" class="avp-notify-badge" hidden></span>
      </button>

      <section id="avpAiChatPanel" class="avp-ai-panel" hidden>
        <header class="avp-ai-head">
          <div>
            <strong id="avpPanelTitle">Hỏi AI Excel</strong>
            <small id="avpPanelSubtitle">AI đang ở chế độ thử nghiệm</small>
          </div>
          <button id="avpAiClose" class="avp-ai-close" type="button" aria-label="Đóng">×</button>
        </header>

        <div id="avpAiMode" class="avp-hub-mode">
          <div class="avp-ai-quota" id="avpAiQuota">Còn ${MAX_DAILY} câu hôm nay</div>

          <div class="avp-ai-messages" id="avpAiMessages">
            <div class="avp-ai-empty">
              Hỏi mình về Excel, Power Query, Pivot, công thức hoặc lỗi bạn đang gặp.
            </div>
          </div>

          <div class="avp-ai-actions-row">
            <button id="avpAiTransferCommunity" class="avp-ai-transfer" type="button">👥 Hỏi cộng đồng</button>
            <button id="avpAiTransfer" class="avp-ai-transfer" type="button">💬 Chuyển cho Admin</button>
          </div>

          <div id="avpAiImagePreview" class="avp-ai-image-preview" hidden>
            <img id="avpAiImageThumb" alt="Ảnh đã chọn">
            <div>
              <strong>Ảnh đã chọn</strong>
              <small id="avpAiImageName"></small>
            </div>
            <button id="avpAiImageRemove" type="button" aria-label="Bỏ ảnh">×</button>
          </div>

          <form id="avpAiForm" class="avp-ai-form">
            <input id="avpAiImageInput" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" hidden>
            <button id="avpAiImagePick" class="avp-ai-image-pick" type="button" aria-label="Gửi ảnh" title="Gửi ảnh">📷</button>
            <textarea id="avpAiInput" maxlength="1200" rows="1" placeholder="Nhập câu hỏi hoặc gửi ảnh lỗi Excel..."></textarea>
            <button id="avpAiSend" type="submit">Gửi</button>
          </form>

          <div class="avp-ai-note">Tối đa ${MAX_DAILY} câu/ngày. Ảnh được dùng để AI phân tích lỗi Excel.</div>
        </div>

        <div id="avpCommunityMode" class="avp-hub-mode" hidden>
          <div class="avp-community-toolbar">
            <div class="avp-community-filters">
              <button type="button" class="active" data-community-filter="latest">Mới nhất</button>
              <button type="button" data-community-filter="unanswered">Chưa trả lời</button>
              <button type="button" data-community-filter="popular">Nổi bật</button>
              <button type="button" data-community-filter="leaderboard">🏆 BXH</button>
            </div>
            <div class="avp-community-toolbar-actions">
              <button id="avpCommunityProfile" class="avp-community-notify-btn" type="button">👤 Hồ sơ</button>
              <button id="avpCommunityNotify" class="avp-community-notify-btn" type="button">
                🔔 Thông báo
                <span id="avpNotifyTabBadge" class="avp-tab-badge" hidden></span>
              </button>
              <button id="avpCommunityAsk" class="avp-community-ask" type="button">＋ Đặt câu hỏi</button>
            </div>
          </div>

          <div class="avp-community-search-wrap">
            <input id="avpCommunitySearch" class="avp-community-search" type="search" maxlength="100" placeholder="Tìm câu hỏi, Power Query, VLOOKUP...">
          </div>

          <div id="avpCommunityContent" class="avp-community-content">
            <div class="avp-community-empty">Đang tải cộng đồng...</div>
          </div>
        </div>

        <div id="avpNotificationMode" class="avp-hub-mode" hidden>
          <div class="avp-notification-toolbar">
            <button id="avpNotifyBackCommunity" class="avp-notify-back-community" type="button">← Cộng đồng</button>
            <div class="avp-notification-filter">
              <button type="button" class="active" data-notify-filter="all">Tất cả</button>
              <button type="button" data-notify-filter="personal">Cá nhân</button>
              <button type="button" data-notify-filter="system">Hệ thống</button>
            </div>
            <button id="avpNotifyMarkAll" type="button">Đánh dấu đã đọc</button>
          </div>
          <div id="avpNotificationContent" class="avp-notification-content">
            <div class="avp-community-empty">Đang tải thông báo...</div>
          </div>
        </div>
      </section>
    `;
    document.body.appendChild(root);

    $("avpAiChatBubble").onclick=async()=>{
      activeMode="ai";
      await toggle(true);
      await switchMode("ai");
    };
    $("avpAiClose").onclick=()=>toggle(false);
    $("avpAiForm").onsubmit=send;
    $("avpAiTransfer").onclick=transferToAdmin;
    $("avpAiTransferCommunity").onclick=transferToCommunity;

    $("avpAiImagePick").onclick=()=>$("avpAiImageInput").click();
    $("avpAiImageInput").onchange=handleImagePick;
    $("avpAiImageRemove").onclick=clearSelectedImage;

    $("avpAiInput").addEventListener("input",e=>{
      e.target.style.height="auto";
      e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";
    });

    root.querySelectorAll("[data-community-filter]").forEach(btn=>{
      btn.onclick=()=>{
        communityFilter=btn.dataset.communityFilter;
        root.querySelectorAll("[data-community-filter]").forEach(b=>b.classList.toggle("active",b===btn));
        if(communityFilter==="leaderboard") loadCommunityLeaderboard();
        else loadCommunity();
      };
    });

    $("avpCommunityAsk").onclick=()=>showCommunityAskForm();
    $("avpCommunityProfile").onclick=()=>showCommunityProfile();
    $("avpCommunityNotify").onclick=()=>switchMode("notifications");

    let searchTimer=null;
    $("avpCommunitySearch").addEventListener("input",()=>{
      clearTimeout(searchTimer);
      searchTimer=setTimeout(()=>loadCommunity(),300);
    });

    root.querySelectorAll("[data-notify-filter]").forEach(btn=>{
      btn.onclick=()=>{
        root.querySelectorAll("[data-notify-filter]").forEach(b=>b.classList.toggle("active",b===btn));
        renderNotifications(window.__avpNotifications||[],btn.dataset.notifyFilter);
      };
    });

    $("avpNotifyMarkAll").onclick=markAllNotificationsRead;
    $("avpNotifyBackCommunity").onclick=()=>switchMode("community");
  }


  function setPanelHeader(title,subtitle){
    if($("avpPanelTitle")) $("avpPanelTitle").textContent=title;
    if($("avpPanelSubtitle")) $("avpPanelSubtitle").textContent=subtitle;
  }

  async function switchMode(mode){
    activeMode=mode;

    const panel=$("avpAiChatPanel");
    if(!panel)return;

    panel.classList.toggle("community-mode",mode==="community");
    panel.classList.toggle("notification-mode",mode==="notifications");

    $("avpAiMode").hidden=mode!=="ai";
    $("avpCommunityMode").hidden=mode!=="community";
    $("avpNotificationMode").hidden=mode!=="notifications";

    if(mode==="ai"){
      setPanelHeader("Hỏi AI Excel","AI đang ở chế độ thử nghiệm");
      if(user && client?.rpc) await loadHistory();
      setTimeout(()=>$("avpAiInput")?.focus(),50);
      return;
    }

    if(mode==="community"){
      setPanelHeader("Cộng đồng Anh Văn Phòng","Hỏi đáp · Chia sẻ · Cùng tiến bộ");
      await currentUser();
      if(communityFilter==="leaderboard") await loadCommunityLeaderboard();
      else await loadCommunity();
      return;
    }

    setPanelHeader("Trung tâm thông báo","Cá nhân · Cộng đồng · Hệ thống");
    await currentUser();
    await loadNotifications();
  }

  function communityTime(value){
    const d=new Date(value);
    if(Number.isNaN(d.getTime())) return "";
    const diff=Math.max(0,Date.now()-d.getTime());
    const min=Math.floor(diff/60000);
    if(min<1)return "Vừa xong";
    if(min<60)return `${min} phút trước`;
    const h=Math.floor(min/60);
    if(h<24)return `${h} giờ trước`;
    const day=Math.floor(h/24);
    if(day<7)return `${day} ngày trước`;
    return d.toLocaleDateString("vi-VN");
  }

  function communityStatus(q){
    return q?.status==="resolved"
      ? '<span class="avp-community-resolved">✓ Đã giải quyết</span>'
      : '<span class="avp-community-open">Đang hỏi</span>';
  }

  async function requireCommunityLogin(){
    await currentUser();
    if(user)return true;
    alert("Bạn cần đăng nhập để tham gia Cộng đồng Anh Văn Phòng.");
    return false;
  }

  async function loadCommunity(){
    client=client||getClient();
    if(!client?.rpc){
      $("avpCommunityContent").innerHTML='<div class="avp-community-empty">Cộng đồng đang chờ kết nối Supabase.</div>';
      return;
    }

    const search=String($("avpCommunitySearch")?.value||"").trim();
    $("avpCommunityContent").innerHTML='<div class="avp-community-empty">Đang tải câu hỏi...</div>';

    try{
      const {data,error}=await client.rpc("community_question_list",{
        p_filter:communityFilter==="leaderboard"?"latest":communityFilter,
        p_search:search||null,
        p_limit:50
      });
      if(error)throw error;

      communityQuestions=Array.isArray(data)?data:[];
      renderCommunityFeed(communityQuestions);
    }catch(e){
      console.warn("Community list",e);
      $("avpCommunityContent").innerHTML='<div class="avp-community-empty">Chưa tải được cộng đồng. Hãy kiểm tra SQL COMMUNITY V1 đã chạy thành công.</div>';
    }
  }

  function renderCommunityFeed(rows){
    const box=$("avpCommunityContent");
    if(!box)return;

    if(!rows.length){
      box.innerHTML=`
        <div class="avp-community-empty avp-community-empty-card">
          <strong>Chưa có câu hỏi phù hợp.</strong>
          <span>Hãy là người đầu tiên đặt câu hỏi cho cộng đồng.</span>
          <button type="button" id="avpCommunityEmptyAsk">＋ Đặt câu hỏi</button>
        </div>`;
      $("avpCommunityEmptyAsk").onclick=()=>showCommunityAskForm();
      return;
    }

    box.innerHTML=rows.map(q=>`
      <article class="avp-question-card" data-question-id="${esc(q.id)}">
        <div class="avp-question-main">
          <div class="avp-question-meta">
            ${communityStatus(q)}
            ${q.topic?`<span class="avp-community-topic">${esc(q.topic)}</span>`:""}
            <span>${communityTime(q.created_at)}</span>
          </div>
          <h3>${esc(q.title)}</h3>
          <p>${esc(q.content).replace(/\n/g,"<br>")}</p>
          <div class="avp-question-user">👤 ${esc(q.display_name||"Học viên")}</div>
        </div>
        <div class="avp-question-stats">
          <strong>${Number(q.answer_count||0)}</strong><span>trả lời</span>
          <strong>${Number(q.helpful_count||0)}</strong><span>hữu ích</span>
        </div>
      </article>
    `).join("");

    box.querySelectorAll("[data-question-id]").forEach(card=>{
      card.onclick=()=>openCommunityQuestion(card.dataset.questionId);
    });
  }

  function showCommunityAskForm(prefill=""){
    currentCommunityQuestion=null;
    const box=$("avpCommunityContent");
    if(!box)return;

    box.innerHTML=`
      <div class="avp-community-form-card">
        <button type="button" class="avp-community-back" id="avpCommunityAskBack">← Quay lại cộng đồng</button>
        <h3>Đặt câu hỏi cho cộng đồng</h3>
        <p>Càng mô tả rõ lỗi, mọi người càng dễ hỗ trợ bạn.</p>

        <label>Tiêu đề</label>
        <input id="avpQuestionTitle" maxlength="180" placeholder="Ví dụ: Power Query bị dư dòng sau Append">

        <label>Chủ đề</label>
        <select id="avpQuestionTopic">
          <option value="">Chọn chủ đề</option>
          <option>Excel cơ bản</option>
          <option>Công thức Excel</option>
          <option>Làm sạch dữ liệu</option>
          <option>Power Query</option>
          <option>PivotTable</option>
          <option>Dashboard</option>
          <option>Khác</option>
        </select>

        <label>Nội dung câu hỏi</label>
        <textarea id="avpQuestionContent" maxlength="5000" rows="7" placeholder="Bạn đã làm gì, đang lỗi ở bước nào?">${esc(prefill)}</textarea>

        <div class="avp-community-form-actions">
          <button type="button" class="avp-secondary-btn" id="avpCommunityAskCancel">Huỷ</button>
          <button type="button" class="avp-primary-btn" id="avpCommunityAskSubmit">Đăng câu hỏi</button>
        </div>
      </div>
    `;

    $("avpCommunityAskBack").onclick=()=>loadCommunity();
    $("avpCommunityAskCancel").onclick=()=>loadCommunity();
    $("avpCommunityAskSubmit").onclick=createCommunityQuestion;
  }

  async function createCommunityQuestion(){
    if(!(await requireCommunityLogin()))return;

    const title=String($("avpQuestionTitle")?.value||"").trim();
    const topic=String($("avpQuestionTopic")?.value||"").trim();
    const content=String($("avpQuestionContent")?.value||"").trim();

    if(title.length<4){
      alert("Tiêu đề câu hỏi hơi ngắn.");
      return;
    }
    if(content.length<2){
      alert("Hãy nhập nội dung câu hỏi.");
      return;
    }

    const btn=$("avpCommunityAskSubmit");
    btn.disabled=true;

    try{
      const {data,error}=await client.rpc("community_question_create",{
        p_title:title,
        p_content:content,
        p_topic:topic||null,
        p_page_path:location.pathname,
        p_image_path:null
      });
      if(error)throw error;

      communityFilter="latest";
      document.querySelectorAll("[data-community-filter]").forEach(b=>{
        b.classList.toggle("active",b.dataset.communityFilter==="latest");
      });
      await loadCommunity();
      if(data) await openCommunityQuestion(String(data));
    }catch(e){
      console.warn("Create community question",e);
      alert("Chưa đăng được câu hỏi.");
    }finally{
      if(btn)btn.disabled=false;
    }
  }

  async function openCommunityQuestion(id){
    client=client||getClient();

    let q=communityQuestions.find(x=>String(x.id)===String(id));
    if(!q){
      try{
        const {data,error}=await client.rpc("community_question_list",{
          p_filter:"latest",
          p_search:null,
          p_limit:100
        });
        if(error)throw error;
        communityQuestions=Array.isArray(data)?data:[];
        q=communityQuestions.find(x=>String(x.id)===String(id));
      }catch{}
    }

    if(!q){
      alert("Không tìm thấy câu hỏi.");
      return;
    }

    currentCommunityQuestion=q;
    const box=$("avpCommunityContent");
    box.innerHTML='<div class="avp-community-empty">Đang tải câu trả lời...</div>';

    try{
      const {data,error}=await client.rpc("community_answer_list",{p_question_id:q.id});
      if(error)throw error;
      renderCommunityQuestion(q,Array.isArray(data)?data:[]);
    }catch(e){
      console.warn("Community answers",e);
      box.innerHTML='<div class="avp-community-empty">Chưa tải được câu trả lời.</div>';
    }
  }

  function ratingStars(answer){
    const mine=Number(answer.my_rating||0);
    return `<div class="avp-answer-rating" title="Đánh giá câu trả lời">
      ${[1,2,3,4,5].map(n=>`<button type="button" data-rate="${n}" class="${mine>=n?"active":""}">★</button>`).join("")}
      <span>${answer.rating?`${Number(answer.rating).toFixed(1)} (${Number(answer.rating_count||0)})`:"Chưa có đánh giá"}</span>
    </div>`;
  }

  function renderCommunityQuestion(q,answers){
    const box=$("avpCommunityContent");
    if(!box)return;

    const canAccept=user && String(user.id)===String(q.user_id);

    box.innerHTML=`
      <div class="avp-community-detail">
        <button type="button" class="avp-community-back" id="avpCommunityDetailBack">← Quay lại cộng đồng</button>

        <article class="avp-question-detail-card">
          <div class="avp-question-meta">
            ${communityStatus(q)}
            ${q.topic?`<span class="avp-community-topic">${esc(q.topic)}</span>`:""}
            <span>${communityTime(q.created_at)}</span>
          </div>
          <h2>${esc(q.title)}</h2>
          <p>${esc(q.content).replace(/\n/g,"<br>")}</p>
          <div class="avp-question-user">👤 ${esc(q.display_name||"Học viên")}</div>
        </article>

        <div class="avp-answer-section-title">
          <strong>${answers.length} câu trả lời</strong>
          <span>${q.status==="resolved"?"Đã có lời giải được chấp nhận":"Cùng hỗ trợ người học"}</span>
        </div>

        <div id="avpCommunityAnswers">
          ${answers.length?answers.map(a=>`
            <article class="avp-answer-card ${a.is_accepted?"accepted":""}" data-answer-id="${esc(a.id)}">
              ${a.is_accepted?'<div class="avp-accepted-label">✅ Câu trả lời được chấp nhận</div>':""}
              <div class="avp-answer-author">
                <strong>${esc(a.display_name||"Học viên")}</strong>
                <span>${communityTime(a.created_at)}</span>
              </div>
              <div class="avp-answer-content">${esc(a.content).replace(/\n/g,"<br>")}</div>

              <div class="avp-answer-actions">
                <button type="button" data-vote="1" class="${Number(a.my_vote)===1?"active":""}">👍 ${Number(a.helpful||0)}</button>
                <button type="button" data-vote="-1" class="${Number(a.my_vote)===-1?"active":""}">👎 ${Number(a.not_helpful||0)}</button>
                ${canAccept&&!a.is_accepted?'<button type="button" class="avp-accept-answer">✓ Chọn câu trả lời đúng</button>':""}
              </div>

              ${ratingStars(a)}
            </article>
          `).join(""):'<div class="avp-community-empty avp-community-empty-small">Chưa có câu trả lời. Bạn có thể là người đầu tiên hỗ trợ.</div>'}
        </div>

        <div class="avp-answer-compose">
          <h3>Viết câu trả lời</h3>
          <textarea id="avpAnswerContent" maxlength="5000" rows="4" placeholder="Chia sẻ cách xử lý rõ ràng, dễ làm theo..."></textarea>
          <button type="button" id="avpAnswerSubmit" class="avp-primary-btn">Gửi câu trả lời</button>
        </div>
      </div>
    `;

    $("avpCommunityDetailBack").onclick=()=>loadCommunity();
    $("avpAnswerSubmit").onclick=createCommunityAnswer;

    box.querySelectorAll("[data-answer-id]").forEach(card=>{
      const aid=card.dataset.answerId;

      card.querySelectorAll("[data-vote]").forEach(btn=>{
        btn.onclick=()=>voteCommunityAnswer(aid,Number(btn.dataset.vote),btn.classList.contains("active"));
      });

      card.querySelectorAll("[data-rate]").forEach(btn=>{
        btn.onclick=()=>rateCommunityAnswer(aid,Number(btn.dataset.rate));
      });

      const accept=card.querySelector(".avp-accept-answer");
      if(accept)accept.onclick=()=>acceptCommunityAnswer(aid);
    });
  }

  async function createCommunityAnswer(){
    if(!(await requireCommunityLogin()))return;
    if(!currentCommunityQuestion)return;

    const content=String($("avpAnswerContent")?.value||"").trim();
    if(content.length<2){
      alert("Hãy nhập nội dung câu trả lời.");
      return;
    }

    const btn=$("avpAnswerSubmit");
    btn.disabled=true;

    try{
      const {error}=await client.rpc("community_answer_create",{
        p_question_id:currentCommunityQuestion.id,
        p_content:content,
        p_image_path:null
      });
      if(error)throw error;
      await openCommunityQuestion(currentCommunityQuestion.id);
      await updateNotificationBadge();
    }catch(e){
      console.warn("Create answer",e);
      alert("Chưa gửi được câu trả lời.");
    }finally{
      if(btn)btn.disabled=false;
    }
  }

  async function voteCommunityAnswer(answerId,vote,isActive){
    if(!(await requireCommunityLogin()))return;

    try{
      const {error}=await client.rpc("community_answer_vote",{
        p_answer_id:answerId,
        p_vote:isActive?0:vote
      });
      if(error)throw error;
      await openCommunityQuestion(currentCommunityQuestion.id);
      await updateNotificationBadge();
    }catch(e){
      console.warn("Vote answer",e);
      const msg=String(e?.message||"");
      alert(msg.includes("SELF_VOTE")?"Bạn không thể vote câu trả lời của chính mình.":"Chưa ghi nhận được lượt vote.");
    }
  }

  async function rateCommunityAnswer(answerId,rating){
    if(!(await requireCommunityLogin()))return;

    try{
      const {error}=await client.rpc("community_answer_rate",{
        p_answer_id:answerId,
        p_rating:rating
      });
      if(error)throw error;
      await openCommunityQuestion(currentCommunityQuestion.id);
      await updateNotificationBadge();
    }catch(e){
      console.warn("Rate answer",e);
      const msg=String(e?.message||"");
      alert(msg.includes("SELF_RATING")?"Bạn không thể tự đánh giá câu trả lời của mình.":"Chưa ghi nhận được đánh giá.");
    }
  }

  async function acceptCommunityAnswer(answerId){
    if(!(await requireCommunityLogin()))return;
    if(!currentCommunityQuestion)return;

    try{
      const {error}=await client.rpc("community_answer_accept",{
        p_question_id:currentCommunityQuestion.id,
        p_answer_id:answerId
      });
      if(error)throw error;

      currentCommunityQuestion.status="resolved";
      currentCommunityQuestion.accepted_answer_id=answerId;
      await openCommunityQuestion(currentCommunityQuestion.id);
      await updateNotificationBadge();
    }catch(e){
      console.warn("Accept answer",e);
      alert("Chưa chọn được câu trả lời này.");
    }
  }


  function communityLevelFromScore(score){
    const s=Math.max(0,Number(score||0));

    if(s>=1000)return {
      code:"avp_expert",icon:"🥇",name:"AVP Expert",
      min:1000,next:null,nextName:null
    };

    if(s>=500)return {
      code:"excel_expert",icon:"🥈",name:"Excel Expert",
      min:500,next:1000,nextName:"AVP Expert"
    };

    if(s>=200)return {
      code:"excel_helper",icon:"🥉",name:"Excel Helper",
      min:200,next:500,nextName:"Excel Expert"
    };

    if(s>=50)return {
      code:"supporter",icon:"📘",name:"Người hỗ trợ",
      min:50,next:200,nextName:"Excel Helper"
    };

    return {
      code:"new_member",icon:"🌱",name:"Thành viên mới",
      min:0,next:50,nextName:"Người hỗ trợ"
    };
  }

  function communityLevelPill(score){
    const lv=communityLevelFromScore(score);
    return `<span class="avp-community-level ${lv.code}">${lv.icon} ${esc(lv.name)}</span>`;
  }

  async function showCommunityProfile(profileUserId=null){
    if(!(await requireCommunityLogin()))return;

    const box=$("avpCommunityContent");
    if(!box)return;

    box.innerHTML='<div class="avp-community-empty">Đang tải hồ sơ cộng đồng...</div>';

    try{
      const targetId=profileUserId || user.id;

      const [
        profileRes,
        certRes
      ]=await Promise.all([
        client.rpc("community_profile",{p_user_id:targetId}),
        client.rpc("community_certificate_wallet",{p_user_id:targetId})
      ]);

      if(profileRes.error)throw profileRes.error;
      if(certRes.error)throw certRes.error;

      const p=Array.isArray(profileRes.data)?profileRes.data[0]:profileRes.data;
      if(!p){
        box.innerHTML='<div class="avp-community-empty">Chưa có hồ sơ cộng đồng.</div>';
        return;
      }

      renderCommunityProfile(p,Array.isArray(certRes.data)?certRes.data:[]);
    }catch(e){
      console.warn("Community profile",e);
      box.innerHTML='<div class="avp-community-empty">Chưa tải được hồ sơ. Hãy chạy SQL COMMUNITY LEVELS & CERTS V1.</div>';
    }
  }

  function renderCommunityProfile(p,certs){
    const box=$("avpCommunityContent");
    if(!box)return;

    const level=communityLevelFromScore(p.score);
    const current=Math.max(0,Number(p.score||0)-level.min);
    const span=level.next===null?1:Math.max(1,level.next-level.min);
    const progress=level.next===null?100:Math.max(0,Math.min(100,Math.round(current/span*100)));

    const unlocked=certs.filter(c=>c.unlocked);
    const locked=certs.filter(c=>!c.unlocked);

    box.innerHTML=`
      <div class="avp-community-profile">
        <button type="button" class="avp-community-back" id="avpCommunityProfileBack">← Quay lại cộng đồng</button>

        <section class="avp-profile-hero">
          <div class="avp-profile-avatar">${level.icon}</div>

          <div class="avp-profile-main">
            <div class="avp-profile-title">
              <h2>${esc(p.display_name||"Học viên")}</h2>
              ${communityLevelPill(p.score)}
            </div>

            <p>Hạng cộng đồng #${Number(p.rank_position||0) || "—"} · ${Number(p.score||0)} điểm</p>

            <div class="avp-level-progress">
              <div class="avp-level-progress-bar">
                <span style="width:${progress}%"></span>
              </div>
              <small>
                ${level.next===null
                  ? "Đã đạt cấp cao nhất hiện tại"
                  : `Còn ${Math.max(0,level.next-Number(p.score||0))} điểm để đạt ${esc(level.nextName)}`}
              </small>
            </div>
          </div>
        </section>

        <section class="avp-profile-stats">
          <div><strong>${Number(p.answers||0)}</strong><span>Câu trả lời</span></div>
          <div><strong>${Number(p.accepted||0)}</strong><span>Đáp án đúng</span></div>
          <div><strong>${Number(p.helpful||0)}</strong><span>Lượt hữu ích</span></div>
          <div><strong>${p.avg_rating?Number(p.avg_rating).toFixed(1):"—"}</strong><span>Đánh giá ⭐</span></div>
        </section>

        <section class="avp-profile-cert-section">
          <div class="avp-profile-section-head">
            <div>
              <h3>🏅 Chứng nhận cộng đồng</h3>
              <p>Mở khóa theo thành tích · Có mã xác minh riêng.</p>
            </div>
            <div class="avp-cert-head-actions">
              <button type="button" id="avpVerifyCertificateBtn">🔎 Xác minh</button>
              <strong>${unlocked.length}/${certs.length}</strong>
            </div>
          </div>

          <div class="avp-cert-grid">
            ${certs.map(c=>`
              <article class="avp-cert-card ${c.unlocked?"unlocked":"locked"}" data-cert-code="${esc(c.certificate_code)}">
                <div class="avp-cert-icon">${c.unlocked?"🏅":"🔒"}</div>
                <div class="avp-cert-card-body">
                  <strong>${esc(c.title)}</strong>
                  <p>${esc(c.description)}</p>
                  <small>${c.unlocked
                    ? c.verification_code
                      ? `✓ Đã cấp · Mã ${esc(c.verification_code)}`
                      : `✓ Đã mở · ${Number(c.progress_percent||100)}%`
                    : `${Number(c.progress_percent||0)}% hoàn thành`}</small>

                  ${c.unlocked ? `
                    <div class="avp-cert-actions">
                      <button type="button" data-cert-action="${c.verification_code?"view":"issue"}">
                        ${c.verification_code?"👁 Xem chứng nhận":"🏅 Nhận chứng nhận"}
                      </button>
                      ${c.verification_code?`<button type="button" data-cert-copy="${esc(c.verification_code)}">📋 Sao chép mã</button>`:""}
                    </div>` : ""}
                </div>
              </article>
            `).join("") || '<div class="avp-community-empty">Chưa có chứng nhận.</div>'}
          </div>
        </section>

        <section class="avp-profile-levels">
          <h3>Lộ trình cấp bậc</h3>
          <div class="avp-level-roadmap">
            ${[
              ["🌱","Thành viên mới","0 điểm"],
              ["📘","Người hỗ trợ","50 điểm"],
              ["🥉","Excel Helper","200 điểm"],
              ["🥈","Excel Expert","500 điểm"],
              ["🥇","AVP Expert","1.000 điểm"]
            ].map(([icon,name,req])=>`
              <div class="${name===level.name?"current":""}">
                <span>${icon}</span>
                <strong>${name}</strong>
                <small>${req}</small>
              </div>
            `).join("")}
          </div>
        </section>
      </div>
    `;

    $("avpCommunityProfileBack").onclick=()=>{
      if(communityFilter==="leaderboard")loadCommunityLeaderboard();
      else loadCommunity();
    };

    $("avpVerifyCertificateBtn").onclick=verifyCommunityCertificatePrompt;

    box.querySelectorAll("[data-cert-code]").forEach(card=>{
      const code=card.dataset.certCode;
      const cert=certs.find(x=>String(x.certificate_code)===String(code));
      if(!cert)return;

      const action=card.querySelector("[data-cert-action]");
      if(action){
        action.onclick=async()=>{
          if(cert.verification_code){
            showCommunityCertificate(p,cert);
          }else{
            await issueCommunityCertificate(cert.certificate_code);
          }
        };
      }

      const copy=card.querySelector("[data-cert-copy]");
      if(copy){
        copy.onclick=async()=>{
          try{
            await navigator.clipboard.writeText(copy.dataset.certCopy);
            alert("Đã sao chép mã xác minh.");
          }catch{
            alert(`Mã xác minh: ${copy.dataset.certCopy}`);
          }
        };
      }
    });
  }


  async function issueCommunityCertificate(certificateCode){
    if(!(await requireCommunityLogin()))return;

    try{
      const {data,error}=await client.rpc("community_certificate_issue",{
        p_certificate_code:certificateCode
      });
      if(error)throw error;

      const row=Array.isArray(data)?data[0]:data;
      if(!row?.verification_code){
        throw new Error("CERTIFICATE_NOT_RETURNED");
      }

      await showCommunityProfile(user.id);
    }catch(e){
      console.warn("Issue certificate",e);
      const msg=String(e?.message||"");
      if(msg.includes("CERTIFICATE_NOT_UNLOCKED")){
        alert("Bạn chưa đủ điều kiện nhận chứng nhận này.");
      }else{
        alert("Chưa cấp được chứng nhận. Hãy thử lại.");
      }
    }
  }

  function certificateCanvas(profile,cert){
    const canvas=document.createElement("canvas");
    canvas.width=1600;
    canvas.height=1131;

    const ctx=canvas.getContext("2d");

    ctx.fillStyle="#fbfdfb";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="#217346";
    ctx.lineWidth=18;
    ctx.strokeRect(36,36,canvas.width-72,canvas.height-72);

    ctx.strokeStyle="#9ac5aa";
    ctx.lineWidth=3;
    ctx.strokeRect(62,62,canvas.width-124,canvas.height-124);

    ctx.fillStyle="#174f31";
    ctx.textAlign="center";
    ctx.font="700 42px Arial, sans-serif";
    ctx.fillText("ANH VĂN PHÒNG",800,150);

    ctx.fillStyle="#217346";
    ctx.font="700 74px Arial, sans-serif";
    ctx.fillText("CHỨNG NHẬN CỘNG ĐỒNG",800,270);

    ctx.fillStyle="#65766c";
    ctx.font="32px Arial, sans-serif";
    ctx.fillText("Chứng nhận này được trao cho",800,350);

    ctx.fillStyle="#163f29";
    ctx.font="700 62px Arial, sans-serif";
    ctx.fillText(String(profile.display_name||"Học viên"),800,455);

    ctx.fillStyle="#65766c";
    ctx.font="30px Arial, sans-serif";
    ctx.fillText("đã đạt thành tích và được công nhận ở cấp",800,525);

    ctx.fillStyle="#174f31";
    ctx.font="700 54px Arial, sans-serif";
    ctx.fillText(String(cert.title||"Community Certificate"),800,620);

    ctx.fillStyle="#53675b";
    ctx.font="28px Arial, sans-serif";
    ctx.fillText(`Điểm cộng đồng: ${Number(profile.score||0)}  ·  Đáp án đúng: ${Number(profile.accepted||0)}  ·  Hữu ích: ${Number(profile.helpful||0)}`,800,705);

    ctx.fillStyle="#53675b";
    ctx.font="26px Arial, sans-serif";
    const issued=cert.issued_at ? new Date(cert.issued_at).toLocaleDateString("vi-VN") : new Date().toLocaleDateString("vi-VN");
    ctx.fillText(`Ngày cấp: ${issued}`,800,775);

    ctx.fillStyle="#174f31";
    ctx.font="700 28px Arial, sans-serif";
    ctx.fillText(`Mã xác minh: ${String(cert.verification_code||"")}`,800,842);

    ctx.strokeStyle="#d6e6dc";
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(280,900);
    ctx.lineTo(1320,900);
    ctx.stroke();

    ctx.fillStyle="#738178";
    ctx.font="24px Arial, sans-serif";
    ctx.fillText("Learn Excel with Anh Văn Phòng · Cộng đồng học Excel thực tế",800,955);

    ctx.fillStyle="#217346";
    ctx.beginPath();
    ctx.arc(800,1030,42,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#fff";
    ctx.font="700 24px Arial, sans-serif";
    ctx.fillText("AVP",800,1038);

    return canvas;
  }

  function showCommunityCertificate(profile,cert){
    const canvas=certificateCanvas(profile,cert);
    const dataUrl=canvas.toDataURL("image/png");

    const box=$("avpCommunityContent");
    if(!box)return;

    box.innerHTML=`
      <div class="avp-certificate-view">
        <button type="button" class="avp-community-back" id="avpCertificateBack">← Quay lại hồ sơ</button>

        <div class="avp-certificate-toolbar">
          <div>
            <strong>${esc(cert.title)}</strong>
            <span>Mã xác minh: ${esc(cert.verification_code||"")}</span>
          </div>
          <div>
            <button type="button" id="avpCertificateDownload">⬇ PNG</button>
            <button type="button" id="avpCertificatePrint">🖨 PDF / In</button>
          </div>
        </div>

        <div class="avp-certificate-image-wrap">
          <img id="avpCertificateImage" src="${dataUrl}" alt="Chứng nhận ${esc(cert.title)}">
        </div>

        <p class="avp-cert-verify-note">Chứng nhận có thể được kiểm tra bằng mã xác minh trong mục “🔎 Xác minh”.</p>
      </div>
    `;

    $("avpCertificateBack").onclick=()=>showCommunityProfile(profile.user_id);

    $("avpCertificateDownload").onclick=()=>{
      const a=document.createElement("a");
      a.href=dataUrl;
      a.download=`AVP-${String(cert.certificate_code||"certificate")}-${String(profile.display_name||"hoc-vien").replace(/[^\p{L}\p{N}]+/gu,"-")}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    $("avpCertificatePrint").onclick=()=>{
      const w=window.open("","_blank");
      if(!w){
        alert("Trình duyệt đang chặn cửa sổ in.");
        return;
      }

      w.document.write(`
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${esc(cert.title)}</title>
            <style>
              html,body{margin:0;background:#fff}
              img{display:block;width:100%;max-width:1120px;margin:0 auto}
              @media print{@page{size:A4 landscape;margin:0}img{width:100%}}
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="setTimeout(()=>window.print(),200)">
          </body>
        </html>
      `);
      w.document.close();
    };
  }

  async function verifyCommunityCertificatePrompt(){
    const code=prompt("Nhập mã xác minh chứng nhận:");
    if(!code)return;

    try{
      const {data,error}=await client.rpc("community_certificate_verify",{
        p_verification_code:String(code).trim().toUpperCase()
      });
      if(error)throw error;

      const row=Array.isArray(data)?data[0]:data;

      if(!row){
        alert("Không tìm thấy chứng nhận với mã này.");
        return;
      }

      alert(
        row.is_valid
          ? `✅ CHỨNG NHẬN HỢP LỆ\n\n${row.display_name}\n${row.title}\nMã: ${row.verification_code}\nNgày cấp: ${new Date(row.issued_at).toLocaleDateString("vi-VN")}`
          : `⚠️ CHỨNG NHẬN ĐÃ BỊ THU HỒI\n\n${row.display_name}\n${row.title}\nMã: ${row.verification_code}`
      );
    }catch(e){
      console.warn("Verify certificate",e);
      alert("Không tìm thấy hoặc chưa kiểm tra được mã chứng nhận.");
    }
  }

  async function loadCommunityLeaderboard(){
    client=client||getClient();
    const box=$("avpCommunityContent");
    box.innerHTML='<div class="avp-community-empty">Đang tải bảng xếp hạng...</div>';

    try{
      const {data,error}=await client.rpc("community_leaderboard",{
        p_period:"month",
        p_limit:30
      });
      if(error)throw error;

      const rows=Array.isArray(data)?data:[];
      box.innerHTML=`
        <div class="avp-leaderboard-head">
          <div>
            <strong>🏆 BXH Cộng đồng tháng này</strong>
            <span>Điểm từ trả lời, lượt hữu ích, đánh giá và đáp án đúng</span>
          </div>
          <div class="avp-period-pills">
            <button type="button" data-period="today">Hôm nay</button>
            <button type="button" data-period="week">Tuần</button>
            <button type="button" data-period="month" class="active">Tháng</button>
            <button type="button" data-period="all">Tất cả</button>
          </div>
        </div>
        <div id="avpLeaderboardRows">${leaderboardRowsHtml(rows)}</div>
      `;

      box.querySelectorAll("[data-period]").forEach(btn=>{
        btn.onclick=async()=>{
          box.querySelectorAll("[data-period]").forEach(b=>b.classList.toggle("active",b===btn));
          await refreshLeaderboardPeriod(btn.dataset.period);
        };
      });

      bindCommunityProfileLinks(box);
    }catch(e){
      console.warn("Leaderboard",e);
      box.innerHTML='<div class="avp-community-empty">Chưa tải được bảng xếp hạng.</div>';
    }
  }

  function leaderboardRowsHtml(rows){
    if(!rows.length){
      return '<div class="avp-community-empty avp-community-empty-card">Chưa có điểm cộng đồng trong kỳ này.</div>';
    }

    return rows.map((r,i)=>`
      <div class="avp-leaderboard-row" data-profile-user="${esc(r.user_id)}">
        <div class="avp-rank">${i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</div>
        <div class="avp-leader-user">
          <div class="avp-leader-name-line">
            <strong>${esc(r.display_name||"Học viên")}</strong>
            ${communityLevelPill(r.score)}
          </div>
          <span>✅ ${Number(r.accepted||0)} đúng · 👍 ${Number(r.helpful||0)} hữu ích · ⭐ ${r.avg_rating?Number(r.avg_rating).toFixed(1):"—"}</span>
        </div>
        <div class="avp-score">${Number(r.score||0)}<span>điểm</span></div>
      </div>
    `).join("");
  }


  function bindCommunityProfileLinks(root){
    root?.querySelectorAll?.("[data-profile-user]").forEach(row=>{
      row.onclick=()=>showCommunityProfile(row.dataset.profileUser);
    });
  }

  async function refreshLeaderboardPeriod(period){
    try{
      const {data,error}=await client.rpc("community_leaderboard",{
        p_period:period,
        p_limit:30
      });
      if(error)throw error;
      $("avpLeaderboardRows").innerHTML=leaderboardRowsHtml(Array.isArray(data)?data:[]);
      bindCommunityProfileLinks($("avpLeaderboardRows"));
    }catch(e){
      console.warn("Leaderboard period",e);
    }
  }

  async function transferToCommunity(){
    client=client||getClient();

    if(!client?.rpc){
      alert("Cộng đồng chưa kết nối được Supabase.");
      return;
    }

    if(!(await requireCommunityLogin()))return;

    let question="";
    try{
      await ensureSession();
      const {data}=await client.rpc("avp_ai_last_user_question",{p_session_id:sessionId});
      question=String(data||"").trim();
    }catch{}

    await openCommunityPanel(question);
  }

  async function updateNotificationBadge(){
    client=client||getClient();

    const bubble=$("avpNotifyBubbleBadge");
    const tab=$("avpNotifyTabBadge");

    if(!client?.rpc){
      if(bubble)bubble.hidden=true;
      if(tab)tab.hidden=true;
      return;
    }

    await currentUser();
    if(!user){
      if(bubble)bubble.hidden=true;
      if(tab)tab.hidden=true;
      return;
    }

    try{
      const {data,error}=await client.rpc("notification_unread_count");
      if(error)throw error;

      const count=Math.max(0,Number(data||0));
      const text=count>99?"99+":String(count);

      [bubble,tab].forEach(el=>{
        if(!el)return;
        el.hidden=count<=0;
        el.textContent=count>0?text:"";
      });

      syncExternalCommunityBadge();
    }catch(e){
      console.warn("Notification badge",e);
    }
  }

  async function loadNotifications(){
    client=client||getClient();

    if(!(await requireCommunityLogin())){
      $("avpNotificationContent").innerHTML='<div class="avp-community-empty">Đăng nhập để xem thông báo của bạn.</div>';
      return;
    }

    $("avpNotificationContent").innerHTML='<div class="avp-community-empty">Đang tải thông báo...</div>';

    try{
      const {data,error}=await client.rpc("notification_center_list",{p_limit:80});
      if(error)throw error;

      window.__avpNotifications=Array.isArray(data)?data:[];
      const active=document.querySelector("[data-notify-filter].active")?.dataset.notifyFilter||"all";
      renderNotifications(window.__avpNotifications,active);
      await updateNotificationBadge();
    }catch(e){
      console.warn("Notifications",e);
      $("avpNotificationContent").innerHTML='<div class="avp-community-empty">Chưa tải được thông báo.</div>';
    }
  }

  function notificationIcon(n){
    if(n.kind==="system"){
      if(n.type==="minigame")return "🎁";
      if(n.type==="event")return "📅";
      if(n.type==="important")return "🚨";
      if(n.type==="update")return "✨";
      return "📢";
    }
    if(n.type==="community_vote")return "👍";
    if(n.type==="community_rating")return "⭐";
    if(n.type==="community_accepted")return "✅";
    if(n.type==="community_answer")return "💬";
    return "🔔";
  }

  function renderNotifications(rows,filter="all"){
    const box=$("avpNotificationContent");
    if(!box)return;

    const data=rows.filter(n=>{
      if(filter==="all")return true;
      if(filter==="system")return n.kind==="system";
      return n.kind==="personal";
    });

    if(!data.length){
      box.innerHTML='<div class="avp-community-empty avp-community-empty-card">Bạn chưa có thông báo trong mục này.</div>';
      return;
    }

    box.innerHTML=data.map(n=>`
      <article class="avp-notification-item ${n.is_read?"":"unread"} ${n.is_pinned?"pinned":""}" data-notify-key="${esc(n.notification_key)}">
        <div class="avp-notification-icon">${notificationIcon(n)}</div>
        <div class="avp-notification-body">
          <div class="avp-notification-title">
            <strong>${esc(n.title)}</strong>
            ${n.is_pinned?'<span>GHIM</span>':""}
          </div>
          ${n.content?`<p>${esc(n.content).replace(/\n/g,"<br>")}</p>`:""}
          <small>${communityTime(n.created_at)} · ${n.kind==="system"?"Hệ thống":"Cá nhân"}</small>
        </div>
        ${n.is_read?"":'<i class="avp-unread-dot"></i>'}
      </article>
    `).join("");

    box.querySelectorAll("[data-notify-key]").forEach(item=>{
      item.onclick=()=>markNotificationRead(item.dataset.notifyKey,item);
    });
  }

  async function markNotificationRead(key,item){
    if(item?.classList.contains("unread")){
      try{
        const {error}=await client.rpc("notification_mark_read",{p_key:key});
        if(error)throw error;
        item.classList.remove("unread");
        item.querySelector(".avp-unread-dot")?.remove();

        const row=(window.__avpNotifications||[]).find(x=>x.notification_key===key);
        if(row)row.is_read=true;

        await updateNotificationBadge();
      }catch(e){
        console.warn("Mark notification read",e);
      }
    }

    const row=(window.__avpNotifications||[]).find(x=>x.notification_key===key);
    if(row?.source_type==="question" && row.source_id){
      await switchMode("community");
      await openCommunityQuestion(row.source_id);
    }
  }

  async function markAllNotificationsRead(){
    if(!(await requireCommunityLogin()))return;

    try{
      const {error}=await client.rpc("notification_mark_all_read");
      if(error)throw error;
      await loadNotifications();
    }catch(e){
      console.warn("Mark all notifications",e);
      alert("Chưa đánh dấu được thông báo.");
    }
  }


  function findOuterSupportMenu(){
    const all=[...document.querySelectorAll("button,a")];

    const byText=t=>all.find(el=>{
      const text=String(el.textContent||"").replace(/\s+/g," ").trim();
      return text===t || text.endsWith(t);
    });

    const learning=byText("Học tập");
    const admin=byText("Chat Admin");
    const ai=byText("Hỏi AI");

    if(learning && admin && learning.parentElement===admin.parentElement){
      return {host:learning.parentElement,template:admin,learning,admin,ai};
    }

    if(ai && admin && ai.parentElement===admin.parentElement){
      return {host:ai.parentElement,template:admin,learning,admin,ai};
    }

    return null;
  }

  function mountExternalCommunityButton(){
    if($("avpExternalCommunityButton"))return true;

    const menu=findOuterSupportMenu();
    if(!menu?.host)return false;

    const btn=document.createElement("button");
    btn.id="avpExternalCommunityButton";
    btn.type="button";
    btn.className=menu.template?.className||"";
    btn.innerHTML=`<span class="avp-community-menu-icon">👥</span><span class="avp-community-menu-label">Cộng đồng</span><span id="avpCommunityMenuBadge" class="avp-community-menu-badge" hidden></span>`;

    // Đồng bộ typography chính xác với nút Chat Admin hiện tại.
    // Tránh span "Cộng đồng" bị global CSS trên website làm chữ to hơn.
    if(menu.template){
      const style=getComputedStyle(menu.template);
      btn.style.fontFamily=style.fontFamily;
      btn.style.fontSize=style.fontSize;
      btn.style.fontWeight=style.fontWeight;
      btn.style.lineHeight=style.lineHeight;

      const label=btn.querySelector(".avp-community-menu-label");
      if(label){
        label.style.fontFamily=style.fontFamily;
        label.style.fontSize=style.fontSize;
        label.style.fontWeight=style.fontWeight;
        label.style.lineHeight=style.lineHeight;
      }
    }

    btn.addEventListener("click",async e=>{
      e.preventDefault();
      e.stopPropagation();
      await openCommunityPanel();
    });

    if(menu.admin){
      menu.host.insertBefore(btn,menu.admin);
    }else{
      menu.host.appendChild(btn);
    }

    return true;
  }

  async function openCommunityPanel(prefill=""){
    const p=$("avpAiChatPanel");
    if(!p)return;

    p.hidden=false;
    await switchMode("community");

    if(prefill){
      showCommunityAskForm(prefill);
    }
  }

  async function openAiPanel(){
    const p=$("avpAiChatPanel");
    if(!p)return;
    p.hidden=false;
    await switchMode("ai");
  }

  function syncExternalCommunityBadge(){
    const source=$("avpNotifyBubbleBadge");
    const target=$("avpCommunityMenuBadge");
    if(!target)return;

    const value=String(source?.textContent||"").trim();
    const hidden=!source || source.hidden || !value;

    target.hidden=hidden;
    target.textContent=hidden?"":value;
  }

  window.AVPCommunity={
    open:openCommunityPanel,
    ask:async(prefill="")=>openCommunityPanel(prefill),
    notifications:async()=>{
      const p=$("avpAiChatPanel");
      if(!p)return;
      p.hidden=false;
      await switchMode("notifications");
    }
  };

  window.AVPAIChat={
    open:openAiPanel
  };

  function clearSelectedImage(){
    if(selectedImage?.previewUrl){
      try{URL.revokeObjectURL(selectedImage.previewUrl)}catch{}
    }
    selectedImage=null;

    const input=$("avpAiImageInput");
    if(input)input.value="";

    const preview=$("avpAiImagePreview");
    if(preview)preview.hidden=true;
  }

  async function normalizeImage(file){
    if(!file || !String(file.type||"").startsWith("image/")){
      throw new Error("INVALID_IMAGE");
    }

    if(file.size > 8 * 1024 * 1024){
      throw new Error("IMAGE_TOO_LARGE");
    }

    const url=URL.createObjectURL(file);

    try{
      const img=new Image();

      await new Promise((resolve,reject)=>{
        img.onload=resolve;
        img.onerror=()=>reject(new Error("IMAGE_DECODE_FAILED"));
        img.src=url;
      });

      const maxSide=1800;
      const scale=Math.min(1,maxSide/Math.max(img.naturalWidth,img.naturalHeight));
      const w=Math.max(1,Math.round(img.naturalWidth*scale));
      const h=Math.max(1,Math.round(img.naturalHeight*scale));

      const canvas=document.createElement("canvas");
      canvas.width=w;
      canvas.height=h;

      const ctx=canvas.getContext("2d");
      ctx.drawImage(img,0,0,w,h);

      const blob=await new Promise(resolve=>
        canvas.toBlob(resolve,"image/jpeg",0.86)
      );

      if(!blob)throw new Error("IMAGE_CONVERT_FAILED");

      return new File(
        [blob],
        `${String(file.name||"anh").replace(/\.[^.]+$/,"")}.jpg`,
        {type:"image/jpeg"}
      );
    }finally{
      URL.revokeObjectURL(url);
    }
  }

  async function handleImagePick(e){
    const file=e.target.files?.[0];
    if(!file)return;

    try{
      const normalized=await normalizeImage(file);

      clearSelectedImage();

      const previewUrl=URL.createObjectURL(normalized);
      selectedImage={
        file:normalized,
        previewUrl,
        originalName:file.name||"Ảnh"
      };

      $("avpAiImageThumb").src=previewUrl;
      $("avpAiImageName").textContent=
        `${selectedImage.originalName} · ${Math.max(1,Math.round(normalized.size/1024))} KB`;
      $("avpAiImagePreview").hidden=false;
    }catch(err){
      console.warn("AVP AI image",err);

      if(err?.message==="IMAGE_TOO_LARGE"){
        alert("Ảnh quá lớn. Hãy chọn ảnh dưới 8 MB.");
      }else{
        alert("Không đọc được ảnh này. Hãy thử ảnh chụp màn hình, JPG hoặc PNG.");
      }

      clearSelectedImage();
    }
  }

  async function fileToDataUrl(file){
    if(!file)return "";

    return await new Promise((resolve,reject)=>{
      const reader=new FileReader();

      reader.onload=()=>resolve(String(reader.result||""));
      reader.onerror=()=>reject(new Error("IMAGE_READ_FAILED"));

      reader.readAsDataURL(file);
    });
  }

  async function uploadSelectedImage(){
    if(!selectedImage?.file)return null;

    const ext="jpg";
    const id=
      (crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`);
    const path=`${user.id}/${id}.${ext}`;

    const {error}=await client.storage
      .from("ai-chat-images")
      .upload(path,selectedImage.file,{
        contentType:"image/jpeg",
        upsert:false,
        cacheControl:"3600"
      });

    if(error)throw error;
    return path;
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
    const image=role==="user" && m.image_path
      ? `<div class="avp-ai-image-chip">📷 Ảnh đính kèm</div>`
      : "";
    const feedback=role==="assistant" && m.id ? `
      <div class="avp-ai-feedback" data-ai-msg="${esc(m.id)}">
        <button type="button" data-fb="up" aria-label="Hữu ích">👍</button>
        <button type="button" data-fb="down" aria-label="Chưa hữu ích">👎</button>
      </div>` : "";
    return `<div class="avp-ai-msg-row ${role}">
      <div class="avp-ai-msg">${image}${text}${feedback}</div>
    </div>`;
  }

  async function loadHistory(){
    if(!user){
      $("avpAiMessages").innerHTML=`<div class="avp-ai-empty">Đăng nhập để dùng AI Chat và lưu lịch sử.</div>`;
      return;
    }
    try{
      await ensureSession();
      const {data,error}=await client.rpc("avp_ai_history_v2",{p_session_id:sessionId,p_limit:30});
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
      await updateNotificationBadge();

      if(activeMode==="community"){
        if(communityFilter==="leaderboard") await loadCommunityLeaderboard();
        else await loadCommunity();
      }else if(activeMode==="notifications"){
        await loadNotifications();
      }else if(client?.rpc){
        await loadHistory();
      }else{
        const box=$("avpAiMessages");
        if(box){
          box.innerHTML='<div class="avp-ai-empty">AI Chat đã được tải. Đang chờ hệ thống đăng nhập/Supabase sẵn sàng…</div>';
        }
      }

      if(activeMode==="ai")setTimeout(()=>$("avpAiInput")?.focus(),50);
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
    if(!text && !selectedImage) return;

    const q=await quota();
    if(q.left<=0){
      alert("Bạn đã dùng hết 5 câu AI hôm nay. Ngày mai hệ thống sẽ tự mở lại.");
      return;
    }

    sending=true;
    $("avpAiSend").disabled=true;

    try{
      await ensureSession();

      let imagePath=null;
      let imageData="";
      let imageMime="";

      if(selectedImage){
        imagePath=await uploadSelectedImage();
        imageData=await fileToDataUrl(selectedImage.file);
        imageMime=selectedImage.file.type || "image/jpeg";
      }

      const content=text || "Hãy phân tích ảnh này và cho mình biết vấn đề cần chú ý.";

      const {data:saveUser,error:saveErr}=await client.rpc("avp_ai_add_user_message_v2",{
        p_session_id:sessionId,
        p_content:content,
        p_image_path:imagePath
      });
      if(saveErr) throw saveErr;

      input.value="";
      input.style.height="auto";
      clearSelectedImage();

      await loadHistory();

      const {data,error}=await client.functions.invoke("ai-chat",{
        body:{
          session_id:sessionId,
          image_path:imagePath,
          image:imageData,
          image_mime:imageMime
        }
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

      let detail="";

      try{
        const response=err?.context;

        if(response && typeof response.json==="function"){
          const payload=await response.json();

          const status=payload?.provider_status;
          const message=payload?.provider_message || payload?.error;

          if(status || message){
            detail=[
              status ? `Mã lỗi AI: ${status}` : "",
              message ? `Chi tiết: ${message}` : ""
            ].filter(Boolean).join("\n");
          }
        }
      }catch(parseErr){
        console.warn("Không đọc được lỗi Edge Function",parseErr);
      }

      alert(
        detail
          ? `AI chưa trả lời được lúc này.\n\n${detail}`
          : "AI chưa trả lời được lúc này. Bạn có thể chuyển câu hỏi cho Admin."
      );
    }finally{
      sending=false;
      await quota();
    }
  }

  async function transferToAdmin(){
    client=client||getClient();

    if(!client?.rpc){
      alert("Chat Admin chưa kết nối được Supabase.");
      return;
    }

    await currentUser();

    if(!user){
      alert("Bạn cần đăng nhập để chuyển câu hỏi cho Admin.");
      return;
    }

    try{
      await ensureSession();

      const {data:lastQuestion,error:lastErr}=await client.rpc(
        "avp_ai_last_user_question",
        {p_session_id:sessionId}
      );

      if(lastErr)throw lastErr;

      const question=String(lastQuestion||"").trim();

      if(!question){
        alert("Bạn chưa có câu hỏi nào để chuyển cho Admin.");
        return;
      }

      const body=[
        "🤖 Câu hỏi được chuyển từ AI Excel",
        "",
        question
      ].join("\n");

      const {error}=await client.rpc("avp_chat_send_user_message",{
        p_body:body
      });

      if(error)throw error;

      alert("Đã chuyển câu hỏi cho Admin. Bạn có thể mở Chat với Admin để theo dõi phản hồi.");
    }catch(e){
      console.warn("AVP AI transfer admin",e);
      alert("Chưa chuyển được câu hỏi cho Admin. Hãy thử lại sau.");
    }
  }

  async function start(){
    mount();

    let menuTry=0;
    const menuTimer=setInterval(()=>{
      menuTry++;
      if(mountExternalCommunityButton() || menuTry>60){
        clearInterval(menuTimer);
        syncExternalCommunityBadge();
      }
    },250);

    const ready=await waitClient();

    if(!ready){
      const box=$("avpAiMessages");
      if(box){
        box.innerHTML='<div class="avp-ai-empty">AI Chat chưa kết nối được Supabase. Hãy tải lại trang rồi thử lại.</div>';
      }
      return;
    }

    await currentUser();
    await updateNotificationBadge();

    try{
      client.auth.onAuthStateChange(async(_event,session)=>{
        user=session?.user||null;
        sessionId=null;
        clearSelectedImage();

        await updateNotificationBadge();

        if(!$("avpAiChatPanel")?.hidden){
          if(activeMode==="community"){
            if(communityFilter==="leaderboard") await loadCommunityLeaderboard();
            else await loadCommunity();
          }else if(activeMode==="notifications"){
            await loadNotifications();
          }else{
            await loadHistory();
          }
        }
      });
    }catch(e){
      console.warn("AVP AI auth listener",e);
    }
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",start,{once:true});
  }else{
    start();
  }
})();
