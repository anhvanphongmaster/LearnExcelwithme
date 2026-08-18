/* Stale-while-revalidate: hiện trang ngay từ cache, cập nhật nền.
   Giảm cảm giác lag khi chuyển trang trên GitHub Pages. */
const CACHE = 'learnexcel-v20260818-1';
const CORE = [
  './',
  './index.html',
  './offline.html',
  './style.css',
  './avp-core.css',
  './simple-nav.css',
  './theme-polish-v33.css',
  './global-search.css',
  './script.js',
  './avp-core.js',
  './simple-nav.js',
  './global-search.js',
  './practice-video.html',
  './excel.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) =>
      Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;

  e.respondWith((async () => {
    const cached = await caches.match(e.request);
    const network = fetch(e.request).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      }
      return res;
    }).catch(() => undefined);

    if (cached) {
      // Hiện cache ngay, refresh nền
      network.catch(() => {});
      return cached;
    }
    const fresh = await network;
    if (fresh) return fresh;
    if (e.request.mode === 'navigate') return caches.match('./offline.html');
    return new Response('', { status: 504 });
  })());
});
