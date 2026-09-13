(()=>{
'use strict';
if(window.__AVP_SITE_CACHE_V1__)return;
window.__AVP_SITE_CACHE_V1__=1;
const STORE='avp_site_state_cache_v1';
function read(){try{return JSON.parse(localStorage.getItem(STORE)||'null')}catch(_){return null}}
function write(result){try{localStorage.setItem(STORE,JSON.stringify({at:Date.now(),result:result}))}catch(_){}}
function ttl(result){const d=result&&result.data;const r=Array.isArray(d)?d[0]:d;return r&&r.enabled?15000:90000}
function wrap(client){
 if(!client||typeof client.rpc!=='function'||client.__avpSiteCacheV1)return false;
 const raw=client.rpc.bind(client);client.__avpSiteCacheV1=true;
 client.rpc=function(name,args){
  if(name!=='site_maintenance_public_v83')return raw(name,args);
  const hit=read();
  if(hit&&(document.visibilityState==='hidden'||Date.now()-hit.at<ttl(hit.result)))return Promise.resolve(hit.result);
  return Promise.resolve(raw(name,args)).then(result=>{if(result&&!result.error)write(result);return result});
 };
 return true;
}
(async()=>{for(let i=0;i<120;i++){const a=window.avpSupabase||window.supabaseClient;if(a){wrap(a);return}await new Promise(r=>setTimeout(r,100))}})();
})();