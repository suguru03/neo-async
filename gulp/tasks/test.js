'use strict';

const path = require('path');

const gulp = require('gulp');
const exit = require('gulp-exit');
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');

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

gulp.task('test', () => {
  let filepath = path.resolve(__dirname, '../../', 'lib/async.js');
  global.async = require(filepath);
  global.async_path = filepath;
  test();
});

gulp.task('test:min', () => {
  let filepath = path.resolve(__dirname, '../../', 'lib/async.min.js');
  global.async = require(filepath);
  global.async_path = filepath;
  test();
});
