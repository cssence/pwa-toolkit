(function (window, document, navigator) {
	"use strict";
	// prepare log
	document.querySelector("main").innerHTML = "<ul></ul>";
	// add action button events
	document.querySelector(".action--clear").addEventListener("click", function (event) {
		document.querySelector("main ul").innerHTML = "";
	});
	// document.querySelector(".action--toggle-keyboard").addEventListener("click", function (event) {
	// 	var input = document.querySelector("input");
	// 	input.type = input.type === "text" ? "number" : "text";
	// 	input.focus();
	// });
	document.querySelector(".action--reset").addEventListener("click", function (event) {
		var input = document.querySelector("input");
		input.focus();
	});
	document.querySelector("form").addEventListener("submit", function (event) {
		event.preventDefault();
		var input = document.querySelector("input");
		if (input.value === "") {
			return;
		}
		var historyItem = document.createElement("li");
		historyItem.setAttribute("data-input", input.value);
		try {
			var result = eval(input.value);
		} catch (err) {
			historyItem.className = "error";
			historyItem.textContent = err;
		}
		if (!historyItem.className) {
			if (typeof result === "number") {
				var data = document.createElement("data");
				data.setAttribute("value", result);
				var lossOfPrecision = parseFloat(result.toPrecision(12));
				if (result !== lossOfPrecision) {
					historyItem.className = "warning";
					result = lossOfPrecision;
				}
				input.value = parseFloat(result);
				result = result.toLocaleString("en-US", {"useGrouping": true, "minimumFractionDigits": 2, "maximumFractionDigits": 6});
				data.textContent = result;
				historyItem.appendChild(data);
			} else {
				historyItem.textContent = result;
			}
		}
		document.querySelector("main ul").append(historyItem);
		historyItem.scrollIntoView();
		input.focus();
	});
	// document.querySelector("input").addEventListener("blur", function (event) {
	// 	var input = document.querySelector("input");
	// 	input.type = "text";
	// });
	// focus on input field
	window.addEventListener("load", function (event) {
		document.querySelector("input").focus();
	});
}(window, document, navigator));
