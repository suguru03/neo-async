'use strict';

var _ = require('lodash');
var es = require('event-stream');
var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jsbeautifier = require('gulp-jsbeautifier');

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

