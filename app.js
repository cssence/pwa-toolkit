/*jshint node: true */
"use strict";
var path = require("path");

var dist = process.argv[2];

var pkg = require(path.join(__dirname, "package.json"));
pkg.config = pkg.config || {};
pkg.config.port = process.env.PORT || pkg.config.port || 8080;

var app = require("express")();
var routes = require(path.join(__dirname, "routes.js"))(pkg);
var serveStatic = require("serve-static");
app.set("port", pkg.config.port);
app.all("*", routes.log);
if (dist) {
	app.use(serveStatic(pkg.config.folders.dist, { extensions: ["html"] }));
	app.use(routes.errorRedirect);
} else {
	app.use(serveStatic(pkg.config.folders.assets, { index: false }));
	app.locals.basedir = pkg.config.folders.views;
	app.set("views", pkg.config.folders.views);
	app.set("view engine", "jade");
	app.get("*", routes.render);
	app.use(routes.error);
}

var server = function () {
	require("http").createServer(app).listen(pkg.config.port, function () {
		console.info("Express %s server listening on port %d", dist || "development", pkg.config.port);
	});
};
if (dist) {
	if (dist.toLowerCase() === "build") {
		server = function () {
			console.log("Build complete.");
		};
	}
	require(path.join(__dirname, "minify.js"))(pkg, function () {
		require(path.join(__dirname, "build.js"))(pkg, server);
	});
} else {
	server();
}
