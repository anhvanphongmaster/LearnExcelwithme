(()=>{
  'use strict';

  if(window.__AVP_TOOL_DIRECT_DOWNLOAD_V1__) return;
  window.__AVP_TOOL_DIRECT_DOWNLOAD_V1__=true;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  async function client(){
    if(window.AVPAccess?.client){
      const sb=await window.AVPAccess.client();
      if(sb?.auth)return sb;
    }
    for(let i=0;i<40;i++){
      const sb=window.avpSupabase||window.supabaseClient||window._supabaseClient;
      if(sb?.auth)return sb;
      await sleep(100);
    }
    return null;
  }

  function nextPage(){
    return (location.pathname.split('/').pop()||'tools-library.html')+location.search+location.hash;
  }

  function goLogin(){
    if(window.AVPAccess?.goLogin){
      window.AVPAccess.goLogin(nextPage());
      return;
    }
    location.href='auth.html?next='+encodeURIComponent(nextPage());
  }

  async function showError(message){
    if(window.AVPModal?.alert){
      try{await window.AVPModal.alert({title:'Chưa tải được Tool',message});return}catch(_){ }
    }
    alert(message);
  }

  async function download(toolId,button){
    const sb=await client();
    if(!sb){
      await showError('Không kết nối được hệ thống tải Tool. Hãy thử lại.');
      return;
    }

    let session=null;
    try{
      const {data}=await sb.auth.getSession();
      session=data?.session||null;
      if(!session?.access_token){
        try{
          const refreshed=await sb.auth.refreshSession();
          session=refreshed?.data?.session||null;
        }catch(_){ }
      }
    }catch(_){ }

    if(!session?.access_token){
      goLogin();
      return;
    }

    const cfg=window.AVP_SUPABASE_CONFIG||{};
    if(!cfg.url||!cfg.publishableKey){
      await showError('Thiếu cấu hình tải Tool.');
      return;
    }

    const oldText=button?.textContent||'';
    if(button){button.disabled=true;button.textContent='Đang tải…';}

    try{
      const res=await fetch(`${cfg.url}/functions/v1/tool-download`,{
        method:'POST',
        headers:{
          Authorization:`Bearer ${session.access_token}`,
          apikey:cfg.publishableKey,
          'Content-Type':'application/json'
        },
        body:JSON.stringify({tool_id:toolId})
      });

      if(res.status===401){
        goLogin();
        return;
      }

      let payload={};
      try{payload=await res.json()}catch(_){ }
      if(!res.ok||!payload?.download_url) throw new Error(payload?.error||`download_${res.status}`);

      const a=document.createElement('a');
      a.href=payload.download_url;
      a.rel='noopener';
      a.style.display='none';
      document.body.appendChild(a);
      a.click();
      a.remove();

      if(window.AVPModal?.toast){
        try{window.AVPModal.toast('Đang tải Tool · mật khẩu giải nén: anhvanphongmaster')}catch(_){ }
      }
    }catch(err){
      console.error('tool direct download failed',err);
      await showError('Phiên đăng nhập vẫn còn nhưng file chưa tải được. Hãy thử lại sau vài giây.');
    }finally{
      if(button){button.disabled=false;button.textContent=oldText||'Tải Tool ↓';}
    }
  }

  document.addEventListener('click',e=>{
    const button=e.target?.closest?.('[data-tool-download]');
    if(!button)return;

    // Override the legacy TikTok/password modal flow: guests go to login;
    // authenticated users receive the file immediately.
    e.preventDefault();
    e.stopImmediatePropagation();
    download(String(button.dataset.toolDownload||''),button);
  },true);
})();
