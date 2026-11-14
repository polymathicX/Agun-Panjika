// Agun Panjika service worker: network-first for the page, stale-while-revalidate for assets and data.
const CACHE = "agun-panjika-global-v3";
const PRECACHE = [];

self.addEventListener("install", (e) => e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('agun-panjika-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // map tiles and fonts go straight to the network

  if (req.mode === "navigate" || url.pathname.endsWith('.json') || url.pathname.endsWith('.geojson')) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          if (res.ok) caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || (req.mode === 'navigate' ? caches.match("./") : Response.error()))),
    );
    return;
  }

  e.respondWith(
    caches.open(CACHE).then((cache) =>
      // Public static modules can vary on Origin, which differs from the precache request.
      cache.match(req, { ignoreVary: true }).then((hit) => {
        const net = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || net;
      }),
    ),
  );
});
