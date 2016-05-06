/* global it */
'use strict';

var assert = require('assert');

var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;

parallel('#timeout', function() {

  it('timeout with series', function(done) {
    async.series([
      async.timeout(function(callback) {
        setTimeout(function() {
          callback(null, 'I did not time out');
        }, delay);
      }, delay * 2),
      async.timeout(function(callback) {
        setTimeout(function() {
          callback(null, 'I will time out');
        }, delay * 3);
      }, delay * 2)
    ], function(err, res) {
      assert.ok(err);
      assert.strictEqual(err.code, 'ETIMEDOUT');
      assert.strictEqual(err.message, 'Callback function "anonymous" timed out.');
      assert.strictEqual(res[0], 'I did not time out');
      done();
    });
  });

  it('timeout with parallel', function(done) {

    var info = { info: 'info' };
    async.parallel([
      async.timeout(function(callback) {
        setTimeout(function() {
          callback(null, 'I did not time out');
        }, delay);
      }, delay * 2),
      async.timeout(function timer(callback) {
        setTimeout(function() {
          callback(null, 'I will time out');
        }, delay * 3);
      }, delay * 2, info)
    ], function(err, res) {
      assert.ok(err);
      assert.strictEqual(err.code, 'ETIMEDOUT');
      assert.strictEqual(err.message, 'Callback function "timer" timed out.');
      assert.strictEqual(err.info, info);
      assert.strictEqual(res[0], 'I did not time out');
      done();
    });
  });

  it('should throw error', function(done) {

    async.parallel([
      async.timeout(function(callback) {
        setTimeout(function() {
          callback();
        }, delay);
      }, delay * 2),
      async.timeout(function(callback) {
        setTimeout(function() {
          callback(null, 2, 2, 2);
        }, delay);
      }, delay * 2),
      async.timeout(function(callback) {
        setTimeout(function() {
          callback(new Error('error'));
        }, delay * 2);
      }, delay * 4)
    ], function(err) {
      assert.ok(err);
      assert.strictEqual(err.message, 'error');
      done();
    });
  });

});
