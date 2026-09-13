(()=>{
'use strict';
if(window.__AVP_RPC_DEDUPE_V1__)return;
window.__AVP_RPC_DEDUPE_V1__=1;
const active=new Map();
const memory=new Map();
const READS=new Set([
 'list_learning_leaderboard','is_admin_user','avp_is_admin','avp_chat_is_admin',
 'avp_chat_get_or_create_thread','avp_chat_my_unread_count'
]);
const WRITES=new Set(['upsert_learning_leaderboard']);
const SESSION_TTL={
 'is_admin_user':120000,
 'avp_is_admin':120000,
 'avp_chat_is_admin':120000,
 'avp_chat_get_or_create_thread':600000,
 'avp_chat_my_unread_count':5000,
 'list_learning_leaderboard':10000
};
function argsKey(args){try{return JSON.stringify(args||{})}catch(_){return ''}}
function key(name,args){return name+'|'+argsKey(args)}
function memTtl(name){return SESSION_TTL[name]||1800}
function sessionKey(name,args){
 const uid=String(window.__AVP_AUTH_USER_ID__||'guest');
 return 'avp_rpc_cache_v2:'+uid+':'+name+':'+argsKey(args);
}
function readSession(name,args){
 const ttl=SESSION_TTL[name];if(!ttl)return null;
 try{
  const row=JSON.parse(sessionStorage.getItem(sessionKey(name,args))||'null');
  if(!row||Date.now()-Number(row.at||0)>=ttl)return null;
  return row.result||null;
 }catch(_){return null}
}
function writeSession(name,args,result){
 if(!SESSION_TTL[name])return;
 try{sessionStorage.setItem(sessionKey(name,args),JSON.stringify({at:Date.now(),result}))}catch(_){ }
}
function wrap(client){
 if(!client||typeof client.rpc!=='function'||client.__avpRpcDedupeV1)return false;
 const raw=client.rpc.bind(client);client.__avpRpcDedupeV1=true;
 client.rpc=function(name,args){
  const tracked=READS.has(name)||WRITES.has(name);
  if(!tracked)return raw(name,args);
  const k=key(name,args),t=Date.now(),hit=memory.get(k);
  if(hit&&t-hit.at<(WRITES.has(name)?2500:memTtl(name)))return Promise.resolve(hit.result);
  if(READS.has(name)){
   const stored=readSession(name,args);
   if(stored){memory.set(k,{at:t,result:stored});return Promise.resolve(stored)}
  }
  if(active.has(k))return active.get(k);
  const p=Promise.resolve(raw(name,args)).then(result=>{
    if(result&&!result.error){
      memory.set(k,{at:Date.now(),result});
      if(READS.has(name))writeSession(name,args,result);
    }
    return result;
  }).finally(()=>active.delete(k));
  active.set(k,p);return p;
 };
 return true;
}
(async()=>{for(let i=0;i<120;i++){const a=window.avpSupabase||window.supabaseClient;if(a){wrap(a);return}await new Promise(r=>setTimeout(r,100))}})();
})();