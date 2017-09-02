/*jshint esversion: 6 */
(() => {
	"use strict";

	const assetCacheName = "assets-v1.0";

	self.addEventListener("install", event => {
		event.waitUntil(
			caches.open(assetCacheName)
				.then(cache => cache.add("./"))
		);
	});

	self.addEventListener("fetch", event => {
		const request = event.request;
		const url = new URL(request.url);
		if (url.origin === location.origin) {
			event.respondWith(
				caches.open(assetCacheName).then(cache => {
					return cache.match(request).then(response => response || fetch(request));
				})
			);
		} else {
			const mediaCacheName = "media";
			event.respondWith(
				caches.open(mediaCacheName).then(cache => {
					return cache.match(request).then(response => response || fetch(request).then(response => {
						cache.put(request, response.clone());
						return response;
					}));
				})			
			);
		}
	});

})();
