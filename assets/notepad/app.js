(function (window, document, navigator) {
	"use strict";
	if (navigator && "serviceWorker" in navigator) {
		navigator.serviceWorker.register("sw.js");
	}
	if (!("localStorage" in window)) {
		return;
	}
	var TEXT_KEY = location.pathname;
	var textarea = document.querySelector("textarea");
	textarea.value = window.localStorage.getItem(TEXT_KEY);
	var update = function () {
		var pre = document.querySelector("pre");
		pre.innerHTML = textarea.value.replace(/(\b(https?|mailto|tel):\/\/[^\s]*)/g, function (url) {
			return "<a target=\"_blank\" href=\"" + url + "\">" + url + "</a>";
		});
	};
	document.querySelector(".action--toggle").addEventListener("click", function (event) {
		var body = document.querySelector("body");
		body.classList.toggle("edit");
		if (body.classList.contains("edit")) {
			textarea.focus();
		} else {
			update();
		}
	});
	textarea.addEventListener("blur", function (event) {
		window.localStorage.setItem(TEXT_KEY, event.target.value);
	});
	update();
}(window, document, navigator));
