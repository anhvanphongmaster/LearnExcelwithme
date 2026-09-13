/*! AVP Home Motion Loader V109 — load current shared shell before preserved Home core */
(function(){
  'use strict';
  if(window.__AVP_HOME_MOTION_LOADER_V109__)return;
  window.__AVP_HOME_MOTION_LOADER_V109__=1;

  function loadCss(){
    if(document.querySelector('link[data-avp-home-ui-owner-v1]'))return;
    var link=document.createElement('link');
    link.rel='stylesheet';
    link.href='home-ui-owner-v1.css?v=20260914-owner2';
    link.dataset.avpHomeUiOwnerV1='1';
    document.head.appendChild(link);
  }

  function loadCore(){
    if(document.querySelector('script[data-avp-home-motion-core]'))return;
    var s=document.createElement('script');
    s.src='home-page-motion-core-v108.js?v=20260914-core1';
    s.defer=true;
    s.dataset.avpHomeMotionCore='1';
    document.head.appendChild(s);
  }

  function loadShellThenCore(){
    loadCss();
    if(window.__AVP_SITE_UPGRADE_V1__){loadCore();return;}
    var existing=document.querySelector('script[data-avp-site-upgrade-v1]');
    if(existing){
      if(window.__AVP_SITE_UPGRADE_V1__){loadCore();return;}
      existing.addEventListener('load',loadCore,{once:true});
      setTimeout(loadCore,1800);
      return;
    }
    var s=document.createElement('script');
    s.src='site-upgrade-v1.js?v=20260914-site4';
    s.defer=true;
    s.dataset.avpSiteUpgradeV1='1';
    s.onload=loadCore;
    s.onerror=loadCore;
    document.head.appendChild(s);
  }

  loadShellThenCore();
})();
