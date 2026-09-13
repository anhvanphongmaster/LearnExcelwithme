(()=>{
  'use strict';
  const LAST='avp_knowledge_last_v2';
  const FIRST='f01-excel-workspace';
  const fallback=`knowledge.html?lesson=${FIRST}`;

  function target(){
    try{
      const last=localStorage.getItem(LAST);
      return last?`knowledge.html?lesson=${encodeURIComponent(last)}`:fallback;
    }catch(_){return fallback}
  }

  function apply(){
    const href=target();
    document.querySelectorAll('a[data-avp-nav="learn"]').forEach(a=>a.href=href);
    document.querySelectorAll('[data-avp-learning-entry]').forEach(a=>a.href=href);

    document.querySelectorAll('a[href="skill-map.html"],a[href="./skill-map.html"]').forEach(a=>{
      if(a.closest('.kv-reader-menu,.lp-page'))return;
      if(a.dataset.keepLearningCatalog==='1')return;
      a.href=href;
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
  window.AVPLearningEntry={target,apply};
})();
