/* AVP one-time cleanup: remove experimental notification/push worker. */
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(k => /avp-chat-push|push-safe|push-live|notification/i.test(k))
          .map(k => caches.delete(k))
      );
    } catch (_) {}

    try {
      await self.registration.unregister();
    } catch (_) {}
  })());
});
