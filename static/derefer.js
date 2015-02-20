/*global App: false */
(function (document, location) {
	"use strict";
	(location.search.slice(1) || "").split("&").forEach(function (param) {
		param = param.split("=");
		if (param[0] === "u" && param[1]) {
			location.href = decodeURIComponent(param[1]);
		}
	});
}(document, location));
