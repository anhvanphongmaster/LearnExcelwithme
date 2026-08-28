/* AVP cleanup: remove experimental push service worker. */
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(k => /avp-chat-push|push-safe|push-live/i.test(k))
          .map(k => caches.delete(k))
      );
    } catch (_) {}

    try {
      await self.registration.unregister();
    } catch (_) {}

    try {
      const clientsList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true
      });
      clientsList.forEach(c => {
        try { c.postMessage({type:"AVP_PUSH_CLEANED"}); } catch (_) {}
      });
    } catch (_) {}
  })());
});
