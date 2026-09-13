/* AVP Chat Loader V1 — keep Admin/logged-in notifications, defer heavy guest runtime. */
(function(){
  'use strict';
  if(window.__AVP_CHAT_LOADER_V1__)return;
  window.__AVP_CHAT_LOADER_V1__=1;
  var loading=false,loaded=false,openAfterLoad=false;
  var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();

  function removeLite(){document.getElementById('avpChatLazyRoot')?.remove();}
  function openRealChat(){
    var tries=0;
    (function tick(){
      var b=document.getElementById('avpChatBubble');
      if(b){try{b.click()}catch(_){ }return;}
      if(++tries<30)setTimeout(tick,80);
    })();
  }
  function loadCore(open){
    if(open)openAfterLoad=true;
    if(loaded){if(openAfterLoad){openAfterLoad=false;openRealChat()}return;}
    if(loading)return;
    loading=true;removeLite();
    var s=document.createElement('script');
    s.src='admin-chat-core-v1.js?v=20260914-chatcore1';
    s.defer=true;s.dataset.avpChatCore='1';
    s.onload=function(){loading=false;loaded=true;if(openAfterLoad){openAfterLoad=false;openRealChat()}};
    s.onerror=function(){loading=false};
    document.head.appendChild(s);
  }
  function mountGuestLite(){
    if(document.getElementById('avpChatLazyRoot')||document.getElementById('avpAdminChatRoot'))return;
    var root=document.createElement('div');
    root.id='avpChatLazyRoot';root.className='avp-guest-mode';
    root.innerHTML='<button class="avp-chat-bubble" id="avpChatBubble" type="button" aria-label="Chat với Admin" title="Chat với Admin">💬</button>';
    document.body.appendChild(root);
    root.querySelector('#avpChatBubble')?.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();loadCore(true)});
  }
  async function waitClient(){
    for(var i=0;i<80;i++){
      var c=window.avpSupabase||window.supabaseClient;
      if(c?.auth)return c;
      if(window.AVP_SUPABASE_CONFIGURED===false)return null;
      await new Promise(function(r){setTimeout(r,75)});
    }
    return window.avpSupabase||window.supabaseClient||null;
  }
  async function boot(){
    if(page==='admin.html'){loadCore(false);return;}
    var c=await waitClient();
    var user=null;
    try{var res=await c?.auth?.getSession?.();user=res?.data?.session?.user||null}catch(_){ }
    if(user){
      var run=function(){loadCore(false)};
      if('requestIdleCallback' in window)requestIdleCallback(run,{timeout:2200});else setTimeout(run,1200);
    }else mountGuestLite();
  }
  window.addEventListener('avp:surface-open',function(e){if(e.detail?.surface==='chat')loadCore(true)});
  document.addEventListener('click',function(e){if(e.target?.closest?.('[data-edge-action="chat"]'))loadCore(true)},true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
