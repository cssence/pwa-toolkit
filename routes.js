/*jshint node: true */
"use strict";
var path = require("path");

module.exports = function (pkg) {
	var notFound = function (req, res) {
		res.render("404.jade", {
			path: req.path,
			build: pkg.config.build
		}, function (err, html) {
			if (err) {
				console.error(err);
				res.status(500).send(JSON.stringify(err, null, "\t"));
			} else {
				res.status(req.path.indexOf("/404") === 0 ? 200 : 404).send(html);
			}
		});
	};
	return {
		log: function (req, res, next) {
			console.log(req.method, req.path);
			next();
		},
		render: function (req, res) {
			var template = (req.path.slice(1) || "index") + ".jade";
			res.render(template, {
				title: pkg.name,
				path: req.path,
				build: pkg.config.build
			}, function (err, html) {
				if (err) {
					console.log(err);
					notFound(req, res);
				} else {
					res.send(html);
				}
			});
		},
		errorRedirect: function (req, res) {
			res.redirect(404, "/404.html");
		},
		error: notFound
	};
};
