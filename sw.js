// ============================================
// SERVICE WORKER - OBLU SELECT SANGELI
// Version: v5.0.0
// ============================================

const CACHE_NAME = 'oblu-sangeli-hk-cache-v8';

const ASSETS = [
  '/Hk_amenities_v3/',
  '/Hk_amenities_v3/index.html',
  '/Hk_amenities_v3/manifest.json',
  '/Hk_amenities_v3/icon-192.png',
  '/Hk_amenities_v3/icon-512.png'
];

// Install
self.addEventListener('install', function(e) {
  console.log('[SW] Installing...');
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[SW] Caching assets...');
        return cache.addAll(ASSETS);
      })
      .then(function() {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate
self.addEventListener('activate', function(e) {
  console.log('[SW] Activating...');
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
    .then(function() {
      console.log('[SW] Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        var responseClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, responseClone);
        });
        return response;
      })
      .catch(function() {
        return caches.match(e.request);
      })
  );
});

console.log('[SW] Service Worker loaded');