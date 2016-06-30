'use strict';

const path = require('path');

const gulp = require('gulp');
const exit = require('gulp-exit');
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');
const executor = require('mocha-parallel-executor');

const config = require('../../test/config');

function test() {
  let filename = gutil.env.file || '*';
  let delay = gulp.env.delay;
  if (delay) {
    config.delay = delay;
  }
  gulp.src([
    './test/**/test.' + filename + '*'
  ])
  .pipe(mocha({
    reporter: 'spec',
    report: 'lcovonly',
    timeout: 2000
  }))
  .pipe(exit());
}

function exec(filename, func, callback) {
  let filepath = path.resolve(__dirname, '../..', 'lib', filename);
  global.async = require(filepath);
  global.async_path = filepath;
  func(callback);
}

gulp.task('test', () => {
  exec('async.js', test);
});

gulp.task('test:min', () => {
  exec('async.min.js', test);
});

gulp.task('test:fast', () => {
  exec('async.js', executor);
});

gulp.task('test:fast:min', () => {
  exec('async.min.js', executor);
});

