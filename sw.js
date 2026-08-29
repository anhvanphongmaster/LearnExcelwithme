const CACHE = "learnexcel-assets-v20260830-push46";
const ASSETS = [
  "./style.css",
  "./simple-nav.css",
  "./avp-core.css",
  "./theme-polish-v33.css",
  "./avp-ui-polish-v40.css",
  "./simple-nav.js",
  "./avp-core.js",
  "./index.html"
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

  const isCodeAsset =
    /\.(?:js|css|json|webmanifest)$/i.test(url.pathname);

  // HTML: always prefer the newest live page, keep cache only for offline fallback.
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

  // JS/CSS/config: network-first prevents old and new versions being mixed
  // immediately after a GitHub Pages deploy.
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

  // Images/fonts/static media: cache-first is efficient and safe.
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
  const target = new URL(event.notification?.data?.url || "admin.html", self.location.origin).href;

  event.waitUntil(
    clients.matchAll({type:"window",includeUncontrolled:true}).then(list => {
      for (const client of list) {
        if ("focus" in client) {
          try{
            client.navigate(target);
          }catch{}
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
