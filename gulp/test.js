'use strict';

var gulp = require('gulp');
var exit = require('gulp-exit');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('test', function() {
  var filename = gutil.env.file || '*';

  global.async = require('../');
  gulp.src([
    './test/**/test.' + filename + '.js'
  ])
  .pipe(mocha({
    reporter: 'spec',
    timeout: 2000
  }))
  .pipe(exit());
});

gulp.task('test:safe', function() {
  var filename = gutil.env.file || '*';

  global.async = require('../').safe;
  gulp.src([
    './test/**/test.' + filename + '.js'
  ])
  .pipe(mocha({
    reporter: 'spec',
    timeout: 2000
  }))
  .pipe(exit());
});

