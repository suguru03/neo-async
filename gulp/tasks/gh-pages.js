'use strict';

var fs = require('fs');
var path = require('path');

var _ = require('lodash');
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
  async.waterfall([

    function(next) {
      git.checkout('origin/gh-pages', next);
    },

    function(next) {
      git.checkout('gh-pages', {
        args: '-B'
      }, next);
    },

    function(next) {
      fs.writeFileSync(filepath, asyncFile, {
        encoding: 'utf8'
      });
      jsdoc.create(next);
    },

    function() {
      var next = _.last(arguments);
      git.status({
        args: '-s ./doc'
      }, next);
    },

    function(result, next) {
      if (!result) {
        console.log('[skip commit]');
        return checkoutMaster(done);
      }
      git.exec({
        args: 'add ./doc ./lib/async.js'
      }, next);
    },

    function(result, next) {
      git.exec({
        args: 'commit -m "update(jsdoc): update jsdoc [v' + async.VERSION + ']"'
      }, next);
    },

    checkoutMaster
  ], done);

  function checkoutMaster(next) {
    git.checkout('v1.x', next);
  }
});
