'use strict';

const gulp = require('gulp');
const jscs = require('gulp-jscs');

const config = require('../config');

gulp.task('jscs', () => {
  let dirnames = config.jscs.dirnames;
  return gulp.src(dirnames)
    .pipe(jscs('.jscsrc'));
});
