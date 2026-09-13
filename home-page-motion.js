/*! home-page-motion.js — V102 four-flow Home learning entry */
(function(){
  'use strict';
  if(window.__avpHomeMotionV102)return;
  window.__avpHomeMotionV102=true;
  window.__avpSiteMotion=true;

  var tracks=[
    ['01','FOUNDATION + DATA','Nền tảng & Dữ liệu','Hiểu Excel, nhập liệu, cấu trúc bảng, lọc và làm sạch dữ liệu.','foundation-data',11,'green'],
    ['02','FORMULA + ANALYSIS','Công thức & Phân tích','Logic, lookup, tổng hợp điều kiện, Table, Pivot, KPI và kiểm tra số.','formula-analysis',11,'blue'],
    ['03','DASHBOARD + POWER QUERY','Dashboard & Power Query','Biểu đồ, dashboard tương tác và quy trình làm sạch/Refresh bằng Power Query.','dashboard-power-query',11,'purple'],
    ['04','AUTOMATION + CASE','Tự động hóa & Case','Macro/VBA, tối ưu file, chọn công cụ và case end-to-end thực chiến.','automation-cases',9,'sand']
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
    if(btn&&btn.dataset.learningHub!=='fourflows1'){
      var clean=btn.cloneNode(true);
      clean.dataset.learningHub='fourflows1';
      clean.innerHTML='<span class="avp-tease-title" style="display:block;font-weight:900;font-size:13.5px">Chọn luồng học →</span><span class="avp-tease-preview" style="display:block;margin-top:4px;opacity:.78;font-size:11px">4 luồng · 42 bài · chọn mục tiêu rồi cuộn qua từng bài</span>';
      clean.addEventListener('click',function(e){e.preventDefault();location.href='skill-map.html';});
      btn.replaceWith(clean);
    }
    var learn=document.querySelector('.top-simple-nav [data-avp-nav="learn"]');
    if(learn){
      learn.href='skill-map.html';
      learn.setAttribute('aria-label','Chọn luồng học Excel');
    }
  }

  function renderModules(){
    var shell=document.querySelector('.home-path-inner');
    var grid=shell&&shell.querySelector('.home-path-grid');
    if(!shell||!grid)return false;

    var title=shell.querySelector(':scope > h2');
    var desc=shell.querySelector(':scope > p');
    if(title)title.textContent='Chọn luồng học Excel';
    if(desc)desc.textContent='4 luồng · 42 bài. Chọn mục tiêu trước, sau đó cuộn qua từng bài trong cùng một giao diện.';

    grid.className='home-path-grid home-platform-grid-v1 home-learning-flow-grid-v1';
    grid.innerHTML=tracks.map(function(t){
      return '<a class="home-platform-module-v1 home-learning-flow-v1 tone-'+esc(t[6])+'" href="skill-map.html?track='+encodeURIComponent(t[4])+'">'+
        '<span class="home-platform-no-v1">'+esc(t[0])+'</span>'+
        '<span class="home-platform-copy-v1"><small>'+esc(t[1])+'</small><strong>'+esc(t[2])+'</strong><em>'+esc(t[3])+'</em><b>'+t[5]+' bài · Mở luồng →</b></span></a>';
    }).join('');
    grid.dataset.avpHomeAz='v102-fourflows';

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
    if(cta.dataset.practiceHubV102==='1')return true;
    cta.dataset.practiceHubV102='1';
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
      section.innerHTML='<div class="home-first-inner-v1"><div class="home-first-head-v1"><span class="home-first-kicker-v1">DÀNH CHO NGƯỜI MỚI</span><h2>Bắt đầu đúng chỗ</h2><p>Chọn luồng học trước, học bài, rồi sang Thực hành bằng file.</p></div><div class="home-first-steps-v1"><div class="home-first-step-v1"><span>01</span><div><strong>Chọn luồng</strong><small>Chọn một trong 4 luồng theo mục tiêu.</small></div></div><div class="home-first-step-v1"><span>02</span><div><strong>Học bài</strong><small>Cuộn card và mở đúng bài cần học.</small></div></div><div class="home-first-step-v1"><span>03</span><div><strong>Thực hành</strong><small>Sau khi học, làm lại bằng file/case.</small></div></div></div><a class="home-first-primary-v1" href="skill-map.html?track=foundation-data">Chọn luồng học →</a><div class="home-first-foot-v1"><span>Học = 4 luồng / 42 bài. Thực hành = 5 luồng file/case.</span></div></div>';
      hero.insertAdjacentElement('afterend',section);
    }

    if(P){
      var t=target(P);
      var primary=section.querySelector('.home-first-primary-v1');
      if(primary){
        if(t.resume){
          primary.href=P.lessonUrl?P.lessonUrl(t.id):('knowledge.html?lesson='+encodeURIComponent(t.id));
          primary.textContent='Tiếp tục · Bài '+String(t.order||1).padStart(2,'0')+' →';
        }else{
          primary.href='skill-map.html?track=foundation-data';
          primary.textContent='Chọn luồng học →';
        }
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
    s.src='learning-platform-catalog-v1.js?v=20260913-fourflows1';
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
