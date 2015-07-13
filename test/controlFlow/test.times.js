/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = global.async || require('../../');
var delay = require('../config').delay;
var domain = require('domain').create();
var errorCallCount = 0;
domain.on('error', function(err) {
  errorCallCount++;
  assert.strictEqual(err.message, 'Callback was already called.');
});

function timeItrator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      order.push(num);
      if (self && self.pow) {
        num = self.pow(num, 2);
      }

      callback(null, num);
    }, num * 2 + (num % 2 === 0 ? 10 : 30));
  };
}

describe('#times', function() {

  it('should execute iterator', function(done) {

    var n = 3;
    var order = [];
    async.times(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [0, 1, 2]);
      assert.deepEqual(order, [0, 2, 1]);
      done();
    });
  });

  it('should execute iterator even if num is string', function(done) {

    var n = '3';
    var order = [];
    async.times(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [0, 1, 2]);
      assert.deepEqual(order, [0, 2, 1]);
      done();
    });
  });

  it('should execute iterator with binding', function(done) {

    var n = 3;
    var order = [];
    async.times(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [0, 1, 4]);
      assert.deepEqual(order, [0, 2, 1]);
      done();
    }, Math);
  });

  it('should return response immediately', function(done) {

    var n = 0;
    var order = [];
    async.times(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should throw error', function(done) {

    var n = 4;
    var iterator = function(n, next) {
      next(n === 2);
    };
    async.times(n, iterator, function(err) {
      assert.ok(err);
      setTimeout(done, delay);
    });
  });

  it('should throw error if double callback', function(done) {

    errorCallCount = 0;
    domain.run(function() {
      var iterator = function(num, callback) {
        process.nextTick(callback);
        process.nextTick(callback);
      };
      async.times(4, iterator);
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 4);
      done();
    }, delay);
  });

});

describe('#timesSeries', function() {

  it('should execute iterator', function(done) {

    var n = 3;
    var order = [];
    async.timesSeries(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [0, 1, 2]);
      assert.deepEqual(order, [0, 1, 2]);
      done();
    });
  });

  it('should execute iterator even if num is string', function(done) {

    var n = '3';
    var order = [];
    async.timesSeries(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [0, 1, 2]);
      assert.deepEqual(order, [0, 1, 2]);
      done();
    });
  });

  it('should execute iterator with binding', function(done) {

    var n = 3;
    var order = [];
    async.timesSeries(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [0, 1, 4]);
      assert.deepEqual(order, [0, 1, 2]);
      done();
    }, Math);
  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var n = 3;
    var iterator = function(n, callback) {
      callback(null, n);
    };
    async.timesSeries(n, iterator, function(err, result) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepEqual(result, [0, 1, 2]);
      done();
    });
    sync = false;
  });

  it('should return response immediately', function(done) {

    var n = 0;
    var order = [];
    async.timesSeries(n, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should throw error', function(done) {

    var n = 4;
    var iterator = function(n, next) {
      next(n === 2);
    };
    async.timesSeries(n, iterator, function(err) {
      assert.ok(err);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    errorCallCount = 0;
    domain.run(function() {
      var iterator = function(num, callback) {
        process.nextTick(callback);
        process.nextTick(callback);
      };
      async.timesSeries(4, iterator);
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 4);
      done();
    }, delay);
  });

});

describe('#timesLimit', function() {

  it('should execute iterator', function(done) {

    var n = 5;
    var order = [];
    async.timesLimit(n, 3, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [0, 1, 2, 3, 4]);
      assert.deepEqual(order, [0, 2, 1, 4, 3]);
      done();
    });
  });

  it('should execute iterator even if num is string', function(done) {

    var n = '5';
    var order = [];
    async.timesLimit(n, 3, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [0, 1, 2, 3, 4]);
      assert.deepEqual(order, [0, 2, 1, 4, 3]);
      done();
    });
  });

  it('should execute iterator with binding', function(done) {

    var n = 7;
    var order = [];
    async.timesLimit(n, 3, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [0, 1, 4, 9, 16, 25, 36]);
      assert.deepEqual(order, [0, 2, 1, 4, 3, 6, 5]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var n = 5;
    var order = [];
    var iterator = function(n, done) {
      setTimeout(function() {
        order.push(n);
        done(null, n);
      }, n * 30);
    };
    async.timesLimit(n, Infinity, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [0, 1, 2, 3, 4]);
      assert.deepEqual(order, [0, 1, 2, 3, 4]);
      done();
    });
  });

  it('should return response immediately', function(done) {

    var n = 0;
    var order = [];
    async.timesLimit(n, 2, timeItrator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should throw error', function(done) {

    var n = 6;
    var iterator = function(n, next) {
      next(n === 4);
    };
    async.timesLimit(n, 3, iterator, function(err) {
      assert.ok(err);
      setTimeout(done, delay);
    });
  });

  it('should throw error if double callback', function(done) {

    errorCallCount = 0;
    domain.run(function() {
      var iterator = function(num, callback) {
        process.nextTick(callback);
        process.nextTick(callback);
      };
      async.timesLimit(4, 2, iterator);
    });
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 4);
      done();
    }, delay);
  });

});
