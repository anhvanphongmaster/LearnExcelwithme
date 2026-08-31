(() => {
  const KEY_HISTORY='avp_learning_history_v2', KEY_BOOK='avp_bookmarks_v2';
  const AVP_EMBEDDED=(function(){try{return new URLSearchParams(location.search).get('embed')==='1'||window.self!==window.top;}catch(e){return window.self!==window.top;}})();
  if(AVP_EMBEDDED){document.documentElement.classList.add('avp-embedded-frame','avp-embedded-youtube');}

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
  launcher.className='avp-edge-launcher is-right is-robot is-walking';
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
        <span class="avp-edge-section-badge" hidden>0</span>
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
      <span class="avp-bot avp-bot-25d" aria-hidden="true">
        <span class="b25-head"><i class="b25-eye l"></i><i class="b25-eye r"></i><i class="b25-smile"></i></span>
        <span class="b25-arm l"></span>
        <span class="b25-body">AVP</span>
        <span class="b25-arm r"></span>
        <span class="b25-leg l"></span>
        <span class="b25-leg r"></span>
      </span><span class="avp-edge-badge" id="avpEdgeBadge" hidden>0</span>
    </button>
  `;

  document.body.appendChild(launcher);



  (function(){
    const base=(location.pathname.replace(/[^/]+$/,"")||"./");
    const vid=launcher.querySelector("#avpBotVid");
    if(vid){
      vid.style.display="block";
      const play=()=>vid.play().catch(()=>{});
      vid.addEventListener("canplay",play);
      play();
    }
  })();

  document.documentElement.classList.add('avp-has-robot');
  if(AVP_EMBEDDED){launcher.hidden=true;launcher.style.display='none';}

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
  if(AVP_EMBEDDED){mini.hidden=true;mini.style.display='none';}

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
    if(launcher.classList.contains('is-robot'))return;
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

  let starUnread=0;
  async function refreshStarUnread(){
    try{
      const sb=window.avpSupabase;
      if(!sb)return;
      const sess=await sb.auth.getUser();
      if(!sess?.data?.user){starUnread=0;return;}
      const {count,error}=await sb.from("practice_grader_star_notifs")
        .select("id",{count:"exact",head:true})
        .eq("is_read",false);
      if(!error) starUnread=Math.max(0,Number(count||0));
    }catch(e){}
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

  window.setAvpEdgeMenu=function setEdgeMenu(open){
    edgeMenu.hidden=!open;
    launcher.classList.toggle('open',open);
    fab.setAttribute('aria-expanded',open?'true':'false');
    if(open){
      launcher.classList.remove('is-walking');
      launcher.classList.add('is-greeting');
      fab.style.transform='none';
      try{window.playAvpBotSeg && window.playAvpBotSeg(3,5.9)}catch(e){}
    }else{
      launcher.classList.remove('is-greeting');
      launcher.classList.add('is-walking');
      try{window.playAvpBotSeg && window.playAvpBotSeg(3,5.9)}catch(e){}
    }

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

  launcher.querySelectorAll('[data-edge-action]').forEach(btn=>{
    btn.addEventListener('click',async e=>{
      e.preventDefault();
      e.stopPropagation();

      const action=btn.dataset.edgeAction;
      hideMiniPreview();
      setEdgeMenu(false);

      const next=location.pathname.split('/').pop()||'index.html';
      let user=null;
      try{
        if(window.AVPAccess&&typeof window.AVPAccess.getUser==='function'){
          user=await window.AVPAccess.getUser(false);
        }
      }catch(err){}
      if(!user){
        try{
          const sb=window.avpSupabase;
          if(sb?.auth){
            const sess=await sb.auth.getSession();
            user=sess?.data?.session?.user||null;
          }
        }catch(err){}
      }
      if(!user){
        toast('Đăng nhập để dùng Hỏi AI, Từ điển, Cộng đồng và Chat Admin');
        return;
      }

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
    const n=Math.max(0,Number(count||0)+starUnread);
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
      unreadCountFromCommunity()
      +
      starUnread;

    if(count<=0){
      edgeBadge.hidden=true;
      edgeBadge.textContent='0';
      previousEdgeCount=0;
      fab?.classList.remove("has-pulse");
      launcher?.classList.remove("has-pulse");
      return;
    }

    edgeBadge.hidden=false;
    edgeBadge.textContent=count>9?'9+':String(count);
    fab?.classList.add("has-pulse");
    launcher?.classList.add("has-pulse");

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

  refreshStarUnread().then(syncEdgeBadge);
  setInterval(function(){refreshStarUnread().then(syncEdgeBadge);},8000);

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
      refreshStarUnread().then(syncEdgeBadge);
  setInterval(function(){refreshStarUnread().then(syncEdgeBadge);},8000);

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
    if(root.classList.contains('is-robot'))return;
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
      root.style.transform='none';

      applySideClass('right');
      root.style.setProperty('left','auto','important');
      root.style.setProperty('right','8px','important');
      root.style.setProperty('bottom','auto','important');
      root.style.setProperty('top',top+'px','important');
      root.style.setProperty('transform','none','important');


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
      'right',
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

      root.style.setProperty('left',r.left+'px','important');
      root.style.setProperty('right','auto','important');
      root.style.setProperty('top',r.top+'px','important');
      root.style.setProperty('bottom','auto','important');

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

      root.style.setProperty('left',x+'px','important');
      root.style.setProperty('right','auto','important');
      root.style.setProperty('top',y+'px','important');
      root.style.setProperty('bottom','auto','important');

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
      if(btn.dataset.justDragged==='1' || btn.dataset.justLifted==='1'){
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


  (function avpRobotWalk(){
    return; // replaced by standalone patrol
    if(AVP_EMBEDDED)return;
    const PAD=16;
    const vid=document.getElementById("avpBotVid");
    let seg=[3,5.9];
    window.playAvpBotSeg=function playBotSeg(a,b){
      seg=[a,b];
      if(!vid)return;
      try{vid.currentTime=a; vid.play();}catch(e){}
    }
    if(vid){
      vid.addEventListener("timeupdate",()=>{
        if(vid.currentTime>=seg[1] || vid.currentTime<seg[0]-0.05){
          vid.currentTime=seg[0];
        }
      });
      playBotSeg(3,5.9);
    }

    let x=40;
    let yBottom=PAD;
    let dir=1;
    const SPEED=2.4;
    let lifting=false;
    let liftMoved=false;
    let startY=0, startX=0, grabY=0;

    const HELLO=[
      "Xin chào, học Excel vui vẻ nhé!",
      "Chào bạn, hôm nay luyện thêm một công thức nha.",
      "Đi từng bước là tiến bộ rồi.",
      "Mở Bài tập Excel khi rảnh 5 phút cũng được.",
      "Bạn làm được — cứ thử một hàm mới.",
      "Chúc bạn học tập hiệu quả!",
      "Nhớ lưu file thực hành của mình nhé.",
      "PivotTable không khó nếu làm chậm.",
      "VLOOKUP/XLOOKUP: kiên nhẫn là ra.",
      "Uống nước, rồi làm tiếp một bài nhỏ.",
      "Chào mừng trở lại Learn Excel!",
      "Hôm nay chỉ cần đúng hơn hôm qua."
    ];
    const bubble=document.createElement("div");
    bubble.className="avp-bot-bubble";
    bubble.id="avpBotBubble";
    bubble.hidden=true;
    bubble.style.zIndex="2147483646";
    document.body.appendChild(bubble);

    function unreadNow(){
      return unreadCountFromChatBadge()+unreadCountFromCommunity()+starUnread;
    }
    function placeBubble(){
      const r=launcher.getBoundingClientRect();
      const bw=Math.min(240, window.innerWidth-24);
      let left=r.left+r.width/2-bw/2;
      left=Math.max(12, Math.min(left, window.innerWidth-bw-12));
      bubble.style.width=bw+"px";
      bubble.style.left=left+"px";
      bubble.style.bottom=(window.innerHeight-r.top+10)+"px";
    }
    function showLine(text,ms){
      bubble.textContent=text;
      bubble.hidden=false;
      bubble.classList.add("show");
      placeBubble();
      return new Promise(res=>setTimeout(()=>{
        bubble.classList.remove("show");
        bubble.hidden=true;
        res();
      },ms));
    }
    async function talkLoop(){
      while(true){
        if(launcher.classList.contains("open") || lifting){
          bubble.hidden=true;
          await new Promise(r=>setTimeout(r,400));
          continue;
        }
        const unread=unreadNow();
        await showLine(HELLO[Math.floor(Math.random()*HELLO.length)], 2200+Math.floor(Math.random()*800));
        if(launcher.classList.contains("open") || lifting) continue;
        if(unread>0){
          await new Promise(r=>setTimeout(r,1500));
          if(launcher.classList.contains("open") || lifting) continue;
          const n=unreadNow()||unread;
          await showLine(n>1?("Bạn có "+n+" tin nhắn mới chưa đọc"):"Bạn có tin nhắn mới chưa đọc", 2600);
        }else{
          await new Promise(r=>setTimeout(r,3000));
        }
      }
    }

    function w(){return Math.max(56, fab.offsetWidth||56)}
    function maxX(){return Math.max(PAD, window.innerWidth - w() - PAD)}
    function applyPos(px, bottom){
      launcher.style.setProperty("left","0px","important");
      launcher.style.setProperty("right","auto","important");
      launcher.style.setProperty("top","auto","important");
      launcher.style.setProperty("bottom", bottom+"px","important");
      launcher.style.setProperty("transform","translateX("+px+"px)","important");
    }

    function frame(){
      if(!lifting && launcher.classList.contains("is-walking") && !launcher.classList.contains("open")){
        x+=dir*SPEED;
        const mx=maxX();
        if(x>=mx){x=mx;dir=-1}
        if(x<=PAD){x=PAD;dir=1}
        applyPos(x, PAD);
        launcher.classList.toggle("face-left", dir<0);
      }
      if(!bubble.hidden) placeBubble();
      requestAnimationFrame(frame);
    }

    fab.addEventListener("pointerdown", function(e){
      if(e.button!=null && e.button!==0)return;
      lifting=false;
      liftMoved=false;
      startY=e.clientY;
      startX=e.clientX;
      grabY=e.clientY;
      try{fab.setPointerCapture(e.pointerId)}catch(err){}
    });
    fab.addEventListener("pointermove", function(e){
      if(startY==null)return;
      const dy=startY-e.clientY;
      const dist=Math.hypot(e.clientX-startX, e.clientY-startY);
      if(dy>18 && dist>18){
        lifting=true;
        liftMoved=true;
        launcher.classList.add("is-lifted","is-crying");
        launcher.classList.remove("is-walking","is-greeting","open");
        playBotSeg(3,5.9);
        edgeMenu.hidden=true;
        const bottom=Math.max(PAD, window.innerHeight - e.clientY - 36);
        applyPos(Math.max(PAD, Math.min(e.clientX-32, maxX())), bottom);
      }
    });
    function dropLift(){
      startY=null;
      if(!liftMoved){
        lifting=false;
        return;
      }
      fab.dataset.justLifted="1";
      setTimeout(()=>delete fab.dataset.justLifted,200);
      launcher.classList.remove("is-lifted","is-crying");
      lifting=false;
      liftMoved=false;
      applyPos(x, PAD);
      if(!launcher.classList.contains("open")){
        launcher.classList.add("is-walking");
        playBotSeg(3,5.9);
      }
    }
    fab.addEventListener("pointerup", dropLift);
    fab.addEventListener("pointercancel", dropLift);

    applyPos(x, PAD);
    requestAnimationFrame(frame);
    talkLoop();
    window.addEventListener("resize",()=>{ if(x>maxX()) x=maxX(); placeBubble(); });
  })();

  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;showInstall()});
  function showInstall(){if(sessionStorage.getItem('avp_install_hide'))return;const b=document.createElement('div');b.className='avp-install-banner show';b.innerHTML='<strong>📱 Cài Learn Excel như ứng dụng</strong><p>Mở nhanh hơn và dùng được một phần nội dung khi mạng yếu.</p><div class="avp-hub-actions"><button class="avp-hub-btn" data-install>Cài ứng dụng</button><button class="avp-hub-btn secondary" data-hide>Để sau</button></div>';document.body.appendChild(b);b.querySelector('[data-install]').onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;b.remove()}};b.querySelector('[data-hide]').onclick=()=>{sessionStorage.setItem('avp_install_hide','1');b.remove()}}
})();


/* Global Download Manager loader */
(()=>{if(document.querySelector('script[data-avp-download-manager]'))return;const s=document.createElement('script');s.src='download-manager.js?v=20260828a';s.defer=true;s.dataset.avpDownloadManager='1';document.head.appendChild(s);})();




(function(){
  if(window.__avpRobotV1)return;
  window.__avpRobotV1=true;

  var css="\
#avpEdgeLauncher.is-robot{width:76px!important;height:90px!important;pointer-events:none!important;background:transparent!important;overflow:visible!important;z-index:2147483000!important}\
#avpEdgeLauncher.is-robot .avp-edge-main{width:76px!important;height:90px!important;background:transparent!important;border:0!important;box-shadow:none!important;pointer-events:auto!important;cursor:pointer!important}\
#avpEdgeLauncher.is-robot .avp-edge-main::before,#avpEdgeLauncher.is-robot .avp-bot-vid,#avpEdgeLauncher.is-robot .avp-bot-img{display:none!important}\
#avpEdgeLauncher.is-robot .avp-edge-menu{pointer-events:auto!important;z-index:2147483647!important;bottom:96px!important;left:50%!important;transform:translateX(-50%)!important}\
#avpEdgeLauncher.is-robot .avp-edge-menu *{pointer-events:auto!important}\
#avpEdgeLauncher.is-robot .avp-edge-badge{pointer-events:none!important}\
.avp-bot-25d{position:relative;width:56px;height:76px;margin:0 auto;filter:drop-shadow(0 6px 8px rgba(0,0,0,.35))}\
#avpEdgeLauncher.face-left .avp-bot-25d{transform:scaleX(-1)}\
.b25-head{position:absolute;left:14px;top:0;width:28px;height:22px;border-radius:8px 8px 6px 6px;background:linear-gradient(145deg,#5edc8a,#1f7a4a 58%,#0f3d28);box-shadow:inset 0 2px 0 rgba(255,255,255,.35)}\
.b25-eye{position:absolute;top:7px;width:6px;height:6px;border-radius:50%;background:#eafff2}\
.b25-eye.l{left:5px}.b25-eye.r{right:5px}\
.b25-smile{position:absolute;left:9px;bottom:3px;width:10px;height:5px;border:2px solid #0b2a1a;border-top:0;border-radius:0 0 8px 8px}\
.b25-body{position:absolute;left:10px;top:22px;width:36px;height:26px;border-radius:8px;background:linear-gradient(160deg,#3cb56f,#165533);color:#fff;font:800 10px/26px system-ui,sans-serif;text-align:center;box-shadow:inset 0 2px 0 rgba(255,255,255,.22)}\
.b25-arm{position:absolute;top:24px;width:7px;height:16px;border-radius:4px;background:linear-gradient(#2f9a5c,#0f3d28);transform-origin:top center}\
.b25-arm.l{left:4px}.b25-arm.r{right:4px}\
.b25-leg{position:absolute;top:46px;width:8px;height:16px;border-radius:4px;background:#0f3d28;transform-origin:top center}\
.b25-leg.l{left:16px}.b25-leg.r{right:16px}\
#avpBotTalk{position:absolute;left:50%;bottom:92px;transform:translateX(-50%);min-width:130px;max-width:190px;padding:7px 10px;border-radius:10px;background:#143526;color:#fff;font:700 12px/1.3 system-ui;display:none;z-index:2147483647;pointer-events:none;text-align:center}\
#avpBotTalk.show{display:block}\
#avpEdgeLauncher.is-lifted .b25-smile{width:12px;height:3px;border:0;background:#0b2a1a;top:14px;bottom:auto}\
#avpEdgeLauncher.is-lifted .b25-head:before,#avpEdgeLauncher.is-lifted .b25-head:after{content:'';position:absolute;top:12px;width:5px;height:10px;border-radius:50%;background:#2aa8ff}\
#avpEdgeLauncher.is-lifted .b25-head:before{left:3px}\
#avpEdgeLauncher.is-lifted .b25-head:after{right:3px}\
";
  var st=document.createElement("style");
  st.textContent=css;
  document.head.appendChild(st);

  function ready(fn){
    if(document.getElementById("avpEdgeLauncher"))fn();
    else setTimeout(function(){ready(fn);},50);
  }

  ready(function(){
    var el=document.getElementById("avpEdgeLauncher");
    var fab=document.getElementById("avpEdgeMain");
    if(!el||!fab)return;
    el.classList.add("is-robot","is-walking");
    el.style.pointerEvents="none";
    el.style.width="76px";
    el.style.height="90px";
    fab.style.pointerEvents="auto";
    var menuEl=document.getElementById("avpEdgeMenu");
    if(menuEl) menuEl.style.pointerEvents="auto";


    var box=fab.querySelector(".avp-bot");
    if(!box || !box.querySelector(".b25-body")){
      var wrap=document.createElement("span");
      wrap.className="avp-bot avp-bot-25d";
      wrap.innerHTML='<span class="b25-head"><i class="b25-eye l"></i><i class="b25-eye r"></i><i class="b25-smile"></i></span><span class="b25-arm l"></span><span class="b25-body">AVP</span><span class="b25-arm r"></span><span class="b25-leg l"></span><span class="b25-leg r"></span>';
      if(box) box.replaceWith(wrap); else fab.insertBefore(wrap, fab.firstChild);
    }

    var talk=document.getElementById("avpBotTalk");
    if(!talk){
      talk=document.createElement("div");
      talk.id="avpBotTalk";
      el.appendChild(talk);
    }
    var lines=["Xin chào!","Học Excel vui nhé","Đi từng bước thôi","Chúc bạn học tốt"];
    var li=0, talkOn=localStorage.getItem("avp_bot_chat")!=="off";
    function hideTalk(){talk.classList.remove("show");}
    function showTalk(){
      if(!talkOn || el.classList.contains("open") || el.classList.contains("is-lifted")){hideTalk();return;}
      talk.textContent=lines[li%lines.length];
      talk.classList.add("show");
    }
    showTalk();
    setInterval(function(){
      li++;
      showTalk();
      setTimeout(hideTalk,2200);
    },5200);

    var legs=el.querySelectorAll(".b25-leg");
    var arms=el.querySelectorAll(".b25-arm");
    var x=16,dir=1,phase=0,lift=false,sy=null,sx=null,moved=false;

    function place(bottom){
      el.style.setProperty("left","0px","important");
      el.style.setProperty("right","auto","important");
      el.style.setProperty("top","auto","important");
      el.style.setProperty("bottom",(bottom==null?10:bottom)+"px","important");
      el.style.setProperty("transform","translateX("+x+"px)","important");
    }

    function tick(){
      var open=el.classList.contains("open");
      if(!open && !lift){
        el.classList.add("is-walking");
        x+=dir*2.2;
        var max=Math.max(20,(window.innerWidth||400)-86);
        if(x>=max){x=max;dir=-1;el.classList.add("face-left");}
        if(x<=12){x=12;dir=1;el.classList.remove("face-left");}
        place(10);
        phase+=0.28;
        var s=Math.sin(phase)*18;
        if(legs[0])legs[0].style.transform="rotate("+s+"deg)";
        if(legs[1])legs[1].style.transform="rotate("+(-s)+"deg)";
        if(arms[0])arms[0].style.transform="rotate("+(-s)+"deg)";
        if(arms[1])arms[1].style.transform="rotate("+s+"deg)";
      }else if(open && !lift){
        phase+=0.35;
        if(arms[1])arms[1].style.transform="rotate("+(-20+Math.sin(phase)*48)+"deg)";
        if(arms[0])arms[0].style.transform="rotate(8deg)";
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    fab.addEventListener("pointerdown",function(e){
      if(e.target.closest && e.target.closest(".avp-edge-menu"))return;
      if(e.button!=null && e.button!==0)return;
      sy=e.clientY;sx=e.clientX;moved=false;lift=false;
    });
    window.addEventListener("pointermove",function(e){
      if(sy==null)return;
      var dy=sy-e.clientY,dist=Math.hypot(e.clientX-sx,e.clientY-sy);
      if(dy>26 && dist>26){
        lift=true;moved=true;
        el.classList.add("is-lifted","is-crying");
        el.classList.remove("is-walking","open","is-greeting");
        var menu=document.getElementById("avpEdgeMenu");
        if(menu)menu.hidden=true;
        hideTalk();
        place(Math.max(10,window.innerHeight-e.clientY-40));
      }
    });
    window.addEventListener("pointerup",function(){
      sy=null;
      if(lift){
        lift=false;
        el.classList.remove("is-lifted","is-crying");
        el.classList.add("is-walking");
        place(10);
      }
    });
    fab.addEventListener("click",function(e){
      if(moved||lift)return;
      if(e.target.closest && e.target.closest(".avp-edge-menu"))return;
      var menu=document.getElementById("avpEdgeMenu");
      if(window.setAvpEdgeMenu) window.setAvpEdgeMenu(menu && menu.hidden);
    });
  });
})();

