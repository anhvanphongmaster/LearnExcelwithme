const CACHE = "learnexcel-assets-v20260912-arena4";
const ASSETS = [
  "./style.css",
  "./simple-nav.css",
  "./avp-core.css",
  "./avp-ui-system.css",
  "./avp-semantic-soft.css",
  "./avp-semantic-hierarchy-v3.css",
  "./avp-readability-guard.css",
  "./theme-polish-v33.css",
  "./avp-ui-polish-v40.css",
  "./avp-global-controls-v1.css",
  "./avp-home-knowledge-v2.css",
  "./avp-learning-contrast-v1.css",
  "./avp-pro-access-guidance-v1.css",
  "./home-mini-bounce.css",
  "./homework.css",
  "./admin-homework.css",
  "./practice-hub-flow-v1.css",
  "./practice-tiktok.css",
  "./practice-roll.css",
  "./excel-race.html",
  "./excel-arena-v4.css",
  "./excel-arena-questions.js",
  "./excel-arena-engine-v4.js",
  "./home-page-motion.js",
  "./simple-nav.js",
  "./avp-core.js",
  "./avp-ui-system.js",
  "./avp-launcher-unify-v1.js",
  "./avp-semantic-hierarchy-v3.js",
  "./avp-home-knowledge-v2.js",
  "./avp-pro-access-guidance-v1.js",
  "./homework.js",
  "./admin-homework.js",
  "./practice-video.js",
  "./practice-roll.js",
  "./global-search.js",
  "./index.html",
  "./practice-video.html",
  "./practice-tiktok.html",
  "./homework.html",
  "./skill-map.html",
  "./skill-map.css",
  "./skill-map.js",
  "./knowledge.html",
  "./knowledge-v2.css",
  "./knowledge-v2.js",
  "./knowledge-reader-menu-v1.css",
  "./knowledge-depth-v1.css",
  "./knowledge-depth-v1.js",
  "./knowledge-data-foundation.js",
  "./knowledge-data-skills.js",
  "./knowledge-data-analysis.js",
  "./knowledge-data-advanced.js",
  "./professional-access.html",
  "./home-code-hub.css",
  "./home-code-hub.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isHTML =
    event.request.mode === "navigate" ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith("/");

  const isCodeAsset = /\.(?:js|css|json|webmanifest)$/i.test(url.pathname);
  const forceFresh =
    url.pathname.endsWith("/home-page-motion.js") ||
    url.pathname.endsWith("/home-mini-bounce.css") ||
    url.pathname.endsWith("/excel-arena-v4.css") ||
    url.pathname.endsWith("/excel-arena-engine-v4.js");

  if (isHTML) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            caches.open(CACHE).then(cache => cache.put(event.request, response.clone())).catch(() => {});
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request)
            .then(cached => cached || caches.match("./index.html"))
        )
    );
    return;
  }

  if (forceFresh) {
    event.respondWith(
      fetch(event.request, { cache: "reload" })
        .then(response => {
          if (response && response.ok) {
            caches.open(CACHE).then(cache => cache.put(event.request, response.clone())).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  if (isCodeAsset) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            caches.open(CACHE).then(cache => cache.put(event.request, response.clone())).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.ok) {
          caches.open(CACHE).then(cache => cache.put(event.request, response.clone())).catch(() => {});
        }
        return response;
      });
    })
  );
});

self.addEventListener("push", event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "Anh Văn Phòng", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Anh Văn Phòng";
  const options = {
    body: data.body || "Có phản hồi mới từ người dùng.",
    icon: data.icon || "icon-192.png",
    badge: data.badge || "icon-192.png",
    tag: data.tag || "avp-admin-push",
    renotify: true,
    data: { url: data.url || "admin.html" },
    vibrate: [120, 70, 120]
  };

  event.waitUntil(
    self.registration.showNotification(title, options).then(() => {
      if ("setAppBadge" in self.navigator) {
        return self.navigator.setAppBadge().catch(() => {});
      }
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  if ("clearAppBadge" in self.navigator) self.navigator.clearAppBadge().catch(() => {});
  const target = new URL(event.notification?.data?.url || "admin.html", self.registration.scope).href;

  event.waitUntil(
    clients.matchAll({type:"window",includeUncontrolled:true}).then(list => {
      for (const client of list) {
        if ("focus" in client) {
          try{ client.navigate(target); }catch{}
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
