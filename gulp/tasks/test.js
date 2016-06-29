'use strict';

const spawn = require('child_process').spawn;

const fs = require('fs');
const os = require('os');
const path = require('path');

const _ = require('lodash');
const gulp = require('gulp');
const exit = require('gulp-exit');
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');

const config = require('../../test/config');
const async = require('../../');

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

function fastTest() {
  let parent = path.resolve(__dirname, '../../');
  let base = path.resolve(parent, 'test');
  let map = {};
  (function resolve(base) {
    _.forEach(fs.readdirSync(base), filename => {
      let filepath = path.resolve(base, filename);
      if (fs.statSync(filepath).isDirectory()) {
        return resolve(filepath);
      }
      if (path.extname(filename) !== '.js') {
        return;
      }
      var name = path.basename(filename, '.js').replace(/test./, '');
      map[name] = filepath;
    });
  })(base);

  let mocha = path.resolve(parent, 'node_modules', '.bin', '_mocha');
  async.mapValuesLimit(map, os.cpus().length, (filepath, filename, done) => {
    let result = {
      log: '',
      err: false
    };
    console.log('**** [%s] ****', filename);
    let test = spawn(mocha, [filepath])
      .on('error', done)
      .on('close', (err) => {
        console.log(result.log);
        result.err = result.err || !!err;
        done(null, result);
      });
    test.stdout.on('data', data => {
      let buf = new Buffer(data, 'utf8');
      result.log += buf.toString();
    });
  }, (err, res) => {
    if (err) {
      throw err;
    }
    _.chain(res)
      .pickBy(result => {
        return result.err;
      })
      .forOwn((result, key) => {
        console.log('error:%s', key);
        console.log(result.log);
      })
      .value();
  });
}

function exec(filename, func) {
  let filepath = path.resolve(__dirname, '../..', 'lib', filename);
  global.async = require(filepath);
  global.async_path = filepath;
  func();
}

gulp.task('test', () => {
  exec('async.js', test);
});

gulp.task('test:min', () => {
  exec('async.min.js', test);
});

gulp.task('test:fast', () => {
  exec('async.js', fastTest);
});

gulp.task('test:fast:min', () => {
  exec('async.min.js', fastTest);
});

