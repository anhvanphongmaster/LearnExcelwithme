const AVP_CACHE="avp-chat-push-safe-v2";

self.addEventListener("install",()=>{
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push",event=>{
  let data={};
  try{
    data=event.data ? event.data.json() : {};
  }catch{
    data={body:event.data?.text?.()||"Bạn có tin nhắn mới."};
  }

  const title=data.title || "Anh Văn Phòng";
  const options={
    body:data.body || "Bạn có tin nhắn mới.",
    tag:data.tag || "avp-chat-message",
    renotify:true,
    data:{
      url:data.url || "./",
      thread_id:data.thread_id || null
    }
  };

  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const target=new URL(event.notification.data?.url || "./",self.location.origin).href;

  event.waitUntil((async()=>{
    const list=await self.clients.matchAll({type:"window",includeUncontrolled:true});
    for(const client of list){
      if("focus" in client){
        try{
          await client.navigate(target);
        }catch{}
        return client.focus();
      }
    }
    return self.clients.openWindow(target);
  })());
});
