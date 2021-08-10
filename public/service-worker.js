const VERSION = 'v_1';
const CACHE_NAME = 'BudgetCache-' + VERSION;
const DATA_CACHE_NAME = 'DataCache-' + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./js/index.js",
    "./css/styles.css",
    "./icons/icon-192x192.png",
    "./icons/icon-512x512.png"
];

// Install
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Files pre-cached successfully!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('Erasing old cache', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

//Ferch cache
self.addEventListener('fetch', function (e) {
    if (e.request.url.includes('/api/')) {
        e.respondWith(
            caches
                .open(DATA_CACHE_NAME)
                .then(cache => {
                    return fetch(e.request)
                        .then(response => {
                            // If the response is good, clon and store it in cache.
                            if (response.status === 200) 
                            {
                                cache.put(e.request.url, response.clone());
                            }
                            return response;
                        })
                        .catch(err => {
                            return cache.match(e.request); //upon a failed request, try retrieving from the cache.
                        });
                })
                .catch(err => console.log(err))
        );
        return;
    }

    e.respondWith(
        fetch(e.request).catch(function() {
            return caches.match(e.request).then(function (response) {
                if (response) {
                    return response;
                } else if (e.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/'); 
                }
            });
        })
    );
});