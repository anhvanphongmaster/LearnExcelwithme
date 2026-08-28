(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const PUSH_BTN_ATTR = "data-avp-push-toggle";
  const SUB_KEY = "avp_push_enabled_v2";

  const getClient = () => window.supabaseClient || window.sb || null;

  function supportsPush(){
    return !!(
      window.isSecureContext &&
      "serviceWorker" in navigator &&
      "Notification" in window &&
      "PushManager" in window
    );
  }

  function isStandalone(){
    return window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator.standalone === true;
  }

  function isIOS(){
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function getVapidKey(){
    return String(
      window.AVP_PUSH_VAPID_PUBLIC_KEY ||
      document.querySelector('meta[name="avp-vapid-public-key"]')?.content ||
      ""
    ).trim();
  }

  function b64ToUint8Array(base64){
    const pad="=".repeat((4-base64.length%4)%4);
    const s=(base64+pad).replace(/-/g,"+").replace(/_/g,"/");
    const raw=atob(s);
    return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)));
  }

  function tinyToast(text){
    let el=$("avpPushTinyToast");
    if(!el){
      el=document.createElement("div");
      el.id="avpPushTinyToast";
      el.className="avp-push-tiny-toast";
      document.body.appendChild(el);
    }
    el.textContent=text;
    el.hidden=false;
    clearTimeout(el._t);
    el._t=setTimeout(()=>{el.hidden=true},3200);
  }

  async function currentRole(){
    const client=getClient();
    if(!client?.auth)return "user";
    try{
      const {data}=await client.auth.getUser();
      const uid=data?.user?.id;
      if(!uid)return "user";
      const {data:isAdmin}=await client.rpc("is_admin_user");
      return isAdmin ? "admin" : "user";
    }catch{
      return "user";
    }
  }

  async function currentThread(){
    const root=document.getElementById("avpAdminChatRoot");
    return root?.dataset?.threadId || null;
  }

  async function saveSubscription(sub){
    const client=getClient();
    if(!client?.rpc)return;
    const json=sub.toJSON();
    const role=await currentRole();
    const thread=await currentThread();

    const {error}=await client.rpc("avp_chat_save_push_subscription",{
      p_endpoint: json.endpoint,
      p_p256dh: json.keys?.p256dh || "",
      p_auth: json.keys?.auth || "",
      p_role: role,
      p_thread_id: thread
    });
    if(error)throw error;
  }

  async function registerPush(){
    if(!supportsPush()){
      if(isIOS()&&!isStandalone()){
        tinyToast("Trên iPhone, thêm web vào Màn hình chính để dùng thông báo ngoài web.");
      }
      return false;
    }

    const key=getVapidKey();
    if(!key){
      tinyToast("Push ngoài web chưa cấu hình VAPID.");
      return false;
    }

    const reg=await navigator.serviceWorker.register(
      "service-worker.js?v=20260828-push-safe2",
      {scope:"./"}
    );

    const permission=Notification.permission==="granted"
      ? "granted"
      : await Notification.requestPermission();

    if(permission!=="granted"){
      tinyToast("Bạn chưa cấp quyền thông báo.");
      return false;
    }

    let sub=await reg.pushManager.getSubscription();
    if(!sub){
      sub=await reg.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:b64ToUint8Array(key)
      });
    }

    await saveSubscription(sub);
    localStorage.setItem(SUB_KEY,"1");
    updateButtons();
    tinyToast("Đã bật thông báo ngoài web.");
    return true;
  }

  async function disablePush(){
    try{
      const reg=await navigator.serviceWorker.getRegistration("./");
      const sub=await reg?.pushManager?.getSubscription();
      if(sub)await sub.unsubscribe();
    }catch{}
    localStorage.setItem(SUB_KEY,"0");
    updateButtons();
    tinyToast("Đã tắt thông báo ngoài web.");
  }

  function updateButtons(){
    const on=localStorage.getItem(SUB_KEY)==="1";
    document.querySelectorAll(`[${PUSH_BTN_ATTR}]`).forEach(btn=>{
      btn.textContent=on?"🔔":"🔕";
      btn.classList.toggle("active",on);
      btn.title=on?"Thông báo ngoài web đang bật":"Bật thông báo ngoài web";
    });
  }

  function mountButton(head){
    if(!head || head.querySelector(`[${PUSH_BTN_ATTR}]`))return;

    // iOS Safari không standalone: không hiện alert thô; vẫn cho nút nhỏ để hướng dẫn.
    const btn=document.createElement("button");
    btn.type="button";
    btn.className="avp-chat-push-toggle";
    btn.setAttribute(PUSH_BTN_ATTR,"1");
    btn.setAttribute("aria-label","Thông báo ngoài web");

    btn.addEventListener("click",async e=>{
      e.preventDefault();
      e.stopPropagation();
      if(localStorage.getItem(SUB_KEY)==="1") await disablePush();
      else {
        try{ await registerPush(); }
        catch(err){
          console.warn("AVP push",err);
          tinyToast("Chưa bật được push. Chat vẫn hoạt động bình thường.");
        }
      }
    });

    const sound=head.querySelector("[data-avp-chat-sound]");
    const close=head.querySelector(".avp-chat-close");
    if(sound?.nextSibling) head.insertBefore(btn,sound.nextSibling);
    else if(close) head.insertBefore(btn,close);
    else head.appendChild(btn);
    updateButtons();
  }

  function remount(){
    document.querySelectorAll(".avp-chat-head").forEach(mountButton);
  }

  const observer=new MutationObserver(remount);
  const boot=()=>{
    remount();
    if(document.body)observer.observe(document.body,{childList:true,subtree:true});
  };

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);
  else boot();

  window.AVPChatPush={register:registerPush,disable:disablePush,supported:supportsPush};
})();
