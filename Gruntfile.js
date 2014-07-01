var lrSnippet = require('connect-livereload')();

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // log task running time
    require('time-grunt')(grunt);

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var pathConfig = {
        app: 'app',
        dist: 'dist',
        tmp: '.tmp'
    };

    grunt.initConfig({
        paths: pathConfig,
        watch: {
            compass: {
                files: ['<%= paths.app %>/compass/**/*'],
                tasks: ['compass:server']
            },
            livereload: {
                files: [
                    '<%= paths.app %>/**/*.html',
                    '<%= paths.app %>/javascripts/**/*.js',
                    '<%= paths.app %>/images/**/*',
                    '<%= paths.tmp %>/stylesheets/**/*.css',
                    '<%= paths.tmp %>/images/**/*'
                ],
                options: {
                    livereload: true,
                    spawn: false
                }
            },
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            }
        },
        connect: {
            options: {
                port: 9999,
                hostname: '0.0.0.0'
            },
            server: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, pathConfig.tmp),
                            mountFolder(connect, pathConfig.app)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://127.0.0.1:<%= connect.options.port %>',
                app: 'Google Chrome Canary'
            }
        },
        clean: {
            dist: ['<%= paths.tmp %>', '<%= paths.dist %>'],
            server: '<%= paths.tmp %>'
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= paths.app %>',
                    dest: '<%= paths.dist %>',
                    src: [
                        '**/*.html',
                        '!components/**/*.html',
                        '!compass/**/*.html',
                        'images/**/*.{webp,gif,png,jpg,jpeg,ttf,otf,svg}'
                    ]
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= paths.app %>/compass/sass',
                imagesDir: '<%= paths.app %>/compass/images',
                fontsDir: '<%= paths.app %>/images/fonts',
                relativeAssets: true
            },
            dist: {
                options: {
                    cssDir: '<%= paths.dist %>/stylesheets',
                    generatedImagesDir: '<%= paths.dist %>/images',
                    outputStyle: 'compressed',
                    environment: 'production'
                }
            },
            server: {
                options: {
                    cssDir: '<%= paths.tmp %>/stylesheets',
                    generatedImagesDir: '<%= paths.tmp %>/images',
                    debugInfo: true,
                    environment: 'development'
                }
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.dist %>/images',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: '<%= paths.dist %>/images'
                }]
            }
        },
        concurrent: {
            server: {
                tasks: ['clean:server', 'compass:server'],
                options: {
                    logConcurrentOutput: true
                }
            },
            dist: {
                tasks: ['copy:dist', 'compass:dist'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false
            }
        },
        cdn: {
            options: {
                cdn: 'http://img.wdjimg.com/static-files/adonis',
                flatten: true
            },
            dist: {
                src: ['<%= paths.dist %>/**/*.css'],
            }
        }
    });

    grunt.registerTask('serve', [
        'concurrent:server',
        'connect:server',
        'open',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',
        'imagemin'
    ]);

    grunt.registerTask('build:production', [
        'build',
        'cdn:dist'
    ]);

    grunt.registerTask('update', [
        'bump-only:patch',
        'changelog',
        'bump-commit'
    ]);

    grunt.registerTask('update:minor', [
        'bump-only:minor',
        'changelog',
        'bump-commit'
    ]);

    grunt.registerTask('update:major', [
        'bump-only:major',
        'changelog',
        'bump-commit'
    ]);
};
