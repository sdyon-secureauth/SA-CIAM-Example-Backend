//--------------------------------------------------------------------------
// You can find dozens of practical, detailed, and working examples of 
// service worker usage on https://github.com/mozilla/serviceworker-cookbook
//--------------------------------------------------------------------------

// Cache name
var CACHE_NAME = 'cache-version-1';

// Files
var REQUIRED_FILES = [
  'index.html',
  '/',
  'https://fonts.googleapis.com/css?family=Poppins:400,500,600&display=swap',
  'https://unpkg.com/ionicons@5.4.0/dist/ionicons.js',
  'assets/js/lib/bootstrap.bundle.min.js',
  'assets/js/plugins/splide/splide.min.js',
  'assets/js/base.js',
  'assets/css/src/splide/splide.min.css',
  'assets/css/src/bootstrap/bootstrap.min.css',
  'assets/css/style.css'
];

self.addEventListener('install', function (event) {
  // Perform install step:  loading each required file into cache
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        // Add all offline dependencies to the cache
        return cache.addAll(REQUIRED_FILES);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return the response from the cached version
        if (response) {
          return response;
        }
        // Not in cache - return the result from the live server
        // `fetch` is essentially a "fallback"
        return fetch(event.request);
      }
      )
  );
});

self.addEventListener('activate', function (event) {
  // Calling claim() to force a "controllerchange" event on navigator.serviceWorker
  event.waitUntil(self.clients.claim());
});