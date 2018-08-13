'use strict';

const path = require('path');

const _ = require('lodash');
const gulp = require('gulp');
const fs = require('fs-extra');
const argv = require('minimist')(process.argv.slice(2));

const { exec } = require('../util');
const async = require('../../lib/async');

gulp.task('npm:publish', publish);

async function publish() {
  const { otp } = argv;
  if (!otp) {
    throw new Error('Invalid otp');
  }
  const rootpath = path.resolve(__dirname, '../..');
  const buildpath = path.resolve(rootpath, 'build');

  await exec(`rm -rf ${buildpath}`);

  // make dir
  !fs.existsSync(buildpath) && fs.mkdirSync(buildpath);

  // copy lib
  fs.copySync(path.resolve(rootpath, 'lib', 'async.js'), path.resolve(buildpath, 'async.js'));
  // copy the minified file
  fs.copySync(path.resolve(rootpath, 'dist', 'async.min.js'), path.resolve(buildpath, 'async.min.js'));

  // copy package.json
  const json = _.omit(require('../../package'), ['files', 'scripts', 'private']);
  json.main = 'async.js';
  json.browser = 'async.min.js';
  fs.writeFileSync(path.resolve(buildpath, 'package.json'), JSON.stringify(json, null, 2), 'utf8');

  // copy README
  fs.copySync(path.resolve(rootpath, 'README.md'), path.resolve(buildpath, 'README.md'));

  // copy LICENSE
  fs.copySync(path.resolve(rootpath, 'LICENSE'), path.resolve(buildpath, 'LICENSE'));

  // create all function files
  const template = fs.readFileSync(path.resolve(__dirname, '../template'), 'utf8');
  _.forOwn(async, (func, key) => {
    if (!_.isFunction(func)) {
      return;
    }
    const file = template.replace('<function>', key);
    fs.writeFileSync(path.resolve(buildpath, `${key}.js`), file, 'utf8');
  });

  await exec(`cd ${buildpath} && npm publish --otp=${otp}`);
}
