'use strict';

const gulp = require('gulp');
const jscs = require('gulp-jscs');

const config = require('../config');

gulp.task('jscs', () => {
  const { dirnames } = config.jscs;
  return gulp.src(dirnames)
    .pipe(jscs('.jscsrc'));
});
