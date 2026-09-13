/*! home-page-motion.js — V100 deterministic Home boot */

/* Visual marker only. Home motion is CSS-driven; no mousemove parallax and no
   delayed re-scan loops. */
(function(){
  'use strict';
  if(window.__avpHomeMotionStableV100)return;
  window.__avpHomeMotionStableV100=true;
  window.__avpSiteMotion=true;

  var RISE_SEL=[
    '.home-path-card','.home-more-card','.home-book-card','.home-ref-item-v114',
    '.home-cta-card','.learn-board','.home-platform-module-v1'
  ].join(',');

  function mark(){
    document.documentElement.classList.add('avp-motion-enabled','avp-performance-stable');
    document.querySelectorAll(RISE_SEL).forEach(function(node){
      node.classList.add('avp-motion-rise','avp-in');
      node.dataset.avpMotionReady='1';
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mark,{once:true});
  else mark();
})();

/* Home A–Z — one render only. The links and primary CTA are final on first
   render, so the catalog loader does not need to repaint them later. */
(function(){
  'use strict';
  if(window.__avpHomeAZV5)return;
  window.__avpHomeAZV5=true;
  window.__avpHomeAZV4=true;

  var modules=[
    ['01','FOUNDATION','Nền tảng Excel','Hiểu file, nhập liệu, định dạng, công thức và cấu trúc bảng trước khi đi sâu.','f01-excel-workspace',6,'green'],
    ['02','DATA CONTROL','Dữ liệu & Làm sạch','Lọc, tìm, chuẩn hóa text, chặn nhập sai và kiểm soát duplicate/blank/error.','d07-sort-filter',5,'teal'],
    ['03','FORMULA & LOOKUP','Công thức & Tra cứu','Logic, tổng hợp điều kiện, lookup, ngày tháng, công thức nâng cao và Dynamic Array.','s07-logic',6,'blue'],
    ['04','ANALYSIS','Phân tích & Báo cáo','Excel Table, PivotTable, KPI, đối chiếu số và bàn giao báo cáo.','a13-excel-table',5,'purple'],
    ['05','VISUAL REPORT','Dashboard & Trực quan hóa','Chart đúng mục đích, KPI card, Slicer/Timeline và dashboard tương tác dễ dùng.','a16-charts-pareto',5,'rose'],
    ['06','POWER QUERY','Power Query','Kết nối nguồn, làm sạch, schema/type, Append/Merge, nhiều file và Refresh bền vững.','pq28-import-sources',6,'sand'],
    ['07','AUTOMATION CODE','Macro / VBA & Tối ưu file','Record Macro, object model, If/Loop, xử lý lỗi, bảo mật và giảm lag workbook.','x23-macro-vba',4,'orange'],
    ['08','WORKFLOW & CASE','Workflow & Case thực chiến','Chọn đúng công cụ và nối Input → Transform → Calculate → Report → Validate → Deliver.','x24-automation-workflow',5,'indigo']
  ];

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function ensureStyle(){
    if(document.getElementById('homeLearningPlatformV5Styles'))return;
    var css=document.createElement('style');
    css.id='homeLearningPlatformV5Styles';
    css.textContent='.home-platform-grid-v1{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important}.home-platform-module-v1{min-width:0;display:grid;grid-template-columns:42px minmax(0,1fr);gap:11px;align-items:start;padding:15px;border:1px solid #d9e6de;border-radius:16px;background:#fff;color:#173f2a;text-decoration:none;box-shadow:0 6px 18px rgba(23,70,43,.045);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.home-platform-module-v1:hover{transform:translateY(-3px);border-color:#9fc9ae;box-shadow:0 12px 28px rgba(23,70,43,.09)}.home-platform-no-v1{display:grid;place-items:center;width:42px;height:42px;border-radius:12px;background:#eaf7ef;color:#17633b;font-size:12px;font-weight:950}.home-platform-copy-v1{min-width:0;display:block}.home-platform-copy-v1 small{display:block;color:#4d8060;font-size:8px;font-weight:950;letter-spacing:.08em}.home-platform-copy-v1 strong{display:block;margin-top:3px;color:#173f2a;font-size:14px;line-height:1.3}.home-platform-copy-v1 em{display:block;margin-top:5px;color:#6d7e74;font-style:normal;font-size:10px;line-height:1.45}.home-platform-copy-v1 b{display:block;margin-top:9px;color:#217346;font-size:9px}.tone-blue .home-platform-no-v1{background:#edf5fb;color:#356f9f}.tone-teal .home-platform-no-v1{background:#e9f7f5;color:#287c72}.tone-indigo .home-platform-no-v1{background:#eef0fb;color:#4d5da8}.tone-purple .home-platform-no-v1{background:#f2edf9;color:#72599a}.tone-rose .home-platform-no-v1{background:#fbefef;color:#9d5454}.tone-sand .home-platform-no-v1{background:#fbf2e5;color:#8b6634}.tone-orange .home-platform-no-v1{background:#fff0e5;color:#9a5d2e}body.dark-mode .home-platform-module-v1{background:#17251d;border-color:#30473a;color:#e1efe6}body.dark-mode .home-platform-copy-v1 strong{color:#e5f3e9}body.dark-mode .home-platform-copy-v1 em{color:#a8b8af}.home-path-more--5{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:12px!important;align-items:stretch!important}.home-path-more--5 .home-more-card{width:100%!important;min-width:0!important;min-height:96px!important;height:100%!important;box-sizing:border-box!important;justify-content:flex-start!important}.home-path-more--5 .home-more-card strong{line-height:1.25}.home-path-more--5 .home-more-card small{line-height:1.35}@media(max-width:980px){.home-platform-grid-v1{grid-template-columns:repeat(2,minmax(0,1fr))!important}.home-path-more--5{grid-template-columns:1fr!important}}@media(max-width:560px){.home-platform-grid-v1{grid-template-columns:1fr!important}.home-platform-module-v1{grid-template-columns:40px minmax(0,1fr)}}';
    document.head.appendChild(css);
  }

  function wirePrimaryCta(){
    var btn=document.getElementById('avpScrollToPath');
    if(btn&&btn.dataset.onePath!=='coach2'){
      var clean=btn.cloneNode(true);
      clean.dataset.onePath='coach2';
      clean.innerHTML='<span class="avp-tease-title" style="display:block;font-weight:900;font-size:13.5px">Học hôm nay →</span><span class="avp-tease-preview" style="display:block;margin-top:4px;opacity:.78;font-size:11px">Web tự chọn bài cần học · luyện ngắn · ôn lỗi</span>';
      clean.addEventListener('click',function(e){e.preventDefault();location.href='learning-coach.html';});
      btn.replaceWith(clean);
    }
    var learn=document.querySelector('.top-simple-nav [data-avp-nav="learn"]');
    if(learn){learn.href='learning-coach.html';learn.setAttribute('aria-label','Học Excel hôm nay');}
  }

  function render(){
    var shell=document.querySelector('.home-path-inner');
    var grid=shell&&shell.querySelector('.home-path-grid');
    if(!shell||!grid)return false;

    ensureStyle();
    var title=shell.querySelector(':scope > h2');
    var desc=shell.querySelector(':scope > p');
    if(title)title.textContent='Nền tảng Excel A–Z';
    if(desc)desc.textContent='8 module · 42 bài. Chọn theo nhóm công việc; bên trong là danh sách bài rõ ràng và luôn có đường quay lại.';

    if(grid.dataset.avpHomeAz!=='v5'){
      grid.className='home-path-grid home-platform-grid-v1';
      grid.innerHTML=modules.map(function(m){
        return '<a class="home-platform-module-v1 tone-'+esc(m[6])+'" href="knowledge.html?lesson='+encodeURIComponent(m[4])+'">'+
          '<span class="home-platform-no-v1">'+esc(m[0])+'</span>'+
          '<span class="home-platform-copy-v1"><small>'+esc(m[1])+'</small><strong>'+esc(m[2])+'</strong><em>'+esc(m[3])+'</em><b>'+m[5]+' bài · Bắt đầu →</b></span></a>';
      }).join('');
      grid.dataset.avpHomeAz='v5';
    }

    var oldMore=shell.querySelector('.home-path-more');
    if(oldMore)oldMore.style.marginTop='18px';
    wirePrimaryCta();
    return true;
  }

  if(!render()&&document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
})();

/* Excel Arena — one idempotent decoration pass. */
(function(){
  'use strict';
  if(window.__avpArenaHomeCardV2)return;
  window.__avpArenaHomeCardV2=true;
  window.__avpArenaHomeCard=true;

  function ensureStyle(){
    if(document.getElementById('avpArenaHomeCardStyle'))return;
    var css=document.createElement('style');
    css.id='avpArenaHomeCardStyle';
    css.textContent='.home-more-race.avp-arena-home{position:relative!important;border-color:#72ad88!important;background:linear-gradient(145deg,#eff9f2,#fff)!important;overflow:visible!important}.home-more-race.avp-arena-home:hover{border-color:#3f865d!important;background:#e9f6ed!important}.home-more-race.avp-arena-home small{color:#4f6659!important;background:transparent!important;padding:0!important;font-weight:600!important}.avp-arena-home-meta{display:block;margin-top:5px;color:#217346;font-size:10px;font-weight:900}.avp-arena-home-badge{position:absolute;top:8px;right:8px;padding:4px 7px;border-radius:999px;background:#217346;color:#fff;font-size:9px;font-weight:950;letter-spacing:.04em}@media(prefers-reduced-motion:no-preference){.avp-arena-home-badge{animation:avpArenaPulse 2.5s ease-in-out infinite}@keyframes avpArenaPulse{0%,75%,100%{box-shadow:0 0 0 0 rgba(33,115,70,0)}88%{box-shadow:0 0 0 5px rgba(33,115,70,.12)}}}body.dark-mode .home-more-race.avp-arena-home{background:#182b20!important;border-color:#47765a!important}';
    document.head.appendChild(css);
  }

  function render(){
    var card=document.querySelector('a.home-more-race[href*="excel-race.html"]');
    if(!card)return false;
    ensureStyle();
    card.classList.add('avp-arena-home');
    card.setAttribute('aria-label','Excel Arena — game phản xạ Excel với Học và Rank');
    var icon=card.querySelector(':scope > span');
    var title=card.querySelector('strong');
    var small=card.querySelector('small');
    if(icon)icon.textContent='⚡';
    if(title)title.textContent='Excel Arena';
    if(small)small.textContent='Bạn nhớ Excel đến đâu khi thời gian đang chạy?';
    if(!card.querySelector('.avp-arena-home-meta')){
      var meta=document.createElement('span');
      meta.className='avp-arena-home-meta';
      meta.textContent='Học · Rank · 14 chủ đề';
      card.appendChild(meta);
    }
    if(!card.querySelector('.avp-arena-home-badge')){
      var badge=document.createElement('span');
      badge.className='avp-arena-home-badge';
      badge.textContent='NEW GAME';
      card.appendChild(badge);
    }
    return true;
  }

  if(!render()&&document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
})();

/* Home First Run — render once; react only to real leaderboard DOM changes. */
(function(){
  'use strict';
  if(window.__avpHomeFirstRunV3)return;
  window.__avpHomeFirstRunV3=true;
  window.__avpHomeFirstRunV2=true;

  var LAST_KEY='avp_knowledge_last_v2';
  var DONE_KEY='avp_platform_completed_v2';

  function readDone(){
    try{var raw=JSON.parse(localStorage.getItem(DONE_KEY)||'[]');return new Set(Array.isArray(raw)?raw:[])}catch(_){return new Set()}
  }

  function loadCatalog(done){
    if(window.AVPLearningPlatform){done(window.AVPLearningPlatform);return}
    var existing=document.querySelector('script[data-avp-home-first-catalog]');
    if(existing){
      existing.addEventListener('load',function(){done(window.AVPLearningPlatform)},{once:true});
      return;
    }
    var s=document.createElement('script');
    s.src='learning-platform-catalog-v1.js?v=20260913-stable100';
    s.dataset.avpHomeFirstCatalog='1';
    s.onload=function(){done(window.AVPLearningPlatform)};
    document.head.appendChild(s);
  }

  function target(P){
    var seq=(P&&P.lessonSequence)||[];
    if(!seq.length)return{id:'f01-excel-workspace',order:1,resume:false};
    var done=readDone(),last='';
    try{last=localStorage.getItem(LAST_KEY)||''}catch(_){ }
    var idx=seq.indexOf(last),id='';
    if(idx>=0)id=(done.has(last)&&idx<seq.length-1)?seq[idx+1]:last;
    if(!id)id=seq.find(function(x){return !done.has(x)})||seq[0];
    var order=P&&P.displayOrder?P.displayOrder(id):(seq.indexOf(id)+1);
    return{id:id,order:order,resume:idx>=0||done.size>0};
  }

  function ensureStyle(){
    if(document.getElementById('homeFirstRunV2Style'))return;
    var s=document.createElement('style');
    s.id='homeFirstRunV2Style';
    s.textContent='\\
.home-first-v1{padding:22px 16px 6px;background:#f4f7f5}.home-first-inner-v1{max-width:1120px;margin:0 auto;padding:22px;border:1px solid #d6e4dc;border-radius:20px;background:#fff;box-shadow:0 10px 28px rgba(23,70,43,.06)}.home-first-head-v1{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;margin-bottom:16px}.home-first-kicker-v1{display:block;margin-bottom:5px;color:#217346;font-size:9px;font-weight:950;letter-spacing:.12em}.home-first-head-v1 h2{margin:0;color:#173f2a;font-size:24px;line-height:1.22}.home-first-head-v1 p{max-width:560px;margin:7px 0 0;color:#6d7e74;font-size:13px;line-height:1.55}.home-first-primary-v1{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border:1px solid #217346;border-radius:13px;background:#217346;color:#fff;text-decoration:none;font-size:13px;font-weight:950;box-shadow:0 8px 18px rgba(33,115,70,.16)}.home-first-primary-v1:hover{background:#185c37;border-color:#185c37}.home-first-steps-v1{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.home-first-step-v1{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;align-items:start;padding:13px;border:1px solid #dce7e0;border-radius:14px;background:#fafcfb}.home-first-step-v1>span{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:#edf6f0;color:#217346;font-size:11px;font-weight:950}.home-first-step-v1 strong{display:block;color:#244a35;font-size:12px}.home-first-step-v1 small{display:block;margin-top:3px;color:#75847b;font-size:10px;line-height:1.45}.home-first-foot-v1{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:13px;padding-top:12px;border-top:1px solid #e4ebe6}.home-first-foot-v1 span{color:#748078;font-size:10px}.home-first-foot-v1 a{color:#217346;text-decoration:none;font-size:11px;font-weight:900}.home-first-foot-v1 a:hover{text-decoration:underline}.home-path-inner>.learn-board{margin-top:18px!important}body.dark-mode .home-first-v1{background:#101a14}body.dark-mode .home-first-inner-v1{background:#17251d;border-color:#30473a}body.dark-mode .home-first-head-v1 h2,body.dark-mode .home-first-step-v1 strong{color:#e5f3e9}body.dark-mode .home-first-head-v1 p,body.dark-mode .home-first-step-v1 small,body.dark-mode .home-first-foot-v1 span{color:#a8b8af}body.dark-mode .home-first-step-v1{background:#132018;border-color:#30473a}@media(max-width:760px){.home-first-head-v1{align-items:stretch;flex-direction:column}.home-first-primary-v1{width:100%}.home-first-steps-v1{grid-template-columns:1fr}.home-first-foot-v1{align-items:flex-start;flex-direction:column}}';
    document.head.appendChild(s);
  }

  function ensurePracticeBanner(){
    var cta=document.querySelector('.avp-mobile-main-cta-wrap .avp-mobile-main-cta');
    if(!cta)return false;
    if(cta.dataset.practiceHubV3==='1')return true;
    cta.dataset.practiceHubV3='1';
    cta.classList.remove('home-start-cta-v1');
    cta.classList.add('avp-practice-hub-cta');
    cta.href='practice-video.html';
    cta.setAttribute('aria-label','Bài tập Excel — 5 luồng thực hành');
    cta.innerHTML='<span class="avp-practice-hub-badges" aria-hidden="true"><span class="avp-mini-channel avp-mini-channel-tt">♪</span><span class="avp-mini-channel avp-mini-channel-yt">▶</span><span class="avp-mini-channel avp-mini-channel-hw">✎</span><span class="avp-mini-channel avp-mini-channel-grade">✓</span><span class="avp-mini-channel avp-mini-channel-pro">◆</span></span><span class="avp-mobile-main-cta-icon">📚</span><span class="avp-mobile-main-cta-copy"><strong>Bài tập Excel</strong><small>5 luồng thực hành trong cùng một khu</small><small style="opacity:.88;font-size:11px;line-height:1.45;display:block;margin-top:2px">01 TikTok · 02 YouTube · 03 Homework · 04 Tự chấm · 05 Pro</small></span><span class="avp-mobile-main-cta-arrow">→</span>';
    return true;
  }

  function ensurePodiumStyle(){
    if(document.getElementById('homePodiumRestoreV2'))return;
    var s=document.createElement('style');
    s.id='homePodiumRestoreV2';
    s.textContent='\\
#learnBoardList .lb-row.lb-podium-1{background:linear-gradient(90deg,#fff7d6 0%,#fff 58%)!important;border:2px solid #f2b51d!important;box-shadow:0 0 0 3px rgba(242,181,29,.16)!important}#learnBoardList .lb-row.lb-podium-2{background:linear-gradient(90deg,#eef2f6 0%,#fff 58%)!important;border:2px solid #9aa8b7!important;box-shadow:0 0 0 3px rgba(154,168,183,.14)!important}#learnBoardList .lb-row.lb-podium-3{background:linear-gradient(90deg,#fff0df 0%,#fff 58%)!important;border:2px solid #d9904e!important;box-shadow:0 0 0 3px rgba(217,144,78,.14)!important}#learnBoardList .lb-podium-1 .lb-rank,#learnBoardList .lb-podium-2 .lb-rank,#learnBoardList .lb-podium-3 .lb-rank{width:38px!important;height:38px!important;background:transparent!important;border-radius:50%!important;font-size:23px!important}.lb-medal{display:inline-grid!important;place-items:center!important;width:34px!important;height:34px!important;font-size:24px!important;line-height:1!important}.lb-podium-1 .lb-medal{filter:drop-shadow(0 2px 5px rgba(245,158,11,.45))}.lb-podium-2 .lb-medal{filter:drop-shadow(0 2px 4px rgba(100,116,139,.32))}.lb-podium-3 .lb-medal{filter:drop-shadow(0 2px 4px rgba(180,83,9,.30))}';
    document.head.appendChild(s);
  }

  function repairPodium(){
    ensurePodiumStyle();
    var rows=document.querySelectorAll('#learnBoardList .lb-row');
    if(!rows.length)return false;
    var medals=['🥇','🥈','🥉'];
    for(var i=0;i<Math.min(3,rows.length);i++){
      var row=rows[i],rank=row.querySelector('.lb-rank');
      row.classList.add('lb-podium-'+(i+1));
      if(rank)rank.innerHTML='<span class="lb-medal lb-'+(i===0?'gold':i===1?'silver':'bronze')+'" title="Top '+(i+1)+'">'+medals[i]+'</span>';
    }
    return true;
  }

  function render(P){
    ensureStyle();
    ensurePracticeBanner();
    repairPodium();

    var t=target(P);
    var url=P&&P.lessonUrl?P.lessonUrl(t.id):('knowledge.html?lesson='+encodeURIComponent(t.id));
    var order=String(t.order||1).padStart(2,'0');
    var primaryLabel=t.resume?('Tiếp tục lộ trình · Bài '+order):'Bắt đầu học Excel';

    var hero=document.querySelector('.avp-hero');
    var section=document.getElementById('homeStartHereV1');
    if(hero&&!section){
      section=document.createElement('section');
      section.className='home-first-v1';
      section.id='homeStartHereV1';
      section.innerHTML='<div class="home-first-inner-v1"><div class="home-first-head-v1"><div><span class="home-first-kicker-v1">DÀNH CHO NGƯỜI MỚI</span><h2>Không biết bắt đầu từ đâu? Đi theo 3 bước này.</h2><p>Web có nhiều khu, nhưng để học từ đầu bạn chỉ cần đi theo một đường: học bài trước, thực hành sau, tra cứu khi cần.</p></div><a class="home-first-primary-v1" href="#">Bắt đầu học Excel →</a></div><div class="home-first-steps-v1"><div class="home-first-step-v1"><span>01</span><div><strong>Học</strong><small>Bắt đầu từ Bài 01 và đi theo thứ tự trong lộ trình Excel A–Z.</small></div></div><div class="home-first-step-v1"><span>02</span><div><strong>Thực hành</strong><small>Sau khi học, làm lại bằng file/bài tập để biến kiến thức thành thao tác.</small></div></div><div class="home-first-step-v1"><span>03</span><div><strong>Tra cứu</strong><small>Khi quên công thức, phím tắt hoặc cần tool thì mới mở kho tra cứu/công cụ.</small></div></div></div><div class="home-first-foot-v1"><span>Arena, Tool và Pro là phần bổ sung — người mới chưa cần vào ngay.</span><span><a href="#ky-nang-excel">Xem lộ trình 42 bài →</a> · <a href="practice-video.html">Khu thực hành →</a></span></div></div>';
      hero.insertAdjacentElement('afterend',section);
    }
    if(section){
      var primary=section.querySelector('.home-first-primary-v1');
      if(primary){primary.href=url;primary.textContent=primaryLabel+' →';}
    }

    var shell=document.querySelector('.home-path-inner');
    var grid=shell&&shell.querySelector('.home-path-grid');
    var board=shell&&shell.querySelector('.learn-board');
    if(shell&&grid&&board&&grid.nextElementSibling!==board)grid.insertAdjacentElement('afterend',board);
    return true;
  }

  function observeBoard(){
    var list=document.getElementById('learnBoardList');
    if(!list||list.dataset.podiumObserver==='1')return;
    list.dataset.podiumObserver='1';
    var raf=0;
    var observer=new MutationObserver(function(){
      if(raf)return;
      raf=requestAnimationFrame(function(){raf=0;repairPodium();});
    });
    observer.observe(list,{childList:true});
    window.addEventListener('pagehide',function(){observer.disconnect();},{once:true});
  }

  function boot(){
    ensurePracticeBanner();
    render(null);
    observeBoard();
    loadCatalog(function(P){render(P);});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
