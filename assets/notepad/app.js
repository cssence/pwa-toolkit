(function (window, document, navigator) {
	"use strict";
	if (navigator && "serviceWorker" in navigator) {
		navigator.serviceWorker.register("sw.js");
	}
	if (!("localStorage" in window)) {
		return;
	}
	var TEXT_KEY = location.pathname;
	var text = window.localStorage.getItem(TEXT_KEY);
	document.querySelector("textarea").value = text;
	document.querySelector(".action--select-all").addEventListener("click", function (event) {
		document.querySelector("textarea").select();
	});
	document.querySelector("textarea").addEventListener("blur", function (event) {
		window.localStorage.setItem(TEXT_KEY, event.target.value);
	});
}(window, document, navigator));
