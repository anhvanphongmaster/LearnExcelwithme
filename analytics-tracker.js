(() => {
  const VISITOR_KEY = "avpAnalyticsVisitorId";
  const MAX_WAIT = 3500;

  function getVisitorId(){
    let id=localStorage.getItem(VISITOR_KEY);
    if(id) return id;

    try{
      id=crypto.randomUUID();
    }catch{
      id=`v_${Date.now()}_${Math.random().toString(36).slice(2,12)}`;
    }

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

      if(
        typeof value==="string" ||
        typeof value==="number" ||
        typeof value==="boolean" ||
        value===null
      ){
        allowed[key]=typeof value==="string" ? value.slice(0, key==='message'?500:120) : value;
      }
    }
    return allowed;
  }

  async function track(eventName, options={}){
    try{
      const client=await getClient();
      if(!client) return false;

      const payload={
        p_event_name:cleanText(eventName,64),
        p_page:cleanText(options.page || currentPage(),180),
        p_tool_name:cleanText(options.tool_name,80),
        p_visitor_id:getVisitorId(),
        p_metadata:safeMetadata(options.metadata)
      };

      const {error}=await client.rpc("track_analytics_event",payload);

      if(error){
        /*
          Do not break the website if analytics SQL is not installed yet.
        */
        console.debug("Analytics unavailable:",error.message);
        return false;
      }

      return true;
    }catch(error){
      console.debug("Analytics tracking failed:",error);
      return false;
    }
  }

  window.avpAnalytics={
    track,
    visitorId:getVisitorId()
  };

  // Track important user clicks across the whole site.
  // Practice-video has its own tracking, so skip those classes to avoid double counts.
  document.addEventListener("click", function(e){
    const link=e.target.closest?.("a[href]");
    if(!link) return;
    const href=String(link.getAttribute("href")||"");
    const label=cleanText(link.getAttribute("download") || link.textContent || href,80);

    if((link.hasAttribute("download") || /(^|\/)downloads\//i.test(href)) && !link.classList.contains("pv-download")){
      track("file_download_click",{page:currentPage(),tool_name:label,metadata:{href:href.slice(0,120)}});
      return;
    }

    if(link.classList.contains("pv-tiktok")) return;
    if(link.classList.contains("pyt-yt") || /(?:youtube\.com|youtu\.be|tiktok\.com)/i.test(href)){
      // Book cards already emit book_click themselves.
      if(link.classList.contains("home-book-card")) return;
      track("video_click",{page:currentPage(),tool_name:label,metadata:{href:href.slice(0,120)}});
    }
  },true);

  async function start(){
    const page=currentPage();

    track("page_view",{page});

    if(page==="excel-mobile.html"){
      track("excel_mobile_open",{page});
    }

    const client=await getClient();
    if(!client?.auth?.onAuthStateChange) return;

    // Professional Track: ghi nhận tối đa 1 ngày hoạt động cho mỗi tài khoản/ngày.
    // RPC tự chống trùng; không thay đổi analytics hiện tại.
    try{
      const {data:{session}}=await client.auth.getSession();
      if(session?.user) client.rpc("professional_track_mark_activity_v1").catch(()=>{});
    }catch(_){}

    client.auth.onAuthStateChange((event,session)=>{
      if(event!=="SIGNED_IN" || !session?.user) return;

      const tokenKey=`avp_login_tracked_${session.user.id}`;
      const now=Date.now();
      const last=Number(sessionStorage.getItem(tokenKey)||0);

      /*
        Prevent duplicate SIGNED_IN events in the same page lifecycle.
      */
      if(now-last < 5000) return;
      sessionStorage.setItem(tokenKey,String(now));

      track("login",{
        page,
        metadata:{provider:session.user.app_metadata?.provider || "email"}
      });
    });
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",start,{once:true});
  }else{
    start();
  }
})();
