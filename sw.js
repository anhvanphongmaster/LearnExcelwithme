/* AVP Service Worker — app-shell router + asset cache
 * Navigation (top-level HTML) → app-shell.html
 * Content (iframe / ?avp_content=1) → original page
 * Avoids rewrite loops via avp_content marker and Sec-Fetch-Dest
 */
const CACHE = 'learnexcel-assets-v20261030-appshell1';
const ASSETS = [
  './app-shell.html',
  './app-shell.css',
  './app-shell.js',
  './style.css',
  './simple-nav.css',
  './avp-global-header-v1.css',
  './avp-core.css',
  './avp-site-motion.css',
  './avp-hover-lift.css',
  './site-upgrade-v1.css',
  './home-ui-owner-v1.css',
  './upgrade.css',
  './homepage-minimal-v1.css',
  './simple-nav.js',
  './avp-logo.svg',
  './avp-core.js',
  './avp-site-motion.js',
  './home-effects.js',
  './home-page-motion.js',
  './home-page-motion-core-v108.js',
  './global-search.js',
  './site-upgrade-v1.js',
  './homepage-minimal-v1.js',
  './avp-home-hero-v2.webp',
  './site-runtime-cache-v1.js',
  './site-auth-cache-v1.js',
  './analytics-tracker.js',
  './daily-header-badge-v1.js',
  './learning-chapter-analytics-v1.js',
  './avp-settings.js',
  './offline.html',
  './manifest.webmanifest'
];

const SHELL_EXCLUDE = new Set([
  'app-shell.html',
  'admin.html',
  'office-quest-admin.html',
  'office-quest-world.html',
  'auth.html',
  'offline.html'
]);

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.allSettled(
        ASSETS.map((url) => cache.add(new Request(url, { cache: 'reload' })))
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

function pageName(url) {
  const path = url.pathname || '';
  const seg = path.split('/').pop() || 'index.html';
  return (seg || 'index.html').toLowerCase();
}

function isHTMLRequest(req, url) {
  if (req.mode === 'navigate') return true;
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('/')) return true;
  const dest = req.headers.get('Sec-Fetch-Dest') || '';
  return dest === 'document';
}

function isContentFetch(req, url) {
  // iframe loads and explicit content marker must receive the real page
  if (url.searchParams.get('avp_content') === '1') return true;
  if (url.searchParams.get('embed') === '1') return true;
  const dest = req.headers.get('Sec-Fetch-Dest') || '';
  if (dest === 'iframe' || dest === 'embed') return true;
  // Shell internal fetch of itself
  if (pageName(url) === 'app-shell.html') return true;
  return false;
}

function shouldUseShell(req, url) {
  if (req.method !== 'GET') return false;
  if (!isHTMLRequest(req, url)) return false;
  if (isContentFetch(req, url)) return false;
  if (SHELL_EXCLUDE.has(pageName(url))) return false;
  // Only top-level navigations
  const dest = req.headers.get('Sec-Fetch-Dest') || '';
  if (dest && dest !== 'document') return false;
  if (req.mode === 'navigate') return true;
  // fallback: treat .html navigations without content marker as shell
  return url.pathname.endsWith('.html') || url.pathname.endsWith('/');
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req, { cache: 'no-store' });
    if (res && res.ok) {
      cache.put(req, res.clone()).catch(() => {});
      return res;
    }
    const cached = await cache.match(req);
    if (cached) return cached;
    return res;
  } catch (_) {
    const cached = await cache.match(req);
    if (cached) return cached;
    if (req.mode === 'navigate') {
      const offline = await cache.match('./offline.html');
      if (offline) return offline;
    }
    return Response.error();
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  } catch (_) {
    return Response.error();
  }
}

async function serveShell(req) {
  const cache = await caches.open(CACHE);
  // Try network shell first so updates land quickly
  try {
    const shellReq = new Request(new URL('app-shell.html', self.registration.scope).href, {
      cache: 'no-store'
    });
    const res = await fetch(shellReq);
    if (res && res.ok) {
      cache.put(shellReq, res.clone()).catch(() => {});
      return res;
    }
  } catch (_) {}
  const cached =
    (await cache.match('./app-shell.html')) ||
    (await cache.match(new URL('app-shell.html', self.registration.scope).href));
  if (cached) return cached;
  // Last resort: pass through original document
  return networkFirst(req);
}

