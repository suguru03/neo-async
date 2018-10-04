/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function transformIterator(order) {

  return function(memo, value, callback) {

    var self = this;
    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      if (num % 2 === 1) {
        if (_.isArray(memo)) {
          memo.push(value);
        }
      }
      order.push(value);
      callback();
    }, num * delay);
  };
}

function transformIteratorWithKey(order) {

  return function(memo, value, key, callback) {

    var self = this;
    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      if (num % 2 === 1) {
        if (_.isArray(memo)) {
          memo.push(value);
        } else {
          memo[key] = value;
        }
      }
      order.push([value, key]);
      if (key === 'break') {
        return callback(null, false);
      }
      callback();
    }, num * delay);
  };
}

parallel('#transform', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    async.transform(collection, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 5]);
      assert.deepStrictEqual(order, [1, 2, 3, 4, 5]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    async.transform(collection, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 5]);
      assert.deepStrictEqual(order, [
        [1, 0],
        [2, 3],
        [3, 2],
        [4, 4],
        [5, 1]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.transform(collection, [], transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [3, 5]);
      assert.deepStrictEqual(order, [2, 3, 5]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.transform(collection, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        b: 3,
        a: 5
      });
      assert.deepStrictEqual(order, [
        [2, 'c'],
        [3, 'b'],
        [5, 'a']
      ]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(5);
    set.add(3);
    set.add(2);
    async.transform(set, [], transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [3, 5]);
      assert.deepStrictEqual(order, [2, 3, 5]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Set with passing index', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(5);
    set.add(3);
    set.add(2);
    async.transform(set, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        0: 5,
        1: 3
      });
      assert.deepStrictEqual(order, [
        [2, 2],
        [3, 1],
        [5, 0]
      ]);
      done();
    });
  });

  it('should work properly even if elements are added in callback', function(done) {

    var order = [];
    var arr = [1, 3, 2];
    var set = new util.Set(arr);
    var iterator = function(acc, value, next) {
      order.push(value);
      acc.push(value);
      next();
    };
    async.transform(set, [], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      setTimeout(function() {
        assert.deepStrictEqual(order, arr);
        assert.deepStrictEqual(res, arr);
        done();
      }, delay);
      set.add(4);
    });
  });

  it('should work even if the size is changed', function(done) {

    var order = [];
    var set = new util.Set([1, 2, 3, 4]);
    var iterator = function(acc, value, next) {
      order.push(value);
      set.delete(value + 1);
      acc.push(value);
      next();
    };
    async.transform(set, [], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [1, 3]);
      assert.deepStrictEqual(res, [1, 3]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 5);
    map.set('b', 3);
    map.set('c', 2);
    async.transform(map, [], transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [
        ['b', 3],
        ['a', 5]
      ]);
      assert.deepStrictEqual(order, [
        ['c', 2],
        ['b', 3],
        ['a', 5]
      ]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 5);
    map.set('b', 3);
    map.set('c', 2);
    async.transform(map, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        0: ['a', 5],
        1: ['b', 3]
      });
      assert.deepStrictEqual(order, [
        [['c', 2], 2],
        [['b', 3], 1],
        [['a', 5], 0]
      ]);
      done();
    });
  });

  it('should execute iterator and break when callback is called "false"', function(done) {

    var order = [];
    var collection = [4, 3, 2];
    var iterator = function(memo, num, callback) {
      setTimeout(function() {
        order.push(num);
        memo.push(num);
        callback(null, num !== 3);
      }, num * delay);
    };
    async.transform(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 3]);
      assert.deepStrictEqual(order, [2, 3]);
      done();
    });
  });

  it('should execute iterator and break when callback is called "false"', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2,
      'break': 3.5
    };
    async.transform(collection, [], transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }

      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [3]);
      assert.deepStrictEqual(order, [
        [2, 'c'],
        [3, 'b'],
        [3.5, 'break']
      ]);
      done();
    });
  });

  it('should execute iterator without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.transform(collection, {}, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, [
        [1.1, 'a'],
        [2.6, 'c'],
        [3.5, 'b']
      ]);
      done();
    }, Math);
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    var iterator = function(memo, value, key, callback) {
      setTimeout(function() {
        memo.push(value);
        order.push(value);
        callback(value === 4);
      }, value * delay);
    };
    async.transform(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 2, 3, 4]);
      assert.deepStrictEqual(order, [1, 2, 3, 4]);
      done();
    });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.transform([1, 2, 3], function(memo, item, callback) {
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

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transform([], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transform({}, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.transform(function() {}, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.transform(undefined, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.transform(null, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return accumulator immediately if array is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transform([], {}, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      done();
    });
  });

  it('should return accumulator immediately if object is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transform({}, [], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      done();
    });
  });

});

