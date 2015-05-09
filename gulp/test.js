'use strict';

var gulp = require('gulp');
var exit = require('gulp-exit');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var config = require('../test/config');

gulp.task('test', function() {
  var filename = gutil.env.file || '*';
  var delay = gulp.env.delay;
  if (delay) {
    config.delay = delay;
  }

  global.async = require('../');

  gulp.src([
    './test/**/test.' + filename + '.js'
  ])
  .pipe(mocha({
    reporter: 'spec',
    report: 'lcovonly',
    timeout: 2000
  }))
  .pipe(exit());
});

gulp.task('test:safe', function() {
  var filename = gutil.env.file || '*';
  var delay = gulp.env.delay;
  if (delay) {
    config.delay = delay;
  }

  global.async = require('../').safe;

  gulp.src([
    './test/**/test.' + filename + '.js'
  ])
  .pipe(mocha({
    reporter: 'spec',
    report: 'lcovonly',
    timeout: 2000
  }))
  .pipe(exit());
});

