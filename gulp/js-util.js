'use strict';

var _ = require('lodash');
var es = require('event-stream');
var exec = require('child_process').exec;
var gulp = require('gulp');
var git = require('gulp-git');
var jscs = require('gulp-jscs');
var jsbeautifier = require('gulp-jsbeautifier');

var async = require('../');

var tasks = [
  './lib/async.js',
  './speed_test/**/*.js',
  './test/**/*.js'
];

gulp.task('jscs', function() {

  return gulp.src(tasks).pipe(jscs('.jscsrc'));
});

gulp.task('jsfmt', function() {

  var streams = _.map(tasks, function(task) {
    var dirname = task.substr(0, _.lastIndexOf(task, '/'));
    return gulp.src(task)
      .pipe(jsbeautifier({
        config: '.jsbeautifyrc',
        mode: 'VERIFY_AND_WRITE'
      }))
      .pipe(gulp.dest(dirname.replace(/\/\*\*/g, '')));
  });
  return es.merge.apply(es, streams);
});

gulp.task('jsdoc', function(done) {
  exec('$(npm bin)/jsdoc -c .jsdocrc ./lib', done);
});

gulp.task('gh-pages', ['jsdoc'], function(done) {

  async.waterfall([

    function(next) {
      git.checkout('origin/gh-pages', next);
    },

    function(next) {
      git.checkout('gh-pages', {
        args: '-8'
      }, next);
    },

    function(next) {
      git.status({
        args: '-s ./doc'
      }, next);
    },

    function(result, next) {
      if (!result) {
        gulp.log('[skip commit]');
        return done();
      }
      git.exec({
        args: 'commit -m "update(jsdoc): update jsdoc ' + _.now() + '"'
      }, next);
    },

    function(next) {
      git.push('origin', 'gh-pages', next);
    },

    function(next) {
      git.checkout('master', next);
    }
  ], done);
});

