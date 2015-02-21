/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');

describe('#until', function() {

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
      callback();
    };

    async.until(test, iterator, function(err) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(order.iterator, [0, 1, 2, 3, 4]);
      assert.deepEqual(order.test, [0, 1, 2, 3, 4, 5]);
      done();
    });

  });

  it('should execute with binding until test is false', function(done) {

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
      result.push(this.pow(count, 2));
      order.iterator.push(count++);
      callback();
    };

    async.until(test, iterator, function(err) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(order.iterator, [0, 1, 2, 3, 4]);
      assert.deepEqual(order.test, [0, 1, 2, 3, 4, 5]);
      assert.deepEqual(result, [0, 1, 4, 9, 16]);
      done();
    }, Math);

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
      assert.deepEqual(order.iterator, [0, 1, 2]);
      assert.deepEqual(order.test, [0, 1, 2]);
      done();
    });

  });

});

describe('#doUntil', function() {

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
      callback();
    };

    async.doUntil(iterator, test, function(err) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(order.iterator, [0, 1, 2, 3, 4]);
      assert.deepEqual(order.test, [1, 2, 3, 4, 5]);
      done();
    });

  });

  it('should execute with binding until test is false', function(done) {

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
      result.push(this.pow(count, 2));
      order.iterator.push(count++);
      callback();
    };

    async.doUntil(iterator, test, function(err) {
      if (err) {
        return done(err);
      }

      assert.deepEqual(order.iterator, [0, 1, 2, 3, 4]);
      assert.deepEqual(order.test, [1, 2, 3, 4, 5]);
      assert.deepEqual(result, [0, 1, 4, 9, 16]);
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

      assert.deepEqual(order.iterator, [0, 1, 2, 3, 4]);
      assert.deepEqual(order.test, [1, 2, 3, 4, 5]);
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
      assert.deepEqual(order.iterator, [0, 1, 2]);
      assert.deepEqual(order.test, [1, 2]);
      done();
    });

  });

});
