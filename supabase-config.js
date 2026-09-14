window.AVP_SUPABASE_CONFIG = {
  url: "https://itnnbyhlpfredaqyhlpr.supabase.co",
  publishableKey: "sb_publishable_MiK_gkzfQUwPn3_-TYZESg_FxuWYTV5"
};

(function(){
  if(typeof document==='undefined')return;
  var items=[
    ['admin-chat.js?v=20260914-lazy1','avp-admin-chat']
  ];
  var page=(location.pathname.split('/').pop()||'').toLowerCase();
  if(page==='admin.html'){
    items.push(['admin-alerts.js?v=20260914-push2','avp-admin-alerts']);
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
