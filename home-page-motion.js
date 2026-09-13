/*! home-page-motion.js — V104 final Home hierarchy */
(function(){
  'use strict';
  if(window.__avpHomeMotionV104)return;
  window.__avpHomeMotionV104=true;
  window.__avpHomeMotionV103=true;
  window.__avpHomeMotionV102=true;
  window.__avpSiteMotion=true;

  var LAST_KEY='avp_knowledge_last_v2';
  var DONE_KEY='avp_platform_completed_v2';

  function ensureAssets(){
    if(!document.querySelector('link[data-home-final-v104]')){
      var link=document.createElement('link');
      link.rel='stylesheet';link.href='home-final-ui-v104.css?v=20260913-1';link.dataset.homeFinalV104='1';
      document.head.appendChild(link);
    }
    if(!document.querySelector('script[data-home-copy-v104]')){
      var script=document.createElement('script');
      script.src='home-copy-v104.js?v=20260913-1';script.dataset.homeCopyV104='1';
      document.head.appendChild(script);
    }
  }

  function markMotion(){
    document.documentElement.classList.add('avp-motion-enabled','avp-performance-stable');
    document.querySelectorAll('.home-choice-card-v104,.home-more-card,.home-book-card,.home-ref-item-v114,.home-cta-card,.learn-board,.home-extra-panel-v104').forEach(function(node){
      node.classList.add('avp-motion-rise','avp-in');node.dataset.avpMotionReady='1';
    });
  }

  function iconStage(items,cycle){
    return '<span class="home-choice-icon-stage-v104" aria-hidden="true" style="--cycle:'+cycle+'s">'+items.map(function(icon,i){return '<i style="--delay:'+(i*2)+'s;--cycle:'+cycle+'s">'+icon+'</i>';}).join('')+'</span>';
  }

  function choiceMarkup(kind){
    if(kind==='learn'){
      return iconStage(['▦','ƒx','▥','⚙'],8)+
        '<span class="home-choice-copy-v104"><small>4 LUỒNG · 42 BÀI</small><strong>Học theo lộ trình</strong><em>Từ nền tảng, công thức đến Power Query và tự động hóa</em><b>Chọn luồng học →</b></span><span class="home-choice-arrow-v104" aria-hidden="true">→</span>';
    }
    return iconStage(['♪','▶','✎','✓','◆'],10)+
      '<span class="home-choice-copy-v104"><small>5 LUỒNG THỰC HÀNH</small><strong>Thực hành kỹ năng</strong><em>TikTok · YouTube · Homework · Tự chấm · Pro</em><b>Vào khu thực hành →</b></span><span class="home-choice-arrow-v104" aria-hidden="true">→</span>';
  }

  function configureChoice(node,kind,href){
    if(!node)return null;
    var clean=node.cloneNode(false);
    if(node.id)clean.id=node.id;
    clean.className='home-choice-card-v104';
    clean.dataset.kind=kind;
    clean.dataset.homeHubV104='1';
    if(kind==='learn')clean.dataset.learningHub='fourflows1';
    clean.setAttribute('aria-label',kind==='learn'?'Học theo lộ trình — 4 luồng, 42 bài':'Thực hành kỹ năng — 5 luồng thực hành');
    clean.innerHTML=choiceMarkup(kind);
    if(clean.tagName==='A')clean.setAttribute('href',href);
    else clean.addEventListener('click',function(e){e.preventDefault();location.href=href;});
    node.replaceWith(clean);
    return clean;
  }

  function renderHeroChoices(){
    var oldLearn=document.getElementById('avpScrollToPath');
    var oldPractice=document.querySelector('.avp-mobile-main-cta-wrap .avp-mobile-main-cta');
    if(!oldLearn||!oldPractice)return false;
    if(oldLearn.closest('.home-choice-stack-v104'))return true;

    var learnParent=oldLearn.parentElement;
    var practiceWrap=oldPractice.closest('.avp-mobile-main-cta-wrap');
    var insertion=practiceWrap&&practiceWrap.parentNode?practiceWrap:null;
    var host=insertion?insertion.parentNode:(oldPractice.parentNode||oldLearn.parentNode);
    if(!host)return false;

    var stack=document.createElement('div');stack.className='home-choice-stack-v104';stack.setAttribute('aria-label','Chọn cách học Excel');
    if(insertion)host.insertBefore(stack,insertion);else host.insertBefore(stack,oldPractice);

    var learn=configureChoice(oldLearn,'learn','skill-map.html');
    var practice=configureChoice(oldPractice,'practice','practice-video.html');
    stack.appendChild(learn);stack.appendChild(practice);

    if(practiceWrap&&practiceWrap!==stack&&!practiceWrap.children.length)practiceWrap.remove();
    if(learnParent&&learnParent!==stack&&learnParent!==practiceWrap&&!learnParent.children.length)learnParent.remove();

    var navLearn=document.querySelector('.top-simple-nav [data-avp-nav="learn"]');
    if(navLearn){navLearn.href='skill-map.html';navLearn.setAttribute('aria-label','Học theo lộ trình Excel');}
    return true;
  }

  function renderExtras(shell){
    var more=shell&&shell.querySelector('.home-path-more');
    if(!more)return false;
    var panel=shell.querySelector('.home-extra-panel-v104');
    if(!panel){
      panel=document.createElement('section');panel.className='home-extra-panel-v104';panel.setAttribute('aria-labelledby','homeExtraTitleV104');
      more.insertAdjacentElement('beforebegin',panel);
    }
    var head=shell.querySelector('.home-extra-head-v2');
    if(!head){head=document.createElement('div');head.className='home-extra-head-v2';}
    head.innerHTML='<div><span>BỔ TRỢ · CÔNG CỤ</span><h3 id="homeExtraTitleV104">Mở rộng kỹ năng</h3><p>Công cụ và khu nâng cao để học sâu hơn khi cần.</p></div><b>Khám phá thêm</b>';
    panel.appendChild(head);
    panel.appendChild(more);

    more.className='home-path-more home-path-more--extras';
    more.innerHTML=''+
      '<div class="home-more-card home-extra-card-v2 tone-master is-restoring" aria-disabled="true" role="status"><span class="home-more-icon">◆</span><div><small>LỘ TRÌNH NÂNG CAO</small><strong>Excel Master</strong><em>Hệ nội dung chuyên sâu</em><b>Sắp cập nhật</b></div></div>'+
      '<a class="home-more-card home-extra-card-v2 tone-skill" href="skill-map.html"><span class="home-more-icon">◈</span><div><small>BẢN ĐỒ KỸ NĂNG</small><strong>Skill Map</strong><em>Xem luồng và vị trí đang học</em><b>Mở bản đồ →</b></div></a>'+
      '<a class="home-more-card home-extra-card-v2 tone-code" href="excel-code-hub.html"><span class="home-more-icon">⌘</span><div><small>CODE & AUTOMATION</small><strong>Excel Code Hub</strong><em>Python · VBA · Power Query</em><b>Mở Code Hub →</b></div></a>'+
      '<a class="home-more-card home-extra-card-v2 tone-arena home-more-race" href="excel-race.html"><span class="home-more-icon">⚡</span><div><small>GAME & PHẢN XẠ</small><strong>Excel Arena</strong><em>Đấu kỹ năng theo thời gian</em><b>Vào Arena →</b></div></a>'+
      '<a class="home-more-card home-extra-card-v2 tone-tools" href="tools-center.html"><span class="home-more-icon">▣</span><div><small>TOOL & TEMPLATE</small><strong>Kho Tool</strong><em>Tiện ích, template và checklist</em><b>Mở Kho Tool →</b></div></a>';
    more.dataset.extrasVersion='104';
    return true;
  }

  function collapseOldLearningCards(){
    var shell=document.querySelector('.home-path-inner');
    if(!shell)return false;
    shell.classList.add('home-path-inner--extras-only-v104');
    var title=shell.querySelector(':scope > h2');var desc=shell.querySelector(':scope > p');var grid=shell.querySelector(':scope > .home-path-grid');
    if(title)title.hidden=true;if(desc)desc.hidden=true;
    if(grid){grid.hidden=true;grid.innerHTML='';grid.dataset.avpHomeAz='v104-collapsed';}
    renderExtras(shell);
    document.body.classList.add('avp-home-ready');
    return true;
  }

  function renderArena(){
    var card=document.querySelector('a.home-more-race[href*="excel-race.html"]');if(!card)return false;
    card.classList.add('avp-arena-home');card.setAttribute('aria-label','Excel Arena — game phản xạ Excel');
    if(!card.querySelector('.avp-arena-home-badge')){var badge=document.createElement('span');badge.className='avp-arena-home-badge';badge.textContent='GAME';card.appendChild(badge);}return true;
  }

  function readDone(){try{var raw=JSON.parse(localStorage.getItem(DONE_KEY)||'[]');return new Set(Array.isArray(raw)?raw:[]);}catch(_){return new Set();}}
  function target(P){
    var seq=(P&&P.lessonSequence)||[];if(!seq.length)return{id:'f01-excel-workspace',order:1,resume:false};var done=readDone();var last='';try{last=localStorage.getItem(LAST_KEY)||'';}catch(_){ }
    var idx=seq.indexOf(last);var id='';if(idx>=0)id=(done.has(last)&&idx<seq.length-1)?seq[idx+1]:last;if(!id)id=seq.find(function(x){return !done.has(x);})||seq[0];var order=P&&P.displayOrder?P.displayOrder(id):(seq.indexOf(id)+1);return{id:id,order:order,resume:idx>=0||done.size>0};
  }

  function renderFirstRun(P){
    var hero=document.querySelector('.avp-hero');if(!hero)return false;var section=document.getElementById('homeStartHereV1');
    if(!section){
      section=document.createElement('section');section.className='home-first-v1';section.id='homeStartHereV1';
      section.innerHTML='<div class="home-first-inner-v1"><div class="home-first-head-v1"><span class="home-first-kicker-v1">DÀNH CHO NGƯỜI MỚI</span><h2>Bắt đầu đúng chỗ</h2><p>Chọn luồng học, học bài rồi thực hành lại bằng file.</p></div><div class="home-first-steps-v1"><div class="home-first-step-v1"><span>01</span><div><strong>Chọn luồng</strong><small>Chọn mục tiêu phù hợp.</small></div></div><div class="home-first-step-v1"><span>02</span><div><strong>Học bài</strong><small>Nắm nội dung theo lộ trình.</small></div></div><div class="home-first-step-v1"><span>03</span><div><strong>Thực hành</strong><small>Làm lại bằng file và case.</small></div></div></div><a class="home-first-primary-v1" href="skill-map.html?track=foundation-data">Chọn luồng học →</a><div class="home-first-foot-v1"><span>4 luồng học · 5 luồng thực hành.</span></div></div>';hero.insertAdjacentElement('afterend',section);
    }
    if(P){var t=target(P);var primary=section.querySelector('.home-first-primary-v1');if(primary){if(t.resume){primary.href=P.lessonUrl?P.lessonUrl(t.id):('knowledge.html?lesson='+encodeURIComponent(t.id));primary.textContent='Tiếp tục · Bài '+String(t.order||1).padStart(2,'0')+' →';}else{primary.href='skill-map.html?track=foundation-data';primary.textContent='Chọn luồng học →';}}}return true;
  }

  function repairPodium(){var rows=document.querySelectorAll('#learnBoardList .lb-row');if(!rows.length)return;var medals=['🥇','🥈','🥉'];for(var i=0;i<Math.min(3,rows.length);i++){var row=rows[i];var rank=row.querySelector('.lb-rank');row.classList.add('lb-podium-'+(i+1));if(rank)rank.innerHTML='<span class="lb-medal lb-'+(i===0?'gold':i===1?'silver':'bronze')+'" title="Top '+(i+1)+'">'+medals[i]+'</span>';}}
  function observeBoard(){var list=document.getElementById('learnBoardList');if(!list||list.dataset.podiumObserver==='1')return;list.dataset.podiumObserver='1';var raf=0;var observer=new MutationObserver(function(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;repairPodium();});});observer.observe(list,{childList:true});window.addEventListener('pagehide',function(){observer.disconnect();},{once:true});}
  function loadCatalog(){if(window.AVPLearningPlatform){renderFirstRun(window.AVPLearningPlatform);return;}var existing=document.querySelector('script[data-avp-home-first-catalog]');if(existing){existing.addEventListener('load',function(){renderFirstRun(window.AVPLearningPlatform);},{once:true});return;}var s=document.createElement('script');s.src='learning-platform-catalog-v1.js?v=20260913-fourflows2';s.dataset.avpHomeFirstCatalog='1';s.onload=function(){renderFirstRun(window.AVPLearningPlatform);};document.head.appendChild(s);}

  function boot(){
    ensureAssets();
    renderHeroChoices();
    collapseOldLearningCards();
    renderArena();
    renderFirstRun(null);
    repairPodium();observeBoard();markMotion();loadCatalog();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
