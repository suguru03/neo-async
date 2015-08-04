'use strict';

var path = require('path');

var gulp = require('gulp');
var generator = require('changelog-generator');

gulp.task('changelog', function(done) {
  var filepath = path.resolve(__dirname, '../..', 'package.json');
  var url = require(filepath).homepage;
  generator(url, done);
});
