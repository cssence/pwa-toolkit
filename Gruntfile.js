/*global grunt, module: false */

module.exports = function (grunt) {
	"use strict";
	var pkg = grunt.file.readJSON("package.json");

	// Project configuration.
	grunt.initConfig({
		pkg: pkg,

		// clean staging directory
		clean: {
			build: ["<%= pkg.config.folders.temp %>"]
		},

		// minify and concatenate css
		cssmin: {
			css: {
				files: {
					"<%= pkg.config.folders.dist %>/bookmarks.css": ["<%= pkg.config.folders.assets %>/bookmarks.css"],
					"<%= pkg.config.folders.dist %>/calendar.css": ["<%= pkg.config.folders.assets %>/calendar.css"],
					"<%= pkg.config.folders.dist %>/iframer.css": ["<%= pkg.config.folders.assets %>/iframer.css"],
					"<%= pkg.config.folders.temp %>/init.min.css": ["<%= pkg.config.folders.assets %>/init.css"]
				}
			}
		},

		// uglify and concatenate js
		uglify: {
			js: {
				files: {
					"<%= pkg.config.folders.dist %>/bookmarks.js": ["<%= pkg.config.folders.assets %>/bookmarks.js"],
					"<%= pkg.config.folders.dist %>/calendar.js": ["<%= pkg.config.folders.assets %>/calendar.js"],
					"<%= pkg.config.folders.dist %>/iframer.js": ["<%= pkg.config.folders.assets %>/iframer.js"],
					"<%= pkg.config.folders.temp %>/index.min.js": ["<%= pkg.config.folders.assets %>/init.js", "<%= pkg.config.folders.assets %>/index.js"]
				}
			}
		},

		// jade compile
		jade: {
			compile: {
				options: {
					data: {
						title: pkg.name
					}
				},
				files: {
					"<%= pkg.config.folders.dist %>/index.html": ["<%= pkg.config.folders.views %>/index.jade"],
					"<%= pkg.config.folders.dist %>/404.html": ["<%= pkg.config.folders.views %>/error.jade"]
				}
			}
		}

	});

	// Load the plugins
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jade");

	grunt.registerTask(
		"build",
		"Prepare project deployment",
		["clean", "cssmin", "uglify"]
	);
	grunt.registerTask(
		"release",
		"Deploy the project",
		["build", "jade"]
	);

	// Default task(s).
	grunt.registerTask("default", ["release"]);

};
