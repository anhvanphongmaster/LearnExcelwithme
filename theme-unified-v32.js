(function(){
  try { localStorage.setItem("theme", "light"); } catch(e) {}
  document.documentElement.classList.remove("dark-mode");

  function loadCss(href,key){
    if(document.querySelector('link[data-'+key+']'))return;
    var link=document.createElement('link');link.rel='stylesheet';link.href=href;link.setAttribute('data-'+key,'1');document.head.appendChild(link);
  }
  function loadJs(src,key){
    if(document.querySelector('script[data-'+key+']'))return;
    var script=document.createElement('script');script.src=src;script.defer=true;script.setAttribute('data-'+key,'1');document.head.appendChild(script);
  }

  var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  loadCss('module-themes-v2.css?v=20260913-mod3','avp-module-themes-v2');

  if(page==='admin.html'){
    loadCss('admin-ui-v2.css?v=20260913-adminui3','avp-admin-ui-v2');
    loadCss('admin-ui-v2-final.css?v=20260914-adminfinal4','avp-admin-ui-v2-final');
    loadJs('admin-groups-v1.js?v=20260914-g2','avp-admin-groups-v1');
    document.querySelectorAll('link[href*="personal-dashboard.css"],link[href*="cloud-sync-v11.css"]').forEach(function(x){x.disabled=true;x.media='not all';});
  }else if(page!=='auth.html'){
    loadCss('site-upgrade-v1.css?v=20260914-site2','avp-site-upgrade-v1');
    loadJs('site-upgrade-v1.js?v=20260914-site4','avp-site-upgrade-v1');
  }

  function forceLight(){
    document.body && document.body.classList.remove("dark-mode");
    document.querySelectorAll("#themeToggle, .top-theme-button").forEach(function(b){b.style.display="none";b.hidden=true;});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",forceLight);else forceLight();
})();