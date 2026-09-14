/* AVP Admin Chat Loader V3 — universal entry + lazy core. */
(function(){
  'use strict';
  if(window.__AVP_CHAT_LOADER_V3__) return;
  window.__AVP_CHAT_LOADER_V3__=true;

  var loading=false, loaded=false, openPending=false;

  function css(){
    if(document.querySelector('link[data-avp-chat-v3-css]')) return;
    var l=document.createElement('link');
    l.rel='stylesheet';
    l.href='admin-chat.css?v=20260915-chatv3';
    l.dataset.avpChatV3Css='1';
    (document.head||document.documentElement).appendChild(l);
  }

  function bubble(){
    if(document.getElementById('avpChatBubble')) return document.getElementById('avpChatBubble');
    if(!document.body) return null;
    var root=document.createElement('div');
    root.id='avpChatV3Root';
    root.className='avp-guest-mode';
    root.innerHTML='<button class="avp-chat-bubble" id="avpChatBubble" type="button" aria-label="Chat với Admin" title="Chat với Admin">💬</button>';
    document.body.appendChild(root);
    var b=root.querySelector('#avpChatBubble');
    b.addEventListener('click',function(e){
      e.preventDefault(); e.stopPropagation(); loadCore(true);
    });
    return b;
  }

  function openBubble(){
    var tries=0;
    (function tick(){
      var b=document.getElementById('avpChatBubble');
      if(b){try{b.click()}catch(_){ } return;}
      if(++tries<60) setTimeout(tick,80);
    })();
  }

  function loadCore(open){
    if(open) openPending=true;
    if(window.__AVP_ADMIN_CHAT_LOADED__){
      if(openPending){openPending=false;openBubble();}
      return;
    }
    if(loading) return;
    loading=true;
    var s=document.querySelector('script[data-avp-chat-v3-core]');
    if(!s){
      s=document.createElement('script');
      s.src='admin-chat-core-v1.js?v=20260915-chatv3';
      s.dataset.avpChatV3Core='1';
      s.onload=function(){
        loaded=true; loading=false;
        document.getElementById('avpChatV3Root')?.remove();
        if(openPending){openPending=false;openBubble();}
      };
      s.onerror=function(){loading=false;};
      (document.head||document.documentElement).appendChild(s);
    }
  }

  function boot(){
    css();
    bubble();
    if(window.__AVP_ADMIN_CHAT_LOADED__) return;
  }

  window.addEventListener('avp:surface-open',function(e){
    if(e.detail?.surface==='chat') loadCore(true);
  });
  document.addEventListener('click',function(e){
    if(e.target?.closest?.('[data-edge-action="chat"]')) loadCore(true);
  },true);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
