/*jshint node: true */
"use strict";
var path = require("path");

var pkg = require("./package.json");
pkg.config = pkg.config || {};
pkg.config.port = process.env.PORT || pkg.config.port || 8080;
pkg.config.environment = (process.env.ENV || pkg.config.enviroment || "development").toLowerCase();
pkg.config.verbose = pkg.config.environment === "development";

var app = require("express")();
var serveStatic = require("serve-static");
var routes = require(path.join(__dirname, "routes.js"))(pkg);
app.set("port", pkg.config.port);
app.all("*", routes.log);
if (!pkg.config.verbose) {
	app.use(serveStatic(pkg.config.folders.temp, {index: false}));
}
app.use(serveStatic(pkg.config.folders.assets, {index: false}));
app.locals.basedir = pkg.config.folders.views;
app.set("views", pkg.config.folders.views);
app.set("view engine", "jade");
app.get("*", routes.render);
app.use(routes.error);

require("http").createServer(app).listen(pkg.config.port, function () {
	console.info("Express %s server listening on port %d", pkg.config.environment, pkg.config.port);
});
