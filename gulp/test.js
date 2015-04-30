'use strict';

var gulp = require('gulp');
var exit = require('gulp-exit');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

var config = require('../test/config');

gulp.task('test', function() {
  var filename = gutil.env.file || '*';

  config.delay = 20;

  gulp.src([
    './test/**/test.' + filename + '.js'
  ])
  .pipe(mocha({
    reporter: 'spec',
    timeout: 2000
  }))
  .pipe(exit());
});

