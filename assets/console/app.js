(function (window, document, navigator) {
	"use strict";
	// indicator for serviceWorker and network status
	var swOutput = document.createElement("p");
	if (navigator) {
		if ("onLine" in navigator) {
			var updateConnectivity = function () {
				var indicator = document.querySelector("h1");
				indicator.classList.toggle("warning", !navigator.onLine);
				indicator.classList.toggle("ok", navigator.onLine);
			};
			updateConnectivity();
			window.addEventListener("online", updateConnectivity);
			window.addEventListener("offline", updateConnectivity);
		}
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("sw.js").then(function (registration) {
				swOutput.className = "ok";
				swOutput.textContent = "ServiceWorker activated";
			}).catch(function (err) {
				swOutput.className = "error";
				swOutput.textContent = err;
		  });
		}
	} else {
		swOutput.className = "warning";
		swOutput.textContent = "ServiceWorker cannot be registered, minimum browser requirements not met";
	}
	document.querySelector(".content").append(swOutput);
	// add action button events
	document.querySelector(".action--clear").addEventListener("click", function (event) {
		document.querySelector(".content").innerHTML = "";
	});
	// manage text input
	document.querySelector("input").addEventListener("keypress", function (event) {
		if (event.keyCode === 13) {
			var evalOutput = document.createElement("p");
			try {
				/*jshint evil:true*/
				evalOutput.textContent = eval(event.target.value) || "undefined";
			} catch (err) {
				evalOutput.className = "error";
				evalOutput.textContent = err;
			}
			document.querySelector(".content").append(evalOutput);
			evalOutput.scrollIntoView();
			event.target.select();
		}
	});
}(window, document, navigator));
