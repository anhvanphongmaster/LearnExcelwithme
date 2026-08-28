(()=>{
  "use strict";
  const STATE={client:null,map:new Map(),loaded:false,loading:null};
  const norm=(v)=>{
    try{
      const u=new URL(v,location.href);
      let p=u.pathname.replace(/^\/+/,"");
      const marker="downloads/";
      const i=p.indexOf(marker);
      return i>=0?decodeURIComponent(p.slice(i)):"";
    }catch(e){return String(v||"").replace(/^\.\//,"");}
  };
  const getClient=()=>window.supabaseClient||window._supabaseClient||window.supabase?.client||null;
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
      try{const {data,error}=await c.rpc("get_download_assets_public");if(error)throw error;STATE.map.clear();(data||[]).forEach(r=>STATE.map.set(norm(r.source_path),r));STATE.loaded=true;scan()}catch(e){console.warn("download manager fallback",e)}
      return STATE.map;
    })();return STATE.loading;
  }
  function apply(a){
    if(!a)return;
    // Luôn giữ key gốc để có thể resolve lại sau khi catalog Supabase tải xong.
    let key=a.dataset.avpDownloadKey||norm(a.getAttribute("href"));
    if(!key||!key.startsWith("downloads/"))return;
    a.dataset.avpDownloadKey=key;

    const row=STATE.map.get(key);
    if(row){
      if(row.is_active===false){
        a.dataset.avpDownloadHidden="1";
        a.setAttribute("aria-disabled","true");
        a.title="Tài nguyên đang tạm ẩn";
      }else{
        delete a.dataset.avpDownloadHidden;
        a.removeAttribute("aria-disabled");
        if(row.file_url){
          a.href=row.file_url;
          // download= trên URL cross-origin có thể khiến trình duyệt xử lý như file local cũ.
          a.removeAttribute("download");
          a.dataset.avpResolvedUrl=row.file_url;
        }
      }
    }

    // Listener chỉ bind một lần, nhưng URL có thể resolve lại nhiều lần.
    if(a.dataset.avpDownloadBound!=="1"){
      a.dataset.avpDownloadBound="1";
      a.addEventListener("click",async e=>{
        const k=a.dataset.avpDownloadKey||key;
        const current=STATE.map.get(k);
        if(current?.is_active===false){
          e.preventDefault();e.stopPropagation();toast("Tài nguyên này đang tạm ẩn");return;
        }
        if(current?.file_url && a.href!==current.file_url){
          a.href=current.file_url;
          a.removeAttribute("download");
        }
        try{STATE.client?.rpc?.("track_download_asset",{p_source_path:k});}catch(err){}
      },true);
    }
  }
  function scan(root=document){root.querySelectorAll?.('a[href*="downloads/"]').forEach(apply)}
  function observe(){new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.('a[href*="downloads/"]'))apply(n);scan(n)}}))).observe(document.documentElement,{childList:true,subtree:true})}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{scan();observe();load()},{once:true});else{scan();observe();load()}
})();
