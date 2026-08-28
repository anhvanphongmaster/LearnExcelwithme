(() => {
  "use strict";

  const $ = id => document.getElementById(id);

  function hideOldAdminViews(){
    document.querySelectorAll(".admin-view-section").forEach(el=>{
      el.hidden=true;
    });

    document.querySelectorAll("[data-admin-view]").forEach(btn=>{
      btn.classList.remove("active");
      btn.setAttribute("aria-selected","false");
    });
  }

  function openCommunity(){
    hideOldAdminViews();

    const btn=$("adminCommunityTab");
    const heading=$("adminCommunityHeading");
    const host=$("avpAdminCommunityHost");

    btn?.classList.add("active");
    btn?.setAttribute("aria-selected","true");

    if(heading) heading.hidden=false;
    if(host) host.hidden=false;

    try{ sessionStorage.setItem("avp-admin-custom-view","community"); }catch{}

    setTimeout(()=>{
      heading?.scrollIntoView?.({behavior:"smooth",block:"start"});
    },30);
  }

  function closeCommunityForOldView(){
    const btn=$("adminCommunityTab");
    const heading=$("adminCommunityHeading");
    const host=$("avpAdminCommunityHost");

    btn?.classList.remove("active");
    btn?.setAttribute("aria-selected","false");
    if(heading) heading.hidden=true;
    if(host) host.hidden=true;

    try{ sessionStorage.removeItem("avp-admin-custom-view"); }catch{}
  }

  function bind(){
    const community=$("adminCommunityTab");
    if(community && community.dataset.v4Bound!=="1"){
      community.dataset.v4Bound="1";
      community.onclick=e=>{
        e.preventDefault();
        e.stopPropagation();
        openCommunity();
      };
    }

    // When any original Admin tab is selected, close the independent Community page.
    document.querySelectorAll("[data-admin-view]").forEach(btn=>{
      if(btn.dataset.communityCloseBound==="1")return;
      btn.dataset.communityCloseBound="1";
      btn.addEventListener("click",()=>closeCommunityForOldView(),true);
    });
  }

  function ensureHealthCard(){
    const card=document.querySelector('[data-health="community"]');
    if(!card)return;

    // community-center.js will set a more precise status when RPCs are available.
    const strong=card.querySelector("strong");
    const small=card.querySelector("small");

    if(strong && /Đang kiểm tra/i.test(strong.textContent||"")){
      strong.textContent="Đã cài";
    }
    if(small && !(small.textContent||"").trim()){
      small.textContent="Thông báo & chứng nhận";
    }
  }

  function init(){
    bind();
    ensureHealthCard();

    try{
      if(sessionStorage.getItem("avp-admin-custom-view")==="community"){
        openCommunity();
      }
    }catch{}

    // admin.js can finish binding/redrawing after DOMContentLoaded.
    let n=0;
    const t=setInterval(()=>{
      n++;
      bind();
      ensureHealthCard();

      if($("adminCommunityTab")?.classList.contains("active")){
        const heading=$("adminCommunityHeading");
        const host=$("avpAdminCommunityHost");
        if(heading)heading.hidden=false;
        if(host)host.hidden=false;
      }

      if(n>=60)clearInterval(t);
    },250);
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",init,{once:true});
  }else{
    init();
  }
})();