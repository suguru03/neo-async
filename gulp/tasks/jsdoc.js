'use strict';

const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

const gulp = require('gulp');

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../..', '.jsdocrc'), {
  encoding: 'utf8'
}));

function createJSDoc(done) {
  const dirpath = path.resolve(__dirname, '../..', config.opts.destination);
  exec(`rm -rf ${dirpath}`);
  exec('$(npm bin)/jsdoc -c .jsdocrc ./lib/async.js', done);
}

gulp.task('jsdoc', createJSDoc);

exports.create = createJSDoc;
