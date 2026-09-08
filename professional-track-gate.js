
(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  let resolveGate;
  // The content loader shares this verified decision instead of checking the
  // same Admin role again while authentication is still starting up.
  window.AVPProfessionalGateReady=new Promise(resolve=>{resolveGate=resolve});

  async function client(){
    for(let i=0;i<40;i++){
      const sb=window.avpSupabase||window.supabaseClient||null;
      if(sb?.rpc)return sb;
      await new Promise(r=>setTimeout(r,100));
    }
    return null;
  }

  function allow(role,isAdmin=false){
    $("ptGate").hidden=true;
    $("ptProtectedContent").hidden=false;
    if($("ptAccessRole")) $("ptAccessRole").textContent=role;
    resolveGate({allowed:true,isAdmin});
  }

  function deny(reason){
    resolveGate({allowed:false});
    const qs=`?intro=0${reason?`&reason=${encodeURIComponent(reason)}`:""}`;
    location.replace(`professional-access.html${qs}`);
  }

  async function boot(){
    const sb=await client();
    if(!sb){
      deny("connection");
      return;
    }

    const resolver=window.AVPProfessionalAccess;
    if(!resolver?.resolve){
      deny("connection");
      return;
    }

    const access=await resolver.resolve({client:sb});
    if(!access.authenticated){
      resolveGate({allowed:false});
      location.replace(`auth.html?next=${encodeURIComponent(location.pathname.split("/").pop()||"professional-track.html")}`);
      return;
    }

    if(access.isAdmin===true && access.canAccess===true){
      allow("✓ ADMIN ACCESS",true);
      return;
    }

    if(access.ok && access.canAccess===true){
      allow("✓ ĐÃ ĐƯỢC PHÊ DUYỆT");
      return;
    }

    if(!access.ok){
      console.warn("[Professional Track gate]",access.error||access.reason);
      deny(access.reason||"connection");
      return;
    }

    deny(access.learnerData?.status||access.reason||"locked");
  }

  function start(){
    boot().catch(error=>{
      console.warn("[Professional Track gate]",error);
      deny("connection");
    });
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",start,{once:true});
  }else{
    start();
  }
})();
