/*! AVP Homepage Minimal V1 — recompose existing homepage without deleting legacy features */
(function(){
  'use strict';
  var path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(path!==''&&path!=='index.html')return;
  if(window.__AVP_HOME_MINIMAL_V1__)return;
  window.__AVP_HOME_MINIMAL_V1__=true;
  document.documentElement.classList.add('avp-home-minimal');

  /* TEMPORARY: let phones render the desktop layout; remove this block to restore responsive mobile. */
  var avpViewport=document.querySelector('meta[name="viewport"]');
  var avpForceDesktop=window.matchMedia('(max-width: 650px)').matches;
  if(avpViewport && avpForceDesktop){
    avpViewport.setAttribute('content','width=1200, initial-scale=0.32, maximum-scale=3, user-scalable=yes');
    document.documentElement.classList.add('avp-force-desktop-mobile');
  }

  function el(tag,cls,html){
    var n=document.createElement(tag);
    if(cls)n.className=cls;
    if(html!==undefined)n.innerHTML=html;
    return n;
  }
  function linkCard(href,icon,title,desc,tone){
    var a=el('a','avp-home-ecosystem-card');
    a.href=href;
    if(tone)a.dataset.tone=tone;
    a.innerHTML='<span class="avp-home-card-icon" aria-hidden="true">'+icon+'</span>'+
      '<span class="avp-home-card-copy"><strong>'+title+'</strong><small>'+desc+'</small></span>'+
      '<span class="avp-home-card-arrow" aria-hidden="true">↗</span>';
    return a;
  }

  function removeLegacyHeroCards(){
    var hero=document.querySelector('.avp-hero');
    if(!hero)return;
    var needles=['học theo lộ trình','thực hành kỹ năng'];
    Array.prototype.slice.call(hero.querySelectorAll('a,button,article,section,div')).forEach(function(node){
      if(!node.isConnected||!hero.contains(node))return;
      var own=(node.innerText||node.textContent||'').replace(/\\s+/g,' ').trim().toLowerCase();
      if(!needles.some(function(n){return own.indexOf(n)!==-1;}))return;
      var parent=node.parentElement;
      /* Remove the smallest card-like wrapper containing the label, not the entire hero or its copy. */
      var card=node;
      while(parent&&parent!==hero&&parent!==hero.querySelector('.avp-copy')){
        var txt=(parent.innerText||parent.textContent||'').replace(/\\s+/g,' ').trim().toLowerCase();
        if(needles.some(function(n){return txt.indexOf(n)!==-1;})){card=parent;parent=parent.parentElement;}
        else break;
      }
      if(card&&card!==hero&&card!==hero.querySelector('.avp-copy'))card.remove();
    });
  }


  function setup(){
    var nav=document.querySelector('.top-simple-nav');
    var hero=document.querySelector('.avp-hero');
    var pathSection=document.getElementById('ky-nang-excel');
    var books=document.getElementById('home-books');
    if(!nav||!hero||!pathSection)return;

    if(!nav.querySelector('.avp-home-brand')){
      var brand=el('a','avp-home-brand');
      brand.href='index.html';
      brand.setAttribute('aria-label','Anh Văn Phòng — Trang chủ');
      brand.innerHTML='<span class="avp-home-brand-mark" aria-hidden="true">AVP</span><span class="avp-home-brand-copy"><strong>Anh Văn Phòng</strong><small>Learn Excel With Me</small></span>';
      nav.insertBefore(brand,nav.firstChild);
    }

    var navLinks=nav.querySelectorAll('.top-simple-links a');
    navLinks.forEach(function(a){
      var key=a.getAttribute('data-avp-nav');
      if(key==='learn'){a.textContent='Lộ trình học';a.href='skill-map.html';}
      if(key==='ai'){a.textContent='AI';a.href='ai.html';}
      if(key==='practice'){a.textContent='Thực hành';a.href='practice-video.html';}
      if(key==='tools'){a.textContent='Công cụ';a.href='tools-center.html';}
    });
    var links=nav.querySelector('.top-simple-links');
    if(links&&!links.querySelector('[data-avp-nav="library"]')){
      var library=el('a','');
      library.href='excel-handbook.html';library.textContent='Thư viện';library.dataset.avpNav='library';
      var practice=links.querySelector('[data-avp-nav="practice"]');
      links.insertBefore(library,practice||links.firstChild);
    }

    var heroTitle=hero.querySelector('.avp-title');
    if(heroTitle){
      heroTitle.innerHTML='<span>Anh Văn Phòng</span><span class="avp-brand-vietnamese">Học đúng trọng tâm. Thực hành trên dữ liệu thật.</span>';
    }
    var tagline=hero.querySelector('#avpTyping');
    if(tagline)tagline.textContent='Học công cụ để làm chủ công việc.';
    var desc=hero.querySelector('.avp-desc');
    if(desc)desc.innerHTML='Excel, dữ liệu, báo cáo và tự động hóa — học qua ví dụ thực tế, bài tập và file thực hành.<span class="avp-domain-line">EXCEL · DATA · REPORTING · AUTOMATION · AI</span>';
    var quest=hero.querySelector('.avp-office-quest-entry');
    if(quest)quest.style.display='none';

    var practiceCta=hero.querySelector('.avp-mobile-main-cta');
    if(practiceCta){
      practiceCta.href='practice-video.html';
      var strong=practiceCta.querySelector('strong');if(strong)strong.textContent='Thực hành Excel';
      var smalls=practiceCta.querySelectorAll('small');if(smalls.length)smalls[0].textContent='Bài tập và tình huống thực tế';
      if(smalls.length>1)smalls[1].textContent='Học bằng cách tự thao tác';
    }
    var tease=hero.querySelector('#avpScrollTease');
    if(tease){
      var btn=tease.querySelector('button');
      if(btn){
        btn.removeAttribute('style');
        var title=btn.querySelector('.avp-tease-title');if(title)title.textContent='Khám phá hệ sinh thái AVP';
        var preview=btn.querySelector('#avpTeasePreview');if(preview)preview.textContent='Lộ trình học, thư viện kiến thức và công cụ hỗ trợ.';
        btn.addEventListener('click',function(){var target=document.getElementById('avp-home-ecosystem');if(target)target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});
      }
    }
    removeLegacyHeroCards();
    var cardObserver=new MutationObserver(function(){removeLegacyHeroCards();});
    cardObserver.observe(hero,{childList:true,subtree:true});
    var mini=hero.querySelector('.avp-mini-info');
    if(mini)mini.innerHTML='<span>✓ Học theo lộ trình</span><span>✓ Ví dụ thực tế</span><span>✓ Có file thực hành</span>';

    var ecosystem=document.getElementById('avp-home-ecosystem');
    if(!ecosystem){
      ecosystem=el('section','');
      ecosystem.id='avp-home-ecosystem';
      ecosystem.setAttribute('aria-labelledby','avp-home-ecosystem-title');
      var head=el('div','avp-home-section-head');
      head.innerHTML='<div><span class="avp-home-section-kicker">KHÁM PHÁ AVP</span><h2 id="avp-home-ecosystem-title">Bạn muốn bắt đầu từ đâu?</h2><p>Chọn đúng khu vực cần dùng. Phần chuyên sâu nằm ở trang riêng.</p></div><a class="avp-home-text-link" href="tools-center.html">Khám phá tất cả <span aria-hidden="true">↗</span></a>';
      var grid=el('div','avp-home-ecosystem-grid');
      grid.appendChild(linkCard('skill-map.html','⌘','Lộ trình học','Các kỹ năng và hướng học Excel.','green'));
      grid.appendChild(linkCard('excel-handbook.html','ƒx','Thư viện kiến thức','Tra cứu hàm, hướng dẫn và ví dụ.','blue'));
      grid.appendChild(linkCard('practice-video.html','▤','Thực hành','Bài tập Excel và tình huống thực tế.','amber'));
      grid.appendChild(linkCard('ai.html','✳','Khu học AI','Ứng dụng AI vào công việc văn phòng.','violet'));
      grid.appendChild(linkCard('tools-center.html','⌘','Công cụ hỗ trợ','Template, tiện ích và tài nguyên.','blue'));
      grid.appendChild(linkCard('tools-center.html','♟','Cộng đồng','Hỏi đáp, chia sẻ kinh nghiệm và thảo luận.','rose'));
      ecosystem.appendChild(head);ecosystem.appendChild(grid);
      hero.insertAdjacentElement('afterend',ecosystem);
    }


    /* Homepage composition inspired by the supplied desktop/mobile reference. */
    var heroTitle=document.querySelector('.avp-hero .avp-title');
    if(heroTitle)heroTitle.innerHTML='<span>Học <b>Excel</b></span><span class="avp-brand-vietnamese">để làm được việc.</span>';
    var eyebrow=document.querySelector('.avp-hero .avp-eyebrow');
    if(eyebrow)eyebrow.innerHTML='<span class="avp-eyebrow-dot"></span> EXCEL　·　DỮ LIỆU　·　BÁO CÁO　·　TỰ ĐỘNG HÓA　·　AI';
    var tagline=document.querySelector('.avp-hero .avp-tagline');
    if(tagline)tagline.innerHTML='<span id="avpTyping">Từ cơ bản đến nâng cao, kèm ví dụ thực tế, bài tập và file thực hành.</span>';
    var desc=document.querySelector('.avp-hero .avp-desc');
    if(desc)desc.innerHTML='Giúp bạn xử lý công việc nhanh hơn, chính xác hơn và chuyên nghiệp hơn.';
    var quest=document.querySelector('.avp-hero .avp-office-quest-entry');
    if(quest)quest.remove();
    var mainCta=document.querySelector('.avp-hero .avp-mobile-main-cta-wrap');
    if(mainCta){
      mainCta.innerHTML='<div class="avp-reference-ctas"><a class="avp-reference-primary" href="skill-map.html"><span class="avp-reference-cta-icon">▤</span><span><strong>Bắt đầu học ngay</strong><small>Dành cho người mới</small></span><b>→</b></a><a class="avp-reference-secondary" href="#home-ai-intro"><span class="avp-reference-play">▶</span><span><strong>Xem giới thiệu</strong><small>1 phút hiểu về AVP</small></span></a></div>';
    }

    /* Keep the existing curriculum routes available, but remove the crowded old lesson grid from the homepage. */
    var oldGrid=pathSection.querySelector('.home-path-grid');
    if(oldGrid)oldGrid.hidden=true;
    var oldMore=pathSection.querySelector('.home-path-more');
    if(oldMore)oldMore.hidden=true;
    var oldHeading=pathSection.querySelector('.home-path-inner>h2');
    var oldIntro=pathSection.querySelector('.home-path-inner>p');
    if(oldHeading)oldHeading.textContent='Bắt đầu với Excel';
    if(oldIntro)oldIntro.textContent='Chọn một chủ đề để đi sâu vào từng bài học.';
    var compactLinks=pathSection.querySelector('.avp-home-compact-links');
    if(!compactLinks){
      compactLinks=el('div','avp-home-compact-links');
      compactLinks.style.cssText='display:flex;flex-wrap:wrap;gap:10px;margin-top:16px';
      [
        ['excel.html','Excel cơ bản'],
        ['congthucexcel.html','Công thức và hàm'],
        ['phimtatexcel.html','Phím tắt'],
        ['power-query-course.html','Power Query'],
        ['pivottable.html','PivotTable']
      ].forEach(function(item){
        var a=el('a','avp-home-text-link',item[1]+' <span aria-hidden="true">↗</span>');
        a.href=item[0];
        a.style.cssText='padding:10px 14px;border:1px solid #dce8df;border-radius:13px;background:#fff';
        compactLinks.appendChild(a);
      });
      pathSection.querySelector('.home-path-inner').appendChild(compactLinks);
    }
    if(books){
      var h=books.querySelector('.home-reference-heading');
      if(h)h.textContent='Tài liệu tham khảo';
    }

    /* Update the current section-scroll handler's target if it exists. */
    var scrollButton=document.getElementById('avpScrollToPath');
    if(scrollButton){
      var fresh=scrollButton.cloneNode(true);
      scrollButton.replaceWith(fresh);
      fresh.addEventListener('click',function(){var target=document.getElementById('avp-home-ecosystem');if(target)target.scrollIntoView({behavior:'smooth',block:'start'});});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();