/*! home-revive-v106.js — homepage-only lightweight effects */
(function(){
  "use strict";
  if(window.__homeReviveV106)return;
  window.__homeReviveV106=true;

  function boot(){
    document.body.classList.add("home-v106-ready");

    const selectors=[
      ".learn-wrap",
      ".home-path",
      ".home-books-grid",
      ".home-reference",
      ".learn-board",
      ".course-card",
      ".home-path-card",
      ".home-more-card",
      ".home-cta-card"
    ];

    const nodes=[...document.querySelectorAll(selectors.join(","))];
    if(!nodes.length)return;

    const reduced=window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if(reduced || !("IntersectionObserver" in window)){
      nodes.forEach(n=>n.classList.add("home-v106-reveal","home-v106-in"));
      return;
    }

    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        entry.target.classList.add("home-v106-in");
        io.unobserve(entry.target);
      });
    },{threshold:.06,rootMargin:"0px 0px -4% 0px"});

    nodes.forEach(n=>{
      n.classList.add("home-v106-reveal");
      io.observe(n);
    });
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else{
    boot();
  }
})();