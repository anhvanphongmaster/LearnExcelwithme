window.AVP_SUPABASE_CONFIG = {
  url: "https://itnnbyhlpfredaqyhlpr.supabase.co",
  publishableKey: "sb_publishable_MiK_gkzfQUwPn3_-TYZESg_FxuWYTV5"
};

(function(){
  if(typeof document==='undefined')return;
  var page=(location.pathname.split('/').pop()||'').toLowerCase();
  var items=[];

  /*
   * Admin Chat must be available on every normal page.
   * Use the proven lazy loader on normal pages: it mounts the guest bubble
   * after Supabase is ready and opens admin-chat-core on click.
   * admin.html keeps its existing admin chat + push notifications.
   */
  if(page==='admin.html'){
    items.push(['admin-chat.js?v=20260914-lazy1','avp-admin-chat']);
    items.push(['admin-alerts.js?v=20260914-push2','avp-admin-alerts']);
  }else{
    items.push(['admin-chat.js?v=20260915-globalfix1','avp-admin-chat']);
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