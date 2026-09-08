(() => {
  "use strict";
  const $ = id => document.getElementById(id);

  async function getClient(){
    for(let i=0;i<40;i++){
      const sb=window.avpSupabase||window.supabaseClient||null;
      if(sb?.rpc)return sb;
      await new Promise(r=>setTimeout(r,100));
    }
    return null;
  }
  function allow(){
    if($("ptGate")) $("ptGate").hidden=true;
    if($("ptProtectedContent")) $("ptProtectedContent").hidden=false;
  }
  function deny(reason){
    location.replace(`professional-access.html?reason=${encodeURIComponent(reason||"locked")}`);
  }

  async function boot(){
    const sb=await getClient();
    if(!sb){ deny("connection"); return; }

    const resolver=window.AVPProfessionalAccess;
    if(!resolver?.resolve){ deny("connection"); return; }

    const access=await resolver.resolve({client:sb});
    if(!access.authenticated){
      location.replace("auth.html?next=sales-handbook.html");
      return;
    }

    if(access.canAccess===true){ allow(); return; }

    if(!access.ok){
      console.warn("[Professional reader gate]",access.error||access.reason);
      deny(access.reason||"connection");
      return;
    }

    deny(access.learnerData?.status||access.reason||"locked");
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();