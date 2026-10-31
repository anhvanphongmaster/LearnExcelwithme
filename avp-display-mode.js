/* AVP RESPONSIVE LAYOUT NORMALIZER
   No Mobile/Desktop switch. The browser viewport and each page's breakpoints
   determine the layout automatically. Legacy saved display modes are ignored.
*/
(function(){
 "use strict";
 function normalize(){
  const root=document.documentElement;
  root.classList.remove("avp-layout-mobile","avp-layout-desktop");
  delete root.dataset.avpDisplayMode;
  try{localStorage.removeItem("avp-display-mode")}catch(_){}
  const viewport=document.querySelector('meta[name="viewport"]');
  if(viewport)viewport.setAttribute("content","width=device-width, initial-scale=1, viewport-fit=cover");
 }
 normalize();
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",normalize,{once:true});
})();
