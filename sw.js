const CACHE_NAME = 'garden-focus-v2.3.4'; // Aumente o número aqui para testar

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Força a instalação imediata
});

// Escuta a mensagem do botão "Atualizar Agora"
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Limpa caches antigos quando a nova versão ativa
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Lógica de busca de arquivos (Offline)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
