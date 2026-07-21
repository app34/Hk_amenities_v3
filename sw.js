// ============================================
// SERVICE WORKER - OBLU SELECT SANGELI
// Version: v4.0.7 | Build: 2026-07-21
// ============================================

const CACHE_NAME = 'oblu-sangeli-hk-cache-v7';
const CACHE_STAMP = Date.now().toString();

const ASSETS = [
  '/Hk_amenities_v3/',
  '/Hk_amenities_v3/index.html',
  '/Hk_amenities_v3/manifest.json',
  '/Hk_amenities_v3/sw.js',
  '/Hk_amenities_v3/icon-192.png',
  '/Hk_amenities_v3/icon-512.png'
];

// Install Event
self.addEventListener('install', (e) => {
  console.log('[SW] Installing new version:', CACHE_NAME);
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching assets...');
        return cache.addAll(ASSETS);
      })
      .then(() => {
        console.log('[SW] All assets cached successfully');
        return self.skipWaiting();
      })
      .catch((err) => console.error('[SW] Installation failed:', err))
  );
});

// Activate Event
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

// Fetch Event
self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(e.request)
          .then((cachedResponse) => cachedResponse || new Response('Offline', { status: 503 }));
      })
  );
});

console.log('[SW] Service Worker loaded successfully! Cache:', CACHE_NAME);
