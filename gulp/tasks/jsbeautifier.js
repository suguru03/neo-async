'use strict';

var _ = require('lodash');
var es = require('event-stream');
var gulp = require('gulp');
var jsbeautifier = require('gulp-jsbeautifier');

var config = require('../config');

gulp.task('jsfmt', ['jsbeautifier']);

gulp.task('jsbeautifier', function() {
  var dirnames = config.jsbeautifier.dirnames;
  var streams = _.map(dirnames, function(task) {
    var dirname = task.slice(0, _.lastIndexOf(task, '/'));
    return gulp.src(task)
      .pipe(jsbeautifier({
        config: '.jsbeautifyrc',
        mode: 'VERIFY_AND_WRITE'
      }))
      .pipe(gulp.dest(dirname.replace(/\/\*\*/g, '')));
  });
  return es.merge.apply(es, streams);
});
