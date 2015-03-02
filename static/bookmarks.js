/*global App */
(function (document, App) {
	"use strict";
	if (typeof App.data === "object" && App.data.hasOwnProperty("length")) {
		var ul = document.createElement("ul");
		document.body.appendChild(ul);
		App.data.forEach(function (bookmark) {
			var li, a, img;
			if (bookmark.url) {
				li = document.createElement("li");
				a = App.makeLink(bookmark.url);
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
	}
}(document, App));
