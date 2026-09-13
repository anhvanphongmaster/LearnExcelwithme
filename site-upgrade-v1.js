(()=>{
  'use strict';
  if(window.__AVP_SITE_UPGRADE_V1__)return;
  window.__AVP_SITE_UPGRADE_V1__=1;

  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const html=document.documentElement;
  html.classList.add('avp-site-upgrade');

  function loadRuntime(src,key){
    if(document.querySelector('script[data-'+key+']'))return;
    const s=document.createElement('script');
    s.src=src;s.defer=true;s.setAttribute('data-'+key,'1');document.head.appendChild(s);
  }
  loadRuntime('site-runtime-cache-v1.js?v=20260914-cache1','avp-site-cache-v1');
  loadRuntime('site-rpc-dedupe-v1.js?v=20260914-rpc2','avp-rpc-dedupe-v1');
  loadRuntime('site-auth-cache-v1.js?v=20260914-auth1','avp-auth-cache-v1');

  const stable=/^(practice-|professional-|homework|baitapexcel|excel-race)/.test(page);
  const legal=new Set(['terms.html','privacy.html','disclaimer.html','open-source.html']);
  if(stable)html.classList.add('avp-site-stable');
  else if(legal.has(page))html.classList.add('avp-site-legal');
  else html.classList.add('avp-site-shell');

  if(page===''||page==='index.html')html.classList.add('avp-site-home');
  if(['skill-map.html','knowledge.html','learning-coach.html','learning-path.html','master-learning.html'].includes(page))html.classList.add('avp-site-learn');
  if(['tools-center.html','tools-library.html','formula-finder.html','qc-dashboard.html','playground.html','excel-mobile.html'].includes(page))html.classList.add('avp-site-tools');

  const learnPages=new Set([
    'skill-map.html','knowledge.html','learning-coach.html','learning-path.html','master-learning.html','excel.html','phimtatexcel.html','congthucexcel.html','filtersort.html','pivottable.html','bieudopareto.html','baocaoexcel.html','excel-nang-cao.html','power-query-course.html','power-pivot-dax.html','dashboard-dong.html','vba-macro.html','solver-whatif.html','focus-room.html','certificate.html'
  ]);
  const practicePages=new Set([
    'practice-video.html','practice-tiktok.html','practice-youtube.html','practice-lab.html','practice-grader.html','homework.html','baitapexcel.html','excel-race.html','professional-access.html','professional-track.html'
  ]);
  const toolsPages=new Set([
    'tools-center.html','tools-library.html','excel-mobile.html','formula-finder.html','qc-dashboard.html','playground.html'
  ]);

  function section(){
    if(page===''||page==='index.html'||legal.has(page)||page==='gioithieu.html'||page==='lienhe.html')return 'home';
    if(learnPages.has(page))return 'learn';
    if(practicePages.has(page)||page.startsWith('practice-')||page.startsWith('professional-'))return 'practice';
    if(toolsPages.has(page)||page.startsWith('tools-'))return 'tools';
    return null;
  }

  function upgradeNav(){
    const nav=document.querySelector('.top-simple-nav');
    if(!nav)return;
    nav.dataset.avpUpgrade='1';
    const current=section();
    nav.querySelectorAll('[data-avp-nav]').forEach(a=>{
      const on=a.dataset.avpNav===current;
      a.classList.toggle('is-current',on);
      if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
  }

  function improveImages(){
    let seenHero=false;
    document.querySelectorAll('img').forEach(img=>{
      const inHero=!!img.closest('.avp-hero,.hero,.page-header,.lh-hero,.pyt-hero,.pw-hero');
      if(inHero&&!seenHero){seenHero=true;return;}
      if(!img.hasAttribute('loading'))img.loading='lazy';
      if(!img.hasAttribute('decoding'))img.decoding='async';
    });
  }

  function secureExternalLinks(){
    document.querySelectorAll('a[target="_blank"]').forEach(a=>{
      const rel=new Set((a.getAttribute('rel')||'').split(/\s+/).filter(Boolean));
      rel.add('noopener');rel.add('noreferrer');
      a.setAttribute('rel',[...rel].join(' '));
    });
  }

  function boot(){
    upgradeNav();
    improveImages();
    secureExternalLinks();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();