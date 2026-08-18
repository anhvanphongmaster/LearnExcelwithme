const CACHE = "learnexcel-assets-v20260818-3";
const ASSETS = ["./style.css","./simple-nav.css","./avp-core.css","./theme-polish-v33.css","./simple-nav.js","./avp-core.js","./index.html"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  const isHTML = e.request.mode === "navigate" || (u.pathname.endsWith(".html") || u.pathname.endsWith("/"));
  if (isHTML) {
    e.respondWith(fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached => {
    const net = fetch(e.request).then(r => {
      if (r && r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone())).catch(() => {});
      return r;
    }).catch(() => cached);
    return cached || net;
  }));
});
