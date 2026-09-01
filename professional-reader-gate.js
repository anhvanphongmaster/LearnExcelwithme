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

    const {data:{session}}=await sb.auth.getSession();
    if(!session?.user){
      location.replace("auth.html?next=sales-handbook.html");
      return;
    }

    try{
      const admin=await sb.rpc("is_admin_user");
      if(!admin.error && admin.data===true){ allow(); return; }
    }catch(_){}

    try{
      const {data,error}=await sb.rpc("professional_track_access_status_v1");
      if(error) throw error;
      if(data?.status==="approved" && data?.can_access===true){ allow(); return; }
      deny(data?.status||"locked");
    }catch(e){
      console.warn("[Professional reader gate]",e);
      deny("locked");
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();