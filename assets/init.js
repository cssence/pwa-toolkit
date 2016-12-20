/*global document, atob, btoa */
var App = App || {};
(function (App, document, atob, btoa) {
	"use strict";
	App.load = function (id, url, callback) {
		var request, response;
		if (url.indexOf("data:") === 0) {
			request = url.split(",");
			response = request.splice(1).join(",");
			if (request[0].split(";").pop() === "base64") {
				try {
					response = atob(response);
				} catch (e) {
					response = undefined;
				}
			}
			callback(id, response);
		} else {
			request = new XMLHttpRequest();
			request.open("GET", url, true);
			request.onerror = function () {
				callback(id);
			};
			request.onload = function () {
				callback(id, this.status >= 200 && this.status < 400 ? this.response : undefined);
			};
			request.send();
		}
	};
	App.makeLink = function (url, options) {
		options = options || {};
		options.derefer = typeof options.derefer === "undefined" || options.derefer;
		var a = document.createElement("a");
		if (options.derefer) {
			a.rel = "noreferrer";
			a.title = url;
			a.href = "data:text/html;base64," + btoa("<meta http-equiv=refresh content=0;url=" + url + ">");
			a.target = "_blank";
		} else {
			a.href = url;
		}
		if (options.text) {
			a.textContent = options.text;
		}
		return a;
	};
}(App, document, atob, btoa));
