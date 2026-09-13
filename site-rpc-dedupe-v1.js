(()=>{
'use strict';
if(window.__AVP_RPC_DEDUPE_V1__)return;
window.__AVP_RPC_DEDUPE_V1__=1;
const active=new Map();
const memory=new Map();
const READS=new Set(['list_learning_leaderboard','is_admin_user','avp_is_admin']);
const WRITES=new Set(['upsert_learning_leaderboard']);
function key(name,args){let x='';try{x=JSON.stringify(args||{})}catch(_){x=''}return name+'|'+x}
function ttl(name){return (name==='is_admin_user'||name==='avp_is_admin')?30000:1800}
function wrap(client){
 if(!client||typeof client.rpc!=='function'||client.__avpRpcDedupeV1)return false;
 const raw=client.rpc.bind(client);client.__avpRpcDedupeV1=true;
 client.rpc=function(name,args){
  const tracked=READS.has(name)||WRITES.has(name);
  if(!tracked)return raw(name,args);
  const k=key(name,args),t=Date.now(),hit=memory.get(k);
  if(hit&&t-hit.at<(WRITES.has(name)?2500:ttl(name)))return Promise.resolve(hit.result);
  if(active.has(k))return active.get(k);
  const p=Promise.resolve(raw(name,args)).then(result=>{
    if(result&&!result.error)memory.set(k,{at:Date.now(),result});
    return result;
  }).finally(()=>active.delete(k));
  active.set(k,p);return p;
 };
 return true;
}
(async()=>{for(let i=0;i<120;i++){const a=window.avpSupabase||window.supabaseClient;if(a){wrap(a);return}await new Promise(r=>setTimeout(r,100))}})();
})();