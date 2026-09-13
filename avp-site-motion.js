/*! avp-site-motion.js — V95 performance-safe motion */
(function(){
  "use strict";
  if(window.__avpSiteMotionV95)return;
  window.__avpSiteMotionV95=true;
  window.__avpSiteMotionV94=true;
  window.__avpSiteMotionV93=true;
  window.__avpSiteMotion=true;

  const RISE_SEL=[
    ".course-card",".practice-file-card",".summary-card",".level-card",
    ".continue-card",".home-path-card",".home-more-card",".home-cta-card",
    ".dash-panel",".pq-lesson",".course-panel",".path-item",".learn-board",
    ".pv-panel",".badge-card",".lab-card",".tool-card",".qc-card",
    ".ref-card",".sm-node",".sm-zone",".fr-session-card",".achievement-card",
    ".feature-card",".content-card",".grid-card","article.card",".card"
  ].join(",");

  function reveal(){
    document.documentElement.classList.add("avp-motion-enabled","avp-performance-stable");
    document.querySelectorAll(RISE_SEL).forEach(function(node){
      node.classList.add("avp-motion-rise","avp-in");
      node.dataset.avpMotionReady="1";
    });
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
        target.scrollIntoView({behavior:"auto",block:"start"});
        history.replaceState(null,"","#"+id);
      });
    });
  }

  function boot(){
    reveal();
    bindAnchors();
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();
