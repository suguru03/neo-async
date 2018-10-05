/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function everyIterator(order) {

  return function(value, callback) {

    var self = this;
    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(value);
      callback(null, num % 2);
    }, num * delay);
  };
}

function everyIteratorWithKey(order) {

  return function(value, key, callback) {

    var self = this;
    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push([value, key]);
      callback(null, num % 2);
    }, num * delay);
  };
}

parallel('#every', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.every(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [1, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 1, 5];
    async.every(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [1, 1, 3, 5]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.every(collection, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        [1, 0],
        [2, 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.every(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [2]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.every(collection, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(5);
    set.add(3);
    set.add(2);
    async.every(set, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [2]);
      done();
    });
  });

  it('should execute iterator by collection of Set with passing key', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(4);
    set.add(3);
    set.add(2);
    async.every(set, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        [2, 2]
      ]);
      done();
    });
  });

  it('should work even if the size is decreased', function(done) {

    var order = [];
    var set = new util.Set([1, 2, 3, 4]);
    var iterator = function(value, next) {
      order.push(value);
      set.delete(value + 1);
      next(null, true);
    };
    async.every(set, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [1, 3]);
      done();
    });
  });

  it('should work even if the size is increased', function(done) {

    var order = [];
    var size = 4;
    var set = new util.Set([1, 2, 3, 4]);
    var iterator = function(value, next) {
      order.push(value);
      value % 2 === 0 && set.add(++size);
      next(null, true);
    };
    async.every(set, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [1, 2, 3, 4, 5, 6, 7]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 4);
    map.set('b', 3);
    map.set('c', 2);
    async.every(map, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        ['c', 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 4);
    map.set('b', 3);
    map.set('c', 2);
    async.every(map, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        [ ['c', 2], 2]
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

    async.every(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [1.1, 2.6, 3.5]);
      done();
    }, Math);
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.every([1, 2], function(item, callback) {
      try {
        callback(item);
      } catch (exception) {
        try {
          callback(exception);
        } catch(e) {
          assert.ok(e);
          util.errorChecker(e);
        }
        done();
      }
    }, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.every([], everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.every(function() {}, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.every(undefined, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.every(null, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return an error', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(value, key, callback) {
      callback('error');
    };
    async.every(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      done();
    });
  });

});

parallel('#everySeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.everySeries(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 1, 5];
    async.everySeries(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [1, 3, 1, 5]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.everySeries(collection, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        [1, 0],
        [3, 1],
        [2, 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.everySeries(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [4]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 4,
      b: 3,
      c: 2
    };
    async.everySeries(collection, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        [4, 'a']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(4);
    set.add(3);
    set.add(2);
    async.everySeries(set, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [4]);
      done();
    });
  });

  it('should execute iterator by collection of Set with passing key', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(4);
    set.add(3);
    set.add(2);
    async.everySeries(set, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        [4, 0]
      ]);
      done();
    });
  });

  it('should work even if the size is decreased', function(done) {

    var order = [];
    var set = new util.Set([1, 2, 3, 4]);
    var iterator = function(value, next) {
      order.push(value);
      set.delete(value + 1);
      next(null, true);
    };
    async.everySeries(set, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [1, 3]);
      done();
    });
  });

  it('should work even if the size is increased', function(done) {

    var order = [];
    var size = 4;
    var set = new util.Set([1, 2, 3, 4]);
    var iterator = function(value, next) {
      order.push(value);
      value % 2 === 0 && set.add(++size);
      next(null, true);
    };
    async.everySeries(set, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [1, 2, 3, 4, 5, 6, 7]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 4);
    map.set('b', 3);
    map.set('c', 2);
    async.everySeries(map, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        ['a', 4]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 4);
    map.set('b', 3);
    map.set('c', 2);
    async.everySeries(map, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        [ ['a', 4], 0]
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

    async.everySeries(collection, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [1.1, 3.5, 2.6]);
      done();
    }, Math);
  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    var iterator = function(n, key, callback) {
      callback(null, true);
    };
    async.everySeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(res, true);
      done();
    });
    sync = false;
  });

  it('should return an error', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(value, key, callback) {
      callback('error');
    };
    async.everySeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
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
        var iterator = function(num, callback) {
          process.nextTick(function() {
            callback(null, true);
          });
          process.nextTick(function() {
            callback(null, true);
          });
        };
        async.everySeries(collection, iterator);
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.everySeries([1, 2], function(item, callback) {
      try {
        callback(item);
      } catch (exception) {
        try {
          callback(exception);
        } catch(e) {
          assert.ok(e);
          util.errorChecker(e);
        }
        done();
      }
    }, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.everySeries([], everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.everySeries(function() {}, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.everySeries(undefined, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.everySeries(null, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

});

parallel('#everyLimit', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 2, 4];
    async.everyLimit(collection, 2, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [1, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array passing index', function(done) {

    var order = [];
    var collection = [1, 5, 2, 4];
    async.everyLimit(collection, 2, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        [1, 0],
        [2, 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 2,
      d: 4
    };
    async.everyLimit(collection, 2, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [1, 2]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 2,
      d: 4
    };
    async.everyLimit(collection, 2, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        [1, 'a'],
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(1);
    set.add(5);
    set.add(2);
    set.add(4);
    async.everyLimit(set, 2, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [1, 2]);
      done();
    });
  });

  it('should execute iterator by collection of Set with passing key', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(1);
    set.add(5);
    set.add(2);
    set.add(4);
    async.everyLimit(set, 2, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        [1, 0],
        [2, 2]
      ]);
      done();
    });
  });

  it('should work with odd number of elements even if the size is decreased', function(done) {

    var called = 0;
    var order = [];
    var set = new util.Set([1, 2, 3, 4, 5]);
    var iterator = function(value, next) {
      order.push(value);
      set.delete(value + 1);
      next(null, true);
    };
    async.everyLimit(set, 2, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(++called, 1);
      assert.deepStrictEqual(order, [1, 3, 5]);
      done();
    });
  });

  it('should work with even number of elements even if the size is decreased', function(done) {

    var called = 0;
    var order = [];
    var set = new util.Set([1, 2, 3, 4, 5, 6]);
    var iterator = function(value, next) {
      order.push(value);
      set.delete(value + 1);
      next(null, true);
    };
    async.everyLimit(set, 2, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(++called, 1);
      assert.deepStrictEqual(order, [1, 3, 5]);
      done();
    });
  });

  it('should work even if the size is increased', function(done) {

    var order = [];
    var size = 4;
    var set = new util.Set([1, 2, 3, 4]);
    var iterator = function(value, next) {
      order.push(value);
      value % 2 === 0 && set.add(++size);
      next(null, true);
    };
    async.everyLimit(set, 2, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [1, 2, 3, 4, 5, 6, 7]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 1);
    map.set('b', 5);
    map.set('c', 2);
    map.set('d', 4);
    async.everyLimit(map, 2, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        ['a', 1],
        ['c', 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 1);
    map.set('b', 5);
    map.set('c', 2);
    map.set('d', 4);
    async.everyLimit(map, 2, everyIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, [
        [ ['a', 1], 0],
        [ ['c', 2], 2]
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

    async.everyLimit(collection, 2, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [1.1, 3.5, 2.6]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 9, 5];
    async.everyLimit(collection, Infinity, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [1, 3, 5, 9]);
      done();
    });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.everyLimit([1, 2], 2, function(item, callback) {
      try {
        callback(item);
      } catch (exception) {
        try {
          callback(exception);
        } catch(e) {
          assert.ok(e);
          util.errorChecker(e);
        }
        done();
      }
    }, function(err) {
      assert.ok(err);
      assert.strictEqual(called, false);
      called = true;
      async.nothing();
    });
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.everyLimit([], 4, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.everyLimit(function() {}, 2, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.everyLimit(undefined, 0, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.everyLimit(null, 0, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.everyLimit(collection, 0, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.everyLimit(collection, undefined, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return an error', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(value, key, callback) {
      callback('error');
    };
    async.everyLimit(collection, 1, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      done();
    });
  });

  it('should stop execution', function(done) {

    var order = [];
    var collection = [3, 2, 1];
    async.everyLimit(collection, 2, everyIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      order.push('callback');
      assert.strictEqual(res, false);
    });
    setTimeout(function() {
      assert.deepStrictEqual(order, [2, 'callback', 3]);
      done();
    }, 10 * delay);
  });

});
