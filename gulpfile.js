'use strict';

var _ = require('lodash');
var fs = require('fs');
var gulp = require('gulp');

fs.readdirSync(__dirname + '/gulp/').forEach(function(filename) {
  require('./gulp/' + filename);
});

gulp.task('list', function() {
  _.forEach(gulp.tasks, function(val, name) {
    console.log(name);
  });
});

