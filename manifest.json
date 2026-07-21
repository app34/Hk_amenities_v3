// ============================================
// SERVICE WORKER - OBLU SELECT SANGELI
// Version: v4.0.3 | Build: 2026-07-21
// ============================================

const CACHE_NAME = 'oblu-sangeli-hk-cache-v6'; // INCREMENTED VERSION
const CACHE_STAMP = Date.now().toString();

const ASSETS = [
  '/Hk_amenities_v3/',
  '/Hk_amenities_v3/index.html?ver=' + CACHE_STAMP,
  '/Hk_amenities_v3/manifest.json',
  '/Hk_amenities_v3/icon-192.png',
  '/Hk_amenities_v3/icon-512.png'
];

// ============================================
// INSTALL EVENT
// ============================================
self.addEventListener('install', (e) => {
  console.log('[SW] Installing new version:', CACHE_NAME);
  console.log('[SW] Cache stamp:', CACHE_STAMP);
  
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
      .catch((err) => {
        console.error('[SW] Installation failed:', err);
      })
  );
});

// ============================================
// ACTIVATE EVENT
// ============================================
self.addEventListener('activate', (e) => {
  console.log('[SW] Activating:', CACHE_NAME);
  
  e.waitUntil(
    caches.keys()
      .then((keys) => {
        console.log('[SW] Existing caches:', keys);
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Old caches cleared');
        return self.clients.claim();
      })
      .then(() => {
        console.log('[SW] Clients claimed');
        return self.clients.matchAll();
      })
      .then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_NAME,
            timestamp: CACHE_STAMP
          });
        });
        console.log('[SW] Update notification sent to clients');
      })
  );
});

// ============================================
// FETCH EVENT
// ============================================
self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(e.request, responseClone);
            })
            .catch((err) => {
              console.log('[SW] Cache put error:', err);
            });
        }
        return response;
      })
      .catch(() => {
        return caches.match(e.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[SW] Serving from cache:', e.request.url);
              return cachedResponse;
            }
            console.log('[SW] No cache found for:', e.request.url);
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// ============================================
// MESSAGE HANDLER
// ============================================
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data === 'skipWaiting') {
    console.log('[SW] Skipping waiting...');
    self.skipWaiting();
  }
  
  if (event.data === 'getVersion') {
    event.ports[0].postMessage({
      version: CACHE_NAME,
      timestamp: CACHE_STAMP
    });
  }
});

// ============================================
// PUSH NOTIFICATION
// ============================================
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Sangeli HK Update';
  const options = {
    body: data.body || 'New updates available!',
    icon: '/Hk_amenities_v3/icon-192.png',
    badge: '/Hk_amenities_v3/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/Hk_amenities_v3/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ============================================
// NOTIFICATION CLICK
// ============================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/Hk_amenities_v3/')
  );
});

console.log('[SW] Service Worker loaded successfully!');
console.log('[SW] Cache Name:', CACHE_NAME);
console.log('[SW] Cache Stamp:', CACHE_STAMP);