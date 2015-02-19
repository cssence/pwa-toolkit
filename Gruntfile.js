/*global grunt, module: false */

module.exports = function (grunt) {
	"use strict";

	// Project configuration.
	grunt.initConfig({
		//pkg: grunt.file.readJSON("package.json"),
		config: grunt.file.readJSON("settings.json"),

		// clean staging directory
		clean: {
			build: ["<%= config.paths.stage %>"]
		},

		// minify and concatenate css
		cssmin: {
			css: {
				files: {
					'<%= config.paths.dist %>/bookmarks.css': ['static/bookmarks.css'],
					'<%= config.paths.dist %>/calendar.css': ['static/calendar.css'],
					'<%= config.paths.dist %>/iframer.css': ['static/iframer.css'],
					'<%= config.paths.stage %>/init.min.css': ['static/init.css']
				}
			}
		},

		// uglify and concatenate js
		uglify: {
			js: {
				files: {
					"<%= config.paths.dist %>/bookmarks.js": ["static/bookmarks.js"],
					"<%= config.paths.dist %>/calendar.js": ["static/calendar.js"],
					"<%= config.paths.dist %>/iframer.js": ["static/iframer.js"],
					"<%= config.paths.stage %>/index.min.js": ["static/init.js", "static/index.js"]
				}
			}
		},

		// jade compile
		jade: {
			compile: {
				options: {
					data: {
						title: "<%= config.title %>"
					}
				},
				files: {
					"<%= config.paths.dist %>/index.html": ["views/index.jade"],
					"<%= config.paths.dist %>/404.html": ["views/error.jade"]
				}
			}
		},

		// copy assets that are to-be-hosted
		copy: {
			assets: {
				files: [
					{src: "LICENSE", dest: "<%= config.paths.dist %>/LICENSE"}
				]
			}
		}

	});

	// Load the plugins
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jade");
	grunt.loadNpmTasks("grunt-contrib-copy");

	grunt.registerTask(
		"build",
		"Prepares project deployment (minification)",
		["clean:build", "cssmin:css", "uglify:js"]
	);
	grunt.registerTask(
		"release",
		"Deploys the project (copy assets and generate HTML)",
		["clean:build", "cssmin:css", "uglify:js", "jade:compile", "copy:assets"]
	);

	// Default task(s).
	grunt.registerTask("default", ["release"]);

};
