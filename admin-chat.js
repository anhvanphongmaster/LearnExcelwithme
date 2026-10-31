/* AVP Chat Loader V2 — render the Chat Admin entry immediately on every normal page. */
(function(){
  'use strict';
  if(window.__AVP_CHAT_LOADER_V1__)return;
  window.__AVP_CHAT_LOADER_V1__=1;

  // Chat CSS must not depend on the Supabase auth module.
  if(!document.querySelector('link[data-avp-admin-chat-css]')){
    var css=document.createElement('link');
    css.rel='stylesheet';
    css.href='admin-chat.css?v=20260915-chatcss2';
    css.dataset.avpAdminChatCss='1';
    document.head.appendChild(css);
  }

  var loading=false,loaded=!!window.__AVP_ADMIN_CHAT_LOADED__,openAfterLoad=false;
  var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();

  // Avoid leaving the temporary bubble in the DOM after the full chat has mounted.
  function syncCoreState(){
    if(window.__AVP_ADMIN_CHAT_LOADED__){loaded=true;}
  }

  function removeLite(){document.getElementById('avpChatLazyRoot')?.remove();}
  function openRealChat(){
    var tries=0;
    (function tick(){
      // Script evaluation is not the same as chat UI readiness. The core sets
      // __AVP_ADMIN_CHAT_LOADED__ before Supabase/session restoration finishes.
      // Wait until the real user/guest panel exists; otherwise the open event
      // is lost and the first tap appears to do nothing.
      var panel=document.getElementById('avpChatPanel')||document.getElementById('avpAdminFloatPanel')||document.getElementById('avpGuestChatPanel');
      if(panel){
        removeLite();
        // Open the panel directly as a fallback; the core event listener may
        // not yet be attached on unusually slow devices.
        panel.hidden=false;
        window.dispatchEvent(new CustomEvent('avp:admin-chat-open'));
        return;
      }
      if(++tries<450){setTimeout(tick,100);return;}
      console.warn('[AVP Chat] UI chưa sẵn sàng sau khi tải core.');
    })();
  }
  function loadCore(open){
    if(open)openAfterLoad=true;
    if(loaded){if(openAfterLoad){openAfterLoad=false;openRealChat()}return;}
    if(loading)return;
    loading=true;
    var s=document.createElement('script');
    s.src='admin-chat-core-v1.js?v=20261031-chat-boot-retry3';
    s.async=true;s.dataset.avpChatCore='1';
    s.onload=function(){
      loading=false;
      // Script download is not initialization. Keep the open request pending
      // while the core waits for Supabase and mounts the role-specific panel.
      if(openAfterLoad){openAfterLoad=false;openRealChat();}
      if(window.__AVP_ADMIN_CHAT_BOOTING__){
        var checks=0;
        (function sync(){
          loaded=!!window.__AVP_ADMIN_CHAT_LOADED__;
          if(loaded)return;
          if(window.__AVP_ADMIN_CHAT_BOOTING__&&checks++<320){setTimeout(sync,100);return;}
        })();
      }else loaded=!!window.__AVP_ADMIN_CHAT_LOADED__;
    };
    s.onerror=function(){loading=false;openAfterLoad=false;console.error('[AVP Chat] Không tải được admin-chat-core-v1.js');};
    document.head.appendChild(s);
  }
  // Public entry point used by the robot menu.
  window.AVPAdminChatOpen=function(){loadCore(true);};
  window.addEventListener('avp:admin-chat-request-open',function(){loadCore(true);});

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

    // The entry point must not depend on Supabase/auth/module loading.
    mountGuestLite();

    var c=await waitClient();
    var user=null;
    try{var res=await c?.auth?.getSession?.();user=res?.data?.session?.user||null}catch(_){ }
    if(user){
      var run=function(){loadCore(false)};
      if('requestIdleCallback' in window)requestIdleCallback(run,{timeout:2200});else setTimeout(run,1200);
    }
  }
  window.addEventListener('avp:surface-open',function(e){if(e.detail?.surface==='chat'&&e.detail?.source!=='bubble'){syncCoreState();if(loaded)window.dispatchEvent(new CustomEvent('avp:admin-chat-open'));else loadCore(true)}});
  document.addEventListener('click',function(e){if(e.target?.closest?.('[data-edge-action="chat"]'))loadCore(true)},true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
