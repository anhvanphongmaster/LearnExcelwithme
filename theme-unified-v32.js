(function(){
  // Giao diện tối đã tắt — luôn light mode
  try { localStorage.setItem("theme", "light"); } catch(e) {}
  document.documentElement.classList.remove("dark-mode");

  function loadCss(href,key){
    if(document.querySelector('link[data-'+key+']'))return;
    var link=document.createElement('link');
    link.rel='stylesheet';
    link.href=href;
    link.setAttribute('data-'+key,'1');
    document.head.appendChild(link);
  }
  loadCss('module-themes-v2.css?v=20260913-mod3','avp-module-themes-v2');
  if((location.pathname.split('/').pop()||'').toLowerCase()==='admin.html'){
    loadCss('admin-ui-v2.css?v=20260913-adminui3','avp-admin-ui-v2');
    loadCss('admin-ui-v2-final.css?v=20260913-adminfinal2','avp-admin-ui-v2-final');
  }

  function forceLight(){
    document.body && document.body.classList.remove("dark-mode");
    document.querySelectorAll("#themeToggle, .top-theme-button").forEach(function(b){
      b.style.display = "none";
      b.hidden = true;
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", forceLight);
  } else {
    forceLight();
  }
})();
