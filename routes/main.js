/*global module: false */
(function () {
	"use strict";
	module.exports = {
		indexAction: function (isDev, title, icon, error) {
			return function (req, res) {
				res.render(error ? "error" : "index", {
					verbose: isDev,
					title: title,
					icon: icon
				});
			};
		}
	};
}());
