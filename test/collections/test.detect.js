/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function detectIterator(order) {

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

function detectIteratorWithKey(order) {

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

parallel('#detect', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.detect(collection, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 1);
      assert.deepStrictEqual(order, [1]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.detect(collection, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 1);
      assert.deepStrictEqual(order, [
        [1, 0]
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
    async.detect(collection, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 3);
      assert.deepStrictEqual(order, [2, 3]);
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
    async.detect(collection, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 3);
      assert.deepStrictEqual(order, [
        [2, 'c'],
        [3, 'b']
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
    async.detect(set, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 3);
      assert.deepStrictEqual(order, [2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of Set with passing key', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(5);
    set.add(3);
    set.add(2);
    async.detect(set, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 3);
      assert.deepStrictEqual(order, [
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
    async.detect(set, iterator, function(err) {
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
    async.detect(set, iterator, function(err) {
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
    map.set('a', 5);
    map.set('b', 3);
    map.set('c', 2);
    async.detect(map, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, ['b', 3]);
      assert.deepStrictEqual(order, [
        ['c', 2],
        ['b', 3]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 5);
    map.set('b', 3);
    map.set('c', 2);
    async.detect(map, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, ['b', 3]);
      assert.deepStrictEqual(order, [
        [ ['c', 2], 2],
        [ ['b', 3], 1]
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

    async.detect(collection, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 1.1);
      assert.deepStrictEqual(order, [1.1]);
      done();
    }, Math);
  });

  it('should not get item', function(done) {

    var order = [];
    var collection = [2, 6, 4];

    async.detect(collection, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, [2, 4, 6]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, false);
      }, num * delay);
    };
    async.detect(collection, iterator, function(err, res) {
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
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.detect(collection, iterator);
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
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.detect(collection, iterator, function(err, res) {
          if (err) {
            return done(err);
          }
          assert.strictEqual(res, undefined);
        });
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.detect([1, 2], function(item, callback) {
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

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.detect(array, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.detect(object, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.detect(function() {}, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.detect(undefined, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.detect(null, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

});

parallel('#detectSeries', function() {

  it('should execute iterator to series by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.detectSeries(collection, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 1);
      assert.deepStrictEqual(order, [1]);
      done();
    });
  });

  it('should execute iterator to series by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.detectSeries(collection, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 1);
      assert.deepStrictEqual(order, [
        [1, 0]
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
    async.detectSeries(collection, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 5);
      assert.deepStrictEqual(order, [5]);
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
    async.detectSeries(collection, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 5);
      assert.deepStrictEqual(order, [
        [5, 'a']
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
    async.detectSeries(set, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 5);
      assert.deepStrictEqual(order, [5]);
      done();
    });
  });

  it('should execute iterator to series by collection of Set with passing key', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(5);
    set.add(3);
    set.add(2);
    async.detectSeries(set, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 5);
      assert.deepStrictEqual(order, [
        [5, 0]
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
    async.detectSeries(set, iterator, function(err) {
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
    async.detectSeries(set, iterator, function(err) {
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
    map.set('a', 5);
    map.set('b', 3);
    map.set('c', 2);
    async.detectSeries(map, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, ['a', 5]);
      assert.deepStrictEqual(order, [
        ['a', 5]
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
    async.detectSeries(map, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, ['a', 5]);
      assert.deepStrictEqual(order, [
        [ ['a', 5], 0]
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

    async.detectSeries(collection, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 1.1);
      assert.deepStrictEqual(order, [1.1]);
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
      callback(null, key === 'c');
    };
    async.detectSeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(res, 2);
      done();
    });
    sync = false;
  });

  it('should not get item', function(done) {

    var order = [];
    var collection = [2, 6, 4];

    async.detectSeries(collection, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, [2, 6, 4]);
      done();
    });
  });

  it('should not get item', function(done) {

    var order = [];
    var collection = [2, 6, 4];

    async.detectSeries(collection, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, [
        [2, 0],
        [6, 1],
        [4, 2]
      ]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, false);
      }, num * delay);
    };
    async.detectSeries(collection, iterator, function(err, res) {
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
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.detectSeries(collection, iterator);
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.detectSeries([1, 2], function(item, callback) {
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
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.detectSeries(collection, iterator, function(err, res) {
          if (err) {
            return done(err);
          }
          assert.strictEqual(res, undefined);
        });
      });
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.detectSeries(array, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.detectSeries(object, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.detectSeries(function() {}, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.detectSeries(undefined, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.detectSeries(null, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should not cause stack overflow', function(done) {

    var array = _.range(10000);
    var calls = 0;
    async.detectSeries(array, function(data, callback) {
      calls++;
      setImmediate(function() {
        callback(null, true);
      });
    }, function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(calls, 1);
      done();
    });
  });

});

parallel('#detectLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [2, 4, 3, 2];

    async.detectLimit(collection, 2, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 3);
      assert.deepStrictEqual(order, [2, 4, 3]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index', function(done) {

    var order = [];
    var collection = [2, 4, 3, 2];

    async.detectLimit(collection, 2, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 3);
      assert.deepStrictEqual(order, [
        [2, 0],
        [4, 1],
        [3, 2]
      ]);
      done();
    });
  });

  it('should execute iterator in limited by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 2,
      b: 4,
      c: 3,
      d: 2
    };
    async.detectLimit(collection, 2, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 3);
      assert.deepStrictEqual(order, [2, 4, 3]);
      done();
    });
  });

  it('should execute iterator in limited by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 2,
      b: 4,
      c: 3,
      d: 2
    };
    async.detectLimit(collection, 2, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 3);
      assert.deepStrictEqual(order, [
        [2, 'a'],
        [4, 'b'],
        [3, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(2);
    set.add(4);
    set.add(3);
    set.add(2);
    async.detectLimit(set, 2, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 3);
      assert.deepStrictEqual(order, [2, 4, 3]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Set with passing key', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(2);
    set.add(4);
    set.add(3);
    set.add(2);
    async.detectLimit(set, 2, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 3);
      assert.deepStrictEqual(order, [
        [2, 0],
        [4, 1],
        [3, 2]
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
    async.detectLimit(set, 2, iterator, function(err) {
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
    async.detectLimit(set, 2, iterator, function(err) {
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
    async.detectLimit(set, 2, iterator, function(err) {
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
    map.set('a', 2);
    map.set('b', 4);
    map.set('c', 3);
    map.set('d', 2);
    async.detectLimit(map, 2, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, ['c', 3]);
      assert.deepStrictEqual(order, [
        ['a', 2],
        ['b', 4],
        ['c', 3]
      ]);
      done();
    });
  });

  it('should execute iterator in limited by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 2);
    map.set('b', 4);
    map.set('c', 3);
    map.set('d', 2);
    async.detectLimit(map, 2, detectIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, ['c', 3]);
      assert.deepStrictEqual(order, [
        [ ['a', 2], 0],
        [ ['b', 4], 1],
        [ ['c', 3], 2]
      ]);
      done();
    });
  });

  it('should execute iterator in limited without binding', function(done) {

    var order = [];
    var collection = {
      a: 2.1,
      b: 3.5,
      c: 2.7
    };

    async.detectLimit(collection, 2, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 2.1);
      assert.deepStrictEqual(order, [2.1]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [2, 3, 1];

    async.detectLimit(collection, Infinity, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 1);
      assert.deepStrictEqual(order, [1]);
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
    var iterator = function(n, key, callback) {
      callback(null, key === 'e');
    };
    async.detectLimit(collection, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(res, 5);
      done();
    });
    sync = false;
  });

  it('should not get item', function(done) {

    var order = [];
    var collection = [2, 8, 4];

    async.detectLimit(collection, 2, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, [2, 4, 8]);
      done();
    });
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 4, 2, 3];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 4, false);
      }, num * delay);
    };
    async.detectLimit(collection, 2, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, [1, 2, 4]);
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
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.detectLimit(collection, 2, iterator);
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.detectLimit([1, 2], 2, function(item, callback) {
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
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.detectLimit(collection, 2, iterator, function(err, res) {
          if (err) {
            return done(err);
          }
          assert.strictEqual(res, undefined);
        });
      });
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = [];
    async.detectLimit(array, 2, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.detectLimit(object, 2, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.detectLimit(function() {}, 2, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.detectLimit(undefined, 2, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.detectLimit(null, 2, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.detectLimit(collection, 0, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.detectLimit(collection, undefined, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, undefined);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should stop execution', function(done) {

    var order = [];
    var collection = [2, 1, 3];
    async.detectLimit(collection, 2, detectIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      order.push('callback');
      assert.strictEqual(res, 1);
    });
    setTimeout(function() {
      assert.deepStrictEqual(order, [1, 'callback', 2]);
      done();
    }, 10 * delay);
  });

  it('should not cause stack overflow', function(done) {

    var array = _.range(10000);
    var calls = 0;
    async.detectLimit(array, 100, function(data, callback) {
      calls++;
      setImmediate(function() {
        callback(null, true);
      });
    }, function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(calls, 100);
      done();
    });
  });

});
