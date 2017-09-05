module.exports = function (grunt) {
	"use strict";
	grunt.file.defaultEncoding = "utf8";

	var pkg = require("./package.json");
	pkg.config.data = [
		{"path": "/console", "name": "Console", "view": "console.pug", "background": "#000000"},
		{"path": "/bookmarks", "name": "Bookmarks"},
		{"path": "/calendar", "name": "Calendar"},
		{"path": "/notepad", "name": "Notepad", "view": "notepad.pug"},
		{"path": "/404", "name": "Blank™", "view": "404.pug", "background": "#000000", "mode": "fullscreen"}
	];
	pkg.config.minify = {};
	pkg.config.minify[pkg.config.folders.dist + "/all.css"] = [pkg.config.folders.assets + "/all.css"];
	pkg.config.uglify = {};
	pkg.config.render = {};
	pkg.config.inline = {};
	pkg.config.copysw = {};
	pkg.config.browserconfig = grunt.file.read(pkg.config.folders.assets + "/browserconfig.xml").replace(/[\t\n]/g, "");
	pkg.config.manifest = grunt.file.read(pkg.config.folders.assets + "/manifest.json");
	pkg.config.data.forEach(function (data) {
		data.browserconfig = pkg.config.browserconfig;
		data.manifest = JSON.parse(pkg.config.manifest.replace(/\{\{path\}\}/g, data.path).replace(/\{\{name\}\}/g, data.name).replace(/\{\{mode\}\}/g, data.mode || "standalone").replace(/\{\{background\}\}/g, data.background || "#202225"));
		var base = pkg.config.folders.dist + data.path;
		pkg.config.minify[base + ".css"] = [pkg.config.folders.assets + data.path + "/style.css"];
		pkg.config.uglify[base + ".js"] = [pkg.config.folders.assets + data.path + "/app.js"];
		pkg.config.copysw[base + "/sw.js"] = [pkg.config.folders.assets + "/sw.js"];
		pkg.config.render[base + "/index.html"] = pkg.config.folders.views + "/" + (data.view || "template.pug");
		pkg.config.render[base + "/browserconfig.xml"] = pkg.config.folders.views + "/browserconfig.pug";
		pkg.config.render[base + "/manifest.json"] = pkg.config.folders.views + "/manifest.pug";
		pkg.config.inline[base + "/index.html"] = base + "/index.html";
	});

	grunt.initConfig({

		// clean staging directory
		clean: {
			dist: [pkg.config.folders.dist + "/**", "!" + pkg.config.folders.dist],
			temp: [pkg.config.folders.dist + "/*.{css,js}"]
		},

		// prefix css
		postcss: {
			options: {
				processors: [
					require("cssnano")()
				]
			},
			styles: {
				files: pkg.config.minify
			}
		},

		// minify js
		uglify: {
			scripts: {
				files: pkg.config.uglify
			}
		},

		// pug compile
		pug: {
			compile: {
				options: {
					data: function (dest, src) {
						var path = dest.slice(pkg.config.folders.dist.length, dest.lastIndexOf("/"));
						return pkg.config.data.filter(function (item) { return item.path === path; })[0];
					}
				},
				files: pkg.config.render
			}
		},
		
		// assets inline
		assets_inline: {
			html: {
				options: {
					assetsDir: pkg.config.folders.dist,
					cssDir: pkg.config.folders.dist,
					jsDir: pkg.config.folders.dist,
					includeTag: "?inline"
				},
				files: pkg.config.inline
			},
		},
		
		// copy files without modification
		copy: {
			root: {
				files: [{
					expand: true,
					cwd: pkg.config.folders.assets,
					src: ["robots.txt"],
					dest: pkg.config.folders.dist
				}]
			},
			docs: {
				files: [{
					expand: true,
					cwd: pkg.config.folders.assets,
					src: ["**/README.md", "404.md"],
					dest: pkg.config.folders.dist
				}]
			},
			icons: {
				files: [{
					expand: true,
					cwd: pkg.config.folders.assets,
					src: ["**/*.png", "!calculator/*.png", "!iframer/*.png", "!settings/*.png"],
					dest: pkg.config.folders.dist
				}]
			},
			serviceworker: {
				files: pkg.config.copysw
			}
		}

	});

	// Load the plugins
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-postcss");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-pug");
	grunt.loadNpmTasks("grunt-assets-inline");

	grunt.registerTask(
		"render",
		"Render all project files",
		[
			"clean:dist",
			"postcss:styles",
			"uglify:scripts",
			"pug:compile",
			"assets_inline:html",
			"copy"
		]
	);

	grunt.registerTask(
		"build",
		"Assemble the complete project",
		[
			"render",
			"copy",
			"clean:temp"
		]
	);

	// Default task(s).
	grunt.registerTask("default", ["build"]);

};
