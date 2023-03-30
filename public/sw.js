const CACHE_NAME = 'v2';

self.addEventListener('fetch', (event) => {
	// cache first, network second
	event.respondWith(caches.open(CACHE_NAME).then((cache) => {
		return cache.match(event.request.url).then((cachedResponse) => {
			if (cachedResponse) {
				return cachedResponse;
			}
			return fetch(event.request).then((fetchedResponse) => {
				cache.put(event.request, fetchedResponse.clone());
				return fetchedResponse;
			});
		});
	}));
});
