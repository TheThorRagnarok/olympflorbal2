/* Olymp Florbal Tréninky – service worker (stale-while-revalidate, offline shell). */
const CACHE = 'olymp-florbal-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });

    const refresh = fetch(req)
      .then((res) => {
        if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
        return res;
      })
      .catch(() => null);

    if (cached) {
      event.waitUntil(refresh);          // aktualizace na pozadí, další načtení už bude čerstvé
      return cached;
    }
    const fresh = await refresh;
    if (fresh) return fresh;
    if (req.mode === 'navigate') {
      const shell = (await cache.match('./index.html')) || (await cache.match('./'));
      if (shell) return shell;
    }
    return new Response('Offline', { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  })());
});
