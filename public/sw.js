const CACHE_VERSION = "v34.0.0";
const CACHE_NAME = `moonrock-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/calculadora",
  "/receitas",
  "/oleos",
  "/aprendizado",
  "/roadmap",
  "/diario",
  "/manifest.json",
];

// ─── install ──────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // Non-critical: precache failures are not fatal
      });
    })
  );
  // Take over immediately — no waiting for page close
  self.skipWaiting();
});

// ─── fetch ────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // For navigation (HTML pages): network-first → cache fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || new Response("Offline", { status: 503 })))
    );
    return;
  }

  // For static assets: cache-first, network update in background
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Stale-while-revalidate: serve cached, fetch fresh in background
        fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
            }
          })
          .catch(() => {});
        return cached;
      }
      return fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

// ─── activate ─────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  // Take control of all open clients immediately
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      ),
      clients.claim(),
    ])
  );
});
