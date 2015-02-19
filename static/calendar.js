/*global document: false, App: false */
(function (document, App) {
	"use strict";
	var	calendar,
		week,
		day,
		marker,
		index = {},
		markWeek,
		addEvents,
		addEvent,
		START_WEEK = 1,//Monday
		DAYS_IN_WEEK = 7,
		now = new Date();
	calendar = document.createElement("table");
	marker = new Date(now);
	index.year = {};
	index.year["this"] = now.getFullYear();
	index.year.last = index.year["this"] - 1;
	index.year.next = index.year["this"] + 1;
	index.week = {};
	index.week["this"] = START_WEEK - now.getDay();
	if (index.week["this"] > 0) {
		index.week["this"] -= DAYS_IN_WEEK;
	}
	index.week.last = index.week["this"] - DAYS_IN_WEEK;
	index.week.next = index.week["this"] + DAYS_IN_WEEK;
	index.first = index.week["this"] - 5 * DAYS_IN_WEEK;
	index.last = index.week.next - 1 + 50 * DAYS_IN_WEEK;
	markWeek = function (period) {
		if (index.current === index.week[period]) {
			week.setAttribute("data-week", period);
		}
	};
	marker.setDate(now.getDate() + index.first);
	for (index.current = index.first; index.current <= index.last; index.current += 1) {
		if (marker.getDay() === START_WEEK) {
			week = document.createElement("tr");
			["last", "this", "next"].forEach(markWeek);
		}
		day = document.createElement("td");
		day.setAttribute("data-date", marker.toISOString().split("T")[0]);
		day.setAttribute("data-day", marker.getDate());
		if (marker.getDate() === 1) {
			day.setAttribute("data-month", marker.toGMTString().split(" ")[2].toUpperCase());
		}
		if (index.current <= 0) {
			day.classList.add(index.current === 0 ? "today" : "past");
		}
		if ([0, 6].indexOf(marker.getDay()) !== -1) {
			day.classList.add("weekend");
		}
		if (marker.getMonth() % 2 !== now.getMonth() % 2) {
			day.classList.add("alternate");
		}
		week.appendChild(day);
		marker.setDate(marker.getDate() + 1);
		if (marker.getDay() === START_WEEK) {
			calendar.appendChild(week);
		}
	}
	document.body.appendChild(calendar);
	document.querySelector("[data-week='last']").scrollIntoView(true);
	document.body.addEventListener("click", function (event) {
		var dayExpanded, day;
		dayExpanded = document.querySelector("[aria-expanded]");
		Array.prototype.forEach.call(event.path, function (element) {
			day = day || (typeof element.getAttribute === "function" && element.getAttribute("data-date") && element);
		});
		if (day !== dayExpanded) {
			if (dayExpanded) {
				dayExpanded.removeAttribute("aria-expanded");
			}
			if (day && !day.getAttribute("aria-expanded") && day.querySelectorAll(".event").length) {
				day.setAttribute("aria-expanded", "true");
			}
		}
	});
	// TODO add setTimeOut to listen for date change and adapt class/data-
	if (typeof App.data === "object") {
		addEvents = function (events, datePick, todo) {
			(events || []).forEach(function (entry) {
				if (entry[datePick]) {
					todo(entry);
				}
			});
		};
		addEvent = function (day, type, entry) {
			if (!day) {
				return;
			}
			var eventList, event, addNode, details = {};
			addNode = function (parentNode, tagName, text, attributes) {
				var node;
				attributes = attributes || {};
				if (text) {
					node = document.createElement(tagName);
					["className", "href", "title"].forEach(function (attribute) {
						if (attributes[attribute]) {
							node[attribute] = attributes[attribute];
						}
					});
					if (text && typeof text !== "boolean") {
						node.textContent = text;
					}
					parentNode.appendChild(node);
				}
				return node;
			};
			eventList = day.querySelector("ul") || addNode(day, "ul", true, {className: "events"});
			event = document.createElement("li");
			event.className = "event " + type;
			details.time = (entry.due || entry.start).slice(11, 16);
			addNode(event, "time", details.time);
			event.appendChild(document.createTextNode((details.time ? " " : "") + entry.name + " "));
			if (entry.tags) {
				if (typeof entry.tags !== "object" || !entry.tags.length) {
					entry.tags = [entry.tags.toString()];
				}
				details.tags = addNode(event, "ul", true, {className: "tags"});
				entry.tags.forEach(function (tag) {
					addNode(details.tags, "li", tag, {className: "tag", title: tag});
				});
			}
			details.location = addNode(event, "p", !!entry.location, {className: "location"});
			addNode(details.location, "a", entry.location, {href: "/derefer/?u=maps.google.com"});
			addNode(event, "p", entry.description, {className: "description"});
			//details.description = addNode(event, "p", !!entry.description, {className: "description"});
			//details.description.innerHTML = entry.description
			eventList.appendChild(event);
		};
		addEvents(App.data.holidays, "start", function (entry) {
			day = document.querySelector("[data-date='" + entry.start + "']");
			if (day) {
				day.setAttribute("data-public-holiday", entry.name || "");
			}
		});
		addEvents(App.data.birthdays, "start", function (entry) {
			var dt, yearOfBirth;
			entry.tags = [-1].concat(entry.tags || []);
			["last", "current", "next"].forEach(function (year) {
				year = index.year[year];
				dt = entry.start.split("-");
				yearOfBirth = parseInt(dt[0], 10);
				dt[0] = year;
				day = document.querySelector("[data-date='" + dt.join("-") + "']");
				entry.tags[0] = year - yearOfBirth;
				addEvent(day, "birthday", entry);
			});
		});
		addEvents(App.data.events, "start", function (entry) {
			day = document.querySelector("[data-date='" + entry.start.slice(0, 10) + "']");
			addEvent(day, "simplified", entry);
		});
		addEvents(App.data.tasks, "due", function (entry) {
			day = document.querySelector("[data-date='" + entry.due.slice(0, 10) + "']");
			//entry.tags = ["TODO"].concat(entry.tags || []);
			addEvent(day, "task", entry);
		});
	}
}(document, App));
