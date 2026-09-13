(()=>{
'use strict';
if(window.__AVP_RPC_DEDUPE_V1__)return;
window.__AVP_RPC_DEDUPE_V1__=1;

const active=new Map();
const memory=new Map();
const READS=new Set([
 'list_learning_leaderboard','is_admin_user','avp_is_admin','avp_chat_is_admin',
 'avp_chat_get_or_create_thread','avp_chat_my_unread_count',
 'notification_unread_count','site_maintenance_public_v83','site_review_status_v2'
]);
const WRITES=new Set(['upsert_learning_leaderboard']);
const SESSION_TTL={
 'is_admin_user':120000,
 'avp_is_admin':120000,
 'avp_chat_is_admin':120000,
 'avp_chat_get_or_create_thread':600000,
 'avp_chat_my_unread_count':5000,
 'notification_unread_count':10000,
 'site_maintenance_public_v83':90000,
 'site_review_status_v2':1800000,
 'list_learning_leaderboard':10000
};
const INVALIDATE_AFTER_WRITE={
 'upsert_learning_leaderboard':['list_learning_leaderboard']
};

function argsKey(args){try{return JSON.stringify(args||{})}catch(_){return ''}}
function key(name,args){return name+'|'+argsKey(args)}
function memTtl(name){return SESSION_TTL[name]||1800}
function sessionKey(name,args){
 const uid=String(window.__AVP_AUTH_USER_ID__||'guest');
 return 'avp_rpc_cache_v2:'+uid+':'+name+':'+argsKey(args);
}
function readSession(name,args){
 const ttl=SESSION_TTL[name];if(!ttl)return {hit:false,result:null};
 try{
  const row=JSON.parse(sessionStorage.getItem(sessionKey(name,args))||'null');
  if(!row||Date.now()-Number(row.at||0)>=ttl)return {hit:false,result:null};
  if(!Object.prototype.hasOwnProperty.call(row,'result'))return {hit:false,result:null};
  return {hit:true,result:row.result};
 }catch(_){return {hit:false,result:null}}
}
function writeSession(name,args,result){
 if(!SESSION_TTL[name])return;
 try{sessionStorage.setItem(sessionKey(name,args),JSON.stringify({at:Date.now(),result}))}catch(_){ }
}
function clearRead(name){
 const prefix=name+'|';
 for(const k of memory.keys())if(k.startsWith(prefix))memory.delete(k);
 try{
  const marker=':'+name+':';
  for(let i=sessionStorage.length-1;i>=0;i--){
   const k=sessionStorage.key(i);
   if(k&&k.startsWith('avp_rpc_cache_v2:')&&k.includes(marker))sessionStorage.removeItem(k);
  }
 }catch(_){ }
}
function invalidateAfterWrite(name){
 const targets=INVALIDATE_AFTER_WRITE[name]||[];
 targets.forEach(clearRead);
}
function wrap(client){
 if(!client||typeof client.rpc!=='function'||client.__avpRpcDedupeV1)return false;
 const raw=client.rpc.bind(client);client.__avpRpcDedupeV1=true;
 client.rpc=function(name,args){
  const isRead=READS.has(name),isWrite=WRITES.has(name);
  if(!isRead&&!isWrite)return raw(name,args);

  const k=key(name,args),t=Date.now();

  /* Writes are only coalesced while the same request is in flight. A completed
     mutation must never be replayed from cache. */
  if(isWrite){
   if(active.has(k))return active.get(k);
   const p=Promise.resolve(raw(name,args)).then(result=>{
    if(result&&!result.error)invalidateAfterWrite(name);
    return result;
   }).finally(()=>active.delete(k));
   active.set(k,p);return p;
  }

  const hit=memory.get(k);
  if(hit&&t-hit.at<memTtl(name))return Promise.resolve(hit.result);

  const stored=readSession(name,args);
  if(stored.hit){
    memory.set(k,{at:t,result:stored.result});
    return Promise.resolve(stored.result);
  }
  if(active.has(k))return active.get(k);

  const p=Promise.resolve(raw(name,args)).then(result=>{
    if(result&&!result.error){
      memory.set(k,{at:Date.now(),result});
      writeSession(name,args,result);
    }
    return result;
  }).finally(()=>active.delete(k));
  active.set(k,p);return p;
 };
 return true;
}

window.avpRpcCache={
 invalidate:function(...names){names.flat().filter(Boolean).forEach(clearRead)}
};

(async()=>{
 for(let i=0;i<120;i++){
  const a=window.avpSupabase||window.supabaseClient;
  if(a){wrap(a);return}
  await new Promise(r=>setTimeout(r,100));
 }
})();
})();