/*global module: false */
(function () {
	"use strict";
	module.exports = {
		indexAction: function (isDev, title, error) {
			return function (req, res) {
				res.render(error ? "error" : "index", {
					verbose: isDev,
					title: title
				});
			};
		}
	};
}());
