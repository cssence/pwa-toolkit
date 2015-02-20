/*global module: false */
(function () {
	"use strict";
	module.exports = {
		renderAction: function (template, options) {
			return function (req, res) {
				res.render(typeof template === "string" ? template : "error", {
					verbose: options.isDev,
					title: options.title
				});
			};
		}
	};
}());
