/* global it */
'use strict';

var assert = require('assert');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');

parallel('#until', function() {

  it('should execute until test is true', function(done) {

    var count = 0;
    var limit = 5;
    var order = {
      test: [],
      iterator: []
    };
    var test = function() {
      order.test.push(count);
      return count === limit;
    };
    var iterator = function(callback) {
      order.iterator.push(count++);
      callback(null, count);
    };

    async.until(test, iterator, function(err, res) {
      if (err) {
        return done(err);
      }

      assert.deepStrictEqual(order.iterator, [0, 1, 2, 3, 4]);
      assert.deepStrictEqual(order.test, [0, 1, 2, 3, 4, 5]);
      assert.strictEqual(res, 5);
      done();
    });
  });

  it('should execute without binding until test is false', function(done) {

    var count = 0;
    var limit = 5;
    var order = {
      test: [],
      iterator: []
    };
    var result = [];
    var test = function() {
      order.test.push(count);
      return count === limit;
    };
    var iterator = function(callback) {
      assert.strictEqual(this, undefined);
      result.push(count * count);
      order.iterator.push(count++);
      callback(null, count);
    };

    async.until(test, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order.iterator, [0, 1, 2, 3, 4]);
      assert.deepStrictEqual(order.test, [0, 1, 2, 3, 4, 5]);
      assert.deepStrictEqual(result, [0, 1, 4, 9, 16]);
      assert.strictEqual(res, 5);
      done();
    }, Math);
  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var count = 0;
    var limit = 5;
    var test = function() {
      return count === limit;
    };
    var iterator = function(callback) {
      count++;
      callback();
    };
    async.until(test, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      done();
    });
    sync = false;
  });

  it('should execute callback immediately if first test is truthy', function(done) {

    var test = function() {
      return true;
    };
    var iterator = function(callback) {
      callback();
    };
    async.until(test, iterator, done);
  });

  it('should get multiple result', function(done) {

    var count = 0;
    var limit = 5;
    var test = function() {
      assert.strictEqual(arguments.length, count);
      return count === limit;
    };
    var iterator = function(callback) {
      callback.apply(null, [null].concat(_.range(++count)));
    };
    async.until(test, iterator, function(err, res1, res2, res3, res4) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(count, 5);
      assert.strictEqual(arguments.length, 6);
      assert.strictEqual(res1, 0);
      assert.strictEqual(res2, 1);
      assert.strictEqual(res3, 2);
      assert.strictEqual(res4, 3);
      done();
    });
  });

  it('should throw error', function(done) {

    var count = 0;
    var limit = 5;
    var order = {
      test: [],
      iterator: []
    };
    var test = function() {
      order.test.push(count);
      return count === limit;
    };
    var iterator = function(callback) {
      order.iterator.push(count++);
      callback(count === 3);
    };
    async.until(test, iterator, function(err) {
      assert.ok(err);
      assert.deepStrictEqual(order.iterator, [0, 1, 2]);
      assert.deepStrictEqual(order.test, [0, 1, 2]);
      done();
    });
  });

});

parallel('#doUntil', function() {

  it('should execute until test is false', function(done) {

    var count = 0;
    var limit = 5;
    var order = {
      test: [],
      iterator: []
    };
    var test = function() {
      order.test.push(count);
      return count === limit;
    };
    var iterator = function(callback) {
      order.iterator.push(count++);
      callback(null, count);
    };

    async.doUntil(iterator, test, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order.iterator, [0, 1, 2, 3, 4]);
      assert.deepStrictEqual(order.test, [1, 2, 3, 4, 5]);
      assert.strictEqual(res, 5);
      done();
    });
  });

  it('should execute without binding until test is false', function(done) {

    var count = 0;
    var limit = 5;
    var order = {
      test: [],
      iterator: []
    };
    var result = [];
    var test = function() {
      order.test.push(count);
      return count === limit;
    };
    var iterator = function(callback) {
      assert.strictEqual(this, undefined);
      result.push(count * count);
      order.iterator.push(count++);
      callback(null, count);
    };

    async.doUntil(iterator, test, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order.iterator, [0, 1, 2, 3, 4]);
      assert.deepStrictEqual(order.test, [1, 2, 3, 4, 5]);
      assert.deepStrictEqual(result, [0, 1, 4, 9, 16]);
      assert.strictEqual(res, 5);
      done();
    }, Math);
  });

  it('should execute until test is false and apply params', function(done) {

    var count = 0;
    var limit = 5;
    var order = {
      test: [],
      iterator: []
    };
    var test = function(c) {
      order.test.push(c);
      return c < limit;
    };
    var iterator = function(callback) {
      order.iterator.push(count++);
      callback(null, count);
    };

    async.doWhilst(iterator, test, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order.iterator, [0, 1, 2, 3, 4]);
      assert.deepStrictEqual(order.test, [1, 2, 3, 4, 5]);
      done();
    });

  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var count = 0;
    var limit = 5;
    var test = function() {
      return count === limit;
    };
    var iterator = function(callback) {
      count++;
      callback();
    };
    async.doUntil(iterator, test, function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      done();
    });
    sync = false;
  });

  it('should get multiple result', function(done) {

    var count = 0;
    var limit = 5;
    var test = function(arg) {
      assert.strictEqual(arg, 0);
      assert.strictEqual(arguments.length, count);
      return count === limit;
    };
    var iterator = function(callback) {
      callback.apply(null, [null].concat(_.range(++count)));
    };
    async.doUntil(iterator, test, function(err, res1, res2, res3, res4) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(count, 5);
      assert.strictEqual(arguments.length, 6);
      assert.strictEqual(res1, 0);
      assert.strictEqual(res2, 1);
      assert.strictEqual(res3, 2);
      assert.strictEqual(res4, 3);
      done();
    });
  });

  it('should throw error', function(done) {

    var count = 0;
    var limit = 5;
    var order = {
      test: [],
      iterator: []
    };
    var test = function() {
      order.test.push(count);
      return count === limit;
    };
    var iterator = function(callback) {
      order.iterator.push(count++);
      callback(count === 3);
    };

    async.doUntil(iterator, test, function(err) {
      assert.ok(err);
      assert.deepStrictEqual(order.iterator, [0, 1, 2]);
      assert.deepStrictEqual(order.test, [1, 2]);
      done();
    });
  });

});
