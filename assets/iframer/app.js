(function (window, document) {
	"use strict";
	/*window._getData(function (data) {
		if (typeof data === "object" && data.hasOwnProperty("length")) {
			data.forEach(function (frame) {
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
	});*/
}(window, document));
