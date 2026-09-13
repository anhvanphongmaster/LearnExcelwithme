(()=>{
  'use strict';
  if(window.__AVP_ADMIN_GRADER_LAZY_V1__)return;
  window.__AVP_ADMIN_GRADER_LAZY_V1__=true;
  let loaded=false,loading=false;
  function loadCore(){
    if(loaded||loading)return;
    loading=true;
    const s=document.createElement('script');
    s.src='admin-grader-core-v1.js?v=20260913-lazy1';
    s.defer=true;
    s.onload=()=>{
      loaded=true;loading=false;
      setTimeout(()=>window.dispatchEvent(new CustomEvent('avp:admin-grader-open')),0);
    };
    s.onerror=()=>{loading=false;console.error('[admin grader] không tải được core')};
    document.head.appendChild(s);
  }
  window.addEventListener('avp:admin-grader-open',()=>{if(!loaded)loadCore()});
})();