/*! home-page-motion.js — V101 deterministic Home boot */
(function(){
  'use strict';
  if(window.__avpHomeMotionV101)return;
  window.__avpHomeMotionV101=true;
  window.__avpSiteMotion=true;

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

  var LAST_KEY='avp_knowledge_last_v2';
  var DONE_KEY='avp_platform_completed_v2';

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function markMotion(){
    document.documentElement.classList.add('avp-motion-enabled','avp-performance-stable');
    document.querySelectorAll('.home-path-card,.home-more-card,.home-book-card,.home-ref-item-v114,.home-cta-card,.learn-board,.home-platform-module-v1').forEach(function(node){
      node.classList.add('avp-motion-rise','avp-in');
      node.dataset.avpMotionReady='1';
    });
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
    if(learn){
      learn.href='learning-coach.html';
      learn.setAttribute('aria-label','Học Excel hôm nay');
    }
  }

  function renderModules(){
    var shell=document.querySelector('.home-path-inner');
    var grid=shell&&shell.querySelector('.home-path-grid');
    if(!shell||!grid)return false;

    var title=shell.querySelector(':scope > h2');
    var desc=shell.querySelector(':scope > p');
    if(title)title.textContent='Nền tảng Excel A–Z';
    if(desc)desc.textContent='8 module · 42 bài. Chọn theo nhóm công việc; bên trong là danh sách bài rõ ràng và luôn có đường quay lại.';

    grid.className='home-path-grid home-platform-grid-v1';
    grid.innerHTML=modules.map(function(m){
      return '<a class="home-platform-module-v1 tone-'+esc(m[6])+'" href="knowledge.html?lesson='+encodeURIComponent(m[4])+'">'+
        '<span class="home-platform-no-v1">'+esc(m[0])+'</span>'+
        '<span class="home-platform-copy-v1"><small>'+esc(m[1])+'</small><strong>'+esc(m[2])+'</strong><em>'+esc(m[3])+'</em><b>'+m[5]+' bài · Bắt đầu →</b></span></a>';
    }).join('');
    grid.dataset.avpHomeAz='v101';

    var more=shell.querySelector('.home-path-more');
    if(more)more.style.marginTop='18px';
    wirePrimaryCta();
    document.body.classList.add('avp-home-ready');
    return true;
  }

  function renderArena(){
    var card=document.querySelector('a.home-more-race[href*="excel-race.html"]');
    if(!card)return false;
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

  function ensurePracticeBanner(){
    var cta=document.querySelector('.avp-mobile-main-cta-wrap .avp-mobile-main-cta');
    if(!cta)return false;
    if(cta.dataset.practiceHubV101==='1')return true;
    cta.dataset.practiceHubV101='1';
    cta.classList.remove('home-start-cta-v1');
    cta.classList.add('avp-practice-hub-cta');
    cta.href='practice-video.html';
    cta.setAttribute('aria-label','Bài tập Excel — 5 luồng thực hành');
    cta.innerHTML='<span class="avp-practice-hub-badges" aria-hidden="true"><span class="avp-mini-channel avp-mini-channel-tt">♪</span><span class="avp-mini-channel avp-mini-channel-yt">▶</span><span class="avp-mini-channel avp-mini-channel-hw">✎</span><span class="avp-mini-channel avp-mini-channel-grade">✓</span><span class="avp-mini-channel avp-mini-channel-pro">◆</span></span><span class="avp-mobile-main-cta-icon">📚</span><span class="avp-mobile-main-cta-copy"><strong>Bài tập Excel</strong><small>5 luồng thực hành trong cùng một khu</small><small style="opacity:.88;font-size:11px;line-height:1.45;display:block;margin-top:2px">01 TikTok · 02 YouTube · 03 Homework · 04 Tự chấm · 05 Pro</small></span><span class="avp-mobile-main-cta-arrow">→</span>';
    return true;
  }

  function readDone(){
    try{
      var raw=JSON.parse(localStorage.getItem(DONE_KEY)||'[]');
      return new Set(Array.isArray(raw)?raw:[]);
    }catch(_){return new Set();}
  }

  function target(P){
    var seq=(P&&P.lessonSequence)||[];
    if(!seq.length)return{id:'f01-excel-workspace',order:1,resume:false};
    var done=readDone();
    var last='';
    try{last=localStorage.getItem(LAST_KEY)||'';}catch(_){ }
    var idx=seq.indexOf(last);
    var id='';
    if(idx>=0)id=(done.has(last)&&idx<seq.length-1)?seq[idx+1]:last;
    if(!id)id=seq.find(function(x){return !done.has(x);})||seq[0];
    var order=P&&P.displayOrder?P.displayOrder(id):(seq.indexOf(id)+1);
    return{id:id,order:order,resume:idx>=0||done.size>0};
  }

  function renderFirstRun(P){
    var hero=document.querySelector('.avp-hero');
    if(!hero)return false;

    var section=document.getElementById('homeStartHereV1');
    if(!section){
      section=document.createElement('section');
      section.className='home-first-v1';
      section.id='homeStartHereV1';
      section.innerHTML='<div class="home-first-inner-v1"><div class="home-first-head-v1"><div><span class="home-first-kicker-v1">DÀNH CHO NGƯỜI MỚI</span><h2>Không biết bắt đầu từ đâu? Đi theo 3 bước này.</h2><p>Web có nhiều khu, nhưng để học từ đầu bạn chỉ cần đi theo một đường: học bài trước, thực hành sau, tra cứu khi cần.</p></div><a class="home-first-primary-v1" href="knowledge.html?lesson=f01-excel-workspace">Bắt đầu học Excel →</a></div><div class="home-first-steps-v1"><div class="home-first-step-v1"><span>01</span><div><strong>Học</strong><small>Bắt đầu từ Bài 01 và đi theo thứ tự trong lộ trình Excel A–Z.</small></div></div><div class="home-first-step-v1"><span>02</span><div><strong>Thực hành</strong><small>Sau khi học, làm lại bằng file/bài tập để biến kiến thức thành thao tác.</small></div></div><div class="home-first-step-v1"><span>03</span><div><strong>Tra cứu</strong><small>Khi quên công thức, phím tắt hoặc cần tool thì mới mở kho tra cứu/công cụ.</small></div></div></div><div class="home-first-foot-v1"><span>Arena, Tool và Pro là phần bổ sung — người mới chưa cần vào ngay.</span><span><a href="#ky-nang-excel">Xem lộ trình 42 bài →</a> · <a href="practice-video.html">Khu thực hành →</a></span></div></div>';
      hero.insertAdjacentElement('afterend',section);
    }

    if(P){
      var t=target(P);
      var primary=section.querySelector('.home-first-primary-v1');
      if(primary){
        primary.href=P.lessonUrl?P.lessonUrl(t.id):('knowledge.html?lesson='+encodeURIComponent(t.id));
        primary.textContent=(t.resume?('Tiếp tục lộ trình · Bài '+String(t.order||1).padStart(2,'0')):'Bắt đầu học Excel')+' →';
      }
    }
    return true;
  }

  function repairPodium(){
    var rows=document.querySelectorAll('#learnBoardList .lb-row');
    if(!rows.length)return;
    var medals=['🥇','🥈','🥉'];
    for(var i=0;i<Math.min(3,rows.length);i++){
      var row=rows[i];
      var rank=row.querySelector('.lb-rank');
      row.classList.add('lb-podium-'+(i+1));
      if(rank)rank.innerHTML='<span class="lb-medal lb-'+(i===0?'gold':i===1?'silver':'bronze')+'" title="Top '+(i+1)+'">'+medals[i]+'</span>';
    }
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

  function loadCatalog(){
    if(window.AVPLearningPlatform){renderFirstRun(window.AVPLearningPlatform);return;}
    var existing=document.querySelector('script[data-avp-home-first-catalog]');
    if(existing){
      existing.addEventListener('load',function(){renderFirstRun(window.AVPLearningPlatform);},{once:true});
      return;
    }
    var s=document.createElement('script');
    s.src='learning-platform-catalog-v1.js?v=20260913-stable101';
    s.dataset.avpHomeFirstCatalog='1';
    s.onload=function(){renderFirstRun(window.AVPLearningPlatform);};
    document.head.appendChild(s);
  }

  function boot(){
    renderModules();
    renderArena();
    ensurePracticeBanner();
    renderFirstRun(null);
    repairPodium();
    observeBoard();
    markMotion();
    loadCatalog();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
