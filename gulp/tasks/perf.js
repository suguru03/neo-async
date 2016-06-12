'use strict';

const _ = require('lodash');
const exec = require('child_process').exec;
const es = require('event-stream');

const gulp = require('gulp');
const gutil = require('gulp-util');

gulp.task('perf', () => {
  let filename = gutil.env.file || '*';
  let gc = !!gutil.env.gc;

  gulp.src([
    './perf/func-comparator/**/sample.' + filename + '.js'
  ])
  .pipe(es.map((file, next) => {
    let filepath = _.first(file.history);
    let command = ['node', gc ? '--expose_gc' : '', filepath].join(' ');
    exec(command, (err, result) => {
      console.log(result);
      next(err);
    });
  }));
});
