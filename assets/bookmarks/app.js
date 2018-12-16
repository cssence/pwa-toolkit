(function (window, document, navigator) {
	"use strict";
	if (navigator && "serviceWorker" in navigator) {
		navigator.serviceWorker.register("sw.js");
	}
	if (!("fetch" in window) || !("localStorage" in window)) {
		return;
	}
	var URL_KEY = location.pathname;
	var update = function () {
		var url = window.localStorage.getItem(URL_KEY);
		if (!url) {
			return;
		}
		fetch(url).then(function (response) {
			return response.json();
		}).then(function (data) {
			if (typeof data !== "object" || !data.hasOwnProperty("length")) {
				return;
			}
			var parent = document.querySelector(".content");
			var ul = document.createElement("ul");
			parent.innerHTML = "";
			parent.appendChild(ul);
			data.forEach(function (bookmark) {
				var li, a, img;
				if (bookmark.url) {
					li = document.createElement("li");
					a = document.createElement("a");
					a.href = bookmark.url;
					a.rel = "noreferrer";
					if (bookmark.icon) {
						img = document.createElement("img");
						img.src = bookmark.icon;
						a.appendChild(img);
					}
					a.appendChild(document.createTextNode(bookmark.name || bookmark.url));
					li.appendChild(a);
					ul.appendChild(li);
				}
			});
		});
	};
	document.querySelector(".action--modify-source").addEventListener("click", function (event) {
		document.querySelector("header").classList.toggle("show-source", true);
		var input = document.querySelector(".source-url");
		input.value = window.localStorage.getItem(URL_KEY);
		input.select();
	});
	document.querySelector(".action--back").addEventListener("click", function (event) {
		document.querySelector("header").classList.toggle("show-source", false);
	});
	document.querySelector(".source-url").addEventListener("keypress", function (event) {
		if (event.keyCode === 13) {
			document.querySelector(".action--update").click();
		}
	});
	document.querySelector(".action--update").addEventListener("click", function (event) {
		window.localStorage.setItem(URL_KEY, document.querySelector(".source-url").value);
		document.querySelector("header").classList.toggle("show-source", false);
		update();
	});
	update();
}(window, document, navigator));
