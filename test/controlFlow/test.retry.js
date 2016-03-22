/* global it */
'use strict';

var assert = require('power-assert');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;

parallel('#retry', function() {

  it('should retry until response', function(done) {

    var failed = 3;
    var callCount = 0;
    var message = 'success';
    var fn = function(callback) {
      callCount++;
      failed--;
      if (failed === 0) {
        return callback(null, message);
      }
      callback('err');
    };

    async.retry(fn, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(callCount, 3);
      assert.strictEqual(res, message);
      done();
    });
  });

  it('should retry until time out', function(done) {

    var times = 3;
    var callCount = 0;
    var error = 'error';
    var success = 'success';
    var fn = function(callback) {
      callCount++;
      callback(error + callCount, success + callCount);
    };

    async.retry(times, fn, function(err, res) {
      assert.strictEqual(callCount, 3);
      assert.strictEqual(err, error + times);
      assert.strictEqual(res, success + times);
      done();
    });
  });

  it('should not require a callback', function(done) {

    var times = 3;
    var callCount = 0;
    var fn = function(callback) {
      callCount++;
      callback();
    };
    async.retry(times, fn);
    setTimeout(function() {
      assert.strictEqual(callCount, 1);
      done();
    }, delay);
  });

  it('should throw error if arguments are empty', function() {

    try {
      async.retry();
    } catch(e) {
      assert.ok(e);
      assert.strictEqual(e.message, 'Invalid arguments for async.retry');
    }
  });

  it('should throw error if first argument is not function', function() {

    try {
      async.retry(1);
    } catch(e) {
      assert.ok(e);
      assert.strictEqual(e.message, 'Invalid arguments for async.retry');
    }
  });

  it('should throw error if arguments are invalid', function() {

    try {
      async.retry(function() {}, 2, function() {});
    } catch(e) {
      assert.ok(e);
      assert.strictEqual(e.message, 'Invalid arguments for async.retry');
    }
  });

  it('should retry with interval when all attempts succeeds', function(done) {

    var times = 3;
    var interval = delay * 3;
    var callCount = 0;
    var error = 'ERROR';
    var erroredResult = 'RESULT';
    var fn = function(callback) {
      callCount++;
      callback(error + callCount, erroredResult + callCount);
    };
    var opts = {
      times: times,
      interval: interval
    };
    var start = Date.now();
    async.retry(opts, fn, function(err, res) {
      var diff = Date.now() - start;
      assert(diff >= (interval * (times - 1)));
      assert.strictEqual(callCount, 3);
      assert.strictEqual(err, error + times);
      assert.strictEqual(res, erroredResult + times);
      done();
    });
  });

  it('should use default times', function(done) {

    var called = 0;
    async.retry(function(callback) {
      called++;
      callback('error');
    });
    setTimeout(function() {
      assert.strictEqual(called, 5);
      done();
    }, delay);
  });

});
