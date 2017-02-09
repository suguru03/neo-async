/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function groupByIterator(order) {

  return function(value, callback) {

    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      order.push(value);
      callback(null, Math.floor(num));
    }, num * delay);
  };
}

function groupByIteratorWithKey(order) {

  return function(value, key, callback) {

    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      order.push([value, key]);
      callback(null, Math.floor(num));
    }, num * delay);
  };
}

parallel('#groupBy', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [4.2, 6.4, 6.1];
    async.groupBy(collection, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        '4': [4.2],
        '6': [6.1, 6.4]
      });
      assert.deepEqual(order, [4.2, 6.1, 6.4]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [4.2, 6.4, 6.1];
    async.groupBy(collection, groupByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        '4': [4.2],
        '6': [6.1, 6.4]
      });
      assert.deepEqual(order, [
        [4.2, 0],
        [6.1, 2],
        [6.4, 1]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 4.2,
      b: 6.4,
      c: 6.1
    };
    async.groupBy(collection, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        '4': [4.2],
        '6': [6.1, 6.4]
      });
      assert.deepEqual(order, [4.2, 6.1, 6.4]);
      done();
    });
  });

  it('should execute iterator by collection of object with key', function(done) {

    var order = [];
    var collection = {
      a: 4.2,
      b: 6.4,
      c: 6.1
    };
    async.groupBy(collection, groupByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        '4': [4.2],
        '6': [6.1, 6.4]
      });
      assert.deepEqual(order, [
        [4.2, 'a'],
        [6.1, 'c'],
        [6.4, 'b']
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(4.2);
    set.add(6.4);
    set.add(6.1);
    async.groupBy(set, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        '4': [4.2],
        '6': [6.1, 6.4]
      });
      assert.deepEqual(order, [4.2, 6.1, 6.4]);
      done();
    });
  });

  it('should execute iterator to series by collection of Set with passing key', function(done) {
    var order = [];
    var set = new util.Set();
    set.add(4.2);
    set.add(6.4);
    set.add(6.1);
    async.groupBy(set, groupByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        '4': [4.2],
        '6': [6.1, 6.4]
      });
      assert.deepEqual(order, [
        [4.2, 0],
        [6.1, 2],
        [6.4, 1]
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 4.2);
    map.set('b', 6.4);
    map.set('c', 6.1);
    async.groupBy(map, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        '4': [['a',4.2]],
        '6': [['c', 6.1], ['b', 6.4]]
      });
      assert.deepEqual(order, [
        ['a', 4.2],
        ['c', 6.1],
        ['b', 6.4]
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of Map with passing key', function(done) {
    var order = [];
    var map = new util.Map();
    map.set('a', 4.2);
    map.set('b', 6.4);
    map.set('c', 6.1);
    async.groupBy(map, groupByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        '4': [['a',4.2]],
        '6': [['c', 6.1], ['b', 6.4]]
      });
      assert.deepEqual(order, [
        [['a', 4.2], 0],
        [['c', 6.1], 2],
        [['b', 6.4], 1]
      ]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [4.4, 6.4, 4, 5];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 5, Math.floor(num));
      }, num * delay);
    };

    async.groupBy(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {
        '4': [4, 4.4]
      });
      assert.deepEqual(order, [4, 4.4, 5]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 2);
      done();
    }, delay);

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
        var collection = [1, 3];
        var iterator = function(num, callback) {
          process.nextTick(function() {
            callback(null, num);
          });
          process.nextTick(function() {
            callback(null, num);
          });
        };
        async.groupBy(collection, iterator);
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.groupBy([1, 2, 3], function(item, callback) {
      try {
        callback(item);
      } catch (exception) {
        try {
          callback(exception);
        } catch(e) {
          assert.ok(e);
          util.errorChecker(e);
          done();
        }
      }
    }, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.groupBy(array, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.groupBy(object, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.groupBy(function() {}, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.groupBy(undefined, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.groupBy(null, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepEqual(res, {});
      assert.deepEqual(order, []);
      done();
    });
  });

});
