/*global App: false */
(function (document, App) {
	"use strict";
	var todo = {}, todoXhr, countdown, reservedWords = ["html", "script", "style"];
	reservedWords.concat(["json"]).forEach(function (word) {
		todo[word] = [];
	});
	(location.search.slice(1) || "").split("&").forEach(function (param) {
		param = param.split("=");
		if (param.length === 2) {
			param = {key: param[0], value: decodeURIComponent(param[1])};
			if (reservedWords.indexOf(param.key) !== -1) {
				todo[param.key].push(param.value);
			} else {
				todo.json.push({id: param.key, url: param.value});
			}
		}
	});
	todo.style.forEach(function (url) {
		var element = document.createElement("link");
		element.rel = "stylesheet";
		element.href = url;
		document.head.appendChild(element);
	});
	countdown = function () {
		if ((todoXhr -= 1) <= 0) {
			document.body.innerHTML += todo.html.join("");
			todo.script.forEach(function (url) {
				var element = document.createElement("script");
				element.src = url;
				document.body.appendChild(element);
			});
		}
	};
	todoXhr = todo.html.length + todo.json.length;
	if (!todoXhr) {
		countdown();
		return;
	}
	todo.json.forEach(function (json) {
		App.load(json.id, json.url, function (id, data) {
			try {
				App[id] = JSON.parse(data);
			} catch (e) {
				App[id] = data;
			}
			countdown();
		});
	});
	todo.html.forEach(function (url, index) {
		App.load(index, url, function (id, htmlSnippet) {
			todo.html[id] = htmlSnippet || "";
			countdown();
		});
	});
}(document, App));
