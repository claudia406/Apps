const CACHE_VERSION = 'world-travel-v1';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const SHELL_FILES = [
  './',
  'index.html',
  'manifest.json',
  'css/style.css',
  'js/app.js',
  'js/i18n.js',
  'js/db.js',
  'js/exif.js',
  'js/photos.js',
  'js/trips.js',
  'js/prefs.js',
  'js/countries-data.js',
  'js/discover.js',
  'js/map-view.js',
  'js/add-travel.js',
  'js/trip-view.js',
  'js/countries-view.js',
  'js/discover-view.js',
  'js/onboarding.js',
  'js/settings-view.js',
  'js/sortable.js',
  'js/ui.js',
  'data/countries.json',
  'data/interests.json',
  'data/discover-curated.json',
  'assets/world-map.svg',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-180.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('world-travel-') && key !== SHELL_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

function isWikipediaRequest(url) {
  return url.hostname.endsWith('wikipedia.org');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (isWikipediaRequest(url)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        try {
          const fresh = await fetch(req);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cached = await cache.match(req);
          if (cached) return cached;
          throw new Error('offline and not cached');
        }
      })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((fresh) => {
            const clone = fresh.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(req, clone));
            return fresh;
          })
          .catch(() => {
            if (req.mode === 'navigate') return caches.match('index.html');
            return undefined;
          });
      })
    );
  }
});
