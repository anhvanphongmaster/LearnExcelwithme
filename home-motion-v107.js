/*! home-motion-v107.js — homepage visual effects only */
(function(){
  "use strict";
  if(window.__avpHomeV107)return;
  window.__avpHomeV107=true;

  function boot(){
    const reduce=window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const selectors=[
      ".home-path",
      ".home-path-card",
      ".home-more-card",
      ".home-cta-card",
      ".course-card",
      ".home-reference",
      ".home-reference-inner",
      ".learn-board",
      "#homeEarnedBadges"
    ];

    const nodes=[...new Set(
      selectors.flatMap(sel=>[...document.querySelectorAll(sel)])
    )];

    if(reduce || !("IntersectionObserver" in window)){
      nodes.forEach(el=>el.classList.add("home-v107-reveal","home-v107-in"));
    }else{
      const io=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(!entry.isIntersecting)return;
          entry.target.classList.add("home-v107-in");
          io.unobserve(entry.target);
        });
      },{threshold:.06,rootMargin:"0px 0px -3% 0px"});

      nodes.forEach(el=>{
        el.classList.add("home-v107-reveal");
        io.observe(el);
      });
    }

    document.addEventListener("pointerdown",e=>{
      const el=e.target.closest("a,button,.home-path-card,.course-card");
      if(!el || reduce)return;
      el.classList.remove("home-v107-press");
      void el.offsetWidth;
      el.classList.add("home-v107-press");
      clearTimeout(el.__homeV107Press);
      el.__homeV107Press=setTimeout(()=>el.classList.remove("home-v107-press"),180);
    },{passive:true});
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else{
    boot();
  }
})();