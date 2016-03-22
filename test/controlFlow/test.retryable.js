/* global it */
'use strict';

var assert = require('power-assert');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;

parallel('#retryable', function() {

  it('should retry', function(done) {

    var callCount = 0;
    var retryableTask = async.retryable(3, function(arg, callback) {
      callCount++;
      assert.strictEqual(arg, 42);
      callback('fail', callCount);
    });
    retryableTask(42, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, 3);
      done();
    });
  });

  it('should work as an embedded task', function(done) {

    var retryResult = 'RETRY';
    var fooResults;
    var retryResults;
    async.auto({
      dep: async.constant('dep'),
      foo: ['dep', function(res, callback) {
        fooResults = res;
        callback(null, 'FOO');
      }],
      retry: ['dep', async.retryable(function(res, callback) {
        retryResults = res;
        callback(null, retryResult);
      })]
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res.retry, retryResult);
      assert.strictEqual(fooResults, retryResults);
      done();
    });
  });

  it('should work as sn embedded task with interval', function(done) {

    var start = Date.now();
    var opts = {
      times: 3,
      interval: delay
    };
    async.auto({
      foo: function(callback) {
        callback(null, 'FOO');
      },
      retry: async.retryable(opts, function(callback) {
        callback('err');
      })
    }, function(err) {
      assert.ok(err);
      var diff = Date.now() - start;
      assert(diff > delay * (opts.times - 1));
      done();
    });
  });

});
