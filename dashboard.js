/*jslint nomen: true */
/*global require: false, __dirname: false, console: false, process: false */
(function () {
	"use strict";

	var	nconf, path, dir, isDev, app, mainController;
	path = require("path");

	// Read configuration (environment)
	nconf = require("nconf");
	nconf.argv().env().file({file: path.join(__dirname, "/settings.json")}).defaults({
		"env": "development",
		"port": 8080
	});
	if (!/[0-9]+/.test(nconf.get("port"))) {
		console.error("Illegal value port! Check your configuration and your settings.json file.");
		process.exit(1);
	}

	// Initialization
	isDev = "development" === nconf.get("env").toLowerCase();
	dir = {};
	app = require("express")();
	dir.views = path.join(__dirname, "/views");
	dir.plain = path.join(__dirname, "/static");
	app.locals.basedir = dir.views;
	app.use(require("errorhandler")(isDev ? {dumpExceptions: true, showStack: true} : {}));
	app.use(require("serve-static")(dir.plain, isDev ? {maxAge: 86400} : {}));
	app.use(require("serve-favicon")(path.join(dir.plain, nconf.get("icon"))));
	if (!isDev) {
		app.use(require("compression")());
	}
	app.set("port", nconf.get("port"));
	app.set("views", dir.views);
	app.set("view engine", "jade");

	// Routes
	mainController = require("./routes/main");
	app.get("/", mainController.indexAction(isDev, nconf.get("title"), nconf.get("icon")));
	app.use(mainController.indexAction(isDev, nconf.get("title"), nconf.get("icon"), 404));

	// Http server
	require("http").createServer(app).listen(nconf.get("port"), function () {
		console.info("Express %s server listening on port %d", nconf.get("env"), nconf.get("port"));
	});

}());
