const CACHE_NAME = 'calctas-cache-v1';
// Liste des fichiers à mettre en cache
const urlsToCache = [
  './', // L'alias pour index.html
  'index.html',
  'manifest.json',
  'logocalc.png',
  'icon-192x192.png',
  'icon-512x512.png',
  // On met aussi en cache les polices et icônes externes pour un vrai mode hors-ligne
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Orbitron:wght@500&family=Stardos+Stencil:wght@700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css'
];

// Étape d'installation : on ouvre le cache et on ajoute nos fichiers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Étape de fetch : on intercepte les requêtes réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    // On cherche d'abord dans le cache
    caches.match(event.request)
      .then(response => {
        // Si la ressource est dans le cache, on la renvoie
        if (response) {
          return response;
        }
        // Sinon, on fait la requête réseau
        return fetch(event.request);
      }
    )
  );
});

// Étape d'activation : on nettoie les anciens caches si nécessaire
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});