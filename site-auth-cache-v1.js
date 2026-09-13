(()=>{
'use strict';
if(window.__AVP_AUTH_CACHE_V1__)return;
window.__AVP_AUTH_CACHE_V1__=1;
function wrap(client){
 if(!client?.auth||typeof client.auth.getUser!=='function'||client.auth.__avpGetUserCacheV1)return false;
 const raw=client.auth.getUser.bind(client.auth);
 let hit=null,pending=null;
 client.auth.__avpGetUserCacheV1=true;
 client.auth.getUser=function(...args){
  if(args.length)return raw(...args);
  const t=Date.now();
  if(hit&&t-hit.at<20000)return Promise.resolve(hit.result);
  if(pending)return pending;
  pending=Promise.resolve(raw()).then(result=>{
    if(result&&!result.error)hit={at:Date.now(),result};
    return result;
  }).finally(()=>{pending=null});
  return pending;
 };
 try{client.auth.onAuthStateChange(()=>{hit=null;pending=null})}catch(_){ }
 return true;
}
(async()=>{for(let i=0;i<120;i++){const c=window.avpSupabase||window.supabaseClient;if(c){wrap(c);return}await new Promise(r=>setTimeout(r,100))}})();
})();