(() => {
"use strict";

const STORE="avp_admin_web_push_v46";
const VAPID_PUBLIC_KEY="BFxmt13_QrywtqzR4quLrMHefc9LbrMuodSThZslO9Qb-b3LksiS3XzniutjGl99Ce3Vn8fqPtf7SymsFlVJp4c";

let client=null;
let admin=false;

function enabled(){
  try{return localStorage.getItem(STORE)==="1"}catch{return false}
}
function setEnabled(v){
  try{localStorage.setItem(STORE,v?"1":"0")}catch{}
}
async function waitClient(){
  for(let i=0;i<50;i++){
    const c=window.avpSupabase||window.supabaseClient;
    if(c?.auth){client=c;return c}
    await new Promise(r=>setTimeout(r,100));
  }
  return null;
}
async function rpc(name,args={}){
  const {data,error}=await client.rpc(name,args);
  if(error)throw error;
  return data;
}
async function isAdmin(){
  try{
    const v=await rpc("is_admin_user");
    if(v===true)return true;
  }catch{}
  try{
    const v=await rpc("avp_chat_is_admin");
    return v===true;
  }catch{return false}
}
function b64ToUint8Array(base64String){
  const padding="=".repeat((4-base64String.length%4)%4);
  const base64=(base64String+padding).replace(/-/g,"+").replace(/_/g,"/");
  const raw=atob(base64);
  return Uint8Array.from([...raw].map(ch=>ch.charCodeAt(0)));
}
function isIOS(){
  return /iphone|ipad|ipod/i.test(navigator.userAgent||"");
}
function isStandalone(){
  return window.matchMedia?.("(display-mode: standalone)")?.matches===true ||
         navigator.standalone===true;
}
function supportState(){
  if(!("serviceWorker" in navigator))return {ok:false,reason:"Trình duyệt không hỗ trợ Service Worker."};
  if(!("PushManager" in window))return {ok:false,reason:isIOS()?"Trên iPhone, hãy thêm website vào Màn hình chính rồi mở từ icon đó.":"Trình duyệt này chưa hỗ trợ Web Push."};
  if(!("Notification" in window))return {ok:false,reason:"Thiết bị không hỗ trợ Notification API."};
  if(isIOS()&&!isStandalone())return {ok:false,reason:"Trên iPhone/iPad, hãy Add to Home Screen rồi mở website từ icon ngoài màn hình chính."};
  return {ok:true,reason:""};
}
async function getRegistration(){
  return await navigator.serviceWorker.ready;
}
async function currentSubscription(){
  try{
    const reg=await getRegistration();
    return await reg.pushManager.getSubscription();
  }catch{return null}
}
function subscriptionJson(sub){
  const j=sub.toJSON();
  return {
    endpoint:j.endpoint||sub.endpoint,
    p256dh:j.keys?.p256dh||"",
    auth:j.keys?.auth||""
  };
}
function deviceLabel(){
  const ua=navigator.userAgent||"";
  if(/iphone|ipad/i.test(ua))return "iPhone/iPad";
  if(/android/i.test(ua))return "Android";
  if(/windows/i.test(ua))return "Windows";
  if(/macintosh|mac os/i.test(ua))return "Mac";
  return navigator.platform||"Thiết bị";
}
async function saveSubscription(sub){
  const s=subscriptionJson(sub);
  if(!s.endpoint||!s.p256dh||!s.auth)throw new Error("PUSH_KEYS_MISSING");
  await rpc("admin_push_subscription_upsert",{
    p_endpoint:s.endpoint,
    p_p256dh:s.p256dh,
    p_auth:s.auth,
    p_user_agent:navigator.userAgent||"",
    p_device_label:deviceLabel()
  });
}
async function subscribe(){
  const state=supportState();
  if(!state.ok)throw new Error(state.reason);

  if(Notification.permission==="denied"){
    throw new Error("Thông báo đang bị chặn trong cài đặt của trình duyệt/thiết bị.");
  }

  const permission=Notification.permission==="granted"
    ?"granted"
    :await Notification.requestPermission();

  if(permission!=="granted")throw new Error("Bạn chưa cấp quyền thông báo.");

  const reg=await getRegistration();
  let sub=await reg.pushManager.getSubscription();

  if(!sub){
    sub=await reg.pushManager.subscribe({
      userVisibleOnly:true,
      applicationServerKey:b64ToUint8Array(VAPID_PUBLIC_KEY)
    });
  }

  await saveSubscription(sub);
  setEnabled(true);

  try{
    await reg.showNotification("🔔 Web Push Admin đã bật",{
      body:"Thiết bị này sẽ nhận thông báo ngay cả khi website không mở.",
      icon:"icon-192.png",
      badge:"icon-192.png",
      tag:"avp-push-enabled",
      data:{url:"admin.html"}
    });
  }catch{}

  return sub;
}
async function unsubscribe(){
  const sub=await currentSubscription();
  if(sub){
    try{
      await rpc("admin_push_subscription_remove",{p_endpoint:sub.endpoint});
    }catch(e){console.warn("Remove push subscription",e)}
    try{await sub.unsubscribe()}catch{}
  }
  setEnabled(false);
}
function statusText(sub){
  const state=supportState();
  if(!state.ok)return "Chưa hỗ trợ";
  if(Notification.permission==="denied")return "Đã chặn";
  if(sub&&enabled())return "Push đã bật";
  return "Bật thông báo";
}
async function refreshButton(){
  const btn=document.getElementById("avpAdminDeviceAlertsBtn");
  if(!btn)return;
  const sub=await currentSubscription();
  btn.querySelector("span").textContent=statusText(sub);
  btn.classList.toggle("is-on",!!sub&&enabled());
}
function mountButton(){
  if(document.getElementById("avpAdminDeviceAlerts"))return;
  const host=document.querySelector(".admin-command-title");
  if(!host)return;

  const wrap=document.createElement("div");
  wrap.className="avp-admin-device-alerts";
  wrap.id="avpAdminDeviceAlerts";
  wrap.innerHTML=`<button type="button" id="avpAdminDeviceAlertsBtn">🔔 <span>Bật thông báo</span></button>
    <small>Web Push · nhận cả khi đã thoát trang</small>`;
  host.appendChild(wrap);

  const btn=document.getElementById("avpAdminDeviceAlertsBtn");
  btn?.addEventListener("click",async()=>{
    btn.disabled=true;
    try{
      const sub=await currentSubscription();
      if(sub&&enabled()){
        if(confirm("Tắt Web Push trên thiết bị này?"))await unsubscribe();
      }else{
        await subscribe();
      }
    }catch(e){
      alert(e?.message||"Chưa bật được Web Push.");
      console.warn("Admin Web Push",e);
    }finally{
      btn.disabled=false;
      await refreshButton();
    }
  });

  refreshButton();
}
async function restoreSubscription(){
  if(!enabled())return;
  const sub=await currentSubscription();
  if(!sub)return;
  try{await saveSubscription(sub)}catch(e){console.warn("Refresh push subscription",e)}
}
async function init(){
  client=await waitClient();
  if(!client)return;

  try{
    const {data}=await client.auth.getSession();
    if(!data?.session?.user)return;
  }catch{return}

  admin=await isAdmin();
  if(!admin)return;

  mountButton();
  await restoreSubscription();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
else init();
})();
