const filesToCache = [
    '/',
    'style/main.css',
    'images/still_life_medium.jpg',
    'index.html',
    'pages/offline.html',
    'pages/404.html'
];

const staticCacheName = 'static-cache-name-v2';

self.addEventListener('install', event => {
    console.log('Install');

    event.waitUntil(
        caches.open(staticCacheName)
        .then((cache)=>{
            return cache.addAll(filesToCache);
        })
        .catch(err=>console.error(err)));
});

self.addEventListener('fetch', event =>{
    console.log('Fetch event for', event.request.url);

    event.respondWith(
        caches.match(event.request)
        .then((res)=>{
            if(res){
                console.log('Found', event.request.url);
                return res;
            }

            console.log('Networ request for', event.request.url);
            return fetch(event.request).then((res)=>{

                if(!res.ok){
                    return caches.match('pages/404.html');
                }
                return caches.open(staticCacheName).then(cache=>{
                    console.log(res);
                    cache.put(event.request.url, res.clone());
                    return res;
                });
            });
        })
        .catch(error=>{
            console.error(error);
            return caches.match('pages/offline.html');
        })
    )
});

self.addEventListener('activate', event=>{
    console.log('Activate');

    const cacheWhiteList = [staticCacheName];

    event.waitUntil(
        caches.keys().then(cacheNames=>{
            return Promise.all(
                cacheNames.map(cacheName => {
                    if(cacheWhiteList.indexOf(cacheName) === -1){
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});