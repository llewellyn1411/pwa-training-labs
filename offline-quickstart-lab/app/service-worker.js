const cacheName = 'cache-v1';
const precacheResources = [
  '/',
  'index.html',
  'styles/main.css',
  'images/space1.jpg',
  'images/space2.jpg',
  'images/space3.jpg'
];

self.addEventListener('install', event =>{
    console.log('install');
    event.waitUntil(
        caches.open(cacheName)
            .then(cache=>{
                return cache.addAll(precacheResources);
            })
    );
});

self.addEventListener('activate', event=>{
    console.log('activate');
});

self.addEventListener('fetch', event=>{
    console.log('fetch')
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse=>{
                if(cachedResponse){
                    return cachedResponse;
                }

                return fetch(event.request);
            })
    )
});
