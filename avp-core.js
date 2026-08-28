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

  const mini=document.createElement('button');
  mini.type='button';
  mini.className='avp-edge-mini-preview';
  mini.id='avpEdgeMiniPreview';
  mini.hidden=true;
  mini.innerHTML=`
    <span class="avp-edge-mini-name"></span>
    <span class="avp-edge-mini-body"></span>
  `;
  launcher.appendChild(mini);

  let miniTimer=null;
  let miniDetail=null;

  function miniDuration(text){
    const n=String(text||'').length;
    if(n<=35)return 3000;
    if(n<=85)return 4000;
    return 5000;
  }

  function hideMiniPreview(){
    clearTimeout(miniTimer);
    miniTimer=null;

    if(mini.hidden)return;

    mini.classList.remove('show');
    mini.classList.add('hide');

    setTimeout(()=>{
      mini.hidden=true;
      mini.classList.remove('hide');
    },220);
  }

  function showMiniPreview(detail){
    const body=String(detail?.body||'Tin nhắn mới').trim()||'Tin nhắn mới';
    const sender=String(detail?.sender||'Tin nhắn mới').trim();

    miniDetail=detail||{};

    mini.querySelector('.avp-edge-mini-name').textContent=sender;
    mini.querySelector('.avp-edge-mini-body').textContent=body;

    clearTimeout(miniTimer);

    mini.hidden=false;
    mini.classList.remove('hide');

    requestAnimationFrame(()=>{
      mini.classList.add('show');
    });

    miniTimer=setTimeout(
      hideMiniPreview,
      miniDuration(body)
    );
  }

  mini.addEventListener('click',()=>{
    hideMiniPreview();
    setEdgeMenu(false);

    const chat=document.getElementById('avpChatBubble');

    if(chat){
      chat.click();
    }else{
      toast('Chat Admin đang tải, thử lại sau một chút');
    }
  });

  window.addEventListener('avp:chat-new-message',e=>{
    showMiniPreview(e.detail||{});
  });

  window.AVPShowMiniChatPreview=showMiniPreview;

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
  let previousEdgeCount=0;

  function syncEdgeBadge(){
    const chatBadge=document.getElementById('avpChatBadge');

    if(!chatBadge){
      edgeBadge.hidden=true;
      edgeBadge.textContent='0';
      previousEdgeCount=0;
      return;
    }

    const raw=String(chatBadge.textContent||'').trim();
    const count=parseInt(raw.replace(/\D/g,''),10)||0;

    const visible=
      !chatBadge.hidden &&
      getComputedStyle(chatBadge).display!=='none' &&
      count>0;

    if(!visible){
      edgeBadge.hidden=true;
      edgeBadge.textContent='0';
      previousEdgeCount=0;
      return;
    }

    edgeBadge.hidden=false;
    edgeBadge.textContent=count>9?'9+':String(count);

    /* Fallback:
       nếu badge tăng nhưng realtime preview event chưa tới,
       vẫn bung preview để người dùng biết có tin mới. */
    if(previousEdgeCount>0 && count>previousEdgeCount && mini.hidden){
      showMiniPreview({
        sender:'Tin nhắn mới',
        body:'Bạn vừa nhận được tin nhắn mới.',
        fallback:true
      });
    }

    previousEdgeCount=count;
  }

  syncEdgeBadge();
  const edgeBadgeTimer=setInterval(syncEdgeBadge,1600);
  window.addEventListener('pagehide',()=>clearInterval(edgeBadgeTimer),{once:true});

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
