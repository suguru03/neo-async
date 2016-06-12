'use strict';

const _ = require('lodash');
const es = require('event-stream');
const gulp = require('gulp');
const jsbeautifier = require('gulp-jsbeautifier');

const config = require('../config');

gulp.task('jsfmt', ['jsbeautifier']);

gulp.task('jsbeautifier', () => {
  let dirnames = config.jsbeautifier.dirnames;
  let streams = _.map(dirnames, (task) => {
    let dirname = task.slice(0, _.lastIndexOf(task, '/'));
    return gulp.src(task)
      .pipe(jsbeautifier({
        config: '.jsbeautifyrc',
        mode: 'VERIFY_AND_WRITE'
      }))
      .pipe(gulp.dest(dirname.replace(/\/\*\*/g, '')));
  });
  return es.merge.apply(es, streams);
});
