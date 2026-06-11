// Service Worker · SM Seguros Calculadora (PWA)
// Permite instalar la app y que funcione sin conexión.

var CACHE = 'sm-calc-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(['index.html', './']);
    }).catch(function(){ /* sin conexión al instalar: se cacheará al usar */ })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e) {
  // Estrategia: intenta red primero; si falla, sirve desde caché.
  e.respondWith(
    fetch(e.request)
      .then(function(resp) {
        var copy = resp.clone();
        caches.open(CACHE).then(function(cache){ cache.put(e.request, copy); }).catch(function(){});
        return resp;
      })
      .catch(function() {
        return caches.match(e.request).then(function(r){ return r || caches.match('index.html'); });
      })
  );
});
