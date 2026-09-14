/*! AVP UI System V1 — accessible, queued dialogs shared by learner + Admin. */
(function(w,d){
  'use strict';
  if(w.__AVP_UI_SYSTEM__)return;
  w.__AVP_UI_SYSTEM__=true;

  (function stripHomeLegacyTheme(){
    var page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    if(page!==''&&page!=='index.html')return;
    d.documentElement.classList.add('avp-site-upgrade','avp-site-home');
    d.querySelectorAll('link[href*="theme-polish-v33.css"]').forEach(function(link){link.remove();});
  })();
