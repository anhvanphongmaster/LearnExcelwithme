(() => {
  const KEY_HISTORY='avp_learning_history_v2', KEY_BOOK='avp_bookmarks_v2';
  const IGNORE=new Set(['auth.html','admin.html','privacy.html','terms.html','disclaimer.html','open-source.html','lienhe.html','gioithieu.html']);
  const page=location.pathname.split('/').pop()||'index.html';
  const title=(document.querySelector('h1')?.textContent||document.title.split('|')[0]||page).trim();
  const now=Date.now();
  const safe=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const toast=(t)=>{let e=document.querySelector('.avp-save-toast');if(!e){e=document.createElement('div');e.className='avp-save-toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),1800)};
  if(!IGNORE.has(page)){
    const hist=safe(KEY_HISTORY).filter(x=>x.url!==page);hist.unshift({url:page,title,ts:now});save(KEY_HISTORY,hist.slice(0,12));
  }
  function progress(){
    const courses=safe('completedCourses'); const pg=safe('avp_playground_completed_v1');
    const coursePct=Math.min(100,Math.round((Array.isArray(courses)?courses.length:0)/6*100));
    const pgPct=Math.min(100,Math.round((Array.isArray(pg)?pg.length:0)/10*100));
    const quiz=Math.min(100,(parseInt(localStorage.getItem('quizBestScore')||'0',10)||0)*20);
    return Math.round((coursePct+pgPct+quiz)/3);
  }
  function renderHub(){
    const h=safe(KEY_HISTORY), b=safe(KEY_BOOK); const pct=progress();
    const recent=h.slice(0,5).map(x=>`<div class="avp-hub-card"><strong>${esc(x.title)}</strong><small>${ago(x.ts)}</small><div class="avp-hub-actions"><a class="avp-hub-btn" href="${attr(x.url)}">Mở lại →</a></div></div>`).join('')||'<div class="avp-hub-empty">Chưa có lịch sử học trên thiết bị này.</div>';
    const books=b.slice(0,6).map(x=>`<div class="avp-hub-card avp-hub-row"><div><strong>${esc(x.title)}</strong><small>Đã lưu để học lại</small></div><a class="avp-hub-btn" href="${attr(x.url)}">Mở</a></div>`).join('')||'<div class="avp-hub-empty">Chưa lưu bài nào. Bấm biểu tượng 🔖 ở cạnh phải để lưu.</div>';
    return `<div class="avp-hub-head"><div><div class="avp-hub-title">📚 Trung tâm học tập</div><small>Tiếp tục đúng chỗ, không mất tiến độ</small></div><button class="avp-hub-close" aria-label="Đóng">×</button></div>
      <section class="avp-hub-section"><h3>Tiến độ tổng</h3><div class="avp-hub-card"><div class="avp-hub-row"><strong>${pct}% hoàn thành</strong><small>trên thiết bị này</small></div><div class="avp-hub-progress"><span style="width:${pct}%"></span></div><div class="avp-hub-actions"><a class="avp-hub-btn" href="dashboard.html">Xem Dashboard</a><a class="avp-hub-btn secondary" href="skill-map.html">Lộ trình học</a></div></div></section><section class="avp-hub-section"><h3>Chức năng nhanh</h3><div class="avp-hub-quick">
<a class="avp-hub-btn" href="index.html">🏠 Trang chủ</a>
<a class="avp-hub-btn" href="practice-video.html">📚 Practice Hub</a>
<a class="avp-hub-btn" href="excel-race.html">🏁 Excel Race</a>
<a class="avp-hub-btn secondary" href="excel.html">📘 Excel cơ bản</a>
<a class="avp-hub-btn secondary" href="dashboard.html">📊 Tiến độ</a>
<a class="avp-hub-btn secondary" href="auth.html">👤 Đăng nhập</a>
</div></section>
      <section class="avp-hub-section"><h3>Học gần đây</h3>${recent}</section>
      <section class="avp-hub-section"><h3>Đã lưu</h3>${books}</section>
      <section class="avp-hub-section"><h3>Sao lưu tiến độ</h3><div class="avp-hub-card"><small>Xuất dữ liệu học tập để đổi máy/trình duyệt mà không mất tiến độ.</small><div class="avp-hub-actions"><button class="avp-hub-btn" data-export>Xuất tiến độ</button><label class="avp-hub-btn secondary" style="cursor:pointer">Nhập tiến độ<input data-import type="file" accept="application/json" hidden></label></div></div></section>`;
  }
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); const attr=esc;
  const ago=t=>{const m=Math.max(0,Math.floor((Date.now()-t)/60000));if(m<1)return'Vừa xem';if(m<60)return`${m} phút trước`;const h=Math.floor(m/60);if(h<24)return`${h} giờ trước`;return`${Math.floor(h/24)} ngày trước`};
  function openHub(){
    window.dispatchEvent(new CustomEvent('avp:surface-open',{detail:{surface:'learning'}}));
    setEdgeMenu(false);back.classList.add('open');hub.innerHTML=renderHub();hub.querySelector('.avp-hub-close').onclick=closeHub;hub.querySelector('[data-export]').onclick=exportData;hub.querySelector('[data-import]').onchange=importData}
  function closeHub(){back.classList.remove('open')}
  function exportData(){const data={version:2,exportedAt:new Date().toISOString(),origin:'LearnExcelwithme',storage:{}};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&(/^(avp_|completedCourses|currentCourse|quizBestScore|dashboardLots|theme)/.test(k)))data.storage[k]=localStorage.getItem(k)}const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`learn-excel-progress-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);toast('Đã xuất tiến độ')}
  function importData(e){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d||d.origin!=='LearnExcelwithme'||!d.storage)throw 0;Object.entries(d.storage).forEach(([k,v])=>localStorage.setItem(k,v));toast('Đã khôi phục tiến độ');setTimeout(()=>location.reload(),700)}catch{(window.avpAlert?window.avpAlert('File tiến độ không hợp lệ.',{title:"Excel",icon:"📥",tone:"ok"}):alert('File tiến độ không hợp lệ.'))}};r.readAsText(f)}
  /* =========================================================
     FLOATING ACTION HUB V3
     1 nút duy nhất ở viền: Trung tâm học / Chat Admin / Hỏi AI
     ========================================================= */
  const launcher=document.createElement('div');
  launcher.className='avp-edge-launcher is-right';
  launcher.id='avpEdgeLauncher';

  launcher.innerHTML=`
    <div class="avp-edge-menu" id="avpEdgeMenu" hidden>
      <button type="button" class="avp-edge-action" data-edge-action="ai">
        <span>✨</span><b>Hỏi AI</b>
      </button>
      <button type="button" class="avp-edge-action" data-edge-action="dictionary">
        <span>📘</span><b>Từ điển Excel</b>
      </button>
      <button type="button" class="avp-edge-action" data-edge-action="community" id="avpExternalCommunityButton">
        <span>👥</span><b>Cộng đồng</b>
        <span id="avpCommunityMenuBadge" class="avp-edge-section-badge" hidden>0</span>
      </button>
      <button type="button" class="avp-edge-action" data-edge-action="chat">
        <span>💬</span><b>Chat Admin</b>
      </button>
    </div>

    <button
      type="button"
      class="avp-hub-fab avp-edge-main"
      id="avpEdgeMain"
      aria-label="Mở công cụ nhanh"
      aria-expanded="false"
      title="Công cụ nhanh — kéo để di chuyển"
    >
      <span class="avp-edge-main-icon">AVP</span>
      <span class="avp-edge-badge" id="avpEdgeBadge" hidden>0</span>
    </button>
  `;

  document.body.appendChild(launcher);

  const fab=launcher.querySelector('#avpEdgeMain');
  const edgeMenu=launcher.querySelector('#avpEdgeMenu');
  const edgeBadge=launcher.querySelector('#avpEdgeBadge');

  /* =========================================================
     MINI PREVIEW V2 — FIXED LAYER
     Không nằm trong launcher để tránh bị CSS cha che.
     ========================================================= */
  const mini=document.createElement('button');
  mini.type='button';
  mini.className='avp-edge-mini-preview-v2';
  mini.id='avpEdgeMiniPreview';
  mini.hidden=true;
  mini.innerHTML=`
    <span class="avp-edge-mini-name"></span>
    <span class="avp-edge-mini-body"></span>
  `;
  document.body.appendChild(mini);

  let miniTimer=null;
  let miniDetail=null;
  let miniHideToken=0;

  const MINI_LAST_VISIT='avp_edge_last_visit_v2';
  const MINI_LAST_GREETING='avp_edge_last_greeting_v2';
  const MINI_LAST_UNREAD_SHOWN='avp_edge_last_unread_shown_v2';

  function miniDuration(text){
    const n=String(text||'').length;
    if(n<=35)return 3000;
    if(n<=90)return 4000;
    return 5000;
  }

  function launcherRect(){
    return launcher.getBoundingClientRect();
  }

  function positionMiniPreview(){
    if(mini.hidden)return;

    const r=launcherRect();
    const gap=8;
    const vw=window.innerWidth;
    const vh=window.innerHeight;

    /* cho browser tính width thật trước */
    const mr=mini.getBoundingClientRect();
    const mw=mr.width||Math.min(270,vw-78);
    const mh=mr.height||58;

    let top=r.top+(r.height-mh)/2;
    top=Math.max(8,Math.min(vh-mh-8,top));

    mini.style.top=Math.round(top)+'px';

    if(launcher.classList.contains('is-left')){
      mini.classList.add('from-left');
      mini.classList.remove('from-right');
      mini.style.left=Math.round(r.right+gap)+'px';
      mini.style.right='auto';
    }else{
      mini.classList.add('from-right');
      mini.classList.remove('from-left');
      mini.style.right=Math.round(vw-r.left+gap)+'px';
      mini.style.left='auto';
    }
  }

  function hideMiniPreview(){
    clearTimeout(miniTimer);
    miniTimer=null;

    if(mini.hidden)return;

    const token=++miniHideToken;

    mini.classList.remove('show');
    mini.classList.add('hide');

    setTimeout(()=>{
      if(token!==miniHideToken)return;
      mini.hidden=true;
      mini.classList.remove('hide');
    },240);
  }

  function showMiniPreview(detail){
    const body=String(detail?.body||'Tin nhắn mới').trim()||'Tin nhắn mới';
    const sender=String(detail?.sender||'Tin nhắn mới').trim();

    miniDetail=detail||{};

    mini.querySelector('.avp-edge-mini-name').textContent=sender;
    mini.querySelector('.avp-edge-mini-body').textContent=body;

    clearTimeout(miniTimer);
    ++miniHideToken;

    mini.hidden=false;
    mini.classList.remove('hide');

    /* position:fixed, luôn nằm ngoài mọi stacking context của launcher */
    positionMiniPreview();

    requestAnimationFrame(()=>{
      positionMiniPreview();
      mini.classList.add('show');
    });

    miniTimer=setTimeout(
      hideMiniPreview,
      miniDuration(body)
    );
  }

  function openChatFromMini(){
    hideMiniPreview();
    setEdgeMenu(false);

    const chat=document.getElementById('avpChatBubble');

    if(chat){
      chat.click();
    }else{
      toast('Chat Admin đang tải, thử lại sau một chút');
    }
  }

  mini.addEventListener('click',openChatFromMini);

  window.addEventListener('avp:chat-ready',()=>{
    setTimeout(()=>{
      const count=unreadCountFromChatBadge();
      if(count>0 && mini.hidden){
        reliableShowUnread(count);
      }else if(count<=0 && mini.hidden){
        showReturnGreeting();
      }
    },250);
  });

  window.addEventListener('avp:chat-new-message',e=>{
    const detail=e.detail||{};

    showMiniPreview({
      sender:detail.sender||'Tin nhắn mới',
      body:detail.body||'Bạn vừa nhận được một tin nhắn mới.',
      ...detail
    });
  });

  window.AVPShowMiniChatPreview=showMiniPreview;

  function unreadCountFromChatBadge(){
    const candidates=[
      document.getElementById('avpChatBadge'),
      document.getElementById('avpChatUnreadBadge'),
      document.querySelector('.avp-chat-badge'),
      document.querySelector('[data-avp-chat-badge]'),
      document.querySelector('#avpChatLauncher [class*="badge"]')
    ].filter(Boolean);

    for(const badge of candidates){
      const raw=String(badge.textContent||'').trim();
      const count=parseInt(raw.replace(/\D/g,''),10)||0;

      if(count>0){
        const style=getComputedStyle(badge);
        if(!badge.hidden && style.display!=='none' && style.visibility!=='hidden'){
          return count;
        }
      }
    }

    return 0;
  }

  function unreadCountFromCommunity(){
    return Math.max(0,Number(window.__avpCommunityUnreadCount||0));
  }


  async function showUnreadReturnPreview(count){
    if(count<=0)return false;

    let detail=null;

    try{
      if(typeof window.AVPGetLatestUnreadPreview==="function"){
        detail=await Promise.race([
          window.AVPGetLatestUnreadPreview(),
          new Promise(resolve=>setTimeout(()=>resolve(null),1800))
        ]);
      }
    }catch(e){
      console.warn("AVP unread preview content",e);
    }

    if(detail?.body){
      showMiniPreview({
        ...detail,
        unread:true
      });
    }else{
      showMiniPreview({
        sender:'Tin nhắn chưa đọc',
        body:count===1
          ? 'Bạn có 1 thông báo mới. Chạm để xem.'
          : `Bạn có ${count} thông báo mới. Chạm để xem.`,
        unread:true,
        fallback:true
      });
    }

    try{
      localStorage.setItem(
        MINI_LAST_UNREAD_SHOWN,
        JSON.stringify({count,at:Date.now()})
      );
    }catch{}

    return true;
  }

  const encouragements=[
    ['Chào mừng bạn quay lại 👋','Tiếp tục học thêm một mẹo Excel nhé.'],
    ['Anh Văn Phòng','Một chút mỗi ngày, Excel sẽ nhẹ nhàng hơn 💚'],
    ['Sẵn sàng chưa? ✨','Mở một bài thực hành và làm tiếp thôi.'],
    ['Học Excel thôi 📊','Mỗi lần quay lại là thêm một chút kỹ năng mới.']
  ];

  function showReturnGreeting(force=false){
    if(unreadCountFromChatBadge()>0)return false;

    const now=Date.now();
    const lastGreeting=Number(localStorage.getItem(MINI_LAST_GREETING)||0);

    /* Không spam khi chỉ chuyển qua lại giữa các trang nội bộ liên tục.
       Khi quay lại sau >= 60 giây thì có thể chào lại.
       Lần đầu vào trang vẫn cho hiện một lời chào. */
    if(!force && lastGreeting && now-lastGreeting<60*1000){
      return false;
    }

    const item=encouragements[
      Math.floor(Math.random()*encouragements.length)
    ];

    showMiniPreview({
      sender:item[0],
      body:item[1],
      greeting:true
    });

    try{
      localStorage.setItem(MINI_LAST_GREETING,String(now));
    }catch{}

    return true;
  }

  function showReturnState(){
    /* Chờ chat/badge load từ Supabase trước */
    let tries=0;

    const check=()=>{
      tries++;

      const count=unreadCountFromChatBadge();

      if(count>0){
        showUnreadReturnPreview(count);
        return;
      }

      if(
        document.getElementById('avpChatBadge') ||
        tries>=12
      ){
        showReturnGreeting();
        return;
      }

      setTimeout(check,350);
    };

    setTimeout(check,500);
  }


  /* =========================================================
     MINI PREVIEW RELIABLE RESTORE
     - Tin nhắn mới: nổi ngay cạnh AVP.
     - Nếu realtime lỡ miss: badge tăng vẫn bung preview.
     - Không có tin chưa đọc: tự chào lại sau khi chat đã load.
     ========================================================= */
  let reliablePreviewBooted=false;
  let reliableLastUnread=-1;

  function reliableChatPanelOpen(){
    const panel=document.getElementById('avpChatPanel');
    return !!(panel && !panel.hidden);
  }

  async function reliableShowUnread(count){
    if(count<=0 || reliableChatPanelOpen())return false;

    try{
      await showUnreadReturnPreview(count);
      return true;
    }catch(e){
      console.warn('AVP reliable unread preview',e);
      return false;
    }
  }

  function reliablePreviewBoot(){
    if(reliablePreviewBooted)return;
    reliablePreviewBooted=true;

    let tries=0;

    const bootCheck=()=>{
      tries++;

      if(document.visibilityState!=='visible'){
        setTimeout(bootCheck,500);
        return;
      }

      const count=unreadCountFromChatBadge();

      if(count>0){
        reliableLastUnread=count;
        reliableShowUnread(count);
        return;
      }

      /* Chờ admin-chat.js mount xong rồi mới tự chào. */
      if(
        document.getElementById('avpChatBadge') ||
        typeof window.AVPGetLatestUnreadPreview==='function' ||
        tries>=16
      ){
        showReturnGreeting();
        reliableLastUnread=0;
        return;
      }

      setTimeout(bootCheck,350);
    };

    setTimeout(bootCheck,700);
  }

  /* Fallback rất nhẹ: nếu realtime không phát event nhưng badge tăng,
     vẫn nổi preview ngay. */
  const reliableUnreadTimer=setInterval(()=>{
    if(document.visibilityState!=='visible')return;

    const count=unreadCountFromChatBadge();

    if(reliableLastUnread<0){
      reliableLastUnread=count;
      return;
    }

    if(
      count>reliableLastUnread &&
      !reliableChatPanelOpen()
    ){
      reliableShowUnread(count);
    }

    reliableLastUnread=count;
  },1800);

  window.addEventListener('pagehide',()=>{
    clearInterval(reliableUnreadTimer);
  },{once:true});

  /* Lúc vào website:
     - có unread -> preview unread
     - không có -> lời chào/động viên */
  showReturnState();
  reliablePreviewBoot();

  let hiddenAt=0;

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      hiddenAt=Date.now();
      try{
        localStorage.setItem(MINI_LAST_VISIT,String(hiddenAt));
      }catch{}
      return;
    }

    const awayMs=hiddenAt
      ? Date.now()-hiddenAt
      : 0;

    /* Quay lại sau khi rời app/tab:
       unread luôn ưu tiên; không unread thì chào nếu rời >= 60 giây */
    setTimeout(()=>{
      const count=unreadCountFromChatBadge();

      if(count>0){
        showUnreadReturnPreview(count);
      }else if(awayMs>=60*1000){
        showReturnGreeting(true);
      }
    },500);
  });

  window.addEventListener('focus',()=>{
    setTimeout(()=>{
      const count=unreadCountFromChatBadge();

      if(count>0 && mini.hidden){
        showUnreadReturnPreview(count);
      }
    },600);
  });

  window.addEventListener('resize',positionMiniPreview);

  const back=document.createElement('div');
  back.className='avp-hub-backdrop';
  back.innerHTML='<aside class="avp-hub" role="dialog" aria-modal="true" aria-label="Trung tâm học tập"></aside>';
  document.body.appendChild(back);
  const hub=back.querySelector('.avp-hub');

  function setEdgeMenu(open){
    edgeMenu.hidden=!open;
    launcher.classList.toggle('open',open);
    fab.setAttribute('aria-expanded',open?'true':'false');
    const icon=fab.querySelector('.avp-edge-main-icon');
    if(icon)icon.textContent='AVP';

    if(!open){
      setTimeout(()=>{
        const count=unreadCountFromChatBadge();
        if(count>0 && mini.hidden && !reliableChatPanelOpen()){
          reliableShowUnread(count);
        }
      },450);
    }
  }

  function clickHiddenTool(id,label){
    const btn=document.getElementById(id);
    if(btn){
      btn.click();
      return true;
    }
    toast(`${label} đang tải, thử lại sau một chút`);
    return false;
  }


  /* =========================================================
     LOGIN GATE — AVP quick menu
     Hỏi AI / Từ điển Excel / Cộng đồng / Chat Admin
     Khách vẫn xem/học các phần công khai khác bình thường.
     ========================================================= */
  const AVP_LOGIN_REQUIRED_ACTIONS=new Set(['ai','dictionary','community','chat']);

  async function avpGetSignedInUser(){
    let sb=window.avpSupabase||window.supabaseClient||window.sb||window._supabase||null;

    /* supabase-config/auth có thể load chậm hơn avp-core một chút. */
    if(!sb?.auth){
      for(let i=0;i<12 && !sb?.auth;i++){
        await new Promise(r=>setTimeout(r,80));
        sb=window.avpSupabase||window.supabaseClient||window.sb||window._supabase||null;
      }
    }
    if(!sb?.auth) return null;

    try{
      const {data}=await sb.auth.getSession();
      if(data?.session?.user) return data.session.user;
    }catch(_){}

    try{
      const {data,error}=await sb.auth.getUser();
      if(!error && data?.user) return data.user;
    }catch(_){}

    return null;
  }

  async function avpRequireLoginForEdgeAction(action){
    if(!AVP_LOGIN_REQUIRED_ACTIONS.has(action)) return true;

    const user=await avpGetSignedInUser();
    if(user) return true;

    try{
      sessionStorage.setItem('avp_login_return_to',location.href);
      sessionStorage.setItem('avp_login_return_action',action);
    }catch(_){}

    toast('Vui lòng đăng nhập để sử dụng tính năng này');
    setTimeout(()=>{ window.location.href='auth.html'; },260);
    return false;
  }

  launcher.querySelectorAll('[data-edge-action]').forEach(btn=>{
    btn.addEventListener('click',async e=>{
      e.preventDefault();
      e.stopPropagation();

      const action=btn.dataset.edgeAction;

      if(!(await avpRequireLoginForEdgeAction(action))){
        setEdgeMenu(false);
        return;
      }

      hideMiniPreview();
      setEdgeMenu(false);

      const aiPanel=document.getElementById('avpAiChatPanel');
      const chatPanels=[
        document.getElementById('avpChatPanel'),
        document.getElementById('avpAdminFloatPanel'),
        document.getElementById('avpGuestChatPanel')
      ].filter(Boolean);

      if(action==='dictionary'){
        window.location.href='excel-dictionary.html';
        return;
      }

      if(action==='learning'){
        if(back.classList.contains('open')){
          closeHub();
          return;
        }
        window.dispatchEvent(new CustomEvent('avp:surface-open',{detail:{surface:'learning'}}));
        openHub();
      }else if(action==='community'){
        const communityAlreadyOpen=aiPanel && !aiPanel.hidden && !document.getElementById('avpCommunityMode')?.hidden;
        if(communityAlreadyOpen){
          aiPanel.hidden=true;
          return;
        }
        window.dispatchEvent(new CustomEvent('avp:surface-open',{detail:{surface:'aihub'}}));
        if(window.AVPCommunity?.open){
          window.AVPCommunity.open();
        }else{
          toast('Cộng đồng đang tải, thử lại sau một chút');
        }
      }else if(action==='chat'){
        const chatAlreadyOpen=chatPanels.some(p=>!p.hidden);
        if(chatAlreadyOpen){
          chatPanels.forEach(p=>p.hidden=true);
          return;
        }
        window.dispatchEvent(new CustomEvent('avp:surface-open',{detail:{surface:'chat'}}));
        clickHiddenTool('avpChatBubble','Chat Admin');
      }else if(action==='ai'){
        const aiAlreadyOpen=aiPanel && !aiPanel.hidden && !document.getElementById('avpAiMode')?.hidden;
        if(aiAlreadyOpen){
          aiPanel.hidden=true;
          return;
        }
        window.dispatchEvent(new CustomEvent('avp:surface-open',{detail:{surface:'aihub'}}));
        clickHiddenTool('avpAiChatBubble','AI Chat');
      }
    });
  });

  /* Mirror badge chưa đọc từ Chat Admin ra nút chính.
     Không dùng observer toàn trang; chỉ polling rất nhẹ. */
  let previousEdgeCount=-1;



  function setNativeEdgeBadge(actionName,count){
    const n=Math.max(0,Number(count||0));
    const action=document.querySelector(`.avp-edge-action[data-edge-action="${actionName}"]`);
    if(!action)return;

    let badge=action.querySelector(".avp-edge-section-badge");
    if(!badge){
      badge=document.createElement("span");
      badge.className="avp-edge-section-badge";
      badge.setAttribute("aria-hidden","true");
      action.appendChild(badge);
    }

    badge.hidden=n<=0;
    badge.textContent=n>99?"99+":String(n);
    action.classList.toggle("has-unread",n>0);
  }

  function setCommunityEdgeBadge(count){
    const n=Math.max(0,Number(count||0));
    const action=document.querySelector('.avp-edge-action[data-edge-action="community"]');
    if(!action)return;

    let badge=document.getElementById("avpCommunityMenuBadge");
    if(!badge){
      badge=document.createElement("span");
      badge.id="avpCommunityMenuBadge";
      badge.className="avp-edge-section-badge";
      action.appendChild(badge);
    }

    badge.hidden=n<=0;
    badge.textContent=n>99?"99+":String(n);
    action.classList.toggle("has-unread",n>0);
  }

  function syncEdgeSectionBadges(){
    const chat=unreadCountFromChatBadge();
    const community=unreadCountFromCommunity();

    // Menu thật đang dùng data-edge-action="chat".
    setNativeEdgeBadge("chat",chat);

    // Cộng đồng là nút được ai-chat.js chèn riêng vào menu.
    setCommunityEdgeBadge(community);
  }

  function syncEdgeBadge(){
    syncEdgeSectionBadges();

    const count=
      unreadCountFromChatBadge()
      +
      unreadCountFromCommunity();

    if(count<=0){
      edgeBadge.hidden=true;
      edgeBadge.textContent='0';
      previousEdgeCount=0;
      return;
    }

    edgeBadge.hidden=false;
    edgeBadge.textContent=count>9?'9+':String(count);

    /* Lần đầu badge xuất hiện sau khi trang load cũng phải bung,
       không cần previous count > 0 như bản cũ. */
    if(
      previousEdgeCount>=0 &&
      count>previousEdgeCount &&
      mini.hidden
    ){
      showUnreadReturnPreview(count);
    }

    previousEdgeCount=count;
  }

  syncEdgeBadge();

  fab?.addEventListener('click',()=>{
    // Đợi menu bỏ hidden rồi gắn badge vào đúng từng nút.
    setTimeout(syncEdgeBadge,0);
  });

  window.addEventListener('avp:community-unread',syncEdgeBadge);

  const chatBadgeObserver=new MutationObserver(mutations=>{
    if(mutations.some(m=>{
      const el=m.target?.nodeType===1?m.target:m.target?.parentElement;
      return el?.closest?.('#avpChatBadge,#avpChatUnreadBadge,.avp-chat-badge,[data-avp-chat-badge],#avpChatLauncher');
    })){
      syncEdgeBadge();
    }
  });

  if(document.body){
    chatBadgeObserver.observe(document.body,{
      childList:true,
      subtree:true,
      attributes:true,
      characterData:true
    });
  }

  const edgeBadgeTimer=setInterval(
    syncEdgeBadge,
    1200
  );

  window.addEventListener(
    'pagehide',
    ()=>clearInterval(edgeBadgeTimer),
    {once:true}
  );

  /* Kéo dọc màn hình + snap sát viền trái/phải, nhớ vị trí. */
  (function enableDragEdgeLauncher(root,btn){
    const POS_KEY='avp_edge_launcher_pos_v5';
    const EDGE_GAP=6;

    const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

    function sideFromX(x,w){
      return (x + w/2) < (window.innerWidth/2) ? 'left' : 'right';
    }

    function applySideClass(side){
      root.classList.toggle('is-left',side==='left');
      root.classList.toggle('is-right',side==='right');
    }

    function save(side,y){
      try{
        localStorage.setItem(POS_KEY,JSON.stringify({side,y}));
      }catch{}
    }

    function snapToEdge(side,y,animate=true){
      const w=root.offsetWidth||50;
      const h=root.offsetHeight||50;
      const maxY=Math.max(EDGE_GAP,window.innerHeight-h-EDGE_GAP);
      const top=clamp(Number(y)||Math.round(window.innerHeight*.55),EDGE_GAP,maxY);

      applySideClass(side);

      if(animate)root.classList.add('is-snapping');

      root.style.top=top+'px';
      root.style.bottom='auto';

      if(side==='left'){
        root.style.left=EDGE_GAP+'px';
        root.style.right='auto';
      }else{
        root.style.left=(window.innerWidth-w-EDGE_GAP)+'px';
        root.style.right='auto';
      }

      save(side,top);
      requestAnimationFrame(positionMiniPreview);

      if(animate){
        setTimeout(()=>root.classList.remove('is-snapping'),260);
      }
    }

    let saved=null;
    try{
      saved=JSON.parse(localStorage.getItem(POS_KEY)||'null');
    }catch{}

    snapToEdge(
      saved?.side==='left'?'left':'right',
      saved?.y ?? Math.round(window.innerHeight*.56),
      false
    );

    window.addEventListener('resize',()=>{
      let pos=null;
      try{
        pos=JSON.parse(localStorage.getItem(POS_KEY)||'null');
      }catch{}

      snapToEdge(
        pos?.side==='left'?'left':'right',
        pos?.y ?? root.getBoundingClientRect().top,
        false
      );
    });

    let dragging=false;
    let moved=false;
    let pointerId=null;

    let grabOffsetX=0;
    let grabOffsetY=0;

    btn.addEventListener('pointerdown',e=>{
      if(e.button!=null && e.button!==0)return;

      const r=root.getBoundingClientRect();

      dragging=true;
      moved=false;
      pointerId=e.pointerId;

      // Điểm người dùng chạm trong chính nút -> cảm giác kéo như AssistiveTouch.
      grabOffsetX=e.clientX-r.left;
      grabOffsetY=e.clientY-r.top;

      root.style.left=r.left+'px';
      root.style.right='auto';
      root.style.top=r.top+'px';
      root.style.bottom='auto';

      root.classList.add('is-dragging');
      setEdgeMenu(false);
      hideMiniPreview();

      try{
        btn.setPointerCapture(pointerId);
      }catch{}

      e.preventDefault();
    },{passive:false});

    btn.addEventListener('pointermove',e=>{
      if(!dragging)return;

      const w=root.offsetWidth||50;
      const h=root.offsetHeight||50;

      let x=e.clientX-grabOffsetX;
      let y=e.clientY-grabOffsetY;

      x=clamp(x,EDGE_GAP,window.innerWidth-w-EDGE_GAP);
      y=clamp(y,EDGE_GAP,window.innerHeight-h-EDGE_GAP);

      const r=root.getBoundingClientRect();
      if(Math.abs(x-r.left)>2 || Math.abs(y-r.top)>2){
        moved=true;
      }

      root.style.left=x+'px';
      root.style.right='auto';
      root.style.top=y+'px';
      root.style.bottom='auto';

      applySideClass(sideFromX(x,w));
      requestAnimationFrame(positionMiniPreview);

      e.preventDefault();
    },{passive:false});

    function finish(e){
      if(!dragging)return;

      dragging=false;
      root.classList.remove('is-dragging');

      try{
        btn.releasePointerCapture(pointerId);
      }catch{}

      if(moved){
        const r=root.getBoundingClientRect();
        const side=sideFromX(r.left,r.width);

        snapToEdge(side,r.top,true);

        btn.dataset.justDragged='1';
        setTimeout(()=>delete btn.dataset.justDragged,320);
      }
    }

    btn.addEventListener('pointerup',finish);
    btn.addEventListener('pointercancel',finish);

    btn.addEventListener('click',e=>{
      if(btn.dataset.justDragged==='1'){
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      setEdgeMenu(edgeMenu.hidden);
    });
  })(launcher,fab);

  document.addEventListener('pointerdown',e=>{
    if(!launcher.contains(e.target))setEdgeMenu(false);
  },{passive:true});

  window.addEventListener('avp:surface-open',e=>{
    if(e.detail?.surface!=='learning') closeHub();
  });

  back.addEventListener('click',e=>{if(e.target===back)closeHub()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeHub()});
  /* V82: bỏ nút bookmark nổi để giảm số nút cố định trên màn hình.
     Dữ liệu bookmark cũ vẫn được giữ nguyên trong localStorage. */
  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;showInstall()});
  function showInstall(){if(sessionStorage.getItem('avp_install_hide'))return;const b=document.createElement('div');b.className='avp-install-banner show';b.innerHTML='<strong>📱 Cài Learn Excel như ứng dụng</strong><p>Mở nhanh hơn và dùng được một phần nội dung khi mạng yếu.</p><div class="avp-hub-actions"><button class="avp-hub-btn" data-install>Cài ứng dụng</button><button class="avp-hub-btn secondary" data-hide>Để sau</button></div>';document.body.appendChild(b);b.querySelector('[data-install]').onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;b.remove()}};b.querySelector('[data-hide]').onclick=()=>{sessionStorage.setItem('avp_install_hide','1');b.remove()}}
})();


/* Global Download Manager loader */
(()=>{if(document.querySelector('script[data-avp-download-manager]'))return;const s=document.createElement('script');s.src='download-manager.js?v=20260828a';s.defer=true;s.dataset.avpDownloadManager='1';document.head.appendChild(s);})();