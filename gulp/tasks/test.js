'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const spawn = require('child_process').spawn;

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

function fastTest(callback) {
  let root = path.resolve(__dirname, '../../');
  let base = path.resolve(root, 'test');
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

  let mocha = path.resolve(root, 'node_modules', '.bin', '_mocha');
  async.mapValuesLimit(map, os.cpus().length, (filepath, filename, done) => {
    let result = {
      log: '',
      err: false
    };
    let test = spawn(mocha, ['--colors', filepath])
      .on('error', done)
      .on('close', err => {
        console.log(result.log);
        result.err = result.err || !!err;
        done(null, result);
      });
    test.stdout.on('data', data => {
      let buf = new Buffer(data, 'utf8');
      result.log += buf.toString();
    });
    test.stderr.on('data', data => {
      process.stdout.write(`${data}\n`);
    });
  }, (err, res) => {
    if (err) {
      return callback(err);
    }
    _.chain(res)
      .pickBy(result => {
        return result.err;
      })
      .forOwn((result, key) => {
        console.log(`error:${key}`);
      })
      .value();

    callback();
  });
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

gulp.task('test:fast', done => {
  exec('async.js', fastTest, done);
});

gulp.task('test:fast:min', done => {
  exec('async.min.js', fastTest, done);
});

