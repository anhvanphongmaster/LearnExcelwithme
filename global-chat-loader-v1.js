/* AVP Global Chat Loader V1 — make the existing Admin Chat available on every normal page. */
(function(){
  'use strict';
  if(window.__AVP_GLOBAL_CHAT_LOADER_V1__) return;
  window.__AVP_GLOBAL_CHAT_LOADER_V1__=true;

  function load(){
    if(window.__AVP_ADMIN_CHAT_LOADED__) return;
    if(document.querySelector('script[data-avp-admin-chat-core]')) return;
    var s=document.createElement('script');
    s.src='admin-chat-core-v1.js?v=20260914-chatglobal1';
    s.defer=true;
    s.dataset.avpAdminChatCore='1';
    s.onerror=function(){console.warn('[AVP chat] Không tải được admin-chat-core-v1.js');};
    (document.head||document.documentElement).appendChild(s);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',load,{once:true});
  else load();
})();
