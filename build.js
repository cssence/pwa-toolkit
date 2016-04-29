/*jshint node: true */
"use strict";
var path = require("path");
var fs = require("fs");
var jade = require("jade");

module.exports = function (pkg, next) {
	var dir = path.join(__dirname, pkg.config.folders.dist);
	var save = [];

	var exclude = ["init.css", "init.js", "index.js"];
	Object.keys(pkg.config.build).forEach(function (file) {
		if (exclude.indexOf(file) === -1) {
			save.push(function (cb) {
				fs.writeFile(path.join(dir, file), pkg.config.build[file], function (err) {
					if (err) throw err;
					console.log("[dist]", file);
					cb();
				});
			});
		}
	});

	var map = {
		"/": "index.jade",
		"/404": "404.jade"
	};
	Object.keys(map).forEach(function (reqPath) {
		var file = map[reqPath];
		save.push(function (cb) {
			var result = jade.renderFile(path.join(__dirname, pkg.config.folders.views, file), {
				title: pkg.name,
				path: reqPath,
				build: pkg.config.build
			});
			console.log("[render]", file);
			fs.writeFile(path.join(dir, file.replace(".jade", ".html")), result, function (err) {
				if (err) throw err;
				console.log("[dist]", file);
				cb();
			});
		});
	});

	require("async").parallel(save, next);
};
