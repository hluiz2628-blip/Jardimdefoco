const CACHE_NAME = 'garden-focus-v7.2'; // Sempre mude isso ao subir nova versão

self.addEventListener('install', () => {
  self.skipWaiting(); // força ativação imediata
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // controla todas as abas
});
