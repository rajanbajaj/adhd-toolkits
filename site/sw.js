const CACHE = 'toolkits-v3';
const PRECACHE = [
  '/toolkits/audhd_comfort_zone.html',
  '/toolkits/adhd_sde_toolkit.html',
  '/toolkits/good_enough_now.html',
  '/toolkits/wide_first.html',
  '/toolkits/grounding_anchor.html',
  '/index.html',
  '/icon.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Only intercept same-origin requests
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const networkFetch = fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      // Return cached immediately, update in background (stale-while-revalidate)
      return cached || networkFetch;
    })
  );
});
