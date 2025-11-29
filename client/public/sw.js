// Service Worker for offline support
const CACHE_NAME = 'translator-v2';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting(); // Activate immediately
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
      .then(() => {
        return self.clients.claim(); // Take control of all pages
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip API calls - they won't work offline anyway
  if (url.pathname.startsWith('/api/')) {
    return; // Let it go to network normally
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache static assets (HTML, JS, CSS, images)
            if (
              url.pathname.endsWith('.html') ||
              url.pathname.endsWith('.js') ||
              url.pathname.endsWith('.css') ||
              url.pathname.startsWith('/assets/') ||
              url.pathname === '/' ||
              url.origin === self.location.origin
            ) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }

            return response;
          })
          .catch(() => {
            // If network fails and it's a navigation request, return cached index.html
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