/** For standalone first-load / excluded pages: inject simple-nav if missing */
async function injectGlobalHeader(req, res) {
  if (!res || !res.ok) return res;
  try {
    const url = new URL(req.url);
    const page = pageName(url);
    if (SHELL_EXCLUDE.has(page) && page !== 'offline.html') return res;
    if (page === 'app-shell.html') return res;
    const type = res.headers.get('content-type') || '';
    if (!type.includes('text/html')) return res;
    // Content embeds already hide chrome via simple-nav; still allow inject if missing
    const html = await res.text();
    const headers = new Headers(res.headers);
    headers.delete('content-length');
    headers.delete('content-encoding');
    headers.delete('transfer-encoding');
    if (html.includes('simple-nav.js') || html.includes('app-shell.js')) {
      return new Response(html, { status: res.status, statusText: res.statusText, headers });
    }
    const tag =
      '<script defer src="./simple-nav.js?v=20261030-appshell1" data-avp-global-header-loader></script>';
    const updated = html.includes('</body>') ? html.replace('</body>', tag + '</body>') : html + tag;
    return new Response(updated, { status: res.status, statusText: res.statusText, headers });
  } catch (_) {
    return res;
  }
}

async function simpleNavWithDailyBadge(req) {
  const base = await networkFirst(req);
  if (!base || !base.ok) return base;
  try {
    const text = await base.text();
    const inject =
      "\n;fetch('./daily-header-badge-v1.js?v=20260914-badge1',{cache:'no-store'}).then(function(r){return r.text()}).then(function(code){try{(0,eval)(code)}catch(e){console.warn('[AVP daily badge]',e)}}).catch(function(){});\n";
    return new Response(text + inject, {
      status: base.status,
      statusText: base.statusText,
      headers: base.headers
    });
  } catch (_) {
    return base;
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Scope guard for project-pages subdirectory
  const scopePath = new URL(self.registration.scope).pathname;
  if (!url.pathname.startsWith(scopePath.replace(/\/$/, '')) && scopePath !== '/') {
    // allow if same origin under scope
  }

  if (url.pathname.endsWith('/simple-nav.js')) {
    event.respondWith(simpleNavWithDailyBadge(req));
    return;
  }

  // App shell routing for top-level HTML navigations
  if (shouldUseShell(req, url)) {
    event.respondWith(serveShell(req));
    return;
  }

  const isHTML =
    req.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('/') ||
    (req.headers.get('Sec-Fetch-Dest') || '') === 'iframe';
  const isCode = /\.(?:js|css|json|webmanifest)$/i.test(url.pathname);

  if (isHTML) {
    event.respondWith(networkFirst(req).then((res) => injectGlobalHeader(req, res)));
    return;
  }
  if (isCode) {
    event.respondWith(networkFirst(req));
    return;
  }
  event.respondWith(cacheFirst(req));
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Anh Văn Phòng', body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'Anh Văn Phòng';
  const options = {
    body: data.body || 'Có phản hồi mới từ người dùng.',
    icon: data.icon || 'icon-192.png',
    badge: data.badge || 'icon-192.png',
    tag: data.tag || 'avp-admin-push',
    renotify: true,
    data: { url: data.url || 'admin.html' },
    vibrate: [120, 70, 120]
  };
  event.waitUntil(
    self.registration.showNotification(title, options).then(() => {
      if ('setAppBadge' in self.navigator) return self.navigator.setAppBadge().catch(() => {});
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if ('clearAppBadge' in self.navigator) self.navigator.clearAppBadge().catch(() => {});
  const raw = (event.notification.data && event.notification.data.url) || 'admin.html';
  const target = new URL(raw, self.registration.scope).href;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) {
          try { c.navigate(target); } catch (_) {}
          return c.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
