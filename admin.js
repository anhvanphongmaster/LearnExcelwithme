(()=>{
  'use strict';
  if(window.__AVP_ADMIN_PERF_GATE_V1__)return;
  window.__AVP_ADMIN_PERF_GATE_V1__=true;

  const READ_CACHE_MS=1800;
  const cache=new Map();
  let manualHealth=false;
  let coreLoaded=false;

  function view(){try{return localStorage.getItem('avp_admin_view_v1')||'overview'}catch(_){return 'overview'}}
  function emptyResult(name){
    if(['admin_analytics_trend','admin_analytics_top_tools','admin_analytics_top_pages','admin_learning_funnel','admin_top_completed_lessons','admin_quiz_difficulty','admin_new_user_trend','admin_list_saved_feedback','admin_list_user_files'].includes(name))return [];
    return {};
  }
  function isHealthCall(name,args){
    if(manualHealth||view()!=='overview')return false;
    args=args||{};
    return (name==='admin_analytics_summary'&&Number(args.p_days)===1)
      ||(name==='admin_um_list_users'&&Number(args.p_limit)===1)
      ||(name==='admin_vote_summary'&&args.p_period==='today')
      ||name==='admin_tiktok_summary_v1'
      ||name==='admin_download_summary'
      ||name==='avp_chat_admin_threads'
      ||(name==='admin_system_notification_list'&&Number(args.p_limit)===1);
  }
  function shouldDefer(name){
    const v=view();
    if(['admin_analytics_trend','admin_analytics_top_tools','admin_analytics_top_pages','admin_feature_usage_summary'].includes(name))return v!=='analytics';
    if(['admin_learning_funnel','admin_top_completed_lessons','admin_quiz_difficulty','admin_new_user_trend'].includes(name))return v!=='learning';
    if(['admin_engagement_summary_v2','admin_list_saved_feedback','admin_list_user_files'].includes(name))return v!=='engagement';
    return false;
  }
  const CACHEABLE=new Set([
    'admin_analytics_summary','admin_analytics_trend','admin_analytics_top_tools','admin_analytics_top_pages','admin_learning_summary','admin_learning_funnel','admin_top_completed_lessons','admin_quiz_difficulty','admin_new_user_trend','admin_engagement_summary_v2','admin_feature_usage_summary','admin_um_list_users','admin_vote_summary','admin_tiktok_summary_v1','admin_download_summary','avp_chat_admin_threads','admin_system_notification_list','admin_list_saved_feedback','admin_list_user_files'
  ]);

  function resetHealthUi(){
    if(manualHealth)return;
    document.querySelectorAll('#adminHealthGrid [data-health]').forEach(card=>{
      card.classList.remove('ok','warn','bad');
      const strong=card.querySelector('strong'),small=card.querySelector('small');
      if(strong)strong.textContent='Chưa kiểm tra';
      if(small)small.textContent='Bấm “Kiểm tra” khi cần chẩn đoán.';
    });
  }

  function installRpcGate(c){
    if(!c?.rpc||c.__avpAdminPerfWrapped)return;
    const original=c.rpc.bind(c);
    c.__avpAdminPerfWrapped=true;
    c.rpc=function(name,args){
      const a=args||{};
      if(isHealthCall(name,a))return Promise.resolve({data:emptyResult(name),error:null});
      if(shouldDefer(name))return Promise.resolve({data:emptyResult(name),error:null});
      if(!CACHEABLE.has(name))return original(name,args);
      let key='';try{key=name+'|'+JSON.stringify(a)}catch(_){key=name}
      const hit=cache.get(key),now=Date.now();
      if(hit&&now-hit.at<READ_CACHE_MS)return hit.promise;
      const promise=original(name,args);cache.set(key,{at:now,promise});
      setTimeout(()=>{const x=cache.get(key);if(x?.promise===promise)cache.delete(key)},READ_CACHE_MS+80);
      return promise;
    };
  }

  async function waitClient(){
    for(let i=0;i<80;i++){
      const c=window.avpSupabase||window.supabaseClient||null;
      if(c?.rpc){installRpcGate(c);return c}
      await new Promise(r=>setTimeout(r,75));
    }
    return null;
  }

  function bindGuards(){
    document.addEventListener('click',e=>{
      const health=e.target.closest('#adminHealthReload');
      if(health){manualHealth=true;setTimeout(()=>{manualHealth=false},8000);return}
      const tab=e.target.closest('.admin-view-tabs [data-admin-view]');
      if(!tab)return;
      const target=tab.dataset.adminView;
      if(target==='overview')setTimeout(resetHealthUi,180);
      if(target==='learning'||target==='analytics'){
        setTimeout(()=>document.getElementById('adminRefresh')?.click(),120);
      }
    },true);
  }

  async function boot(){
    bindGuards();
    await waitClient();
    const s=document.createElement('script');
    s.src='admin-core-v1.js?v=20260913-perf1';s.defer=true;
    s.onload=()=>{coreLoaded=true;setTimeout(resetHealthUi,350);setTimeout(resetHealthUi,1200)};
    s.onerror=()=>console.error('[Admin] Không tải được admin-core-v1.js');
    document.head.appendChild(s);
  }
  boot();
})();