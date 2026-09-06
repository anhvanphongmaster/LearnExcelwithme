(() => {
  // Single-instance guard: avp-core must never mount the global UI twice.
  if(window.__AVP_CORE_BOOTED__) return;
  window.__AVP_CORE_BOOTED__=true;
  const KEY_HISTORY='avp_learning_history_v2', KEY_BOOK='avp_bookmarks_v2';
  const AVP_EMBEDDED=(function(){try{return new URLSearchParams(location.search).get('embed')==='1'||window.self!==window.top;}catch(e){return window.self!==window.top;}})();
  if(AVP_EMBEDDED){document.documentElement.classList.add('avp-embedded-frame','avp-embedded-youtube');}

  const IGNORE=new Set(['auth.html','admin.html','privacy.html','terms.html','disclaimer.html','open-source.html','lienhe.html','gioithieu.html']);
  const page=location.pathname.split('/').pop()||'index.html';
  const title=(document.querySelector('h1')?.textContent||document.title.split('|')[0]||page).trim();

  /* One read-only page context shared by Robot / AI / Admin chat. */
  const AVP_PAGE_META={
    'index.html':['Trang chủ','Trang chủ','home'],
    'skill-map.html':['Khu học','Skill Map','map'],
    'learning-path.html':['Khu học','Lộ trình học','learning'],
    'master-learning.html':['Khu học','Master Learning','learning'],
    'my-learning.html':['Khu học','Học tập của tôi','learning'],
    'excel.html':['Khu học','Excel cơ bản','learning'],
    'filtersort.html':['Khu học','Filter & Sort','learning'],
    'pivottable.html':['Khu học','PivotTable','learning'],
    'bieudopareto.html':['Khu học','Biểu đồ Pareto','learning'],
    'baocaoexcel.html':['Khu học','Báo cáo Excel / QC','learning'],
    'excel-nang-cao.html':['Khu học','Excel nâng cao','learning'],
    'power-query-course.html':['Khu học','Power Query','learning'],
    'power-pivot-dax.html':['Khu học','Power Pivot & DAX','learning'],
    'dashboard-dong.html':['Khu học','Dashboard động','learning'],
    'solver-whatif.html':['Khu học','What-If & Solver','learning'],
    'vba-macro.html':['Khu học','VBA / Macro','learning'],
    'phimtatexcel.html':['Kho tra cứu','Phím tắt Excel','reference'],
    'congthucexcel.html':['Kho tra cứu','Công thức Excel','reference'],
    'excel-dictionary.html':['Kho tra cứu','Từ điển Excel','reference'],
    'excel-handbook.html':['Kho tra cứu','Excel Handbook','reference'],
    'practice-video.html':['Khu bài tập','Khu bài tập','practice'],
    'practice-tiktok.html':['Khu bài tập','TikTok Practice','practice'],
    'practice-youtube.html':['Khu bài tập','YouTube Practice','practice'],
    'practice-grader.html':['Khu bài tập','Bài tập tự chấm','practice'],
    'practice-guides.html':['Khu bài tập','Hướng dẫn thực hành','practice'],
    'practice-lab.html':['Khu bài tập','Practice Lab','practice'],
    'excel-race.html':['Thử thách','Excel Race','game'],
    'professional-access.html':['Professional Track','Điều kiện truy cập','professional'],
    'professional-track.html':['Professional Track','Khu bài tập Professional','professional'],
    'tools-center.html':['Công cụ',title,'tools'],
    'formula-finder.html':['Công cụ',title,'tools'],
    'excel-doctor.html':['Công cụ',title,'tools'],
    'qc-dashboard.html':['Công cụ',title,'tools'],
    'excel-mobile.html':['Công cụ',title,'tools']
  };
  const avpMeta=AVP_PAGE_META[page]||['Learn Excel',title,'general'];
  const pageContext=Object.freeze({
    page,area:avpMeta[0],label:avpMeta[1],kind:avpMeta[2],title,href:location.href
  });
  window.AVPPageContext=pageContext;
  document.documentElement.dataset.avpArea=pageContext.kind;
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
<a class="avp-hub-btn secondary" href="auth.html?tab=login">👤 Đăng nhập</a>
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

  const aiActionLabel=pageContext.kind==='learning'?'Hỏi AI về bài này':(pageContext.kind==='practice'?'Hỏi AI về bài tập':'Hỏi AI');

  launcher.innerHTML=`
    <div class="avp-edge-menu" id="avpEdgeMenu" hidden>
      <button type="button" class="avp-edge-action" data-edge-action="ai">
        <span>✨</span><b>${aiActionLabel}</b>
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
      <span class="avp-bot" aria-hidden="true">
        <span class="avp-bot-head"><i class="avp-bot-eye"></i><i class="avp-bot-eye"></i><i class="avp-bot-mouth"></i><i class="avp-bot-tear l"></i><i class="avp-bot-tear r"></i></span>
        <span class="avp-bot-arm avp-bot-arm-l"></span>
        <span class="avp-bot-body">AVP</span>
        <span class="avp-bot-arm avp-bot-arm-r"></span>
        <span class="avp-bot-leg avp-bot-leg-l"></span>
        <span class="avp-bot-leg avp-bot-leg-r"></span>
      </span>
      <span class="avp-edge-main-icon" hidden>AVP</span>
      <span class="avp-edge-badge" id="avpEdgeBadge" hidden>0</span>
    </button>
  `;

  document.body.appendChild(launcher);
  document.documentElement.classList.add('avp-has-robot');
  if(AVP_EMBEDDED){launcher.hidden=true;launcher.style.display='none';}

  const fab=launcher.querySelector('#avpEdgeMain');
  const edgeMenu=launcher.querySelector('#avpEdgeMenu');
  const edgeBadge=launcher.querySelector('#avpEdgeBadge');
  fab.title=`Trợ lý AVP — ${pageContext.area}: ${pageContext.label}`;
  fab.setAttribute('aria-label',`Mở trợ lý AVP — ${pageContext.label}`);

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

  function positionRobotDockMenu(){
    if(!launcher.classList.contains('avp-robot-dock') || edgeMenu.hidden)return;
    const r=launcher.getBoundingClientRect();
    edgeMenu.style.position='fixed';
    edgeMenu.style.left='auto';
    edgeMenu.style.right=Math.max(8,Math.round(window.innerWidth-r.left+8))+'px';
    edgeMenu.style.bottom='auto';
    edgeMenu.style.transform='none';
    const mr=edgeMenu.getBoundingClientRect();
    const top=Math.max(8,Math.min(window.innerHeight-mr.height-8,r.top+(r.height-mr.height)/2));
    edgeMenu.style.top=Math.round(top)+'px';
  }

  function clearRobotDockMenuPosition(){
    edgeMenu.style.position='';
    edgeMenu.style.left='';
    edgeMenu.style.right='';
    edgeMenu.style.top='';
    edgeMenu.style.bottom='';
    edgeMenu.style.transform='';
  }

  function setEdgeMenu(open){
    edgeMenu.hidden=!open;
    launcher.classList.toggle('open',open);
    fab.setAttribute('aria-expanded',open?'true':'false');
    const icon=fab.querySelector('.avp-edge-main-icon');
    if(icon)icon.textContent='AVP';

    const dockMode=launcher.classList.contains('avp-robot-dock');
    const homeMode=launcher.classList.contains('avp-robot-home');

    if(open){
      launcher.classList.remove('is-walking');
      launcher.classList.add('is-greeting');
      fab.style.transform='none';
      if(dockMode)requestAnimationFrame(positionRobotDockMenu);
    }else{
      launcher.classList.remove('is-greeting');
      if(homeMode)launcher.classList.add('is-walking');
      else launcher.classList.remove('is-walking');
      if(!dockMode)clearRobotDockMenuPosition();
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

  function refreshUnreadWhenVisible(){
    if(document.visibilityState!=="visible") return;
    refreshStarUnread().then(syncEdgeBadge);
  }

  refreshUnreadWhenVisible();
  const starUnreadTimer=setInterval(refreshUnreadWhenVisible,30000);

  syncEdgeBadge();

  fab?.addEventListener('click',()=>{
    // Đợi menu bỏ hidden rồi gắn badge vào đúng từng nút.
    setTimeout(syncEdgeBadge,0);
  });

  window.addEventListener('avp:community-unread',syncEdgeBadge);

  const edgeBadgeTimer=setInterval(()=>{
    if(document.visibilityState==="visible") syncEdgeBadge();
  },3000);

  window.addEventListener(
    'pagehide',
    ()=>{
      clearInterval(edgeBadgeTimer);
      clearInterval(starUnreadTimer);
    },
    {once:true}
  );

  /* Kéo dọc màn hình + snap sát viền trái/phải, nhớ vị trí. */
  (function enableDragEdgeLauncher(root,btn){
    // Robot uses one dedicated controller below. Do not attach the generic edge drag handlers.
    if(root.classList.contains('is-robot')) return;
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

    if(!root.classList.contains('is-robot')){
      snapToEdge(
        saved?.side==='left'?'left':'right',
        saved?.y ?? Math.round(window.innerHeight*.56),
        false
      );
    }

    window.addEventListener('resize',()=>{
      if(root.classList.contains('is-robot'))return;
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


  (function avpRobotController(){
    if(AVP_EMBEDDED)return;

    const HOME_PAGE='index.html';
    const isHome=page===HOME_PAGE;
    const PAD=16;
    const DOCK_GAP=8;
    const DOCK_Y_KEY='avp_robot_dock_y_v1';
    const HOME_POS_KEY='avp_bot_walk_x_v1';
    const DRAG_THRESHOLD=5;

    const PRACTICE_CONTEXT={
      'practice-video.html':{
        area:'Khu bài tập',
        enter:[
          'Bạn đang ở Khu bài tập. Chọn đúng kiểu luyện phù hợp với mục tiêu hôm nay nhé.',
          'Đây là Khu bài tập. Bạn có thể luyện theo TikTok, YouTube, Tự chấm hoặc Practice Lab.'
        ],
        suggest:[
          'Muốn biết đúng sai ngay? Hãy thử Bài tập tự chấm.',
          'Muốn xem hướng dẫn ngắn theo video? Khu TikTok Practice phù hợp hơn.',
          'Muốn học case dài và đầy đủ hơn? Chuyển sang YouTube Practice.',
          'Muốn tự xử lý một case hoàn chỉnh? Practice Lab đang chờ bạn.',
          'Muốn kiểm tra phản xạ nhanh? Excel Race là lựa chọn phù hợp.'
        ]
      },
      'practice-tiktok.html':{
        area:'TikTok Practice',
        enter:[
          'Bạn đang ở TikTok Practice — bài ngắn, làm theo từng video.',
          'Đây là khu TikTok Practice. Chọn chủ đề rồi mở bài thực hành tương ứng.'
        ],
        suggest:[
          'Muốn bài dài và giải thích kỹ hơn? Thử YouTube Practice.',
          'Làm xong rồi muốn biết mình đúng đến đâu? Sang Bài tập tự chấm nhé.',
          'Nếu bí cách làm, khu Hướng dẫn thực hành có thể giúp bạn.',
          'Muốn luyện một case lớn hơn thay vì bài ngắn? Thử Practice Lab.',
          'Thiếu kiến thức nền ở chủ đề này? Mở Skill Map để quay lại đúng bài học.'
        ]
      },
      'practice-youtube.html':{
        area:'YouTube Practice',
        enter:[
          'Bạn đang ở YouTube Practice — phù hợp với các bài và project dài hơn.',
          'Đây là khu YouTube Practice. Hãy chọn project rồi làm từng phần theo video.'
        ],
        suggest:[
          'Muốn luyện nhanh một kỹ thuật nhỏ? TikTok Practice sẽ gọn hơn.',
          'Muốn kiểm tra kết quả ngay sau khi làm? Sang Bài tập tự chấm.',
          'Nếu muốn tự giải một case hoàn chỉnh, hãy thử Practice Lab.',
          'Vướng một bước trong project? Bạn có thể hỏi AI hoặc Chat Admin ngay tại robot.'
        ]
      },
      'practice-grader.html':{
        area:'Bài tập tự chấm',
        enter:[
          'Bạn đang ở Bài tập tự chấm. Đây là khu tích điểm và kiểm tra kết quả trực tiếp.',
          'Đây là Bài tập tự chấm — làm bài, nộp kết quả và xem điểm ngay.'
        ],
        suggest:[
          'Nếu chưa biết cách làm, mở Hướng dẫn thực hành trước khi thử lại.',
          'Muốn xem một ví dụ ngắn trước? TikTok Practice có thể phù hợp.',
          'Muốn luyện sâu theo project? Thử YouTube Practice.',
          'Điểm ở khu này là một phần điều kiện để mở Professional Track.'
        ]
      },
      'practice-guides.html':{
        area:'Hướng dẫn thực hành',
        enter:[
          'Bạn đang ở Hướng dẫn thực hành. Dùng khu này khi cần gỡ một bước đang bí.',
          'Đây là khu Hướng dẫn thực hành — xem cách làm rồi quay lại bài để tự hoàn thành.'
        ],
        suggest:[
          'Xem xong hướng dẫn, quay lại Bài tập tự chấm để kiểm tra kết quả nhé.',
          'Muốn xem video ngắn tương ứng? Kiểm tra TikTok Practice.',
          'Đừng chỉ xem đáp án — hãy quay lại bài và tự làm lại một lần.'
        ]
      },
      'practice-lab.html':{
        area:'Practice Lab',
        enter:[
          'Bạn đang ở Practice Lab — khu luyện case gần với công việc thực tế.',
          'Đây là Practice Lab. Hãy xử lý bài như một file công việc thật.'
        ],
        suggest:[
          'Nếu case này quá khó, quay lại Skill Map để củng cố phần kiến thức liên quan.',
          'Muốn luyện nhanh trước khi làm case lớn? Thử Bài tập tự chấm.',
          'Vướng logic xử lý? Bạn có thể hỏi AI hoặc Chat Admin từ robot.'
        ]
      },
      'excel-race.html':{
        area:'Excel Race',
        enter:[
          'Bạn đang ở Excel Race — khu kiểm tra phản xạ Excel nhanh.',
          'Đây là Excel Race. Tập trung vào độ chính xác trước, tốc độ sẽ đến sau.'
        ],
        suggest:[
          'Nếu sai nhiều ở một chủ đề, quay lại Skill Map để học đúng phần đó.',
          'Muốn luyện có điểm và kết quả rõ hơn? Thử Bài tập tự chấm.'
        ]
      }
    };

    const pageArea=pageContext.label||title;

    // One non-interactive context row. It never changes home-page UI.
    if(!isHome){
      const contextRow=document.createElement('div');
      contextRow.className='avp-edge-context';
      contextRow.innerHTML='<small>KHU HIỆN TẠI</small><strong></strong>';
      contextRow.querySelector('strong').textContent=pageArea;
      edgeMenu.prepend(contextRow);
    }

    const bubble=document.createElement('div');
    bubble.className='avp-bot-bubble';
    bubble.id='avpBotBubble';
    bubble.hidden=true;
    document.body.appendChild(bubble);

    let bubbleTimer=null;
    let dragging=false;
    let suppressClickUntil=0;
    let suggestionTimer=null;
    let lastLine='';

    function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
    function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
    function botW(){return Math.max(64,launcher.offsetWidth||64);}
    function botH(){return Math.max(72,launcher.offsetHeight||72);}
    function maxDockX(){return Math.max(DOCK_GAP,window.innerWidth-botW()-DOCK_GAP);}
    function maxDockY(){return Math.max(DOCK_GAP,window.innerHeight-botH()-DOCK_GAP);}
    function unreadNow(){return unreadCountFromChatBadge()+unreadCountFromCommunity()+starUnread;}

    function hideLine(){
      clearTimeout(bubbleTimer);
      bubbleTimer=null;
      bubble.classList.remove('show');
      bubble.hidden=true;
    }

    function placeBubble(){
      if(bubble.hidden)return;
      const r=launcher.getBoundingClientRect();
      const bw=Math.min(270,Math.max(180,window.innerWidth-96));
      bubble.style.width=bw+'px';

      if(isHome){
        let left=r.left+r.width/2-bw/2;
        left=clamp(left,12,window.innerWidth-bw-12);
        bubble.classList.remove('dock-side');
        bubble.style.left=Math.round(left)+'px';
        bubble.style.right='auto';
        bubble.style.top='auto';
        bubble.style.bottom=Math.round(window.innerHeight-r.top+10)+'px';
      }else{
        bubble.classList.add('dock-side');
        const br=bubble.getBoundingClientRect();
        const bh=br.height||56;
        const left=Math.max(10,r.left-bw-12);
        const top=clamp(r.top+(r.height-bh)/2,8,window.innerHeight-bh-8);
        bubble.style.left=Math.round(left)+'px';
        bubble.style.right='auto';
        bubble.style.top=Math.round(top)+'px';
        bubble.style.bottom='auto';
      }
    }

    function showLine(text,ms=4200){
      if(!text || dragging || launcher.classList.contains('open') || document.visibilityState==='hidden')return;
      const line=String(text).trim();
      if(!line)return;
      lastLine=line;
      clearTimeout(bubbleTimer);
      bubble.textContent=line;
      bubble.hidden=false;
      bubble.classList.add('show');
      requestAnimationFrame(placeBubble);
      bubbleTimer=setTimeout(hideLine,ms);
    }

    function pick(arr){
      if(!Array.isArray(arr)||!arr.length)return '';
      const candidates=arr.filter(x=>x!==lastLine);
      const pool=candidates.length?candidates:arr;
      return pool[Math.floor(Math.random()*pool.length)];
    }

    function schedulePracticeSuggestion(){
      clearTimeout(suggestionTimer);
      const ctx=PRACTICE_CONTEXT[page];
      if(!ctx || !ctx.suggest?.length)return;
      // Deliberately sparse: useful hints without becoming a distraction.
      const delay=42000+Math.floor(Math.random()*38000);
      suggestionTimer=setTimeout(()=>{
        if(!dragging && !launcher.classList.contains('open') && document.visibilityState==='visible'){
          const unread=unreadNow();
          if(unread>0)showLine(unread>1?`Bạn có ${unread} thông báo chưa đọc.`:'Bạn có một thông báo chưa đọc.',3500);
          else showLine(pick(ctx.suggest),4300);
        }
        schedulePracticeSuggestion();
      },delay);
    }

    async function waitSupabaseClient(){
      for(let n=0;n<40;n++){
        const sb=window.avpSupabase||window.supabaseClient||null;
        if(sb?.auth && sb?.rpc)return sb;
        await sleep(100);
      }
      return null;
    }

    async function professionalStatusLine(){
      const sb=await waitSupabaseClient();
      if(!sb){
        showLine('Chưa kết nối được hệ thống để kiểm tra Professional Track. Bạn có thể xem các mốc ngay trên trang.',4600);
        return;
      }
      try{
        const sess=await sb.auth.getSession();
        const user=sess?.data?.session?.user||null;
        if(!user){
          showLine('Đăng nhập để mình kiểm tra bạn còn thiếu điều kiện nào để vào Professional Track.',4700);
          return;
        }
        try{
          const admin=await sb.rpc('is_admin_user');
          if(!admin.error && admin.data===true){
            showLine('Bạn đang vào Professional Track bằng quyền Admin.',3600);
            return;
          }
        }catch(_){ }

        const res=await sb.rpc('professional_track_access_status_v1');
        if(res?.error)throw res.error;
        const s=res?.data||{};
        if(s.can_access || s.status==='approved'){
          showLine('Professional Track đã mở. Cứ làm từng case như một công việc thật — cần hỗ trợ thì gọi mình.',5000);
          return;
        }
        if(s.status==='pending'){
          showLine('Bạn đã đủ điều kiện và đã nộp hồ sơ. Hiện chỉ cần chờ Admin xét duyệt.',4700);
          return;
        }
        if(s.status==='rejected'){
          showLine('Hồ sơ Professional cần bổ sung. Hãy xem ghi chú của Admin trên trang này trước khi nộp lại.',5000);
          return;
        }
        if(s.eligible){
          showLine('Bạn đã đủ điểm và đủ ngày hoạt động. Bước tiếp theo là nộp chứng chỉ để Admin xét duyệt.',5000);
          return;
        }

        const missing=[];
        const b=Math.max(0,1500-(Number(s.basic_score)||0));
        const i=Math.max(0,1300-(Number(s.intermediate_score)||0));
        const a=Math.max(0,1000-(Number(s.advanced_score)||0));
        const d=Math.max(0,5-(Number(s.active_days)||0));
        if(b)missing.push(`Cơ bản ${b.toLocaleString('vi-VN')} điểm`);
        if(i)missing.push(`Trung cấp ${i.toLocaleString('vi-VN')} điểm`);
        if(a)missing.push(`Nâng cao ${a.toLocaleString('vi-VN')} điểm`);
        if(d)missing.push(`${d} ngày hoạt động`);
        const detail=missing.length?` Bạn còn thiếu: ${missing.join(', ')}.`:'';
        showLine(`Professional Track chưa mở.${detail} Hãy làm Bài tập tự chấm để tích đủ điểm trước.`,6500);
      }catch(e){
        console.debug('[AVP robot professional status]',e);
        showLine('Chưa kiểm tra được điều kiện Professional lúc này. Bạn có thể xem các mốc ngay trên trang.',4300);
      }
    }

    function bindRobotMenuClick(){
      fab.addEventListener('click',e=>{
        if(Date.now()<suppressClickUntil || fab.dataset.justLifted==='1'){
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
        setEdgeMenu(edgeMenu.hidden);
        if(launcher.classList.contains('avp-robot-dock'))requestAnimationFrame(positionRobotDockMenu);
      });
    }

    function initDockMode(){
      launcher.classList.add('avp-robot-dock','is-right');
      launcher.classList.remove('avp-robot-home','is-left','is-walking','face-left');

      let savedY=null;
      try{savedY=Number(localStorage.getItem(DOCK_Y_KEY));}catch(_){ }
      if(!Number.isFinite(savedY))savedY=Math.round(window.innerHeight*.60);

      function dockAt(y,animate=false){
        const top=clamp(Number(y)||Math.round(window.innerHeight*.60),DOCK_GAP,maxDockY());
        launcher.classList.add('is-right');
        launcher.classList.remove('is-left');
        if(animate)launcher.classList.add('is-snapping');
        launcher.style.right='auto';
        launcher.style.bottom='auto';
        launcher.style.top=Math.round(top)+'px';
        launcher.style.left=Math.round(maxDockX())+'px';
        try{localStorage.setItem(DOCK_Y_KEY,String(Math.round(top)));}catch(_){ }
        requestAnimationFrame(()=>{
          placeBubble();
          if(!edgeMenu.hidden)positionRobotDockMenu();
        });
        if(animate)setTimeout(()=>launcher.classList.remove('is-snapping'),300);
      }

      dockAt(savedY,false);

      let activePointer=null;
      let downX=0,downY=0,grabX=0,grabY=0;

      fab.addEventListener('pointerdown',e=>{
        if(e.button!=null && e.button!==0)return;
        activePointer=e.pointerId;
        dragging=false;
        downX=e.clientX;
        downY=e.clientY;
        const r=launcher.getBoundingClientRect();
        grabX=e.clientX-r.left;
        grabY=e.clientY-r.top;
        hideLine();
        setEdgeMenu(false);
        try{fab.setPointerCapture(activePointer);}catch(_){ }
      },{passive:true});

      fab.addEventListener('pointermove',e=>{
        if(activePointer===null || e.pointerId!==activePointer)return;
        const dist=Math.hypot(e.clientX-downX,e.clientY-downY);
        if(!dragging && dist<DRAG_THRESHOLD)return;
        if(!dragging){
          dragging=true;
          launcher.classList.add('is-dragging','is-lifted','is-crying');
          launcher.classList.remove('is-greeting','is-walking','is-right','is-left');
          launcher.style.transition='none';
        }
        const x=clamp(e.clientX-grabX,DOCK_GAP,window.innerWidth-botW()-DOCK_GAP);
        const y=clamp(e.clientY-grabY,DOCK_GAP,maxDockY());
        launcher.style.right='auto';
        launcher.style.bottom='auto';
        launcher.style.left=Math.round(x)+'px';
        launcher.style.top=Math.round(y)+'px';
        e.preventDefault();
      },{passive:false});

      function finishDrag(e){
        if(activePointer===null || (e?.pointerId!=null && e.pointerId!==activePointer))return;
        try{fab.releasePointerCapture(activePointer);}catch(_){ }
        activePointer=null;
        if(!dragging)return;

        const r=launcher.getBoundingClientRect();
        const y=clamp(r.top,DOCK_GAP,maxDockY());
        dragging=false;
        suppressClickUntil=Date.now()+380;
        launcher.classList.remove('is-dragging','is-lifted','is-crying');
        launcher.classList.add('is-right','is-snapping');
        launcher.style.transition='left .28s cubic-bezier(.2,.9,.25,1), top .12s ease';
        launcher.style.left=Math.round(maxDockX())+'px';
        launcher.style.top=Math.round(y)+'px';
        try{localStorage.setItem(DOCK_Y_KEY,String(Math.round(y)));}catch(_){ }
        setTimeout(()=>{
          launcher.classList.remove('is-snapping');
          launcher.style.transition='';
          if(!edgeMenu.hidden)positionRobotDockMenu();
        },300);
      }

      fab.addEventListener('pointerup',finishDrag);
      fab.addEventListener('pointercancel',finishDrag);

      window.addEventListener('resize',()=>{
        let y=launcher.getBoundingClientRect().top;
        try{
          const sy=Number(localStorage.getItem(DOCK_Y_KEY));
          if(Number.isFinite(sy))y=sy;
        }catch(_){ }
        dockAt(y,false);
      });

      bindRobotMenuClick();

      const ctx=PRACTICE_CONTEXT[page];
      if(ctx){
        setTimeout(()=>showLine(pick(ctx.enter),4300),1300);
        schedulePracticeSuggestion();
      }else if(page==='professional-access.html'){
        setTimeout(professionalStatusLine,1600);
      }else if(page==='professional-track.html'){
        setTimeout(()=>showLine('Bạn đã vào Professional Track. Cứ làm từng case chắc chắn — cần hỗ trợ thì gọi mình.',4600),1300);
      }
      // Learning pages intentionally remain quiet so the robot does not compete with lesson content.

      window.addEventListener('avp:chat-new-message',e=>{
        if(dragging || launcher.classList.contains('open'))return;
        const body=String(e.detail?.body||'').trim();
        showLine(body?'Bạn vừa có tin nhắn mới từ Admin.':'Bạn vừa có tin nhắn mới từ Admin.',3600);
      });

      setTimeout(()=>{
        if(!ctx && page!=='professional-access.html' && page!=='professional-track.html'){
          const n=unreadNow();
          if(n>0)showLine(n>1?`Bạn có ${n} thông báo chưa đọc.`:'Bạn có một thông báo chưa đọc.',3500);
        }
      },2200);
    }

    function initHomeMode(){
      // Preserve the original stable main-page patrol behavior.
      launcher.classList.add('avp-robot-home','is-walking');
      launcher.classList.remove('avp-robot-dock');
      clearRobotDockMenuPosition();

      let x=PAD;
      const yBottom=PAD;
      let dir=1;
      try{
        const savedBot=JSON.parse(localStorage.getItem(HOME_POS_KEY)||'null');
        if(savedBot && typeof savedBot.x==='number'){
          x=savedBot.x;
          dir=savedBot.dir===-1?-1:1;
        }
      }catch(_){ }
      const SPEED=.9;
      let lifting=false;
      let liftMoved=false;
      let startY=null,startX=0;

      const HELLO=[
        'Xin chào, học Excel vui vẻ nhé!',
        'Chào bạn, hôm nay luyện thêm một công thức nha.',
        'Đi từng bước là tiến bộ rồi.',
        'Mở Bài tập Excel khi rảnh 5 phút cũng được.',
        'Bạn làm được — cứ thử một hàm mới.',
        'Chúc bạn học tập hiệu quả!',
        'Nhớ lưu file thực hành của mình nhé.',
        'PivotTable không khó nếu làm chậm.',
        'VLOOKUP/XLOOKUP: kiên nhẫn là ra.',
        'Uống nước, rồi làm tiếp một bài nhỏ.',
        'Chào mừng trở lại Learn Excel!',
        'Hôm nay chỉ cần đúng hơn hôm qua.'
      ];

      function homeMaxX(){return Math.max(PAD,window.innerWidth-botW()-PAD);}
      function persist(){try{localStorage.setItem(HOME_POS_KEY,JSON.stringify({x,dir}));}catch(_){ }}
      function applyPos(px,bottom){
        launcher.style.left=px+'px';
        launcher.style.right='auto';
        launcher.style.top='auto';
        launcher.style.bottom=bottom+'px';
      }

      function frame(){
        if(!lifting && launcher.classList.contains('is-walking') && !launcher.classList.contains('open')){
          x+=dir*SPEED;
          const mx=homeMaxX();
          if(x>=mx){x=mx;dir=-1;}
          if(x<=PAD){x=PAD;dir=1;}
          applyPos(x,PAD);
          launcher.classList.toggle('face-left',dir<0);
          if(!window.__avpBotSaveT || Date.now()-window.__avpBotSaveT>400){
            window.__avpBotSaveT=Date.now();
            persist();
          }
        }
        placeBubble();
        requestAnimationFrame(frame);
      }

      (async function talkLoop(){
        while(true){
          if(launcher.classList.contains('open') || lifting){
            hideLine();
            await sleep(400);
            continue;
          }
          const unread=unreadNow();
          showLine(HELLO[Math.floor(Math.random()*HELLO.length)],2200+Math.floor(Math.random()*800));
          await sleep(2600);
          if(launcher.classList.contains('open') || lifting)continue;
          if(unread>0){
            await sleep(1500);
            if(launcher.classList.contains('open') || lifting)continue;
            const n=unreadNow()||unread;
            showLine(n>1?`Bạn có ${n} tin nhắn mới chưa đọc`:'Bạn có tin nhắn mới chưa đọc',2600);
            await sleep(2700);
          }else{
            await sleep(3000);
          }
        }
      })();

      fab.addEventListener('pointerdown',e=>{
        if(e.button!=null && e.button!==0)return;
        lifting=false;
        liftMoved=false;
        startY=e.clientY;
        startX=e.clientX;
        try{fab.setPointerCapture(e.pointerId);}catch(_){ }
      });

      fab.addEventListener('pointermove',e=>{
        if(startY===null)return;
        const dy=startY-e.clientY;
        const dist=Math.hypot(e.clientX-startX,e.clientY-startY);
        if(dy>18 && dist>18){
          lifting=true;
          liftMoved=true;
          launcher.classList.add('is-lifted','is-crying');
          launcher.classList.remove('is-walking','is-greeting','open');
          edgeMenu.hidden=true;
          const bottom=Math.max(PAD,window.innerHeight-e.clientY-36);
          applyPos(Math.max(PAD,Math.min(e.clientX-32,homeMaxX())),bottom);
        }
      });

      function dropLift(){
        startY=null;
        if(!liftMoved){lifting=false;return;}
        fab.dataset.justLifted='1';
        suppressClickUntil=Date.now()+260;
        setTimeout(()=>delete fab.dataset.justLifted,220);
        launcher.classList.remove('is-lifted','is-crying');
        lifting=false;
        liftMoved=false;
        applyPos(x,PAD);
        if(!launcher.classList.contains('open'))launcher.classList.add('is-walking');
      }
      fab.addEventListener('pointerup',dropLift);
      fab.addEventListener('pointercancel',dropLift);
      bindRobotMenuClick();

      applyPos(x,yBottom);
      requestAnimationFrame(frame);
      window.addEventListener('resize',()=>{if(x>homeMaxX())x=homeMaxX();placeBubble();persist();});
      window.addEventListener('pagehide',persist);
      document.addEventListener('visibilitychange',()=>{if(document.hidden)persist();});
    }

    if(isHome)initHomeMode();
    else initDockMode();

    window.addEventListener('resize',()=>{
      placeBubble();
      if(!edgeMenu.hidden && launcher.classList.contains('avp-robot-dock'))positionRobotDockMenu();
    });
    window.addEventListener('pagehide',()=>clearTimeout(suggestionTimer));
  })();

  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;showInstall()});
  function showInstall(){if(sessionStorage.getItem('avp_install_hide'))return;const b=document.createElement('div');b.className='avp-install-banner show';b.innerHTML='<strong>📱 Cài Learn Excel như ứng dụng</strong><p>Mở nhanh hơn và dùng được một phần nội dung khi mạng yếu.</p><div class="avp-hub-actions"><button class="avp-hub-btn" data-install>Cài ứng dụng</button><button class="avp-hub-btn secondary" data-hide>Để sau</button></div>';document.body.appendChild(b);b.querySelector('[data-install]').onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;b.remove()}};b.querySelector('[data-hide]').onclick=()=>{sessionStorage.setItem('avp_install_hide','1');b.remove()}}
})();


/* Global Download Manager loader */
(()=>{if(document.querySelector('script[data-avp-download-manager]'))return;const s=document.createElement('script');s.src='download-manager.js?v=20260828a';s.defer=true;s.dataset.avpDownloadManager='1';document.head.appendChild(s);})();
