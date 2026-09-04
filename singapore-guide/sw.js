const CACHE_NAME = 'sg-guide-v4';

const STATIC_FILES = [
  './index.html',
  './schedule.html',
  './day1.html',
  './day2.html',
  './day3.html',
  './day4.html',
  './day5.html',
  './day6.html',
  './day7.html',
  './spots.html',
  './gourmet.html',
  './cruise.html',
  './prep.html',
  './basics.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Google Fonts & picsum: network first, cache fallback
  if (url.hostname.includes('fonts.') || url.hostname.includes('picsum.photos')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // App files: cache first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
