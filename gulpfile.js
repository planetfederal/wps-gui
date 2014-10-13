var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_bower_files = require('main-bower-files'),
    gp_filter = require('gulp-filter'),
    gp_uglify = require('gulp-uglify');

gulp.task('jsbuild', function(){
    return gulp.src(gp_bower_files().concat(['mappings/*.js', 'wpsclient.js', 'wpsui.js']))
        .pipe(gp_filter('**/*.js'))
        .pipe(gp_concat('wps-gui-debug.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gp_rename('wps-gui.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['jsbuild'], function(){});
