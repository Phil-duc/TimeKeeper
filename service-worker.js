const CACHE_NAME = 'time-keeper-cache-v2';

const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'icon.png',
  'main.js',
  'js/calendar.js',
  
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
