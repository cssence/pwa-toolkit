/*jshint node: true */
"use strict";
var path = require("path");
var fs = require("fs");
var cssnano = require("cssnano");
var uglifyjs = require("uglify-js");

module.exports = function (pkg, next) {
	pkg.config.build = pkg.config.build || {};
	var dir = path.join(__dirname, pkg.config.folders.assets);
	var load = [];
	fs.readdir(dir, function (err, files) {
		if (err) throw err;
		files.forEach(function (file) {
			var addResult = function(file, content) {
				pkg.config.build[file] = content;
			};
			var ext = file.split(".").pop();
			if (ext === "css") {
				load.push(function (cb) {
					fs.readFile(path.join(dir, file), function (err, data) {
						if (err) throw err;
						cssnano.process(data).catch(function (err) {
							console.error(path.join(dir, file), "\n", err);
						}).then(function (result) {
							console.log("[minify]", file);
							addResult(file, result.css);
						}).then(cb);
					});
				});
			} else if (ext === "js") {
				load.push(function (cb) {
					var result = uglifyjs.minify(path.join(dir, file));
					console.log("[uglify]", file);
					addResult(file, result.code);
					cb();
				});
			}
		});
		require("async").parallel(load, next);
	});
};
