'use strict';

const path = require('path');

const gulp = require('gulp');
const git = require('gulp-git');
const generator = require('changelog-generator');

const async = require('../../');

gulp.task('changelog', done => {
  const filepath = path.resolve(__dirname, '../..', 'package.json');
  const { homepage } = require(filepath);

  async.angelFall([

    async.apply(generator, homepage),

    async.apply(git.exec, {
      args: 'add ./CHANGELOG.md'
    }),

    async.apply(git.exec, {
      args: 'commit -m "docs(CHANGELOG): v' + async.VERSION + ' [ci skip]"'
    })
  ], done);
});
