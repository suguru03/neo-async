/* global it */
'use strict';

var assert = require('power-assert');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');

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

});
