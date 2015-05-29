'use strict';

var gulp = require('gulp');
var generator = require('changelog-generator');

gulp.task('changelog', function(done) {
  var url = require('../../package.json').repository.homepage;
  generator(url, done);
});
