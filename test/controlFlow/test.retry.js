/* global it */
'use strict';

var assert = require('assert');

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

  it('should execute even if type of times is string', function(done) {

    var times = '3';
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

  it('should retry with empty options', function(done) {

    var callCount = 0;
    var fn = function(callback) {
      callCount++;
      callback('error');
    };
    var opts = {};
    async.retry(opts, fn, function(err) {
      assert.ok(err);
      assert.strictEqual(callCount, 5);
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

  it('retry with custom interval when all attempts fail',function(done) {
    var times = 3;
    var intervalFunc = function(retryCount) {
      return retryCount * 110;
    };
    var callCount = 0;
    var error = 'ERROR';
    var erroredResult = 'RESULT';
    var iterator = function(callback) {
      callCount++;
      callback(error + callCount, erroredResult + callCount); // respond with indexed values
    };
    var opts = {
      times: times,
      interval: intervalFunc
    };
    var start = Date.now();
    async.retry(opts, iterator, function(err, res) {
      var now = Date.now();
      var diff = now - start;
      assert.ok(diff >= 300, diff);
      assert.strictEqual(callCount, 3);
      assert.strictEqual(err, error + times);
      assert.strictEqual(res, erroredResult + times);
      done();
    });
  });

  it('should return extra arguments', function(done) {
    var func = function(callback) {
      callback(null, 1, 2, 3);
    };
    async.retry(5, func, function(err, arg1, arg2, arg3) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(arguments.length, 4);
      assert.strictEqual(arg1, 1);
      assert.strictEqual(arg2, 2);
      assert.strictEqual(arg3, 3);
      done();
    });
  });

  it('should return extra arguments with options', function(done) {
    var func = function(callback) {
      callback(null, 1, 2, 3);
    };
    var intervalFunc = function(retryCount) {
      return retryCount * 110;
    };
    var opts = {
      times: 5,
      interval: intervalFunc
    };
    async.retry(opts, func, function(err, arg1, arg2, arg3) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(arguments.length, 4);
      assert.strictEqual(arg1, 1);
      assert.strictEqual(arg2, 2);
      assert.strictEqual(arg3, 3);
      done();
    });
  });

  it('should use default interval if interval is invalid string or number', function(done) {
    var callCount = 0;
    var func = function(callback) {
      callback(++callCount % 2, callCount);
    };
    var opts = {
      interval: 'test'
    };
    async.retry(opts, func, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 2);
      assert.strictEqual(callCount, 2);
      done();
    });
  });

  it('retry when some attempts fail and error test returns false at some invokation',function(done) {
    var callCount = 0;
    var error = 'ERROR';
    var special = 'SPECIAL_ERROR';
    var erroredResult = 'RESULT';
    function fn(callback) {
      callCount++;
      var err = callCount === 2 ? special : error + callCount;
      callback(err, erroredResult + callCount);
    }
    function errorTest(err) {
      return err && err === error + callCount; // just a different pattern
    }
    var options = {
      errorFilter: errorTest
    };
    async.retry(options, fn, function(err, result) {
      assert.equal(callCount, 2, 'did not retry the correct number of times');
      assert.equal(err, special, 'Incorrect error was returned');
      assert.equal(result, erroredResult + 2, 'Incorrect result was returned');
      done();
    });
  });

  it('retry with interval when some attempts fail and error test returns false at some invokation',function(done) {
    var interval = 50;
    var callCount = 0;
    var error = 'ERROR';
    var erroredResult = 'RESULT';
    var special = 'SPECIAL_ERROR';
    var specialCount = 3;
    function fn(callback) {
      callCount++;
      var err = callCount === specialCount ? special : error + callCount;
      callback(err, erroredResult + callCount);
    }
    function errorTest(err) {
      return err && err !== special;
    }
    var start = new Date().getTime();
    async.retry({ interval: interval, errorFilter: errorTest }, fn, function(err, result){
      var now = new Date().getTime();
      var duration = now - start;
      assert(duration >= (interval * (specialCount - 1)),  'did not include interval');
      assert.equal(callCount, specialCount, 'did not retry the correct number of times');
      assert.equal(err, special, 'Incorrect error was returned');
      assert.equal(result, erroredResult + specialCount, 'Incorrect result was returned');
      done();
    });
  });

});
