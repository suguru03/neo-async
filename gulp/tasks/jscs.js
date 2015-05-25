'use strict';

var gulp = require('gulp');
var jscs = require('gulp-jscs');

var config = require('../config');

gulp.task('jscs', function() {
  var dirnames = config.jscs.dirnames;
  return gulp.src(dirnames)
    .pipe(jscs('.jscsrc'));
});
