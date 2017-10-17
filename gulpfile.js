'use strict';

var srcPath = 'app/';
var distPath = 'dist/';
var tmpPath = 'tmp/';
var mockPath = 'mocks/';
var currentPath = '.';

var srcFontsPath = 'app/fonts/**/*';
var srcStylesPath = 'app/styles/**/*.scss';
var srcScriptsPath = 'app/scripts/**/*.js';
var srcHtmlPath = 'app/*.html';
var srcMainJsPath = 'app/scripts/app.js';
var srcViewsPath = 'app/views/**/*.tpl.html';

var tmpFontsPath = 'tmp/fonts/';
var tmpStylesPath = 'tmp/styles/';
var tmpScriptsPath = 'tmp/scripts/';

var distFontsPath = 'dist/fonts/';
var distStylesPath = 'dist/styles/';
var distScriptsPath = 'dist/scripts/';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var fs = require('fs');
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nMock = require('n-mock');
var serveStatic = require('serve-static');
var runSequence = require('run-sequence');
var mainBowerFiles = require('main-bower-files');

gulp.task('clean', del.bind(null, [tmpPath, distPath]));

gulp.task('fonts', function() {
  return gulp.src(mainBowerFiles({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat(srcFontsPath))
    .pipe(gulp.dest(tmpFontsPath))
    .pipe(gulp.dest(distFontsPath));
});

gulp.task('styles',['fonts'],function(){
  return gulp.src(srcStylesPath)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error',$.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(tmpStylesPath))
    .pipe($.minifyCss({compatibility: '*'}))
    .pipe(gulp.dest(distStylesPath))
    .pipe(reload({stream: true}));
});

gulp.task('browserify', [], function() {
  return gulp.src(srcMainJsPath)
    .pipe($.browserify())
    .pipe($.ngAnnotate({add: true}))
    .pipe($.rename('main.js'))
    .pipe(gulp.dest(tmpScriptsPath))
    .pipe($.uglify())
    .pipe(gulp.dest(distScriptsPath))
    .pipe(reload({stream: true}));
});

gulp.task('serve', function() {
  browserSync({
    notify: false,
    port: 9001,
    server: {
      baseDir: [srcPath, tmpPath, currentPath],
      routes: {
        '/bower_components': 'bower_components'
      },
      middleware: [
        serveStatic(srcPath),
        serveStatic(tmpPath),
        serveStatic(currentPath),
        nMock(mockPath)
      ]
    }
  });

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/views/**/*.tpl.html', ['browserify']);
  gulp.watch('app/*.html', ['browserify']);
  gulp.watch('app/scripts/**/*.js', ['browserify']);
  });

  gulp.task('default', function(callback) {
    return runSequence('clean', 'styles', 'browserify', 'serve', callback);
  });
