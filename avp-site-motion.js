/*! avp-site-motion.js — V93 smooth global interactions */
(function(){
  "use strict";
  if(window.__avpSiteMotionV93)return;
  window.__avpSiteMotionV93=true;

  const reduce=!!(
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

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

  function boot(){
    document.documentElement.classList.add("avp-motion-enabled");
    setupRise();
    setupPress();
    setupAnchorScroll();

    // Re-scan dynamic UI without intercepting navigation.
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