module.exports = function (grunt) {
    //#region [ Config ]

    grunt.initConfig({
        package: grunt.file.readJSON("package.json"),
        clean: {
            wwwroot: [
                "wwwroot/css/*",
                "wwwroot/js/*"
            ]
        },
        less: {
            options: {
                paths: ["less"],
                strictMath: false
            },
            src: {
                files: {
                    "wwwroot/css/tutorial.css": "less/tutorial.less"
                }
            }
        },
        csslint: {
            options: {
                "order-alphabetical": false,
                "fallback-colors": false,
                "adjoining-classes": false,
                "box-model": false
            },
            src: [
                "wwwroot/css/**/*.css",
                "!wwwroot/css/**/*.min.css"
            ]
        },
        jshint: {
            options: {
                debug: true,
                multistr: true,
                sub: true,
                laxbreak: true,
                globals: {
                    jQuery: true
                }
            },
            src: [
                "gruntfile.js",
                "js/**/*.js",
                "!js/libs/*.js"
            ]
        },
        copy: {
            js: {
                files: [{
                    expand: true,
                    cwd: "js/",
                    src: ["**", "!js/libs/*.js"],
                    dest: "wwwroot/js/",
                    filter: "isFile"
                }]
            }
        },
        cssmin: {
            options: {
                advanced: false
            },
            build: {
                files: [{
                    expand: true,
                    cwd: "wwwroot/css",
                    src: ["*.css", "!*.min.css"],
                    dest: "wwwroot/css",
                    ext: ".min.css"
                }]
            }
        },
        uglify: {
            options: {
                stripBanners: false,
                sourceMap: false
            },
            build: {
                files: {
                    "wwwroot/js/tutorial.min.js": ["wwwroot/js/tutorial.js"]
                }
            }
        }
    });

    //#endregion


    //#region [ Tasks : Registration ]

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-csslint");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("cleanTask", cleanTask);
    grunt.registerTask("buildTask", buildTask);

    //#endregion


    //#region [ Tasks ]

    /**
     * Clean task.
     */
    function cleanTask() {
        // List of tasks
        var tasks = [
            "clean:wwwroot"
        ];

        // Run tasks
        grunt.task.run.apply(grunt.task, tasks);
    }


    /**
     * Build task.
     */
    function buildTask() {
        var package = grunt.config("package");

        grunt.log.writeln("Building " + package.name + " v" + package.version);

        // List of tasks
        var tasks = [
            "less",
            "csslint",
            "jshint",
            "copy:js",
            "cssmin",
            "uglify"
        ];

        // Run tasks
        grunt.task.run.apply(grunt.task, tasks);
    }

    //#endregion
};