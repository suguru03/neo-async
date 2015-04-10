'use strict';

var gulp = require('gulp');
var exit = require('gulp-exit');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('test', function() {
  var filename = gutil.env.file || '*';

  gulp.src([
    './test/**/test.' + filename + '.js'
  ])
  .pipe(mocha({
    reporter: 'spec',
    timeout: 2000
  }))
  .pipe(exit());
});

