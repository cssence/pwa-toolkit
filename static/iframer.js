/*global document: false, App: false */
(function (document, App) {
	"use strict";
	if (typeof App.data === "object" && App.data.hasOwnProperty("length")) {
		App.data.forEach(function (frame) {
			var iframe, a;
			if (frame.url) {
				iframe = document.createElement("iframe");
				iframe.src = frame.url;
				(frame.style || "").split(";").forEach(function (style) {
					style = style.split(":");
					iframe.style[style[0]] = style[1];
				});
				//a = document.createElement("a");
				//a.href = frame.url;
				//a.appendChild(document.createTextNode(frame.name || frame.url));
				document.body.appendChild(iframe);
			}
		});
	}
}(document, App));
