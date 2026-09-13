window.AVP_SUPABASE_CONFIG = {
  url: "https://itnnbyhlpfredaqyhlpr.supabase.co",
  publishableKey: "sb_publishable_MiK_gkzfQUwPn3_-TYZESg_FxuWYTV5"
};

/* Shared runtime guards load from the same early config entrypoint used across
   the site. They wait for avpSupabase, then dedupe auth/RPC/maintenance reads
   before feature modules begin their normal work. */
(function(){
  if(typeof document==='undefined')return;
  var items=[
    ['site-auth-cache-v1.js?v=20260914-auth2','avp-auth-cache-v1'],
    ['site-rpc-dedupe-v1.js?v=20260914-rpc3','avp-rpc-dedupe-v1'],
    ['site-runtime-cache-v1.js?v=20260914-cache2','avp-site-cache-v1']
  ];
  items.forEach(function(item){
    if(document.querySelector('script[data-'+item[1]+']'))return;
    var s=document.createElement('script');
    s.src=item[0];
    s.async=false;
    s.setAttribute('data-'+item[1],'1');
    document.head.appendChild(s);
  });
})();
