'use strict';

var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var gulp = require('gulp');

var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../..', '.jsdocrc'), {
  encoding: 'utf8'
}));

function createJSDoc(done) {
  var dirpath = path.resolve(__dirname, '../..', config.opts.destination);
  exec('rm -rf ' + dirpath);
  exec('$(npm bin)/jsdoc -c .jsdocrc ./lib/async.js', done);
}

gulp.task('jsdoc', createJSDoc);

exports.create = createJSDoc;
