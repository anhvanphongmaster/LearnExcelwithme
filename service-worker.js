/* AVP Service Worker — chat notifications */
const CACHE_NAME="avp-chat-notify-v1";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));

self.addEventListener("push",event=>{
  let data={};
  try{data=event.data?event.data.json():{}}catch{data={body:event.data?.text?.()||"Bạn có tin nhắn mới."}}
  const title=data.title||"Anh Văn Phòng";
  const options={
    body:data.body||"Bạn có tin nhắn mới.",
    icon:data.icon||"./icon-192.png",
    badge:data.badge||"./icon-192.png",
    tag:data.tag||"avp-chat-message",
    renotify:true,
    data:{url:data.url||"./?openChat=1"}
  };
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const target=new URL(event.notification.data?.url||"./",self.location.origin).href;
  event.waitUntil((async()=>{
    const list=await clients.matchAll({type:"window",includeUncontrolled:true});
    for(const c of list){
      if("focus" in c){await c.navigate(target);return c.focus()}
    }
    if(clients.openWindow)return clients.openWindow(target);
  })());
});
