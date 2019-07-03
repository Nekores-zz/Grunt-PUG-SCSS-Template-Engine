module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    // Define reusable paths.
    paths: {
      dist: "dist",
      src: "src",
      dist_css: "<%= paths.dist %>/css",
      dist_js: "<%= paths.dist %>/js",
      src_scss: "<%= paths.src %>/scss",
      src_pug: "<%= paths.src %>/templates",
      src_js: "<%= paths.src %>/js",
      src_css_vendor: "<%= paths.src %>/vendor/css",
      src_js_vendor: "<%= paths.src %>/vendor/js",
      bootstrap_scss: "<%= paths.src %>/vendor/bootstrap"
    },

    // Sass compiling.
    sass: {
      expanded: {
        options: {
          sourceMap: true,
          outputStyle: "expanded"
        },
        files: {
          "<%= paths.dist_css %>/styles.css":
            "<%= paths.src_scss %>/styles.scss"
        }
      },
      minified: {
        options: {
          sourceMap: true,
          outputStyle: "compressed"
        },
        files: {
          "<%= paths.dist_css %>/styles.min.css":
            "<%= paths.src_scss %>/styles.scss",
          "<%= paths.dist_css %>/styles.min.css.map":
            "<%= paths.src_scss %>/styles.scss.map"
        }
      },
      bootstrap: {
        options: {
          sourceMap: true,
          outputStyle: "compressed"
        },
        files: {
          "<%= paths.src_css_vendor %>/bootstrap.min.css":
            "<%= paths.bootstrap_scss %>/bootstrap.scss"
        }
      }
    },

    // Autoprefix css properties with vendor prefixes
    autoprefixer: {
      expanded: {
        options: {
          browsers: ["> 5%", "last 3 versions", "ie 10", "ie 11"]
        },
        files: {
          "<%= paths.dist_css %>/styles.css": "<%= paths.dist_css %>/styles.css"
        }
      },
      minified: {
        options: {
          browsers: ["> 5%", "last 3 versions", "ie 10", "ie 11"]
        },
        files: {
          "<%= paths.dist_css %>/styles.min.css":
            "<%= paths.dist_css %>/styles.min.css"
        }
      },
      bootstrap: {
        options: {
          browsers: ["last 3 versions", "ie 10", "ie 11"]
        },
        files: {
          "<%= paths.src_css_vendor %>/bootstrap.min.css":
            "<%= paths.src_css_vendor %>/bootstrap.min.css"
        }
      }
    },

    // Compile only changed Pug file
    "cache-pug-compiler": {
      cache: {
        options: {
          // Will hook into this pug tasks and replace the src,
          // changing what gets compiled
          pugTask: "compile",
          // Used by pugInheritance
          basedir: "<%= paths.src_pug %>"
        },
        files: [
          {
            expand: true,
            cwd: "<%= paths.src_pug %>",
            src: ["*.pug"],
            // src: ["*.pug", "components/*.pug", "docs/*.pug"],
            // src: [
            //          'components/loader.pug',
            //          'docs/changelog.pug',
            //          'index.pug',
            //      ],
            dest: "<%= paths.dist %>",
            ext: ".html"
          }
        ]
      }
    },

    // Pug (Jade) compiling.
    pug: {
      compile: {
        options: {
          pretty: true
        },
        files: [
          {
            cwd: "<%= paths.src_pug %>",
            src: ["*.pug"],
            // src: ["*.pug", "components/*.pug", "docs/*.pug"],
            // src: [

            //          'components/loader.pug',
            //          'docs/changelog.pug',
            //          'index.pug',
            //      ],
            dest: "<%= paths.dist %>",
            expand: true,
            ext: ".html"
          }
        ]
      }
    },

    // Browser autorefresh / syncing.
    browserSync: {
      files: {
        src: [
          "<%= paths.dist %>/**/*.html",
          "<%= paths.dist_css %>/*.css",
          "<%= paths.dist_js %>/*.js"
        ]
      },
      options: {
        browser: "chrome",
        server: "<%= paths.dist %>",
        watchTask: true
      }
    },

    // Concat. Files concatination
    concat: {
      css: {
        src: "<%= paths.src_css_vendor %>/*.css",
        dest: "<%= paths.dist_css %>/vendor.min.css"
      },
      js: {
        src: [
          "<%= paths.src_js_vendor %>/jquery.min.js",
          "<%= paths.src_js_vendor %>/popper.min.js",
          "<%= paths.src_js_vendor %>/lightgallery-all.min.js",
          "<%= paths.src_js_vendor %>/*.js"
        ],
        dest: "<%= paths.dist_js %>/vendor.min.js"
      }
    },

    // Uglify. Files minification
    uglify: {
      main_js: {
        files: {
          "<%= paths.dist_js %>/scripts.min.js":
            "<%= paths.src_js %>/scripts.js"
        }
      }
    },

    // Watcher.
    watch: {
      css: {
        files: ["<%= paths.src_scss %>/**/*.scss"],
        tasks: ["sass:minified", "autoprefixer:minified"]
      },
      "cache-pug-compiler": {
        files: ["<%= paths.src_pug %>/**/*.pug"],
        tasks: ["cache-pug-compiler", "pug"]
      },
      pug: {
        files: [
          // "<%= paths.src_pug %>/helpers/*.pug",
          // "<%= paths.src_pug %>/partials/*.pug"
        ],
        tasks: ["pug"]
      },
      js: {
        files: ["<%= paths.src_js %>/*.js"],
        tasks: ["uglify"]
      }
    }
  });

  // These plugins provide necessary tasks.

  // BrowserSync.
  grunt.loadNpmTasks("grunt-browser-sync");

  // Sass.
  grunt.loadNpmTasks("grunt-sass");

  // Compile only changed Pug file
  grunt.loadNpmTasks("grunt-cache-pug-compile");

  // Pug (formerly Jade).
  grunt.loadNpmTasks("grunt-contrib-pug");

  // Concat.
  grunt.loadNpmTasks("grunt-contrib-concat");

  // Uglify.
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // Autoprefixer
  grunt.loadNpmTasks("grunt-autoprefixer");

  // Watch.
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Run tasks.

  // Default task.
  grunt.registerTask("default", [
    "browserSync",
    "sass:bootstrap",
    "sass:expanded",
    "autoprefixer:bootstrap",
    "autoprefixer:expanded",
    "concat",
    "uglify",
    "pug",
    "watch"
  ]);
};
