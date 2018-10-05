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
      assert.deepStrictEqual(res, {
        '4': [4.2],
        '6': [6.1, 6.4]
      });
      assert.deepStrictEqual(order, [4.2, 6.1, 6.4]);
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
      assert.deepStrictEqual(res, {
        '4': [4.2],
        '6': [6.1, 6.4]
      });
      assert.deepStrictEqual(order, [
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
      assert.deepStrictEqual(res, {
        '4': [4.2],
        '6': [6.1, 6.4]
      });
      assert.deepStrictEqual(order, [4.2, 6.1, 6.4]);
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
      assert.deepStrictEqual(res, {
        '4': [4.2],
        '6': [6.1, 6.4]
      });
      assert.deepStrictEqual(order, [
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
      assert.deepStrictEqual(res, {
        '4': [4.2],
        '6': [6.1, 6.4]
      });
      assert.deepStrictEqual(order, [4.2, 6.1, 6.4]);
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
      assert.deepStrictEqual(res, {
        '4': [4.2],
        '6': [6.1, 6.4]
      });
      assert.deepStrictEqual(order, [
        [4.2, 0],
        [6.1, 2],
        [6.4, 1]
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
    async.groupBy(set, iterator, function(err) {
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
    async.groupBy(set, iterator, function(err) {
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
    map.set('a', 4.2);
    map.set('b', 6.4);
    map.set('c', 6.1);
    async.groupBy(map, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '4': [['a',4.2]],
        '6': [['c', 6.1], ['b', 6.4]]
      });
      assert.deepStrictEqual(order, [
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
      assert.deepStrictEqual(res, {
        '4': [['a',4.2]],
        '6': [['c', 6.1], ['b', 6.4]]
      });
      assert.deepStrictEqual(order, [
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
      assert.deepStrictEqual(res, {
        '4': [4, 4.4]
      });
      assert.deepStrictEqual(order, [4, 4.4, 5]);
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
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
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
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
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
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
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
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
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
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

});

parallel('#groupBySeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [4.2, 6.4, 6.1];
    async.groupBySeries(collection, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '4': [4.2],
        '6': [6.4, 6.1]
      });
      assert.deepStrictEqual(order, [4.2, 6.4, 6.1]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [4.2, 6.4, 6.1];
    async.groupBySeries(collection, groupByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '4': [4.2],
        '6': [6.4, 6.1]
      });
      assert.deepStrictEqual(order, [
        [4.2, 0],
        [6.4, 1],
        [6.1, 2]
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
    async.groupBySeries(collection, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '4': [4.2],
        '6': [6.4, 6.1]
      });
      assert.deepStrictEqual(order, [4.2, 6.4, 6.1]);
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
    async.groupBySeries(collection, groupByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '4': [4.2],
        '6': [6.4, 6.1]
      });
      assert.deepStrictEqual(order, [
        [4.2, 'a'],
        [6.4, 'b'],
        [6.1, 'c']
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
    async.groupBySeries(set, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '4': [4.2],
        '6': [6.4, 6.1]
      });
      assert.deepStrictEqual(order, [4.2, 6.4, 6.1]);
      done();
    });
  });

  it('should execute iterator to series by collection of Set with passing key', function(done) {
    var order = [];
    var set = new util.Set();
    set.add(4.2);
    set.add(6.4);
    set.add(6.1);
    async.groupBySeries(set, groupByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '4': [4.2],
        '6': [6.4, 6.1]
      });
      assert.deepStrictEqual(order, [
        [4.2, 0],
        [6.4, 1],
        [6.1, 2]
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
    async.groupBySeries(set, iterator, function(err) {
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
    async.groupBySeries(set, iterator, function(err) {
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
    map.set('a', 4.2);
    map.set('b', 6.4);
    map.set('c', 6.1);
    async.groupBySeries(map, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '4': [['a',4.2]],
        '6': [['b', 6.4], ['c', 6.1]]
      });
      assert.deepStrictEqual(order, [
        ['a', 4.2],
        ['b', 6.4],
        ['c', 6.1]
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
    async.groupBySeries(map, groupByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '4': [['a',4.2]],
        '6': [['b', 6.4], ['c', 6.1]]
      });
      assert.deepStrictEqual(order, [
        [['a', 4.2], 0],
        [['b', 6.4], 1],
        [['c', 6.1], 2]
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

    async.groupBySeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '4': [4.4, 4],
        '6': [6.4]
      });
      assert.deepStrictEqual(order, [4.4, 6.4, 4, 5]);
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
        async.groupBySeries(collection, iterator);
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.groupBySeries([1, 2, 3], function(item, callback) {
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
    async.groupBySeries(array, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.groupBySeries(object, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.groupBySeries(function() {}, groupByIterator(order), function(err, res) {
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
    async.groupBySeries(undefined, groupByIterator(order), function(err, res) {
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
    async.groupBySeries(null, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

});

parallel('#groupByLimit', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1.1, 5.9, 3.2, 3.9, 2.1];
    async.groupByLimit(collection, 2, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '1': [1.1],
        '3': [3.2, 3.9],
        '5': [5.9],
        '2': [2.1]
      });
      assert.deepStrictEqual(order, [1.1, 3.2, 5.9, 2.1, 3.9]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1.1, 5.9, 3.2, 3.9, 2.1];
    async.groupByLimit(collection, 2, groupByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '1': [1.1],
        '3': [3.2, 3.9],
        '5': [5.9],
        '2': [2.1]
      });
      assert.deepStrictEqual(order, [
        [1.1, 0],
        [3.2, 2],
        [5.9, 1],
        [2.1, 4],
        [3.9, 3]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 5.9,
      c: 3.2,
      d: 3.9,
      e: 2.1
    };
    async.groupByLimit(collection, 2, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '1': [1.1],
        '3': [3.2, 3.9],
        '5': [5.9],
        '2': [2.1]
      });
      assert.deepStrictEqual(order, [1.1, 3.2, 5.9, 2.1, 3.9]);
      done();
    });
  });

  it('should execute iterator by collection of object with key', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 5.9,
      c: 3.2,
      d: 3.9,
      e: 2.1
    };
    async.groupByLimit(collection, 2, groupByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '1': [1.1],
        '3': [3.2, 3.9],
        '5': [5.9],
        '2': [2.1]
      });
      assert.deepStrictEqual(order, [
        [1.1, 'a'],
        [3.2, 'c'],
        [5.9, 'b'],
        [2.1, 'e'],
        [3.9, 'd']
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(1.1);
    set.add(5.9);
    set.add(3.2);
    set.add(3.9);
    set.add(2.1);
    async.groupByLimit(set, 2, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '1': [1.1],
        '3': [3.2, 3.9],
        '5': [5.9],
        '2': [2.1]
      });
      assert.deepStrictEqual(order, [1.1, 3.2, 5.9, 2.1, 3.9]);
      done();
    });
  });

  it('should execute iterator to series by collection of Set with passing key', function(done) {
    var order = [];
    var set = new util.Set();
    set.add(1.1);
    set.add(5.9);
    set.add(3.2);
    set.add(3.9);
    set.add(2.1);
    async.groupByLimit(set, 2, groupByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '1': [1.1],
        '3': [3.2, 3.9],
        '5': [5.9],
        '2': [2.1]
      });
      assert.deepStrictEqual(order, [
        [1.1, 0],
        [3.2, 2],
        [5.9, 1],
        [2.1, 4],
        [3.9, 3]
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
      next();
    };
    async.groupByLimit(set, 2, iterator, function(err) {
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
      next();
    };
    async.groupByLimit(set, 2, iterator, function(err) {
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
    async.groupByLimit(set, 2, iterator, function(err) {
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
    map.set('a', 1.1);
    map.set('b', 5.9);
    map.set('c', 3.2);
    map.set('d', 3.9);
    map.set('e', 2.1);
    async.groupByLimit(map, 2, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '1': [['a',1.1]],
        '3': [['c', 3.2], ['d', 3.9]],
        '5': [['b', 5.9]],
        '2': [['e', 2.1]]
      });
      assert.deepStrictEqual(order, [
        ['a', 1.1],
        ['c', 3.2],
        ['b', 5.9],
        ['e', 2.1],
        ['d', 3.9]
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of Map with passing key', function(done) {
    var order = [];
    var map = new util.Map();
    map.set('a', 1.1);
    map.set('b', 5.9);
    map.set('c', 3.2);
    map.set('d', 3.9);
    map.set('e', 2.1);
    async.groupByLimit(map, 2, groupByIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '1': [['a',1.1]],
        '3': [['c', 3.2], ['d', 3.9]],
        '5': [['b', 5.9]],
        '2': [['e', 2.1]]
      });
      assert.deepStrictEqual(order, [
        [['a', 1.1], 0],
        [['c', 3.2], 2],
        [['b', 5.9], 1],
        [['e', 2.1], 4],
        [['d', 3.9], 3]
      ]);
      done();
    });
  });

  it('should execute on asynchronous', function(done) {

    var sync = true;
    var collection = [1.1, 5.9, 3.2, 3.9, 2.1];
    var iterator = function(value, next) {
      next(null, value);
    };
    async.groupByLimit(collection, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.strictEqual(sync, false);
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1.1, 5.9, 3.2, 3.9, 2.1];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 2.1, Math.floor(num));
      }, num * delay);
    };

    async.groupByLimit(collection, 2, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {
        '1': [1.1],
        '3': [3.2],
        '5': [5.9]
      });
      assert.deepStrictEqual(order, [1.1, 3.2, 5.9, 2.1]);
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
        async.groupByLimit(collection, 2, iterator);
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.groupByLimit([1, 2, 3], 2, function(item, callback) {
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
    async.groupByLimit(array, 2, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.groupByLimit(object, 2, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.groupByLimit(function() {}, 2, groupByIterator(order), function(err, res) {
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
    async.groupByLimit(undefined, 2, groupByIterator(order), function(err, res) {
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
    async.groupByLimit(null, 2, groupByIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
      assert.deepStrictEqual(order, []);
      done();
    });
  });

});
