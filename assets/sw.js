/*jshint esversion: 6 */
(() => {
	"use strict";

	const assetCacheName = "assets-v1.1";

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
			// respond from cache
			event.respondWith(
				caches.open(assetCacheName).then(function (cache) {
					return cache.match(request).then(function (matching) {
						return matching || Promise.reject("no-match");
					});
				})
			);
			// check if we need to store an updated version
			event.waitUntil(
				caches.open(assetCacheName).then(function (cache) {
					return fetch(request).then(function (response) {
						return cache.put(request, response);
					});
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
