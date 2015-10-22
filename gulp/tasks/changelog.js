'use strict';

var path = require('path');

var gulp = require('gulp');
var git = require('gulp-git');
var generator = require('changelog-generator');

var async = require('../../');

gulp.task('changelog', function(done) {
  var filepath = path.resolve(__dirname, '../..', 'package.json');
  var url = require(filepath).homepage;

  async.angelFall([

    async.apply(generator, url),

    async.apply(git.exec, {
        args: 'add ./CHANGELOG.md'
    }),

    async.apply(git.exec, {
        args: 'commit -m "docs(CHANGELOG): v' + async.VERSION + ' [ci skip]"'
    })
  ], done);
});
