'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const gulp = require('gulp');
const exit = require('gulp-exit');
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');
const executor = require('mocha-parallel-executor');

const config = require('../../test/config');

function test() {
  const filename = gutil.env.file || '*';
  const delay = gulp.env.delay;
  if (delay) {
    config.delay = delay;
  }
  gulp.src([
    `./test/**/test.${filename}*`
  ])
  .pipe(mocha({
    reporter: 'spec',
    report: 'lcovonly',
    timeout: 2000
  }))
  .pipe(exit());
}

function exec(name, func) {
  const filepath = path.resolve(__dirname, '../..', 'lib', name);
  const filename = gutil.env.file;
  let files;
  if (filename) {
    files = _.transform(['collections', 'controlFlow', 'other', 'utils'], (result, dir) => {
      const p = path.resolve(__dirname, '../../', 'test', dir, `test.${filename}.js`);
      if(fs.existsSync(p)) {
        result.push(p);
      }
    });
  }
  global.async = require(filepath);
  global.async_path = filepath;
  func({ files: files });
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

