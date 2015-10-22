'use strict';

var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var git = require('gulp-git');

var async = require('../../');
var jsdoc = require('./jsdoc');

gulp.task('gh-pages', function(done) {

  var filepath = path.resolve(__dirname, '../..', 'lib/async.js');
  var options = {
    encoding: 'utf8'
  };
  var asyncFile = fs.readFileSync(filepath, options);
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

    function(result, next) {
      if (!result) {
        console.log('[skip commit]');
        return checkoutMaster(done);
      }
      git.exec({
        args: 'add ./doc ./lib/async.js'
      }, next);
    },

    async.apply(git.exec, {
        args: 'commit -m "docs(jsdoc): update jsdoc [v' + async.VERSION + ']"'
    }),

    checkoutMaster
  ], done);

  function checkoutMaster(next) {
    git.checkout('master', next);
  }
});
