// v3 - force update, network first strategy
const CACHE = 'familyfinance-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Always go to network first, cache as fallback
  if (e.request.url.includes('anthropic.com') ||
      e.request.url.includes('jsonbin.io') ||
      e.request.url.includes('script.google.com') ||
      e.request.url.includes('qrserver.com')) {
    return;
  }
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
