'use strict';

var gulp = require('gulp');
var jscs = require('gulp-jscs');

gulp.task('jscs', function() {

  return gulp.src([
    './lib/async.js',
    './speed_test/**/*.js',
    './test/**/*.js',
    './*.js'
  ])
  .pipe(jscs('.jscsrc'));
});

