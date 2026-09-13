const RESCUE_VERSION="learnexcel-rescue-20260913-1";

self.addEventListener("install",event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;

  /* Rescue mode: never rewrite HTML/JS/CSS and never serve stale app cache. */
  event.respondWith((async()=>{
    try{
      return await fetch(req,{cache:"no-store"});
    }catch(err){
      if(req.mode==="navigate"){
        try{return await fetch(new Request("./index.html",{cache:"no-store"}));}catch(_){ }
      }
      return Response.error();
    }
  })());
});

self.addEventListener("push",event=>{
  let data={};
  try{data=event.data?event.data.json():{};}catch(e){data={title:"Anh Văn Phòng",body:event.data?event.data.text():""};}
  const title=data.title||"Anh Văn Phòng";
  const options={
    body:data.body||"Có phản hồi mới từ người dùng.",
    icon:data.icon||"icon-192.png",
    badge:data.badge||"icon-192.png",
    tag:data.tag||"avp-admin-push",
    renotify:true,
    data:{url:data.url||"admin.html"},
    vibrate:[120,70,120]
  };
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const target=new URL(event.notification?.data?.url||"admin.html",self.registration.scope).href;
  event.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
    for(const client of list){
      if("focus" in client){
        try{client.navigate(target);}catch(_){ }
        return client.focus();
      }
    }
    if(clients.openWindow) return clients.openWindow(target);
  }));
});
