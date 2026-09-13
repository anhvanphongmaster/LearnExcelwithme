const CACHE="learnexcel-assets-v20260913-canonical3";
const ASSETS=[
  "./style.css","./simple-nav.css","./avp-core.css","./avp-site-motion.css","./avp-hover-lift.css","./home-ux-polish-v1.css",
  "./simple-nav.js","./avp-core.js","./avp-site-motion.js","./home-effects.js","./home-page-motion.js","./home-canonical-v1.js","./home-robot-motion-v4.js","./global-search.js",
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
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

async function networkFirst(req){
  const cache=await caches.open(CACHE);
  try{
    const res=await fetch(req,{cache:"no-cache"});
    if(res&&res.ok)cache.put(req,res.clone()).catch(()=>{});
    return res;
  }catch(_){
    const cached=await cache.match(req);
    if(cached)return cached;
    if(req.mode==="navigate")return (await cache.match("./index.html"))||Response.error();
    return Response.error();
  }
}

async function cacheFirst(req){
  const cache=await caches.open(CACHE);
  const cached=await cache.match(req);
  if(cached)return cached;
  try{
    const res=await fetch(req);
    if(res&&res.ok)cache.put(req,res.clone()).catch(()=>{});
    return res;
  }catch(_){
    return Response.error();
  }
}

function responseFromText(net,text,type){
  const headers=new Headers(net.headers);
  headers.set("content-type",type);
  headers.set("cache-control","no-cache");
  headers.delete("content-length");
  return new Response(text,{status:net.status,statusText:net.statusText,headers});
}

/* The repository still contains old Home fallback markup. For navigation we
   inject the canonical controller before Home motion executes. CSS keeps the
   fallback invisible until that controller commits the final DOM. */
async function canonicalHomeHtml(req){
  const cache=await caches.open(CACHE);
  try{
    const net=await fetch(req,{cache:"no-cache"});
    if(!net||!net.ok)return net;
    let text=await net.text();

    /* Make even the fallback labels current before parse. */
    text=text.replace("Lộ trình 14 bài · Bảng xếp hạng","Học hôm nay →");
    text=text.replace("Top học viên · <b>đăng nhập</b> để có mặt trên BXH","Web tự chọn bài cần học · luyện ngắn · ôn lỗi");
    text=text.replace("<h2>Lộ trình 14 bài</h2>","<h2>Nền tảng Excel A–Z</h2>");
    text=text.replace("<p>Học theo thứ tự. Mỗi bài có ví dụ và quiz.</p>","<p>8 module · 42 bài. Chọn theo nhóm công việc; bên trong là danh sách bài rõ ràng và luôn có đường quay lại.</p>");

    if(!text.includes('data-avp-home-canonical')){
      const marker='<script defer src="home-effects.js"></script>';
      const boot='<script defer src="home-canonical-v1.js?v=20260913-canonical3" data-avp-home-canonical></script>\n';
      if(text.includes(marker)) text=text.replace(marker,boot+marker);
      else text=text.replace('</body>',boot+'</body>');
    }

    const out=responseFromText(net,text,"text/html; charset=utf-8");
    cache.put(req,out.clone()).catch(()=>{});
    return out;
  }catch(_){
    return (await cache.match(req))||(await cache.match("./index.html"))||Response.error();
  }
}

/* Home motion used to contain two layout renderers. Strip those marked blocks
   at delivery time so this file owns visual effects only, never Home layout. */
async function canonicalHomeMotion(req){
  const cache=await caches.open(CACHE);
  try{
    const net=await fetch(req,{cache:"no-cache"});
    if(!net||!net.ok)return net;
    let text=await net.text();
    text=text.replace(/\/\* Home A–Z V4 — self-contained renderer[\s\S]*?(?=\/\* Excel Arena)/,'');
    text=text.replace(/\/\* Excel Arena — highlight[\s\S]*?(?=\/\* Home First Run V2)/,'');
    text=text.replace(/\s*setTimeout\(boot, 600\);\s*setTimeout\(boot, 1800\);/,'');
    const out=responseFromText(net,text,"application/javascript; charset=utf-8");
    cache.put(req,out.clone()).catch(()=>{});
    return out;
  }catch(_){
    return (await cache.match(req))||Response.error();
  }
}

self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;

  const homeNavigation=req.mode==="navigate" && (url.pathname.endsWith('/')||url.pathname.endsWith('/index.html'));
  if(homeNavigation){
    event.respondWith(canonicalHomeHtml(req));
    return;
  }

  if(url.pathname.endsWith('/home-page-motion.js')){
    event.respondWith(canonicalHomeMotion(req));
    return;
  }

  const isHTML=req.mode==="navigate"||url.pathname.endsWith(".html")||url.pathname.endsWith("/");
  const isCode=/\.(?:js|css|json|webmanifest)$/i.test(url.pathname);

  /* HTML + code prefer the current deploy. Query strings stay part of the cache key. */
  if(isHTML||isCode){
    event.respondWith(networkFirst(req));
    return;
  }

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
