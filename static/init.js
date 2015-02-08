/*global atob: false */
var App = {
	load: function (id, url, callback) {
		"use strict";
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
	}
};
