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
      <section class="avp-hub-section"><h3>Tiến độ tổng</h3><div class="avp-hub-card"><div class="avp-hub-row"><strong>${pct}% hoàn thành</strong><small>trên thiết bị này</small></div><div class="avp-hub-progress"><span style="width:${pct}%"></span></div><div class="avp-hub-actions"><a class="avp-hub-btn" href="dashboard.html">Xem Dashboard</a><a class="avp-hub-btn secondary" href="learning-path.html">Lộ trình học</a></div></div></section><section class="avp-hub-section"><h3>Chức năng nhanh</h3><div class="avp-hub-quick">
<a class="avp-hub-btn" href="index.html">🏠 Trang chủ</a>
<a class="avp-hub-btn" href="practice-video.html">📚 Bài tập video</a>
<a class="avp-hub-btn" href="practice-youtube.html">▶️ YouTube practice</a>
<a class="avp-hub-btn" href="excel-race.html">🏁 Excel Race</a>
<a class="avp-hub-btn secondary" href="learning-path.html">🗓️ Lộ trình 30 ngày</a>
<a class="avp-hub-btn secondary" href="excel.html">📘 Excel cơ bản</a>
<a class="avp-hub-btn secondary" href="dashboard.html">📊 Tiến độ</a>
<a class="avp-hub-btn secondary" href="master-learning.html">🗺️ Chi tiết lộ trình</a>
<a class="avp-hub-btn secondary" href="auth.html">👤 Đăng nhập</a>
</div></section>
      <section class="avp-hub-section"><h3>Học gần đây</h3>${recent}</section>
      <section class="avp-hub-section"><h3>Đã lưu</h3>${books}</section>
      <section class="avp-hub-section"><h3>Sao lưu tiến độ</h3><div class="avp-hub-card"><small>Xuất dữ liệu học tập để đổi máy/trình duyệt mà không mất tiến độ.</small><div class="avp-hub-actions"><button class="avp-hub-btn" data-export>Xuất tiến độ</button><label class="avp-hub-btn secondary" style="cursor:pointer">Nhập tiến độ<input data-import type="file" accept="application/json" hidden></label></div></div></section>`;
  }
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); const attr=esc;
  const ago=t=>{const m=Math.max(0,Math.floor((Date.now()-t)/60000));if(m<1)return'Vừa xem';if(m<60)return`${m} phút trước`;const h=Math.floor(m/60);if(h<24)return`${h} giờ trước`;return`${Math.floor(h/24)} ngày trước`};
  function openHub(){setEdgeMenu(false);back.classList.add('open');hub.innerHTML=renderHub();hub.querySelector('.avp-hub-close').onclick=closeHub;hub.querySelector('[data-export]').onclick=exportData;hub.querySelector('[data-import]').onchange=importData}
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
      <button type="button" class="avp-edge-action" data-edge-action="learning">
        <span>📚</span><b>Học tập</b>
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
      <span class="avp-edge-main-icon">＋</span>
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

  window.addEventListener('avp:chat-new-message',e=>{
    const detail=e.detail||{};
    showMiniPreview(detail);
  });

  window.AVPShowMiniChatPreview=showMiniPreview;

  function unreadCountFromChatBadge(){
    const badge=document.getElementById('avpChatBadge');
    if(!badge)return 0;

    const raw=String(badge.textContent||'').trim();
    const count=parseInt(raw.replace(/\D/g,''),10)||0;

    if(
      badge.hidden ||
      getComputedStyle(badge).display==='none'
    )return 0;

    return count;
  }

  function showUnreadReturnPreview(count){
    if(count<=0)return false;

    showMiniPreview({
      sender:'Tin nhắn chưa đọc',
      body:count===1
        ? 'Bạn có 1 tin nhắn mới. Chạm để xem.'
        : `Bạn có ${count} tin nhắn mới. Chạm để xem.`,
      unread:true
    });

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

  /* Lúc vào website:
     - có unread -> preview unread
     - không có -> lời chào/động viên */
  showReturnState();

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
    if(icon)icon.textContent=open?'×':'＋';
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
    btn.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();

      const action=btn.dataset.edgeAction;
      hideMiniPreview();
      setEdgeMenu(false);

      if(action==='learning'){
        openHub();
      }else if(action==='chat'){
        clickHiddenTool('avpChatBubble','Chat Admin');
      }else if(action==='ai'){
        clickHiddenTool('avpAiChatBubble','AI Chat');
      }
    });
  });

  /* Mirror badge chưa đọc từ Chat Admin ra nút chính.
     Không dùng observer toàn trang; chỉ polling rất nhẹ. */
  let previousEdgeCount=-1;

  function syncEdgeBadge(){
    const count=unreadCountFromChatBadge();

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
    const POS_KEY='avp_edge_launcher_pos_v3';
    const margin=3;

    function clamp(v,min,max){
      return Math.max(min,Math.min(max,v));
    }

    function apply(pos){
      const w=root.offsetWidth||48;
      const h=root.offsetHeight||48;

      const side=pos?.side==='left'?'left':'right';
      const maxY=Math.max(margin,window.innerHeight-h-margin);
      const y=clamp(Number(pos?.y)||Math.round(window.innerHeight*.55),margin,maxY);

      root.style.top=y+'px';
      root.style.bottom='auto';
      requestAnimationFrame(positionMiniPreview);

      if(side==='left'){
        root.style.left=margin+'px';
        root.style.right='auto';
        root.classList.add('is-left');
        root.classList.remove('is-right');
      }else{
        root.style.right=margin+'px';
        root.style.left='auto';
        root.classList.add('is-right');
        root.classList.remove('is-left');
      }
    }

    let saved=null;
    try{
      saved=JSON.parse(localStorage.getItem(POS_KEY)||'null');
    }catch{}

    apply(saved||{side:'right',y:Math.round(window.innerHeight*.56)});

    window.addEventListener('resize',()=>{
      let p=null;
      try{p=JSON.parse(localStorage.getItem(POS_KEY)||'null')}catch{}
      apply(p||{side:root.classList.contains('is-left')?'left':'right',y:root.getBoundingClientRect().top});
    });

    let dragging=false;
    let moved=false;
    let sx=0,sy=0,startTop=0,pid=null;

    btn.addEventListener('pointerdown',e=>{
      if(e.button!=null&&e.button!==0)return;

      dragging=true;
      moved=false;
      pid=e.pointerId;
      sx=e.clientX;
      sy=e.clientY;
      startTop=root.getBoundingClientRect().top;

      root.classList.add('is-dragging');
      try{btn.setPointerCapture(pid)}catch{}
      e.preventDefault();
    },{passive:false});

    btn.addEventListener('pointermove',e=>{
      if(!dragging)return;

      const dx=e.clientX-sx;
      const dy=e.clientY-sy;

      if(Math.abs(dx)>5||Math.abs(dy)>5)moved=true;
      if(!moved)return;

      const h=root.offsetHeight||48;
      const y=clamp(startTop+dy,margin,window.innerHeight-h-margin);

      root.style.top=y+'px';

      requestAnimationFrame(positionMiniPreview);

      /* trong lúc kéo, đổi bên theo vị trí ngón tay */
      const side=e.clientX<window.innerWidth/2?'left':'right';

      if(side==='left'){
        root.style.left=margin+'px';
        root.style.right='auto';
        root.classList.add('is-left');
        root.classList.remove('is-right');
      }else{
        root.style.right=margin+'px';
        root.style.left='auto';
        root.classList.add('is-right');
        root.classList.remove('is-left');
      }

      hideMiniPreview();
      setEdgeMenu(false);
      e.preventDefault();
    },{passive:false});

    function finish(e){
      if(!dragging)return;

      dragging=false;
      root.classList.remove('is-dragging');

      try{btn.releasePointerCapture(pid)}catch{}

      if(moved){
        const r=root.getBoundingClientRect();
        const side=root.classList.contains('is-left')?'left':'right';
        const pos={side,y:r.top};

        try{localStorage.setItem(POS_KEY,JSON.stringify(pos))}catch{}
        apply(pos);

        btn.dataset.justDragged='1';
        setTimeout(()=>delete btn.dataset.justDragged,260);
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

  back.addEventListener('click',e=>{if(e.target===back)closeHub()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeHub()});
  if(!IGNORE.has(page)&&page!=='index.html'){
    const bm=document.createElement('button');bm.className='avp-bookmark-btn';bm.title='Lưu bài này';bm.setAttribute('aria-label','Lưu bài này');document.body.appendChild(bm);
    const sync=()=>{const b=safe(KEY_BOOK);const on=b.some(x=>x.url===page);bm.textContent=on?'🔖':'🔗';bm.classList.toggle('saved',on);bm.title=on?'Bỏ lưu bài này':'Lưu bài này'};sync();bm.onclick=()=>{let b=safe(KEY_BOOK);const i=b.findIndex(x=>x.url===page);if(i>=0){b.splice(i,1);toast('Đã bỏ lưu')}else{b.unshift({url:page,title,ts:Date.now()});b=b.slice(0,20);toast('Đã lưu bài để học lại')}save(KEY_BOOK,b);sync()}
  }
  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;showInstall()});
  function showInstall(){if(sessionStorage.getItem('avp_install_hide'))return;const b=document.createElement('div');b.className='avp-install-banner show';b.innerHTML='<strong>📱 Cài Learn Excel như ứng dụng</strong><p>Mở nhanh hơn và dùng được một phần nội dung khi mạng yếu.</p><div class="avp-hub-actions"><button class="avp-hub-btn" data-install>Cài ứng dụng</button><button class="avp-hub-btn secondary" data-hide>Để sau</button></div>';document.body.appendChild(b);b.querySelector('[data-install]').onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;b.remove()}};b.querySelector('[data-hide]').onclick=()=>{sessionStorage.setItem('avp_install_hide','1');b.remove()}}
})();


/* Global Download Manager loader */
(()=>{if(document.querySelector('script[data-avp-download-manager]'))return;const s=document.createElement('script');s.src='download-manager.js?v=20260828a';s.defer=true;s.dataset.avpDownloadManager='1';document.head.appendChild(s);})();
