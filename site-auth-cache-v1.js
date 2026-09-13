(()=>{
'use strict';
if(window.__AVP_AUTH_CACHE_V1__)return;
window.__AVP_AUTH_CACHE_V1__=1;
function wrap(client){
 if(!client?.auth||typeof client.auth.getUser!=='function'||client.auth.__avpGetUserCacheV1)return false;
 const rawUser=client.auth.getUser.bind(client.auth);
 const rawSession=typeof client.auth.getSession==='function'?client.auth.getSession.bind(client.auth):null;
 let userHit=null,userPending=null,sessionHit=null,sessionPending=null;
 function publishUser(user){
  window.__AVP_AUTH_USER_ID__=user?.id?String(user.id):'';
  window.__AVP_AUTH_USER__=user||null;
 }
 client.auth.__avpGetUserCacheV1=true;
 client.auth.getUser=function(...args){
  if(args.length)return rawUser(...args);
  const t=Date.now();
  if(userHit&&t-userHit.at<20000)return Promise.resolve(userHit.result);
  if(userPending)return userPending;
  userPending=Promise.resolve(rawUser()).then(result=>{
    if(result&&!result.error){userHit={at:Date.now(),result};publishUser(result?.data?.user||null)}
    return result;
  }).finally(()=>{userPending=null});
  return userPending;
 };
 if(rawSession){
  client.auth.getSession=function(...args){
   if(args.length)return rawSession(...args);
   const t=Date.now();
   if(sessionHit&&t-sessionHit.at<5000)return Promise.resolve(sessionHit.result);
   if(sessionPending)return sessionPending;
   sessionPending=Promise.resolve(rawSession()).then(result=>{
    if(result&&!result.error){sessionHit={at:Date.now(),result};publishUser(result?.data?.session?.user||null)}
    return result;
   }).finally(()=>{sessionPending=null});
   return sessionPending;
  };
 }
 try{
  client.auth.onAuthStateChange((_event,session)=>{
   userHit=null;userPending=null;sessionHit=null;sessionPending=null;
   publishUser(session?.user||null);
  });
 }catch(_){ }
 try{client.auth.getSession()}catch(_){ }
 return true;
}
(async()=>{for(let i=0;i<120;i++){const c=window.avpSupabase||window.supabaseClient;if(c){wrap(c);return}await new Promise(r=>setTimeout(r,100))}})();
})();