var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_bower_files = require('main-bower-files'),
    gp_filter = require('gulp-filter'),
    gp_minify_css = require('gulp-minify-css'),
    gp_uglify = require('gulp-uglify');

gulp.task('cssbuild', function() {
    gulp.src(['src/*.png'])
      .pipe(gulp.dest('dist'));
    gulp.src(['vendor/ol.css', 'vendor/highlight/styles/default.css ', 'src/style.css'])
      .pipe(gp_filter('**/*.css'))
      .pipe(gp_concat('wps-gui.css'))
      .pipe(gulp.dest('dist'))
      .pipe(gp_rename('wps-gui.min.css'))
      .pipe(gp_minify_css())
      .pipe(gulp.dest('dist'));
});

gulp.task('jsbuild', function(){
    var bower_files = gp_bower_files();
    // remove w3c-schemas/scripts/w3c-schemas.js
    // see https://github.com/highsource/w3c-schemas/issues/11
    bower_files.pop();
    var files = bower_files.concat([
      'vendor/highlight/highlight.pack.js',
      'components/vkBeautify/vkbeautify.js',
      'components/w3c-schemas/scripts/lib/XLink_1_0.js',
      'components/ogc-schemas/scripts/lib/Filter_1_1_0.js',
      'components/ogc-schemas/scripts/lib/Filter_2_0.js',
      'components/ogc-schemas/scripts/lib/GML_2_1_2.js',
      'components/ogc-schemas/scripts/lib/GML_3_1_1.js',
      'components/ogc-schemas/scripts/lib/OWS_1_0_0.js',
      'components/ogc-schemas/scripts/lib/OWS_1_1_0.js',
      'components/ogc-schemas/scripts/lib/SMIL_2_0.js',
      'components/ogc-schemas/scripts/lib/SMIL_2_0_Language.js',
      'components/ogc-schemas/scripts/lib/WCS_1_1.js',
      'components/ogc-schemas/scripts/lib/WFS_1_1_0.js',
      'components/ogc-schemas/scripts/lib/WPS_1_0_0.js',
      'src/wpsclient.js',
      'src/wpsui.js'
    ]);
    gulp.src(files)
        .pipe(gp_filter('**/*.js'))
        .pipe(gp_concat('wps-gui.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gp_rename('wps-gui.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist'));
});

//gulp.watch('src/*.js', ['jsbuild']);
//gulp.watch(['src/*.css', 'vendor/*.css'], ['cssbuild']);

gulp.task('default', ['jsbuild', 'cssbuild'], function(){});
