/*! avp-site-motion.js — V97 desktop-light motion */
(function(){
  "use strict";
  if(window.__avpSiteMotionV97)return;
  window.__avpSiteMotionV97=true;
  window.__avpSiteMotionV96=true;
  window.__avpSiteMotionV95=true;
  window.__avpSiteMotionV94=true;
  window.__avpSiteMotionV93=true;
  window.__avpSiteMotion=true;

  const root=document.documentElement;
  const desktop=!!(window.matchMedia&&window.matchMedia("(min-width:901px)").matches);
  const reduce=!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const RISE_SEL=[
    ".course-card",".course-box",".practice-file-card",".summary-card",".level-card",
    ".continue-card",".home-path-card",".home-more-card",".home-cta-card",
    ".dash-panel",".pq-lesson",".course-panel",".path-item",".learn-board",
    ".pv-panel",".badge-card",".lab-card",".tool-card",".qc-card",
    ".ref-card",".sm-node",".sm-zone",".fr-session-card",".achievement-card",
    ".feature-card",".content-card",".grid-card","article.card",".card",
    ".table-box",".table-container",".search-box",".pivot-box",".step",
    ".shortcut-section",".learning-progress",".stat-card",".home-module-card",
    ".home-showcase-card",".lesson-card",".skill-card",".module-card",".project-card",
    ".topic-card",".case-card",".info-card",".kpi-card",".download-card",".formula-card",
    ".quiz-card",".arena-card",".home-book-card",".tool-panel",".info-box",".action-box"
  ].join(",");

  function setupReveal(){
    const nodes=[].slice.call(document.querySelectorAll(RISE_SEL));
    if(!nodes.length)return;

    nodes.forEach(function(node){
      node.classList.add("avp-motion-rise");
      node.dataset.avpMotionReady="1";
    });

    if(!desktop||reduce||!("IntersectionObserver" in window)){
      nodes.forEach(function(node){node.classList.add("avp-in");});
      return;
    }

    nodes.forEach(function(node){node.classList.add("avp-motion-ready");});
    const io=new IntersectionObserver(function(entries,observer){
      entries.forEach(function(entry){
        if(!entry.isIntersecting)return;
        entry.target.classList.add("avp-in");
        observer.unobserve(entry.target);
      });
    },{rootMargin:"0px 0px -5% 0px",threshold:.04});
    nodes.forEach(function(node){io.observe(node);});
  }

  function setupParallax(){
    if(!desktop||reduce)return;
    const hero=document.querySelector(".avp-hero,.pv-hero,.pw-hero,.pyt-hero,.ph-direct-hero,.ml-hero,.pq-hero,.dashboard-hero");
    if(!hero)return;

    let ticking=false;
    function paint(){
      ticking=false;
      const rect=hero.getBoundingClientRect();
      if(rect.bottom<0||rect.top>window.innerHeight)return;
      const offset=Math.max(-8,Math.min(8,-rect.top*.015));
      root.style.setProperty("--avp-parallax-y",offset.toFixed(2)+"px");
    }
    function onScroll(){
      if(ticking)return;
      ticking=true;
      requestAnimationFrame(paint);
    }
    paint();
    window.addEventListener("scroll",onScroll,{passive:true});
  }

  function bindAnchors(){
    document.querySelectorAll("a[href^='#']").forEach(function(a){
      if(a.dataset.avpSmoothBound==="1")return;
      a.dataset.avpSmoothBound="1";
      a.addEventListener("click",function(e){
        const id=(a.getAttribute("href")||"").slice(1);
        if(!id)return;
        const target=document.getElementById(id);
        if(!target)return;
        e.preventDefault();
        target.scrollIntoView({behavior:desktop&&!reduce?"smooth":"auto",block:"start"});
        history.replaceState(null,"","#"+id);
      });
    });
  }

  function boot(){
    root.classList.add("avp-motion-enabled","avp-performance-stable");
    setupReveal();
    setupParallax();
    bindAnchors();
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();