(() => {
  const BOOT_PAGE=(location.pathname.split("/").filter(Boolean).pop() || "index.html").toLowerCase();
  if(new Set(["auth.html","admin.html","offline.html"]).has(BOOT_PAGE)) return;

  function loadRuntime(src,key){
    if(document.querySelector('script[data-'+key+']'))return;
    const s=document.createElement('script');
    s.src=src;s.defer=true;s.setAttribute('data-'+key,'1');document.head.appendChild(s);
  }
  function loadStyle(href,key){
    if(document.querySelector('link[data-'+key+']'))return;
    const l=document.createElement('link');
    l.rel='stylesheet';l.href=href;l.setAttribute('data-'+key,'1');document.head.appendChild(l);
  }

  loadStyle('site-upgrade-v1.css?v=20260914-site2','avp-site-upgrade-v1');
  loadRuntime('site-upgrade-v1.js?v=20260914-site4','avp-site-upgrade-v1');
  loadRuntime('site-runtime-cache-v1.js?v=20260914-cache2','avp-site-cache-v1');
  loadRuntime('site-rpc-dedupe-v1.js?v=20260914-rpc6','avp-rpc-dedupe-v1');
  loadRuntime('site-auth-cache-v1.js?v=20260914-auth3','avp-auth-cache-v1');

  const VISITOR_KEY = "avpAnalyticsVisitorId";
  const MAX_WAIT = 3500;
  const RPC_TIMEOUT = 5000;
  const PAGE_VIEW_TTL = 30*60*1000;
  const LOGIN_TRACK_TTL = 30*60*1000;
  const recentEvents=new Map();
  let lastAuthUserId=null;

  function getVisitorId(){
    let id=localStorage.getItem(VISITOR_KEY);
    if(id) return id;
    try{id=crypto.randomUUID();}
    catch{id=`v_${Date.now()}_${Math.random().toString(36).slice(2,12)}`;}
    localStorage.setItem(VISITOR_KEY,id);
    return id;
  }

  function currentPage(){
    const pathname=location.pathname || "";
    const name=pathname.split("/").filter(Boolean).pop();
    return name || "index.html";
  }

  async function getClient(){
    const start=Date.now();
    while(Date.now()-start < MAX_WAIT){
      if(window.avpSupabase) return window.avpSupabase;
      if(window.AVP_SUPABASE_CONFIGURED === false) return null;
      await new Promise(resolve=>setTimeout(resolve,80));
    }
    return window.avpSupabase || null;
  }

  function cleanText(value,max=80){
    const text=String(value ?? "").trim();
    return text ? text.slice(0,max) : null;
  }

  function safeMetadata(metadata){
    if(!metadata || typeof metadata!=="object") return {};
    const allowed={};
    for(const [key,value] of Object.entries(metadata)){
      if(!/^[a-zA-Z0-9_.-]{1,40}$/.test(key)) continue;
      if(typeof value==="string" || typeof value==="number" || typeof value==="boolean" || value===null){
        allowed[key]=typeof value==="string" ? value.slice(0,key==='message'?500:120) : value;
      }
    }
    return allowed;
  }

  function recentlyTracked(signature,ttl=1500){
    const now=Date.now();
    const last=Number(recentEvents.get(signature)||0);
    if(now-last<ttl) return true;
    recentEvents.set(signature,now);
    if(recentEvents.size>80){
      for(const [key,at] of recentEvents){if(now-at>60000) recentEvents.delete(key);}
    }
    return false;
  }

  function shouldTrackPageView(page){
    try{
      const key=`avp_page_view_${page}`;
      const now=Date.now();
      const last=Number(sessionStorage.getItem(key)||0);
      if(now-last<PAGE_VIEW_TTL) return false;
      sessionStorage.setItem(key,String(now));
    }catch(_){ }
    return true;
  }

  async function track(eventName, options={}){
    try{
      const signature=[eventName,options.page||currentPage(),options.tool_name||""].join("|");
      if(recentlyTracked(signature)) return false;
      const client=await getClient();
      if(!client) return false;
      const payload={
        p_event_name:cleanText(eventName,64),
        p_page:cleanText(options.page || currentPage(),180),
        p_tool_name:cleanText(options.tool_name,80),
        p_visitor_id:getVisitorId(),
        p_metadata:safeMetadata(options.metadata)
      };
      let timer;
      const {error}=await Promise.race([
        client.rpc("track_analytics_event",payload),
        new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error("ANALYTICS_TIMEOUT")),RPC_TIMEOUT);})
      ]).finally(()=>clearTimeout(timer));
      if(error){console.debug("Analytics unavailable:",error.message);return false;}
      return true;
    }catch(error){console.debug("Analytics tracking failed:",error);return false;}
  }

  window.avpAnalytics={track,visitorId:getVisitorId()};

  document.addEventListener("click", function(e){
    const link=e.target.closest?.("a[href]");
    if(!link) return;
    const href=String(link.getAttribute("href")||"");
    const label=cleanText(link.getAttribute("download") || link.textContent || href,80);
    if((link.hasAttribute("download") || /(^|\/)downloads\//i.test(href)) && !link.classList.contains("pv-download")){
      track("file_download_click",{page:currentPage(),tool_name:label,metadata:{href:href.slice(0,120)}});return;
    }
    if(link.classList.contains("pv-tiktok")) return;
    if(link.classList.contains("pyt-yt") || /(?:youtube\.com|youtu\.be|tiktok\.com)/i.test(href)){
      if(link.classList.contains("home-book-card")) return;
      track("video_click",{page:currentPage(),tool_name:label,metadata:{href:href.slice(0,120)}});
    }
  },true);

  async function start(){
    const page=currentPage();
    if(shouldTrackPageView(page)) track("page_view",{page});
    if(page==="excel-mobile.html") track("excel_mobile_open",{page});

    const client=await getClient();
    if(!client?.auth?.onAuthStateChange) return;

    if(page.includes("professional")){
      try{
        const {data:{session}}=await client.auth.getSession();
        if(session?.user){
          const day=new Date().toISOString().slice(0,10);
          const activityKey=`avp_professional_activity_${session.user.id}_${day}`;
          if(localStorage.getItem(activityKey)!=="1"){
            client.rpc("professional_track_mark_activity_v1")
              .then(({error})=>{if(!error)localStorage.setItem(activityKey,"1")})
              .catch(()=>{});
          }
        }
      }catch(_){}
    }

    client.auth.onAuthStateChange((event,session)=>{
      if(event==="SIGNED_OUT"){
        if(lastAuthUserId){
          try{sessionStorage.removeItem(`avp_login_tracked_${lastAuthUserId}`)}catch(_){ }
        }
        lastAuthUserId=null;
        return;
      }
      if(event!=="SIGNED_IN" || !session?.user) return;
      lastAuthUserId=String(session.user.id);
      const tokenKey=`avp_login_tracked_${lastAuthUserId}`;
      const now=Date.now();
      let last=0;
      try{last=Number(sessionStorage.getItem(tokenKey)||0)}catch(_){ }
      if(now-last < LOGIN_TRACK_TTL) return;
      try{sessionStorage.setItem(tokenKey,String(now))}catch(_){ }
      track("login",{page,metadata:{provider:session.user.app_metadata?.provider || "email"}});
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();