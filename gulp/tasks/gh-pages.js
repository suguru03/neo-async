'use strict';

const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const git = require('gulp-git');

const async = require('../../');
const jsdoc = require('./jsdoc');

gulp.task('gh-pages', done => {

  const filepath = path.resolve(__dirname, '../..', 'lib/async.js');
  const options = {
    encoding: 'utf8'
  };
  const asyncFile = fs.readFileSync(filepath, options);
  async.angelFall([

    async.apply(git.fetch, 'origin', ''),

    async.apply(git.checkout, 'gh-pages'),

    async.apply(fs.writeFile, filepath, asyncFile, {
      encoding: 'utf8'
    }),

    async.apply(jsdoc.create),

    async.apply(git.status, {
      args: '-s ./doc'
    }),

    (result, next) => {
      if (!result) {
        console.log('[skip commit]');
        return checkoutMaster(done);
      }
      git.exec({
        args: 'add ./doc ./lib/async.js'
      }, next);
    },

    async.apply(git.exec, {
      args: `commit -m "docs(jsdoc): update jsdoc [v${async.VERSION}] [ci skip]"`
    }),

    checkoutMaster
  ], done);

  function checkoutMaster(next) {
    git.checkout('master', next);
  }
});
