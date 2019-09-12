(function (window, document, navigator) {
	"use strict";
	/*if (navigator && "serviceWorker" in navigator) {
		navigator.serviceWorker.register("sw.js");
	}*/
	if (!("fetch" in window) || !("localStorage" in window)) {
		return;
	}
	var dataStore;
	var URL_KEY = location.pathname;
	var update = function () {
		var url = window.localStorage.getItem(URL_KEY);
		if (!url) {
			return;
		}
		fetch(url).then(function (response) {
			return response.json();
		}).then(function (data) {
			if (typeof data !== "object" || !data.hasOwnProperty("length")) {
				return;
			}
			var makeElement = function(tag, inner, options) {
				var element = document.createElement(tag);
				if (typeof inner === "object") {
					options = inner;
					inner = null;
				}
				Object.keys(options || {}).forEach(function (key) {
					element.setAttribute(key, options[key]);
				});
				if (inner) {
					element.innerHTML = inner;
				}
				return element;
			};
			var container = document.querySelector(".content");
			container.innerHTML = "";
			var nav = makeElement("nav", {
				"class": "contacts"
			});
			container.appendChild(nav);
			nav.appendChild(makeElement("h2", data.length ? "All contacts": "No contacts"));
			var ul = makeElement("ul");
			nav.appendChild(ul);
			data.forEach(function (contact, index) {
				if (contact.id) {
					var tags = ["card"].concat(contact.tagged || []);
					if (contact.hue) {
						tags.push(contact.hue);
					}
					var li = makeElement("li", {
						"class": tags.join(" ")
					});
					var a = makeElement("a", contact.name.first + " " + contact.name.last, {
						"href": "#" + contact.id,
						"data-initial": contact.name.first[0]
					});
					var fineprint = "";
					contact.tagged.split(" ").forEach(function (tag) {
						fineprint += " <span class=\"tag\">" + tag + "</span>";
					});
					a.appendChild(makeElement("small", fineprint));
					li.appendChild(a);
					ul.appendChild(li);
				}
			});
			document.querySelector(".contacts").addEventListener("click", function (event) {
				var href = (function getRef(target) {
					var found = target.getAttribute("href");
					while (!found) {
						target = target.parentElement;
					}
					return found;
				})(event.target);
				if (!href) {
					return false;
				}
				var id = href.slice(1);
				var contact = data.filter(function (item) { return item.id === id; })[0];
				event.preventDefault(); // TODO remove and enhance
				var className = ["details"];
				if (contact.hue) {
					className.push(contact.hue);
				}
				var details = makeElement("section", {
					"id": contact.id,
					"class": className.join(" ")
				});
				details.appendChild(makeElement("h2", contact.name.first + " " + contact.name.last));
				contact.phone = contact.phone || [];
				contact.email = contact.email || [];
				if (contact.phone.length || contact.email.length) {
					var dl = makeElement("dl", {
						"class": "card"
					});
					if (contact.phone.length) {
						dl.appendChild(makeElement("dt", "<h3>Phone</h3>"));
						contact.phone.forEach(function (item) {
							var dd = makeElement("dd");
							dd.appendChild(makeElement("span", item.value + " <small>" + item.type + "</small>"));
							if (item.type.indexOf("Landline") === -1) {
								dd.appendChild(makeElement("a", "Text", {
									"href": "sms:" + item.value.replace(/\s/g, ""),
									"class": "action action--phone-text"
								}));
							}
							dd.appendChild(makeElement("a", "Call", {
								"href": "tel:" + item.value.replace(/\s/g, ""),
								"class": "action action--phone-call"
							}));
							dl.appendChild(dd);
						});
					}
					if (contact.email.length) {
						dl.appendChild(makeElement("dt", "<h3>E-Mail</h3>"));
						contact.email.forEach(function (item) {
							var dd = makeElement("dd");
							dd.appendChild(makeElement("span", item.value + " <small>" + item.type + "</small>"));
							dd.appendChild(makeElement("a", "Mail", {
								"href": "mailto:" + item.value,
								"class": "action action--mail-compose"
							}));
							dl.appendChild(dd);
						});
					}
					details.appendChild(dl);
				}
				var name = "";
				["honorific-prefix", "first", "additional", "last", "honorific-suffix"].forEach(function (item) {
					if (contact.name[item]) {
						name += (item === "honorific-suffix" ? ", " : " ");
						name += contact.name[item];
					}
				});
				details.appendChild(makeElement("div", "<h3>Honorific</h3><p>" + name.trim() + "</p>", {
					"class": "card"
				}));
				details.appendChild(makeElement("div", "<h3>Notes</h3><p>" + contact.notes.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>") + "</p>", {
					"class": "card"
				}));
				details.appendChild(makeElement("a", "Download vCard", {
					"href": "#", // TODO data uri
					"class": "action action-primary action--download",
					"download": ""
				}));
				details.appendChild(makeElement("button", "Close", {
					"class": "action action--close",
				}));
				document.body.classList.toggle("show-details");
				document.querySelector(".content").appendChild(details);
				//window.scrollTo(0, 0);
				document.querySelector(".action--close").addEventListener("click", function (event) {
					document.querySelector(".details").remove();
					document.body.classList.toggle("show-details");
				});
			});
		});
	};
	document.querySelector(".action--modify-source").addEventListener("click", function (event) {
		document.querySelector("header").classList.toggle("show-source", true);
		var input = document.querySelector(".source-url");
		input.value = window.localStorage.getItem(URL_KEY);
		input.select();
	});
	document.querySelector(".action--back").addEventListener("click", function (event) {
		document.querySelector("header").classList.toggle("show-source", false);
	});
	document.querySelector(".source-url").addEventListener("keypress", function (event) {
		if (event.keyCode === 13) {
			document.querySelector(".action--update").click();
		}
	});
	document.querySelector(".action--update").addEventListener("click", function (event) {
		window.localStorage.setItem(URL_KEY, document.querySelector(".source-url").value);
		document.querySelector("header").classList.toggle("show-source", false);
		update();
	});
	update();
}(window, document, navigator));
