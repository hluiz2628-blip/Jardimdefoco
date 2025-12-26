const CACHE_NAME = 'garden-focus-v2.3.3'; // Versão nova
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  // Força o novo Service Worker a assumir o controlo logo que é descarregado
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  // Limpa TODOS os caches antigos para garantir que a imagem e nome novos apareçam
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controlo das abas abertas
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
// No seu arquivo sw.js, adicione este evento
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notifica a página quando uma nova versão está pronta
self.addEventListener('statechange', function() {
  if (self.state === 'activated') {
    // Envia mensagem para todas as páginas controladas
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'UPDATE_AVAILABLE' });
      });
    });
  }
});
