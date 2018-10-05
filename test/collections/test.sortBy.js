/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function sortByIterator(order) {

  return function(value, callback) {

    var self = this;
    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(value);
      callback(null, num * 2);
    }, num * delay);
  };
}

function sortByIteratorWithKey(order) {

  return function(value, key, callback) {

    var self = this;
    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push([value, key]);
      callback(null, num * 2);
    }, num * delay);
  };
}

parallel('#sortBy', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortBy(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3]);
      assert.deepStrictEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortBy(collection, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3]);
      assert.deepStrictEqual(order, [
        [1, 0],
        [2, 2],
        [3, 1]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.sortBy(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3]);
      assert.deepStrictEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.sortBy(collection, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3]);
      assert.deepStrictEqual(order, [
        [1, 'a'],
        [2, 'c'],
        [3, 'b']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(1);
    set.add(3);
    set.add(2);
    async.sortBy(set, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 2, 3]);
      assert.deepStrictEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of Set with passing key', function(done) {
    var order = [];
    var set = new util.Set();
    set.add(1);
    set.add(3);
    set.add(2);
    async.sortBy(set, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 2, 3]);
      assert.deepStrictEqual(order, [
        [1, 0],
        [2, 2],
        [3, 1]
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
      next();
    };
    async.sortBy(set, iterator, function(err) {
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
      next();
    };
    async.sortBy(set, iterator, function(err) {
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
    map.set('b', 3);
    map.set('c', 2);
    async.sortBy(map, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [
        ['a', 1],
        ['c', 2],
        ['b', 3]
      ]);
      assert.deepStrictEqual(order, [
        ['a', 1],
        ['c', 2],
        ['b', 3]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 1);
    map.set('b', 3);
    map.set('c', 2);
    async.sortBy(map, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [
        ['a', 1],
        ['c', 2],
        ['b', 3]
      ]);
      assert.deepStrictEqual(order, [
        [['a', 1], 0],
        [['c', 2], 2],
        [['b', 3], 1]
      ]);
      done();
    });
  });

  it('should execute iterator without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.7
    };

    async.sortBy(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1.1, 2.7, 3.5]);
      assert.deepStrictEqual(order, [1.1, 2.7, 3.5]);
      done();
    }, Math);
  });

  it('should keep the order if criteria are same value', function(done) {

    var collection = [{
      a: 1, b: 1
    }, {
      a: 2, b: 2
    }, {
      a: 1, b: 3
    }, {
      a: 2, b: 4
    }, {
      a: 1, b: 5
    }];
    var iterator = function(obj, callback) {
      callback(null, obj.a);
    }
    async.sortBy(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [{
        a: 1, b: 1
      }, {
        a: 1, b: 3
      }, {
        a: 1, b: 5
      }, {
        a: 2, b: 2
      }, {
        a: 2, b: 4
      }]);
      done();
    });
  });

  it('should throw error', function(done) {
    var order = [];
    var collection = [1, 3, 2];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * delay);
    };
    async.sortBy(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 3);
      done();
    }, delay);

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
        var collection = [1, 3, 2];
        var iterator = function(num, index, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.sortBy(collection, iterator);
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.sortBy([1, 2, 3], function(item, callback) {
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

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.sortBy(function() {}, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.sortBy(undefined, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.sortBy(null, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

});

parallel('#sortBySeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortBySeries(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3]);
      assert.deepStrictEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortBySeries(collection, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3]);
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
      a: 1,
      b: 3,
      c: 2
    };
    async.sortBySeries(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3]);
      assert.deepStrictEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.sortBySeries(collection, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3]);
      assert.deepStrictEqual(order, [
        [1, 'a'],
        [3, 'b'],
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(1);
    set.add(3);
    set.add(2);
    async.sortBySeries(set, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 2, 3]);
      assert.deepStrictEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator to series by collection of Set with passing key', function(done) {
    var order = [];
    var set = new util.Set();
    set.add(1);
    set.add(3);
    set.add(2);
    async.sortBySeries(set, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 2, 3]);
      assert.deepStrictEqual(order, [
        [1, 0],
        [3, 1],
        [2, 2]
      ]);
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
      next();
    };
    async.sortBySeries(set, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [1, 2, 3, 4, 5, 6, 7]);
      done();
    });
  });

  it('should execute iterator to series by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 1);
    map.set('b', 3);
    map.set('c', 2);
    async.sortBySeries(map, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [
        ['a', 1],
        ['c', 2],
        ['b', 3]
      ]);
      assert.deepStrictEqual(order, [
        ['a', 1],
        ['b', 3],
        ['c', 2]
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of Map with passing key', function(done) {
    var order = [];
    var map = new util.Map();
    map.set('a', 1);
    map.set('b', 3);
    map.set('c', 2);
    async.sortBySeries(map, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [
        ['a', 1],
        ['c', 2],
        ['b', 3]
      ]);
      assert.deepStrictEqual(order, [
        [['a', 1], 0],
        [['b', 3], 1],
        [['c', 2], 2]
      ]);
      done();
    });
  });

  it('should execute iterator without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.7
    };

    async.sortBySeries(collection, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1.1, 2.7, 3.5]);
      assert.deepStrictEqual(order, [1.1, 3.5, 2.7]);
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
    var iterator = function(num, key, callback) {
      callback(null, num % 2);
    };
    async.sortBySeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepStrictEqual(res, [2, 1, 3]);
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * delay);
    };
    async.sortBySeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, [1, 3]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    var iterator = function(num, index, callback) {
      setTimeout(function() {
        order.push([num, index]);
        callback(num === 3, num);
      }, num * delay);
    };
    async.sortBySeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, [
        [1, 0],
        [3, 1]
      ]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 3);
      done();
    }, delay);

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
        var collection = [1, 3, 2];
        var iterator = function(num, index, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.sortBySeries(collection, iterator);
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.sortBySeries([1, 2, 3], function(item, callback) {
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

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.sortBySeries(function() {}, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.sortBySeries(undefined, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.sortBySeries(null, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

});

parallel('#sortByLimit', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    async.sortByLimit(collection, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3, 4, 5]);
      assert.deepStrictEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 5, 3, 2, 4];
    async.sortByLimit(collection, 2, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3, 4, 5]);
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

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 2,
      e: 4
    };
    async.sortByLimit(collection, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3, 4, 5]);
      assert.deepStrictEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 2,
      e: 4
    };
    async.sortByLimit(collection, 2, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3, 4, 5]);
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

  it('should execute iterator in limited by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(1);
    set.add(5);
    set.add(3);
    set.add(4);
    set.add(2);
    async.sortByLimit(set, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 2, 3, 4, 5]);
      assert.deepStrictEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Set with passing key', function(done) {
    var order = [];
    var set = new util.Set();
    set.add(1);
    set.add(5);
    set.add(3);
    set.add(4);
    set.add(2);
    async.sortByLimit(set, 2, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 2, 3, 4, 5]);
      assert.deepStrictEqual(order, [
        [1, 0],
        [3, 2],
        [5, 1],
        [2, 4],
        [4, 3]
      ]);
      done();
    });
  });

  it('should work with odd number of elements even if the size is decreased', function(done) {

    var called = 0;
    var order = [];
    var set = new util.Set([1, 2, 3, 4, 5]);
    var iterator = function(value, index, next) {
      order.push(value);
      set.delete(value + 1);
      next();
    };
    async.sortByLimit(set, 2, iterator, function(err) {
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
    var iterator = function(value, index, next) {
      order.push(value);
      set.delete(value + 1);
      next();
    };
    async.sortByLimit(set, 2, iterator, function(err) {
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
      next();
    };
    async.sortByLimit(set, 2, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [1, 2, 3, 4, 5, 6, 7]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 1);
    map.set('b', 5);
    map.set('c', 3);
    map.set('d', 4);
    map.set('e', 2);
    async.sortByLimit(map, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [
        ['a', 1],
        ['e', 2],
        ['c', 3],
        ['d', 4],
        ['b', 5]
      ]);
      assert.deepStrictEqual(order, [
        ['a', 1],
        ['c', 3],
        ['b', 5],
        ['e', 2],
        ['d', 4]
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
    map.set('d', 4);
    map.set('e', 2);
    async.sortByLimit(map, 2, sortByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [
        ['a', 1],
        ['e', 2],
        ['c', 3],
        ['d', 4],
        ['b', 5]
      ]);
      assert.deepStrictEqual(order, [
        [['a', 1], 0],
        [['c', 3], 2],
        [['b', 5], 1],
        [['e', 2], 4],
        [['d', 4], 3]
      ]);
      done();
    });
  });

  it('should execute iterator without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.7
    };

    async.sortByLimit(collection, 5, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1.1, 2.7, 3.5]);
      assert.deepStrictEqual(order, [1.1, 2.7, 3.5]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 5, 3];
    async.sortByLimit(collection, Infinity, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 3, 5]);
      assert.deepStrictEqual(order, [1, 3, 5]);
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
    var iterator = function(num, key, callback) {
      callback(null, num % 2);
    };
    async.sortByLimit(collection, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepStrictEqual(res, [2, 4, 1, 3, 5]);
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * delay);
    };
    async.sortByLimit(collection, 2, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, [1, 3]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 5, 3];
    var iterator = function(num, index, callback) {
      setTimeout(function() {
        order.push([num, index]);
        callback(num === 3, num);
      }, num * delay);
    };
    async.sortByLimit(collection, 2, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, [
        [1, 0],
        [3, 2]
      ]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {

    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 3);
      done();
    }, delay);

    domain.create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
        var collection = [1, 3, 2];
        var iterator = function(num, index, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.sortByLimit(collection, 2, iterator);
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.sortByLimit([1, 2, 3], 2, function(item, callback) {
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

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.sortByLimit(function() {}, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.sortByLimit(undefined, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.sortByLimit(null, 2, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortByLimit(collection, 0, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.sortByLimit(collection, undefined, sortByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

});