parallel('#transformSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.transformSeries(collection, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3]);
      assert.deepStrictEqual(order, [1, 3, 2, 4]);
      done();
    });
  });

  it('should execute iterator to series by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.transformSeries(collection, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3]);
      assert.deepStrictEqual(order, [
        [1, 0],
        [3, 1],
        [2, 2],
        [4, 3]
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.transformSeries(collection, [], transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [5, 3]);
      assert.deepStrictEqual(order, [5, 3, 2]);
      done();
    });
  });

  it('should execute iterator to series by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.transformSeries(collection, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        a: 5,
        b: 3
      });
      assert.deepStrictEqual(order, [
        [5, 'a'],
        [3, 'b'],
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(5);
    set.add(3);
    set.add(2);
    async.transformSeries(set, [], transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [5, 3]);
      assert.deepStrictEqual(order, [5, 3, 2]);
      done();
    });
  });

  it('should execute iterator to series by collection of Set with passing index', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(5);
    set.add(3);
    set.add(2);
    async.transformSeries(set, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        0: 5,
        1: 3
      });
      assert.deepStrictEqual(order, [
        [5, 0],
        [3, 1],
        [2, 2]
      ]);
      done();
    });
  });

  it('should work properly even if elements are added in callback', function(done) {

    var order = [];
    var arr = [1, 3, 2];
    var set = new util.Set(arr);
    var iterator = function(acc, value, next) {
      order.push(value);
      acc.push(value);
      next();
    };
    async.transformSeries(set, [], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      setTimeout(function() {
        assert.deepStrictEqual(order, arr);
        assert.deepStrictEqual(res, arr);
        done();
      }, delay);
      set.add(4);
    });
  });

  it('should work even if the size is changed', function(done) {

    var order = [];
    var set = new util.Set([1, 2, 3, 4]);
    var iterator = function(acc, value, next) {
      order.push(value);
      set.delete(value + 1);
      acc.push(value);
      next();
    };
    async.transformSeries(set, [], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [1, 3]);
      assert.deepStrictEqual(res, [1, 3]);
      done();
    });
  });

  it('should execute iterator to series by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 5);
    map.set('b', 3);
    map.set('c', 2);
    async.transformSeries(map, [], transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [
        ['a', 5],
        ['b', 3]
      ]);
      assert.deepStrictEqual(order, [
        ['a', 5],
        ['b', 3],
        ['c', 2]
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 5);
    map.set('b', 3);
    map.set('c', 2);
    async.transformSeries(map, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        0: ['a', 5],
        1: ['b', 3]
      });
      assert.deepStrictEqual(order, [
        [['a', 5], 0],
        [['b', 3], 1],
        [['c', 2], 2]
      ]);
      done();
    });
  });

  it('should execute iterator and break when callback is called "false"', function(done) {

    var order = [];
    var collection = {
      a: 5,
      'break': 3.5,
      b: 3,
      c: 2
    };
    async.transformSeries(collection, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        a: 5
      });
      assert.deepStrictEqual(order, [
        [5, 'a'],
        [3.5, 'break']
      ]);
      done();
    });
  });

  it('should execute iterator to series without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.transformSeries(collection, undefined, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, [
        [1.1, 'a'],
        [3.5, 'b'],
        [2.6, 'c']
      ]);
      done();
    });
  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var collection = {
      a: 1,
      b: 3,
      c: 2,
      d: 4,
      e: 5
    };
    var iterator = function(result, num, key, callback) {
      result[key] = num * 2;
      callback();
    };
    async.transformSeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepStrictEqual(res, {
        a: 2,
        b: 6,
        c: 4,
        d: 8,
        e: 10
      });
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    var iterator = function(memo, value, key, callback) {
      setTimeout(function() {
        memo.push(value);
        order.push(value);
        callback(value === 4);
      }, value * delay);
    };
    async.transformSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 5, 3, 2, 4]);
      assert.deepStrictEqual(order, [1, 5, 3, 2, 4]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 4);
      done();
    }, delay);

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
        var collection = [1, 3, 2, 4];
        var iterator = function(memo, value, key, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.transformSeries(collection, iterator, _.noop);
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.transformSeries([1, 2, 3], function(memo, item, callback) {
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

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformSeries([], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformSeries({}, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.transformSeries(function() {}, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.transformSeries(undefined, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.transformSeries(null, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return accumulator immediately if array is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformSeries([], {}, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      done();
    });
  });

  it('should return accumulator immediately if object is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformSeries({}, [], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      done();
    });
  });

});

