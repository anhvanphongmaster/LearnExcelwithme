
(() => {
  "use strict";
  const $=id=>document.getElementById(id);

  async function client(){
    for(let i=0;i<40;i++){
      const sb=window.avpSupabase||window.supabaseClient||null;
      if(sb?.rpc)return sb;
      await new Promise(r=>setTimeout(r,100));
    }
    return null;
  }

  let gateResolved=false;
  let resolveGate;
  window.AVPProfessionalGateReady=new Promise(resolve=>{resolveGate=resolve});

  function publishGate(state){
    if(gateResolved)return;
    gateResolved=true;
    window.AVPProfessionalGateState=state;
    resolveGate?.(state);
  }

  function allow(role,isAdmin=false){
    $("ptGate").hidden=true;
    $("ptProtectedContent").hidden=false;
    if($("ptAccessRole")) $("ptAccessRole").textContent=role;
    publishGate({allowed:true,isAdmin:Boolean(isAdmin),role});
  }

  function deny(reason){
    publishGate({allowed:false,isAdmin:false,reason:reason||"locked"});
    const qs=`?intro=0${reason?`&reason=${encodeURIComponent(reason)}`:""}`;
    location.replace(`professional-access.html${qs}`);
  }

  async function boot(){
    const sb=await client();
    if(!sb){
      deny("connection");
      return;
    }

    const {data:{session}}=await sb.auth.getSession();
    if(!session?.user){
      location.replace(`auth.html?next=${encodeURIComponent(location.pathname.split("/").pop()||"professional-track.html")}`);
      return;
    }

    // Admin always bypasses learner requirements.
    try{
      const adminRes=await sb.rpc("is_admin_user");
      if(!adminRes.error && adminRes.data===true){
        allow("✓ ADMIN ACCESS",true);
        return;
      }
    }catch(_){}

    // Normal learner: only approved + can_access=true.
    try{
      const {data,error}=await sb.rpc("professional_track_access_status_v1");
      if(error) throw error;

      if(data?.status==="approved" && data?.can_access===true){
        allow("✓ ĐÃ ĐƯỢC PHÊ DUYỆT",false);
        return;
      }

      deny(data?.status||"locked");
    }catch(e){
      console.warn("[Professional Track gate]",e);
      deny("locked");
    }
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else{
    boot();
  }
})();
