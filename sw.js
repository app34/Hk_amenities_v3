// Service Worker for OBLU SELECT Sangeli Housekeeping Hub
const CACHE_NAME = 'oblu-sangeli-hk-v4';
const ASSETS = [
  '/Hk_amenities_v3/',
  '/Hk_amenities_v3/index.html',
  '/Hk_amenities_v3/manifest.json',
  '/Hk_amenities_v3/icon-192.png',
  '/Hk_amenities_v3/icon-512.png'
];

// Install event - cache assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching assets...');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Clone and cache successful responses
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
