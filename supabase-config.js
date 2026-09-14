window.AVP_SUPABASE_CONFIG = {
  url: "https://itnnbyhlpfredaqyhlpr.supabase.co",
  publishableKey: "sb_publishable_MiK_gkzfQUwPn3_-TYZESg_FxuWYTV5"
};

(function(){
  if(typeof document==='undefined')return;
  var page=(location.pathname.split('/').pop()||'').toLowerCase();
  var items=[];

  /*
   * Normal pages use ONE global chat loader only.
   * The old admin-chat.js loader mounted a separate lazy chat layer and
   * could race/overlap with the global Admin Chat runtime.
   */
  if(page==='admin.html'){
    items.push(['admin-chat.js?v=20260914-lazy1','avp-admin-chat']);
    items.push(['admin-alerts.js?v=20260914-push2','avp-admin-alerts']);
  }else{
    items.push(['global-chat-loader-v1.js?v=20260914-chatglobal1','avp-global-chat-loader']);
  }

  items.forEach(function(item){
    if(document.querySelector('script[data-'+item[1]+']'))return;
    var s=document.createElement('script');
    s.src=item[0];
    s.async=false;
    s.setAttribute('data-'+item[1],'1');
    document.head.appendChild(s);
  });
})();