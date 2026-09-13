(()=>{
'use strict';
if(window.__AVP_SUPABASE_READ_CACHE_V1__)return;
window.__AVP_SUPABASE_READ_CACHE_V1__=1;
const rawFetch=window.fetch.bind(window);
const cfg=window.AVP_SUPABASE_CONFIG||{};
const origin=String(cfg.url||'').replace(/\/$/,'');
if(!origin)return;
const DIRTY='avp_progress_dirty_v1';
const PREFIX='avp_rest_cache_v1:';
const PROGRESS_KEYS=new Set([
 'completedCourses','currentCourse','quizBestScore','avp_playground_progress_v1',
 'avpLearningPath30','avpLearningPathLastVisit','avpRecentActivities','avp_bonus_xp_v1',
 'avp_activity_days_v1','avp_learning_events_v1','avp_daily_rewards_v1',
 'avp_excel_challenge_stats_v1','avp_lesson_progress_v1','avp_xp_v2','avp_quiz_done_v1',
 'avp_badge_unlock_dates_v9','avp_bookmarks_v2','avp_learning_history_v2','avp_visit_days_v1',
 'avp_recent_lessons_v1','avp_playground_completed_v1','avp.practiceLab.v14'
]);
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)}
function cacheKey(url){return PREFIX+hash(url)}
function isDirty(){try{return sessionStorage.getItem(DIRTY)==='1'}catch(_){return true}}
function setDirty(v){try{if(v)sessionStorage.setItem(DIRTY,'1');else sessionStorage.removeItem(DIRTY)}catch(_){}}
function info(input,init){
 const url=typeof input==='string'?input:String(input?.url||'');
 const method=String(init?.method||input?.method||'GET').toUpperCase();
 return {url,method};
}
function tableOf(url){
 try{const u=new URL(url);if(!u.href.startsWith(origin+'/rest/v1/'))return '';return u.pathname.split('/rest/v1/')[1]?.split('/')[0]||''}catch(_){return ''}
}
function cacheable(url,table){
 try{
  const u=new URL(url);
  if(table==='profiles')return u.searchParams.has('id')&&String(u.searchParams.get('id')||'').startsWith('eq.');
  if(table==='user_progress')return u.searchParams.has('user_id')&&String(u.searchParams.get('user_id')||'').startsWith('eq.')&&!isDirty();
 }catch(_){ }
 return false;
}
function ttl(table){return table==='profiles'?120000:60000}
function read(url,table){
 try{
  const row=JSON.parse(sessionStorage.getItem(cacheKey(url))||'null');
  if(!row||Date.now()-Number(row.at||0)>=ttl(table))return null;
  return new Response(row.body,{status:row.status,statusText:row.statusText||'',headers:row.headers||{}});
 }catch(_){return null}
}
async function store(url,res){
 try{
  const body=await res.clone().text();
  const headers={};res.headers.forEach((v,k)=>headers[k]=v);
  sessionStorage.setItem(cacheKey(url),JSON.stringify({at:Date.now(),body,status:res.status,statusText:res.statusText,headers}));
 }catch(_){ }
}
function clearTable(table){
 try{
  for(let i=sessionStorage.length-1;i>=0;i--){const k=sessionStorage.key(i);if(k&&k.startsWith(PREFIX))sessionStorage.removeItem(k)}
 }catch(_){ }
}
window.fetch=async function(input,init){
 const meta=info(input,init),table=tableOf(meta.url);
 if(!table||!['profiles','user_progress'].includes(table))return rawFetch(input,init);
 if(meta.method==='GET'&&cacheable(meta.url,table)){
  const hit=read(meta.url,table);if(hit)return hit;
  const res=await rawFetch(input,init);if(res?.ok)await store(meta.url,res);return res;
 }
 const res=await rawFetch(input,init);
 if(meta.method!=='GET'&&res?.ok){clearTable(table);if(table==='user_progress')setDirty(false)}
 return res;
};
const nativeSet=Storage.prototype.setItem,nativeRemove=Storage.prototype.removeItem;
Storage.prototype.setItem=function(k,v){nativeSet.call(this,k,v);if(this===localStorage&&PROGRESS_KEYS.has(String(k)))setDirty(true)};
Storage.prototype.removeItem=function(k){nativeRemove.call(this,k);if(this===localStorage&&PROGRESS_KEYS.has(String(k)))setDirty(true)};
window.addEventListener('avp:cloud-progress-loaded',()=>setDirty(false));
})();