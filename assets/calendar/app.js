(function (window, document, navigator) {
	"use strict";
	if (navigator && "serviceWorker" in navigator) {
		navigator.serviceWorker.register("sw.js");
	}
	if (!("fetch" in window) || !("localStorage" in window)) {
		return;
	}
	var URL_KEY = location.pathname;
	var makeLink = function (url, options) {
		options = options || {};
		var a = document.createElement("a");
		a.rel = "noreferrer";
		a.href = url;
		a.target = "_blank";
		if (options.text) {
			a.textContent = options.text;
		}
		return a;
	};
	var update = function () {
		var	calendar,
			week,
			day,
			marker,
			index = {},
			addAppointments,
			addAppointment,
			START_WEEK = 1, //Monday
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
		marker.setDate(now.getDate() + index.first);
		for (index.current = index.first; index.current <= index.last; index.current += 1) {
			if (marker.getDay() === START_WEEK) {
				week = document.createElement("tr");
			}
			day = document.createElement("td");
			day.setAttribute("data-date", marker.toISOString().split("T")[0]);
			day.setAttribute("data-day", marker.getDate());
			if (marker.getDate() === 1) {
				day.setAttribute("data-month", marker.toGMTString().split(" ")[2].toUpperCase());
			}
			if (index.current === 0) {
				day.id = "today";
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
		var parent = document.querySelector("main");
		parent.innerHTML = "";
		parent.appendChild(calendar);
		var scroll2Today = function () {
			var todayRect = document.getElementById("today").getBoundingClientRect();
			window.scrollTo(0, window.pageYOffset + todayRect.top - todayRect.height - document.querySelector("header").offsetHeight);
		};
		scroll2Today();
		parent.addEventListener("click", function (event) {
			var dayExpanded, day;
			dayExpanded = document.querySelector("[aria-expanded]");
			day = event.target;
			while (!day.getAttribute("data-date")) {
				if (day.tagName.toLowerCase() === "main") {
					return;
				}
				day = day.parentElement;
			}
			if (day !== dayExpanded) {
				if (dayExpanded) {
					dayExpanded.removeAttribute("aria-expanded");
				}
				if (day && !day.getAttribute("aria-expanded") && day.querySelector(".events")) {
					day.setAttribute("aria-expanded", "true");
				}
			}
		});
		// TODO add setTimeOut to listen for date change and adapt class/data-
		var url = window.localStorage.getItem(URL_KEY);
		if (!url) {
			return;
		}
		fetch(url).then(function (response) {
			return response.json();
		}).then(function (data) {
			if (!data || typeof data !== "object") {
				return;
			}
			addAppointments = function (appointments, datePick, todo) {
				(appointments || []).forEach(function (entry) {
					if (entry[datePick]) {
						todo(entry);
					}
				});
			};
			addAppointment = function (day, type, entry) {
				if (!day) {
					return;
				}
				var appointmentList, appointment, addNode, details = {};
				addNode = function (parentNode, tagName, text, options) {
					var node;
					options = options || {};
					if (text) {
						node = document.createElement(tagName);
						["className", "title"].forEach(function (attribute) {
							if (options[attribute]) {
								node[attribute] = options[attribute];
							}
						});
						if (text && typeof text !== "boolean") {
							node[options.html ? "innerHTML" : "textContent"] = text;
						}
						parentNode.appendChild(node);
					}
					return node;
				};
				appointmentList = day.querySelector("ul") || addNode(day, "ul", true, {className: "events"});
				appointment = document.createElement("li");
				appointment.className = "event " + type;
				details.time = (entry.due || entry.start).slice(11, 16);
				addNode(appointment, "time", details.time);
				details.name = entry.name.split(" ");
				details.name.forEach(function (word, index) {
					if (word && ["#", "@", "+"].indexOf(word.charAt(0)) !== -1) {
						details.name[index] = "<i class=tag title=" + word + ">" + word.slice(1) + "</i>";
					}
				});
				appointment.innerHTML += " " + details.name.join(" ");
				addNode(appointment, "p", (entry.location || "").replace(/[\s\S]+/, function (text) {
					var url = "https://www.google.com/maps?q=" + encodeURIComponent(text);
					return makeLink(url, {text: text}).outerHTML;
				}), {className: "location", html: true});
				addNode(appointment, "p", (entry.description || "").replace(/(https?)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/g, function (url) {
					return makeLink(url, {text: url}).outerHTML;
				}), {className: "description", html: true});
				appointmentList.appendChild(appointment);
			};
			addAppointments(data.holidays, "start", function (entry) {
				day = document.querySelector("[data-date='" + entry.start + "']");
				if (day) {
					day.setAttribute("data-public-holiday", entry.name || "");
				}
			});
			addAppointments(data.birthdays, "start", function (entry) {
				var dt, yearOfBirth;
				entry.name += " #";
				["last", "this", "next"].forEach(function (year) {
					year = index.year[year];
					dt = entry.start.split("-");
					yearOfBirth = parseInt(dt[0], 10);
					dt[0] = year;
					day = document.querySelector("[data-date='" + dt.join("-") + "']");
					entry.name = entry.name.slice(0, entry.name.lastIndexOf("#") + 1) + (year - yearOfBirth);
					addAppointment(day, "birthday", entry);
				});
			});
			addAppointments(data.appointments, "start", function (entry) {
				day = document.querySelector("[data-date='" + entry.start.slice(0, 10) + "']");
				addAppointment(day, "simplified", entry);
			});
			addAppointments(data.tasks, "due", function (entry) {
				day = document.querySelector("[data-date='" + entry.due.slice(0, 10) + "']");
				addAppointment(day, "task", entry);
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
