// Agun Panjika service worker: network-first for the page, stale-while-revalidate for assets and data.
const CACHE = "agun-panjika-global-v3";
const PRECACHE = [];

self.addEventListener("install", (e) => e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('agun-panjika-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

async function mediaRange(request) {
  const cached = await caches.open(CACHE).then(cache => cache.match(request, { ignoreVary: true })).catch(() => undefined);
  const range = /^bytes=(\d*)-(\d*)$/i.exec(request.headers.get('range').trim());
  const condition = request.headers.get('if-range');
  if (!cached || cached.status !== 200 || cached.headers.has('content-encoding') ||
      !range || (!range[1] && !range[2]) ||
      (condition && (condition.startsWith('W/') ||
        (condition !== cached.headers.get('etag') && condition !== cached.headers.get('last-modified'))))) return fetch(request, { cache: 'no-cache' });

  let body;
  try { body = await cached.blob(); } catch { return fetch(request, { cache: 'no-cache' }); }
  const start = range[1] ? Number(range[1]) : Math.max(0, body.size - Number(range[2]));
  const end = range[1] && range[2] ? Math.min(Number(range[2]), body.size - 1) : body.size - 1;
  if (!Number.isSafeInteger(start) || start >= body.size || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${body.size}` } });
  }
  const headers = new Headers(cached.headers);
  headers.set('Content-Range', `bytes ${start}-${end}/${body.size}`);
  headers.set('Content-Length', String(end - start + 1));
  headers.set('Accept-Ranges', 'bytes');
  return new Response(body.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers });
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // map tiles and fonts go straight to the network
  // Slice an already cached movie correctly; never cache partial streaming responses.
  if (req.headers.has('range')) {
    if (req.destination === 'video' || req.destination === 'audio' || url.pathname.endsWith('.mp4')) e.respondWith(mediaRange(req));
    return;
  }
  if (req.destination === 'video' || req.destination === 'audio') {
    e.respondWith(fetch(req, { cache: 'no-cache' }));
    return;
  }
  if (url.pathname.endsWith('.mp4')) {
    e.respondWith(fetch(req, { cache: 'no-cache' }).then(response => {
      if (response.status === 200) {
        const copy = response.clone();
        e.waitUntil(caches.open(CACHE).then(cache => cache.put(req, copy)).catch(() => {}));
      }
      return response;
    }).catch(() => caches.match(req, { ignoreVary: true }).then(hit => hit || Response.error())));
    return;
  }

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
