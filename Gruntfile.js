'use strict';

var LIVERELOAD_PORT = 35729;

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var pathConfig = {
        app : 'app',
        dist : 'dist',
        tmp : '.tmp'
    };

    grunt.initConfig({
        paths : pathConfig,
        watch : {
            compass : {
                files : ['sass/{,*/}*.scss'],
                tasks : ['compass']
            },
            livereload: {
                files: [
                    'gallery.html',
                    '<%= paths.dist %>/*.css',
                    'images/{,*/}*/{,*/}*.{png,jpg,jpeg,gif,webp}'
                ],
                options : {
                    livereload : LIVERELOAD_PORT
                },
                tasks : ['livereload']
            }
        },
        clean : {
            dist : ['<%= paths.tmp %>', '<%= paths.dist %>'],
            server : '<%= paths.tmp %>'
        },
        compass : {
            options : {
                sassDir : 'sass',
                cssDir : '<%= paths.dist %>',
                imagesDir : 'sass/sprites',
                generatedImagesDir : '<%= paths.dist %>/images',
                relativeAssets : true
            },
            dist : {
                options : {
                    outputStyle: 'compressed'
                }
            },
            server : {
                options : {
                    debugInfo: true
                }
            }
        },
    });

    grunt.registerTask('server', [
        'clean:server',
        'compass:server',
        'watch',
        'livereload-start'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'compass:dist'
    ]);
};
