'use strict';

var _ = require('lodash');
var es = require('event-stream');
var exec = require('child_process').exec;
var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('speed_test', function() {
  var filename = gutil.env.file || '*';
  var gc = !!gutil.env.gc;

  gulp.src([
    './speed_test/**/sample.' + filename + '.js'
  ])
  .pipe(es.map(function(file, next) {
    var filepath = _.first(file.history);
    var command = ['node', gc ? '--expose_gc' : '', filepath].join(' ');
    exec(command, function(err, result) {
      console.log(result);
      next(err);
    });
  }));
});


