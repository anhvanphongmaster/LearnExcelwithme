const CACHE="learnexcel-assets-v20260913-stable2";
const ASSETS=[
  "./style.css","./simple-nav.css","./avp-core.css","./avp-site-motion.css","./avp-hover-lift.css","./home-ux-polish-v1.css",
  "./simple-nav.js","./avp-core.js","./avp-site-motion.js","./home-effects.js","./home-page-motion.js","./global-search.js",
  "./index.html","./skill-map.html","./knowledge.html","./practice-video.html","./excel-race.html","./learning-coach.html",
  "./learning-platform-catalog-v1.js","./learning-coach-v2.css","./learning-coach-v2.js"
];

self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await Promise.allSettled(ASSETS.map(url=>cache.add(new Request(url,{cache:"reload"}))));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(req){
  const cache=await caches.open(CACHE);
  try{
    const res=await fetch(req,{cache:"no-cache"});
    if(res&&res.ok) cache.put(req,res.clone()).catch(()=>{});
    return res;
  }catch(_){
    const cached=await cache.match(req);
    if(cached) return cached;
    if(req.mode==="navigate") return (await cache.match("./index.html"))||Response.error();
    return Response.error();
  }
}

async function staleWhileRevalidate(event){
  const req=event.request;
  const cache=await caches.open(CACHE);
  const cached=await cache.match(req);
  const refresh=fetch(req,{cache:"no-cache"}).then(res=>{
    if(res&&res.ok) cache.put(req,res.clone()).catch(()=>{});
    return res;
  });
  if(cached){
    event.waitUntil(refresh.catch(()=>{}));
    return cached;
  }
  try{return await refresh;}catch(_){return Response.error();}
}

async function cacheFirst(req){
  const cache=await caches.open(CACHE);
  const cached=await cache.match(req);
  if(cached) return cached;
  try{
    const res=await fetch(req);
    if(res&&res.ok) cache.put(req,res.clone()).catch(()=>{});
    return res;
  }catch(_){return Response.error();}
}

self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;

  const isHTML=req.mode==="navigate"||url.pathname.endsWith(".html")||url.pathname.endsWith("/");
  const isCode=/\.(?:js|css|json|webmanifest)$/i.test(url.pathname);

  /* HTML must never come from a stale first response. */
  if(isHTML){event.respondWith(networkFirst(req));return;}

  /* JS/CSS remain fast, but query strings are real cache keys. */
  if(isCode){event.respondWith(staleWhileRevalidate(event));return;}

  event.respondWith(cacheFirst(req));
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
  event.waitUntil(self.registration.showNotification(title,options).then(()=>{
    if("setAppBadge" in self.navigator)return self.navigator.setAppBadge().catch(()=>{});
  }));
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  if("clearAppBadge" in self.navigator)self.navigator.clearAppBadge().catch(()=>{});
  const target=new URL(event.notification?.data?.url||"admin.html",self.registration.scope).href;
  event.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
    for(const client of list){if("focus" in client){try{client.navigate(target);}catch{}return client.focus();}}
    if(clients.openWindow)return clients.openWindow(target);
  }));
});