parallel('#transformLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.transformLimit(collection, 2, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 5]);
      assert.deepStrictEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];

    async.transformLimit(collection, 2, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 5]);
      assert.deepStrictEqual(order, [
        [1, 0],
        [3, 2],
        [5, 1],
        [2, 3],
        [4, 4]
      ]);
      done();
    });
  });

  it('should execute iterator in limited by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 2,
      e: 4
    };
    async.transformLimit(collection, 2, [], transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 5]);
      assert.deepStrictEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 2,
      e: 4
    };
    async.transformLimit(collection, 2, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        a: 1,
        b: 5,
        c: 3
      });
      assert.deepStrictEqual(order, [
        [1, 'a'],
        [3, 'c'],
        [5, 'b'],
        [2, 'd'],
        [4, 'e']
      ]);
      done();
    });
  });

  it('should work properly even if elements are added in callback', function(done) {

    var order = [];
    var arr = [1, 5, 3, 2, 4];
    var set = new util.Set(arr);
    var iterator = function(acc, value, next) {
      order.push(value);
      acc.push(value);
      next();
    };
    async.transformLimit(set, 2, [], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      setTimeout(function() {
        assert.deepStrictEqual(order, arr);
        assert.deepStrictEqual(res, arr);
        done();
      }, delay);
      set.add(6);
    });
  });

  it('should work with odd number of elements even if the size is changed', function(done) {

    var called = 0;
    var order = [];
    var set = new util.Set([1, 2, 3, 4, 5]);
    var iterator = function(acc, value, next) {
      order.push(value);
      set.delete(value + 1);
      acc.push(value);
      next();
    };
    async.transformLimit(set, 2, [], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(++called, 1);
      assert.deepStrictEqual(order, [1, 3, 5]);
      assert.deepStrictEqual(res, [1, 3, 5]);
      done();
    });
  });

  it('should work with even number of elements even if the size is changed', function(done) {

    var called = 0;
    var order = [];
    var set = new util.Set([1, 2, 3, 4, 5, 6]);
    var iterator = function(acc, value, next) {
      order.push(value);
      set.delete(value + 1);
      acc.push(value);
      next();
    };
    async.transformLimit(set, 2, [], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(++called, 1);
      assert.deepStrictEqual(order, [1, 3, 5]);
      assert.deepStrictEqual(res, [1, 3, 5]);
      done();
    });
  });

  it('should work with odd number of elements even if the size is changed', function(done) {

    var called = 0;
    var order = [];
    var set = new util.Set([1, 2, 3, 4, 5]);
    var iterator = function(acc, value, index, next) {
      order.push([index, value]);
      set.delete(value + 1);
      acc.push(value);
      next();
    };
    async.transformLimit(set, 2, [], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(++called, 1);
      assert.deepStrictEqual(order, [[0, 1], [1, 3], [2, 5]]);
      assert.deepStrictEqual(res, [1, 3, 5]);
      done();
    });
  });

  it('should work with even number of elements even if the size is changed', function(done) {

    var called = 0;
    var order = [];
    var set = new util.Set([1, 2, 3, 4, 5, 6]);
    var iterator = function(acc, value, index, next) {
      order.push([index, value]);
      set.delete(value + 1);
      acc.push(value);
      next();
    };
    async.transformLimit(set, 2, [], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(++called, 1);
      assert.deepStrictEqual(order, [[0, 1], [1, 3], [2, 5]]);
      assert.deepStrictEqual(res, [1, 3, 5]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 1);
    map.set('b', 5);
    map.set('c', 3);
    map.set('d', 2);
    map.set('e', 4);
    async.transformLimit(map, 2, [], transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [
        ['a', 1],
        ['c', 3],
        ['b', 5]
      ]);
      assert.deepStrictEqual(order, [
        ['a', 1],
        ['c', 3],
        ['b', 5],
        ['d', 2],
        ['e', 4]
      ]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 1);
    map.set('b', 5);
    map.set('c', 3);
    map.set('d', 2);
    map.set('e', 4);
    async.transformLimit(map, 2, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        0: ['a', 1],
        1: ['b', 5],
        2: ['c', 3]
      });
      assert.deepStrictEqual(order, [
        [['a', 1], 0],
        [['c', 3], 2],
        [['b', 5], 1],
        [['d', 2], 3],
        [['e', 4], 4]
      ]);
      done();
    });
  });

  it('should execute iterator in limited and break when callback is called "false"', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2,
      'break': 3.5,
      d: 3
    };
    async.transformLimit(collection, 4, transformIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        b: 3
      });
      assert.deepStrictEqual(order, [
        [2, 'c'],
        [3, 'b'],
        [3.5, 'break']
      ]);
      done();
    });

  });

  it('should execute iterator in limited without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.7
    };

    async.transformLimit(collection, 2, [], transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, [1.1, 3.5, 2.7]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 4, 2, 3, 1, 1];

    async.transformLimit(collection, Infinity, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 1, 1, 3, 3]);
      assert.deepStrictEqual(order, [1, 1, 1, 2, 3, 3, 4]);
      done();
    });
  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var collection = {
      a: 1,
      b: 3,
      c: 2,
      d: 4,
      e: 5
    };
    var iterator = function(result, num, key, callback) {
      result[key] = num * 2;
      callback();
    };
    async.transformLimit(collection, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepStrictEqual(res, {
        a: 2,
        b: 6,
        c: 4,
        d: 8,
        e: 10
      });
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    var iterator = function(memo, value, key, callback) {
      setTimeout(function() {
        memo.push(value);
        order.push(value);
        callback(value === 3);
      }, value * delay);
    };
    async.transformLimit(collection, 2, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3]);
      assert.deepStrictEqual(order, [1, 3]);
      done();
    });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.transformLimit([1, 2, 3], 2, function(memo, item, callback) {
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

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformLimit([], 3, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformLimit({}, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.transformLimit(function() {}, 2, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.transformLimit(undefined, 2, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.transformLimit(null, 2, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.transformLimit(collection, 0, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(order, []);
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.transformLimit(collection, undefined, transformIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(order, []);
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return accumulator immediately if array is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformLimit([], 4, {}, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      done();
    });
  });

  it('should return accumulator immediately if object is empty', function(done) {

    var iterator = function(memo, value, key, callback) {
      callback();
    };
    async.transformLimit({}, 4, [], iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      done();
    });
  });

});
