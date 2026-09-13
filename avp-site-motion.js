/*! avp-site-motion.js — V99 stable desktop motion */
(function(){
  "use strict";
  if(window.__avpSiteMotionV99)return;
  window.__avpSiteMotionV99=true;
  window.__avpSiteMotion=true;

  const RISE_SEL=[
    ".course-card",".course-box",".practice-file-card",".summary-card",".level-card",
    ".continue-card",".home-path-card",".home-more-card",".home-cta-card",
    ".dash-panel",".pq-lesson",".course-panel",".path-item",".learn-board",
    ".pv-panel",".badge-card",".lab-card",".tool-card",".qc-card",
    ".ref-card",".sm-node",".sm-zone",".fr-session-card",".achievement-card",
    ".feature-card",".content-card",".grid-card","article.card",".card",
    ".table-box",".table-container",".search-box",".pivot-box",".step"
  ].join(",");

  function mark(){
    document.documentElement.classList.add("avp-motion-enabled","avp-performance-stable");
    document.querySelectorAll(RISE_SEL).forEach(node=>{
      node.classList.add("avp-motion-rise","avp-in");
      node.dataset.avpMotionReady="1";
    });
  }

  function bindAnchors(){
    document.querySelectorAll("a[href^='#']").forEach(a=>{
      if(a.dataset.avpSmoothBound==="1")return;
      a.dataset.avpSmoothBound="1";
      a.addEventListener("click",e=>{
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

  function boot(){mark();bindAnchors();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();
