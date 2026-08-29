(() => {
"use strict";

const STORE="avp_admin_device_alerts_v45";
const SNAP="avp_admin_alert_snapshot_v45";
const POLL_MS=20000;

let client=null,user=null,timer=null,admin=false,baselineReady=false;
let snapshot={chatUnread:0,graderKey:"",reviewKey:"",communityKey:""};

function loadSnapshot(){
  try{
    const v=JSON.parse(localStorage.getItem(SNAP)||"{}");
    snapshot={...snapshot,...v};
  }catch{}
}
function saveSnapshot(){
  try{localStorage.setItem(SNAP,JSON.stringify(snapshot))}catch{}
}
function enabled(){
  try{return localStorage.getItem(STORE)==="1"}catch{return false}
}
function setEnabled(v){
  try{localStorage.setItem(STORE,v?"1":"0")}catch{}
}
async function waitClient(){
  for(let i=0;i<40;i++){
    const c=window.avpSupabase||window.supabaseClient;
    if(c?.auth){client=c;return c}
    await new Promise(r=>setTimeout(r,100));
  }
  return null;
}
async function getUser(){
  try{
    const {data}=await client.auth.getSession();
    return data?.session?.user||null;
  }catch{return null}
}
async function isAdmin(){
  try{
    const {data,error}=await client.rpc("avp_chat_is_admin");
    if(!error&&data===true)return true;
  }catch{}
  try{
    const {data,error}=await client.rpc("is_admin_user");
    if(!error&&data===true)return true;
  }catch{}
  return false;
}
function inactive(){
  const state=window.AVP_ADMIN_PRESENCE_STATE;
  if(state)return state!=="active";
  return document.hidden || !(typeof document.hasFocus==="function"?document.hasFocus():true);
}
async function registration(){
  if(!("serviceWorker" in navigator))return null;
  try{
    const reg=await navigator.serviceWorker.ready;
    return reg||null;
  }catch{return null}
}
async function notify(title,body,url,tag){
  if(!enabled()||Notification.permission!=="granted"||!inactive())return;
  const opts={
    body:String(body||""),
    icon:"icon-192.png",
    badge:"icon-192.png",
    tag:tag||"avp-admin",
    renotify:true,
    data:{url:url||"admin.html"},
    vibrate:[100,60,100]
  };
  try{
    const reg=await registration();
    if(reg?.showNotification){
      await reg.showNotification(title,opts);
      return;
    }
  }catch{}
  try{new Notification(title,opts)}catch{}
}
function newestKey(rows){
  if(!Array.isArray(rows)||!rows.length)return "";
  const r=rows[0]||{};
  return String(r.id||r.created_at||r.updated_at||JSON.stringify(r).slice(0,120));
}
async function rpc(name,args={}){
  try{
    const {data,error}=await client.rpc(name,args);
    if(error)throw error;
    return data;
  }catch{return null}
}
async function checkChat(){
  const rows=await rpc("avp_chat_admin_threads",{p_limit:100});
  if(!Array.isArray(rows))return;
  const unread=rows.reduce((s,r)=>s+(Number(r.unread_count)||0),0);
  if(baselineReady&&unread>snapshot.chatUnread){
    const latest=rows.find(r=>(Number(r.unread_count)||0)>0);
    const sender=latest?.display_name||latest?.email||"Học viên";
    await notify("💬 Tin nhắn mới",`${sender} vừa gửi tin nhắn cho bạn.`,"admin.html?view=inbox","avp-chat");
  }
  snapshot.chatUnread=unread;
}
async function checkGrader(){
  const rows=await rpc("admin_practice_grader_appeals",{p_status:"pending",p_limit:20});
  if(!Array.isArray(rows))return;
  const key=newestKey(rows);
  if(baselineReady&&key&&snapshot.graderKey&&key!==snapshot.graderKey){
    const r=rows[0]||{};
    await notify("🧪 Yêu cầu chấm lại",`${r.display_name||r.email||"Học viên"} gửi yêu cầu kiểm tra bài ${r.lesson_title||r.lesson_key||""}.`,"admin.html?view=grader","avp-grader");
  }
  snapshot.graderKey=key;
}
async function checkReviews(){
  const rows=await rpc("admin_site_review_list",{p_rating:null,p_search:null,p_limit:20});
  if(!Array.isArray(rows))return;
  const key=newestKey(rows);
  if(baselineReady&&key&&snapshot.reviewKey&&key!==snapshot.reviewKey){
    const r=rows[0]||{};
    const stars=Number(r.rating)||0;
    const text=String(r.content||"").trim();
    await notify(`⭐ Đánh giá mới ${stars}/5`,text?text.slice(0,120):"Có đánh giá website mới.","admin.html?view=reviews","avp-review");
  }
  snapshot.reviewKey=key;
}
async function checkCommunity(){
  const rows=await rpc("admin_community_moderation_queue",{p_status:"open",p_limit:30});
  if(!Array.isArray(rows))return;
  const key=newestKey(rows);
  if(baselineReady&&key&&snapshot.communityKey&&key!==snapshot.communityKey){
    const r=rows[0]||{};
    await notify("📣 Phản hồi cộng đồng mới",r.reason_label||r.reason||"Có nội dung mới cần Admin kiểm tra.","admin.html?view=community","avp-community");
  }
  snapshot.communityKey=key;
}
async function poll(){
  if(!admin||!client)return;
  await Promise.allSettled([checkChat(),checkGrader(),checkReviews(),checkCommunity()]);
  saveSnapshot();
  baselineReady=true;
}
function statusText(){
  if(!("Notification" in window))return "Thiết bị không hỗ trợ";
  if(Notification.permission==="denied")return "Đã chặn";
  if(Notification.permission==="granted"&&enabled())return "Đã bật";
  return "Chưa bật";
}
function mountButton(){
  if(document.getElementById("avpAdminDeviceAlerts"))return;
  const host=document.querySelector(".admin-command-title");
  if(!host)return;

  const wrap=document.createElement("div");
  wrap.className="avp-admin-device-alerts";
  wrap.id="avpAdminDeviceAlerts";
  wrap.innerHTML=`<button type="button" id="avpAdminDeviceAlertsBtn">🔔 <span>${statusText()}</span></button>
    <small>Chat · chấm lại · đánh giá · cộng đồng</small>`;
  host.appendChild(wrap);

  const btn=document.getElementById("avpAdminDeviceAlertsBtn");
  btn?.addEventListener("click",async()=>{
    if(!("Notification" in window)){
      alert("Trình duyệt này chưa hỗ trợ thông báo web.");
      return;
    }
    if(Notification.permission==="denied"){
      alert("Thông báo đang bị chặn. Hãy bật lại quyền Notification trong cài đặt trình duyệt/PWA.");
      return;
    }
    const permission=Notification.permission==="granted"
      ?"granted"
      :await Notification.requestPermission();

    if(permission==="granted"){
      setEnabled(true);
      btn.querySelector("span").textContent="Đã bật";
      await notify("🔔 Thông báo Admin đã bật","Bạn sẽ nhận cảnh báo khi đang rời tab và có phản ứng mới từ học viên.","admin.html","avp-enabled");
      poll();
    }else{
      setEnabled(false);
      btn.querySelector("span").textContent=statusText();
    }
  });
}
async function init(){
  loadSnapshot();
  client=await waitClient();
  if(!client)return;
  user=await getUser();
  if(!user)return;
  admin=await isAdmin();
  if(!admin)return;

  mountButton();
  await poll();

  clearInterval(timer);
  timer=setInterval(poll,POLL_MS);

  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="hidden")poll();
  });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();