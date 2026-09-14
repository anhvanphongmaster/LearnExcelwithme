const CACHE="learnexcel-assets-v20260914-fouc5";
const ASSETS=[
  "./style.css","./simple-nav.css","./avp-core.css","./avp-site-motion.css","./avp-hover-lift.css",
  "./site-upgrade-v1.css","./home-ui-owner-v1.css","./upgrade.css",
  "./simple-nav.js","./avp-core.js","./avp-site-motion.js","./home-effects.js","./home-page-motion.js","./home-page-motion-core-v108.js","./global-search.js",
  "./site-upgrade-v1.js","./site-runtime-cache-v1.js","./site-rpc-dedupe-v1.js","./site-auth-cache-v1.js","./site-supabase-read-cache-v1.js","./analytics-tracker.js","./daily-header-badge-v1.js"
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
    const res=await fetch(req,{cache:"no-store"});
    if(res&&res.ok){
      cache.put(req,res.clone()).catch(()=>{});
      return res;
    }
    const cached=await cache.match(req);
    if(cached) return cached;
    return res;
  }catch(_){
    const cached=await cache.match(req);
    if(cached) return cached;
    if(req.mode==="navigate") return Response.error();
    return Response.error();
  }
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

async function simpleNavWithDailyBadge(req){
  const base=await networkFirst(req);
  if(!base||!base.ok) return base;
  try{
    const text=await base.text();
    const inject="\n;fetch('./daily-header-badge-v1.js?v=20260914-badge1',{cache:'no-store'}).then(function(r){return r.text()}).then(function(code){try{(0,eval)(code)}catch(e){console.warn('[AVP daily badge]',e)}}).catch(function(){});\n";
    return new Response(text+inject,{status:base.status,statusText:base.statusText,headers:base.headers});
  }catch(_){return base;}
}

self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;
  if(url.pathname.endsWith("/simple-nav.js")||url.pathname.endsWith("/simple-nav.js")){
    event.respondWith(simpleNavWithDailyBadge(req));
    return;
  }
  const isHTML=req.mode==="navigate"||url.pathname.endsWith(".html")||url.pathname.endsWith("/");
  const isCode=/\.(?:js|css|json|webmanifest)$/i.test(url.pathname);
  if(isHTML||isCode){event.respondWith(networkFirst(req));return;}
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
