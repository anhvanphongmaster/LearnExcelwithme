/*! avp-site-motion.js — V94 parallax + zoom, skip patched/fragile pages */
(function(){
  "use strict";
  if(window.__avpSiteMotionV94)return;
  window.__avpSiteMotionV94=true;
  window.__avpSiteMotionV93=true;
  window.__avpSiteMotion=true;

  const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const inIframe=window.self!==window.top;
  const reduce=!!(
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const SKIP_HEAVY=/^(admin\.html|admin-|auth\.html|certificate\.html|practice-grader\.html|playground\.html)/.test(page)
    || inIframe
    || document.documentElement.hasAttribute("data-avp-no-motion");

  const RISE_SEL=[
    ".course-card",".practice-file-card",".summary-card",".level-card",
    ".continue-card",".home-path-card",".home-more-card",".home-cta-card",
    ".dash-panel",".pq-lesson",".course-panel",".path-item",".learn-board",
    ".pv-panel",".badge-card",".lab-card",".tool-card",".qc-card",
    ".ref-card",".sm-node",".sm-zone",".fr-session-card",".achievement-card",
    ".feature-card",".content-card",".grid-card","article.card",".card"
  ].join(",");

  const PRESS_SEL=[
    "a[href]","button","[role='button']",
    "input[type='button']","input[type='submit']"
  ].join(",");

  const HERO_SEL=".avp-hero,.pv-hero,.ml-hero,.pq-hero,.dashboard-hero";

  const ZOOM_CARD_SEL=[
    ".home-path-card",".home-more-card",".home-cta-card",
    ".course-card",".level-card",".tool-card",".lab-card",
    ".feature-card",".content-card",".summary-card",
    ".practice-file-card",".home-book-card"
  ].join(",");

  function setupRise(){
    const nodes=document.querySelectorAll(RISE_SEL);
    if(!nodes.length)return;

    if(reduce || !("IntersectionObserver" in window)){
      nodes.forEach(n=>n.classList.add("avp-motion-rise","avp-in"));
      return;
    }

    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        entry.target.classList.add("avp-in");
        io.unobserve(entry.target);
      });
    },{threshold:.06,rootMargin:"0px 0px -3% 0px"});

    nodes.forEach((node,index)=>{
      if(node.dataset.avpMotionReady==="1")return;
      node.dataset.avpMotionReady="1";
      node.classList.add("avp-motion-rise");
      node.style.setProperty("--avp-rise-delay",
        Math.min(index*.018,.10)+"s");
      io.observe(node);
    });
  }

  function press(target){
    if(reduce || !target)return;
    target.classList.remove("avp-pressing");
    void target.offsetWidth;
    target.classList.add("avp-pressing");
    clearTimeout(target.__avpPressTimer);
    target.__avpPressTimer=setTimeout(()=>{
      target.classList.remove("avp-pressing");
    },180);
  }

  function setupPress(){
    if(document.documentElement.dataset.avpPressBound==="1")return;
    document.documentElement.dataset.avpPressBound="1";

    document.addEventListener("pointerdown",e=>{
      const target=e.target.closest(PRESS_SEL);
      if(!target)return;
      press(target);
    },{passive:true});
  }

  function setupAnchorScroll(){
    document.querySelectorAll("a[href^='#']").forEach(a=>{
      if(a.dataset.avpSmoothBound==="1")return;
      a.dataset.avpSmoothBound="1";

      a.addEventListener("click",e=>{
        const id=(a.getAttribute("href")||"").slice(1);
        if(!id)return;
        const target=document.getElementById(id);
        if(!target)return;
        e.preventDefault();
        target.scrollIntoView({
          behavior:reduce?"auto":"smooth",
          block:"start"
        });
        history.replaceState(null,"","#"+id);
      });
    });
  }

  function setupParallax(){
    if(reduce || SKIP_HEAVY)return;
    if(document.documentElement.dataset.avpPxBound==="1")return;
    document.documentElement.dataset.avpPxBound="1";

    document.querySelectorAll(HERO_SEL).forEach(hero=>{
      if(hero.querySelector(":scope > .avp-depth-bg"))return;
      const bg=document.createElement("div");
      bg.className="avp-depth-bg";
      bg.setAttribute("aria-hidden","true");
      hero.insertBefore(bg,hero.firstChild);
    });

    let ticking=false;
    function apply(){
      const y=window.pageYOffset||document.documentElement.scrollTop||0;
      document.documentElement.style.setProperty("--avp-y",y.toFixed(1));
      ticking=false;
    }
    function onScroll(){
      if(ticking)return;
      ticking=true;
      requestAnimationFrame(apply);
    }
    window.addEventListener("scroll",onScroll,{passive:true});
    apply();
  }

  function isInternalHref(href){
    if(!href)return false;
    if(href.charAt(0)==="#")return false;
    if(/^(mailto:|tel:|javascript:)/i.test(href))return false;
    if(/\.(xlsx|xls|xlsm|zip|pdf|png|jpe?g|webp|gif|mp4|webm)(\?|#|$)/i.test(href))return false;
    try{
      const url=new URL(href,location.href);
      if(url.origin!==location.origin)return false;
      const dest=(url.pathname.split("/").pop()||"").toLowerCase();
      if(/^(admin\.html|auth\.html|certificate\.html)/.test(dest))return false;
      return url.href.split("#")[0]!==location.href.split("#")[0];
    }catch(e){
      return false;
    }
  }

  function setupZoomNav(){
    if(reduce || SKIP_HEAVY)return;
    if(document.documentElement.dataset.avpZoomBound==="1")return;
    document.documentElement.dataset.avpZoomBound="1";

    document.addEventListener("click",function(e){
      if(e.defaultPrevented)return;
      if(e.button!==0)return;
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;

      /* Practice Hub đã có zoom riêng — không chồng */
      if(e.target.closest(".ph-switch,[data-practice-branch],#phSourceBack"))return;
      if(e.target.closest("form,input,textarea,select,iframe,.avp-edge-launcher,#avpEdgeMenu"))return;

      const link=e.target.closest("a[href]");
      if(!link)return;
      if(link.target && link.target!=="_self")return;
      if(link.hasAttribute("download"))return;
      if(!isInternalHref(link.getAttribute("href")))return;

      const card=link.closest(ZOOM_CARD_SEL);
      if(!card)return;

      const grid=card.parentElement;
      if(grid){
        grid.classList.add("avp-zoom-grid","avp-zoom-choosing");
        card.classList.add("avp-zoom-picked");
      }

      e.preventDefault();
      document.documentElement.classList.add("avp-leaving");
      const href=link.href;
      setTimeout(function(){
        location.href=href;
      },360);
    },true);
  }

  function boot(){
    document.documentElement.classList.add("avp-motion-enabled");
    try{
      if(document.referrer){
        const ref=new URL(document.referrer);
        if(ref.origin===location.origin){
          document.documentElement.classList.add("avp-arriving");
          setTimeout(function(){
            document.documentElement.classList.remove("avp-arriving");
          },520);
        }
      }
    }catch(e){}
    setupRise();
    setupPress();
    setupAnchorScroll();
    setupParallax();
    setupZoomNav();

    setTimeout(setupRise,350);
    setTimeout(setupRise,900);
    setTimeout(setupRise,1800);
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else{
    boot();
  }
})();
