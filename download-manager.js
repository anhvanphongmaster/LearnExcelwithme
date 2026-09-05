(()=>{
  "use strict";
  const STATE={client:null,map:new Map(),loaded:false,loading:null};
  const norm=(v)=>{
    try{
      const u=new URL(String(v||"").trim(),location.href);
      let p=u.pathname.replace(/^\/+/,"");
      const marker="downloads/";
      p=decodeURIComponent(p).replace(/(^|\/)downloads\s+\//,"$1downloads/");
      const start=p.indexOf(marker);
      const key=start>=0?p.slice(start).replace(/^(?:downloads\/video-practice\/){2,}/,"downloads/video-practice/"):"";
      if (/(?:^|\/)(?:02_)?PowerQuery-11-Files\.zip$/.test(p)) return "downloads/video-practice/PowerQuery-11-Files.zip";
      return key;
    }catch(e){return String(v||"").replace(/^\.\//,"");}
  };
  const getClient=()=>window.avpSupabase||window.supabaseClient||window._supabaseClient||window.supabase?.client||null;
  function toast(msg){
    let el=document.getElementById("avpDownloadToast");
    if(!el){el=document.createElement("div");el.id="avpDownloadToast";Object.assign(el.style,{position:"fixed",left:"50%",bottom:"24px",transform:"translateX(-50%)",zIndex:"2147483647",background:"#163e2a",color:"#fff",padding:"10px 14px",borderRadius:"12px",font:"700 13px system-ui",boxShadow:"0 8px 28px rgba(0,0,0,.2)",opacity:"0",transition:"opacity .18s"});document.body.appendChild(el)}
    el.textContent=msg;el.style.opacity="1";clearTimeout(el._t);el._t=setTimeout(()=>el.style.opacity="0",1800);
  }
  async function waitClient(){for(let i=0;i<50;i++){const c=getClient();if(c?.rpc)return c;await new Promise(r=>setTimeout(r,120))}return null}
  async function load(){
    if(STATE.loaded)return STATE.map;if(STATE.loading)return STATE.loading;
    STATE.loading=(async()=>{
      const c=await waitClient();if(!c)return STATE.map;STATE.client=c;
      let timer;
      try{const {data,error}=await Promise.race([c.rpc("get_download_assets_public"),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error("Download catalogue timeout")),8000)})]);if(error)throw error;(data||[]).forEach(r=>{const key=norm(r.source_path);if(key)STATE.map.set(key,r)});STATE.loaded=true;scan()}catch(e){console.warn("download manager fallback",e)}finally{clearTimeout(timer)}
      return STATE.map;
    })();return STATE.loading;
  }
  function apply(a){
    // TikTok owns its auth + download action and resolves the map on click.
    if(a?.matches?.('a.pv-download'))return;
    if(!a||a.dataset.avpDownloadBound==="1")return;

    /* TikTok Practice dùng file tĩnh trong repo.
       Không rewrite sang URL backend để tránh link hết hạn / sai mapping. */
    if(a.dataset.avpPracticeDownload==="1")return;

    const key=norm(a.getAttribute("href"));if(!key||!key.startsWith("downloads/"))return;
    a.dataset.avpDownloadBound="1";a.dataset.avpDownloadKey=key;
    const row=STATE.map.get(key);
    if(row){
      if(row.is_active===false){a.dataset.avpDownloadHidden="1";a.setAttribute("aria-disabled","true");a.title="Tài nguyên đang tạm ẩn"}
      else if(row.file_url){a.href=row.file_url;}
    }
    a.addEventListener("click",async e=>{
      const current=STATE.map.get(key);
      if(current?.is_active===false){e.preventDefault();e.stopPropagation();toast("Tài nguyên này đang tạm ẩn");return}
      try{STATE.client?.rpc?.("track_download_asset",{p_source_path:key});}catch(err){}
    },true);
  }
  function scan(root=document){root.querySelectorAll?.('a[href*="downloads/"]').forEach(apply)}
  function observe(){new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.('a[href*="downloads/"]'))apply(n);scan(n)}}))).observe(document.documentElement,{childList:true,subtree:true})}
  window.AVPDownloadAssets = {
    async resolve(sourcePath, fallbackURL) {
      await load();
      const key = norm(sourcePath);
      const row = key ? STATE.map.get(key) : null;
      if (row?.is_active === false) throw new Error("Tài nguyên này đang tạm ẩn.");
      return { href: row?.file_url || fallbackURL, key, managed: !!row?.file_url };
    },
    track(key) {
      if (!key || !STATE.client?.rpc) return;
      try { Promise.resolve(STATE.client.rpc("track_download_asset", {p_source_path:key})).catch(()=>{}); } catch (_) {}
    }
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{scan();observe();load()},{once:true});else{scan();observe();load()}
})();
