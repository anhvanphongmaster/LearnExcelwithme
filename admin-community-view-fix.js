(() => {
  "use strict";

  const COMMUNITY = "community";

  function setView(view){
    document.querySelectorAll("[data-admin-view]").forEach(btn=>{
      const active=btn.getAttribute("data-admin-view")===view;
      btn.classList.toggle("active",active);
      btn.setAttribute("aria-selected",active?"true":"false");
    });

    document.querySelectorAll(".admin-view-section[data-admin-section]").forEach(section=>{
      section.hidden=section.getAttribute("data-admin-section")!==view;
    });

    try{
      sessionStorage.setItem("avp-admin-view",view);
    }catch{}
  }

  function bindCommunityTab(){
    const btn=document.querySelector('[data-admin-view="community"]');
    if(!btn || btn.dataset.communityViewFixed==="1") return;
    btn.dataset.communityViewFixed="1";

    // Capture phase + stopImmediatePropagation prevents older admin view code
    // from treating the new view as unknown and falling back to overview.
    btn.addEventListener("click",e=>{
      e.preventDefault();
      e.stopImmediatePropagation();
      setView(COMMUNITY);

      const host=document.getElementById("avpAdminCommunityHost");
      host?.scrollIntoView?.({behavior:"smooth",block:"start"});
    },true);
  }

  function restoreCommunityView(){
    try{
      if(sessionStorage.getItem("avp-admin-view")===COMMUNITY){
        setView(COMMUNITY);
      }
    }catch{}
  }

  function init(){
    bindCommunityTab();
    restoreCommunityView();

    // Admin modules may redraw/bind tabs after load. Re-check briefly.
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      bindCommunityTab();
      if(tries>=40) clearInterval(timer);
    },250);
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",init,{once:true});
  }else{
    init();
  }
})();