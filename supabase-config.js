window.AVP_SUPABASE_CONFIG = {
  url: "https://itnnbyhlpfredaqyhlpr.supabase.co",
  publishableKey: "sb_publishable_MiK_gkzfQUwPn3_-TYZESg_FxuWYTV5"
};

(function(){
  if(typeof document==='undefined')return;
  var page=(location.pathname.split('/').pop()||'').toLowerCase();
  var items=[];

  /* Admin Chat is a site-wide entry point on every normal page. */
  if(page==='admin.html'){
    items.push(['admin-chat.js?v=20260914-lazy1','avp-admin-chat']);
    items.push(['admin-alerts.js?v=20260914-push2','avp-admin-alerts']);
  }else{
    /* V3 uses a unique loader flag so stale V1/V2 service-worker code cannot suppress it. */
    items.push(['admin-chat-v3.js?v=20260915-v3','avp-admin-chat-v3']);
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
