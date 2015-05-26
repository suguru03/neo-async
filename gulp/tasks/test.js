'use strict';

var path = require('path');

var gulp = require('gulp');
var exit = require('gulp-exit');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

var config = require('../../test/config');

function test() {
  var filename = gutil.env.file || '*';
  var delay = gulp.env.delay;
  if (delay) {
    config.delay = delay;
  }
  gulp.src([
      './test/**/test.' + filename + '.js'
    ])
    .pipe(mocha({
      reporter: 'spec',
      report: 'lcovonly',
      timeout: 2000
    }))
    .pipe(exit());
}

gulp.task('test', function() {
  var filepath = path.resolve(__dirname, '../../', 'lib/async.js');
  global.async = require(filepath);
  global.async_path = filepath;
  test();
});

gulp.task('test:safe', function() {
  var filepath = path.resolve(__dirname, '../../', 'lib/async.js');
  global.async = require(filepath).safe;
  global.async_path = filepath;
  test();
});

gulp.task('test:min', function() {
  var filepath = path.resolve(__dirname, '../../', '../lib/async.min.js');
  global.async = require(filepath);
  global.async_path = filepath;
  test();
});

gulp.task('test:min:safe', function() {
  var filepath = path.resolve(__dirname, '../../', '../lib/async.min.js');
  global.async = require(filepath).safe;
  global.async_path = filepath;
  test();
});
