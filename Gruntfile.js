module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("nodetree.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.licenses[0].type %> License\n" +
				" */\n"
		},

        bowerInstall: {
        
          target: {
        
            // Point to the files that should be updated when
            // you run `grunt bower-install`
            src: [
              'demo/**/*.html',   // .html support...
            ],
        
            // Optional:
            // ---------
            cwd: '',
            dependencies: true,
            devDependencies: false,
            exclude: [],
            fileTypes: {},
            ignorePath: ''
          }
        },

		// Concat definitions
		concat: {
			dist: {
				src: ["src/js/nodetree.js"],
				dest: "dist/js/nodetree.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/js/nodetree.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/js/nodetree.js"],
				dest: "dist/js/nodetree.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// CoffeeScript compilation
		coffee: {
			compile: {
				files: {
					"dist/js/nodetree.js": "src/js/nodetree.coffee"
				}
			}
		},

        // Compile Scss
        sass: {
            dev: {
                options: {
                    style: 'expanded',
                    banner: '<%= meta.banner %>'
                },
				files: {
					'dist/css/nodetree.css' : 'src/scss/nodetree.scss'
				}
            },
			dist: {
                options: {
                    style: "compressed"
                },
				files: {
					'dist/css/nodetree.min.css' : 'src/scss/nodetree.scss'
				}
			}
		},

        // Watch for changes to scss
		watch: {
			css: {
				files: ['**/*.scss'],
				tasks: ['sass']
			},
            scripts: {
                files: ['src/js/**/*.js'],
                tasks: ["jshint", "concat", "uglify"],
                options: {
                    spawn: false,
                },
            }
		}

	});

    grunt.loadNpmTasks('grunt-bower-install');
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-coffee");
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask("default", ["jshint", "concat", "uglify", "watch"]);
	grunt.registerTask("travis", ["jshint"]);

};
