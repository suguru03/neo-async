'use strict';

const path = require('path');

const gulp = require('gulp');
const git = require('gulp-git');
const generator = require('changelog-generator');

const async = require('../../');

gulp.task('changelog', (done) => {
  let filepath = path.resolve(__dirname, '../..', 'package.json');
  let url = require(filepath).homepage;

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
