/*jslint nomen: true */
/*global require: false, __dirname: false, console: false, process: false */
(function () {
	"use strict";

	var	nconf, path, dir, app, mainController, options = {};
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
	options.isDev = "development" === nconf.get("env").toLowerCase();
	dir = {};
	app = require("express")();
	dir.views = path.join(__dirname, "/views");
	dir.plain = path.join(__dirname, "/static");
	app.locals.basedir = dir.views;
	app.use(require("serve-static")(dir.plain));
	app.set("port", nconf.get("port"));
	app.set("views", dir.views);
	app.set("view engine", "jade");

	// Routes
	mainController = require("./routes/main");
	options.title = nconf.get("title");
	app.get("/", mainController.renderAction("index", options));
	app.get("/derefer/", mainController.renderAction("derefer", options));
	app.use(mainController.renderAction(404, options));

	// Http server
	require("http").createServer(app).listen(nconf.get("port"), function () {
		console.info("Express %s server listening on port %d", nconf.get("env"), nconf.get("port"));
	});

}());
