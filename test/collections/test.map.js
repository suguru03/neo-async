/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function mapIterator(order) {
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

function mapIteratorWithKey(order) {
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

parallel('#map', function() {
  it('should execute iterator by collection of array', function(done) {
    var order = [];
    var collection = [1, 3, 2];
    async.map(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
      assert.deepStrictEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {
    var order = [];
    var collection = [1, 3, 2];
    async.map(collection, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
      assert.deepStrictEqual(order, [[1, 0], [2, 2], [3, 1]]);
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
    async.map(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
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
    async.map(collection, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
      assert.deepStrictEqual(order, [[1, 'a'], [2, 'c'], [3, 'b']]);
      done();
    });
  });

  it('should execute iterator by collection of Set', function(done) {
    var order = [];
    var set = new util.Set();
    set.add(1);
    set.add(3);
    set.add(2);
    async.map(set, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
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
    async.map(set, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
      assert.deepStrictEqual(order, [[1, 0], [2, 2], [3, 1]]);
      done();
    });
  });

  it('should work properly even if elements are added in callback', function(done) {
    var order = [];
    var arr = [1, 3, 2];
    var set = new util.Set(arr);
    var iterator = function(value, next) {
      order.push(value);
      next(null, value);
    };
    async.map(set, iterator, function(err, res) {
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

  it('shoult work even if the size is decreased', function(done) {
    var order = [];
    var set = new util.Set([1, 2, 3, 4]);
    var iterator = function(value, next) {
      order.push(value);
      set.delete(value + 1);
      next(null, value);
    };
    async.map(set, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [1, 3]);
      assert.deepStrictEqual(res, [1, 3]);
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
      next(null, value);
    };
    async.map(set, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3, 4, 5, 6, 7]);
      assert.deepStrictEqual(order, [1, 2, 3, 4, 5, 6, 7]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {
    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 3);
    collection.set('c', 2);
    async.map(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
      assert.deepStrictEqual(order, [['a', 1], ['c', 2], ['b', 3]]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {
    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 3);
    collection.set('c', 2);
    async.map(collection, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
      assert.deepStrictEqual(order, [[['a', 1], 0], [['c', 2], 2], [['b', 3], 1]]);
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

    async.map(
      collection,
      mapIterator(order),
      function(err, res) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
        assert.deepStrictEqual(res, [2.2, 7, 5.4]);
        assert.deepStrictEqual(order, [1.1, 2.7, 3.5]);
        done();
      },
      Math
    );
  });

  it('should throw error', function(done) {
    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * delay);
    };

    async.map(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, undefined, 2, undefined]);
      assert.deepStrictEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {
    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 2);
      done();
    }, delay);

    domain
      .create()
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
        async.map(collection, iterator);
      });
  });

  it('should avoid double callback', function(done) {
    var called = {
      iterator: false,
      callback: false
    };
    async.map(
      [1, 2],
      function(item, callback) {
        try {
          callback(item);
        } catch (exception) {
          try {
            callback(exception);
          } catch (e) {
            assert.ok(e);
            assert.strictEqual(called.iterator, false);
            util.errorChecker(e);
            called.iterator = true;
          }
        }
      },
      function(err) {
        assert.ok(err);
        assert.strictEqual(called.callback, false);
        called.callback = true;
        async.nothing();
      }
    );
    setTimeout(done, delay);
  });

  it('should return response immediately if array is empty', function(done) {
    var order = [];
    var array = [];
    async.map(array, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {
    var order = [];
    var object = {};
    async.map(object, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {
    var order = [];
    async.map(function() {}, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {
    var order = [];
    async.map(undefined, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {
    var order = [];
    async.map(null, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });
});

parallel('#mapSeries', function() {
  it('should execute iterator to series by collection of array', function(done) {
    var order = [];
    var collection = [1, 3, 2];
    async.mapSeries(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
      assert.deepStrictEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator to series by collection of array with passing index', function(done) {
    var order = [];
    var collection = [1, 3, 2];
    async.mapSeries(collection, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
      assert.deepStrictEqual(order, [[1, 0], [3, 1], [2, 2]]);
      done();
    });
  });

  it('should execute iterator to series by collection of object', function(done) {
    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.mapSeries(collection, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
      assert.deepStrictEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator to series by collection of object with passing key', function(done) {
    var order = [];
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    async.mapSeries(collection, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
      assert.deepStrictEqual(order, [[1, 'a'], [3, 'b'], [2, 'c']]);
      done();
    });
  });

  it('should execute iterator to series by collection of Set', function(done) {
    var order = [];
    var set = new util.Set();
    set.add(1);
    set.add(3);
    set.add(2);
    async.mapSeries(set, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
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
    async.mapSeries(set, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
      assert.deepStrictEqual(order, [[1, 0], [3, 1], [2, 2]]);
      done();
    });
  });

  it('should work properly even if elements are added in callback', function(done) {
    var order = [];
    var arr = [1, 3, 2];
    var set = new util.Set(arr);
    var iterator = function(value, next) {
      order.push(value);
      next(null, value);
    };
    async.mapSeries(set, iterator, function(err, res) {
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

  it('shoult work even if the size is decreased', function(done) {
    var order = [];
    var set = new util.Set([1, 2, 3, 4]);
    var iterator = function(value, next) {
      order.push(value);
      set.delete(value + 1);
      next(null, value);
    };
    async.mapSeries(set, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [1, 3]);
      assert.deepStrictEqual(res, [1, 3]);
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
      next(null, value);
    };
    async.mapSeries(set, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3, 4, 5, 6, 7]);
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
    async.mapSeries(map, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
      assert.deepStrictEqual(order, [['a', 1], ['b', 3], ['c', 2]]);
      done();
    });
  });

  it('should execute iterator to series by collection of Map with passing key', function(done) {
    var order = [];
    var map = new util.Map();
    map.set('a', 1);
    map.set('b', 3);
    map.set('c', 2);
    async.mapSeries(map, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 4]);
      assert.deepStrictEqual(order, [[['a', 1], 0], [['b', 3], 1], [['c', 2], 2]]);
      done();
    });
  });

  it('should execute iterator to series without binding', function(done) {
    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.7
    };
    async.mapSeries(
      collection,
      mapIterator(order),
      function(err, res) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
        assert.deepStrictEqual(res, [2.2, 7, 5.4]);
        assert.deepStrictEqual(order, [1.1, 3.5, 2.7]);
        done();
      },
      Math
    );
  });

  it('should execute on asynchronous', function(done) {
    var sync = true;
    var collection = {
      a: 1,
      b: 3,
      c: 2
    };
    var iterator = function(n, callback) {
      callback(null, n);
    };
    async.mapSeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2]);
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {
    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * delay);
    };

    async.mapSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, undefined, undefined, undefined]);
      assert.deepStrictEqual(order, [1, 3]);
      done();
    });
  });

  it('should throw error if double callback', function(done) {
    var errorCallCount = 0;
    setTimeout(function() {
      assert.strictEqual(errorCallCount, 2);
      done();
    }, delay);

    domain
      .create()
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
        async.mapSeries(collection, iterator);
      });
  });

  it('should avoid double callback', function(done) {
    var called = false;
    async.mapSeries(
      [1, 2],
      function(item, callback) {
        try {
          callback(item);
        } catch (exception) {
          try {
            callback(exception);
          } catch (e) {
            assert.ok(e);
            util.errorChecker(e);
            done();
          }
        }
      },
      function(err) {
        assert.ok(err);
        assert.strictEqual(called, false);
        called = true;
        async.nothing();
      }
    );
  });

  it('should return response immediately if array is empty', function(done) {
    var order = [];
    var array = [];
    async.mapSeries(array, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {
    var order = [];
    var object = {};
    async.mapSeries(object, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {
    var order = [];
    async.mapSeries(function() {}, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {
    var order = [];
    async.mapSeries(undefined, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {
    var order = [];
    async.mapSeries(null, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });
});

parallel('#mapLimit', function() {
  it('should execute iterator in limited by collection of array', function(done) {
    var order = [];
    var collection = [1, 5, 3, 4, 2];

    async.mapLimit(collection, 2, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 10, 6, 8, 4]);
      assert.deepStrictEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index', function(done) {
    var order = [];
    var collection = [1, 5, 3, 4, 2];

    async.mapLimit(collection, 2, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 10, 6, 8, 4]);
      assert.deepStrictEqual(order, [[1, 0], [3, 2], [5, 1], [2, 4], [4, 3]]);
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
    async.mapLimit(set, 2, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 10, 6, 8, 4]);
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
    async.mapLimit(set, 2, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 10, 6, 8, 4]);
      assert.deepStrictEqual(order, [[1, 0], [3, 2], [5, 1], [2, 4], [4, 3]]);
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
    async.mapLimit(set, 2, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(order, [1, 2, 3, 4, 5, 6, 7]);
      done();
    });
  });

  it('should work with odd number of elements even if the size is decreased', function(done) {
    var called = 0;
    var order = [];
    var set = new util.Set([1, 2, 3, 4, 5]);
    var iterator = function(value, index, next) {
      order.push([index, value]);
      set.delete(value + 1);
      next();
    };
    async.mapLimit(set, 2, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(++called, 1);
      assert.deepStrictEqual(order, [[0, 1], [1, 3], [2, 5]]);
      done();
    });
  });

  it('should work with even number of elements even if the size is decreased', function(done) {
    var called = 0;
    var order = [];
    var set = new util.Set([1, 2, 3, 4, 5, 6]);
    var iterator = function(value, index, next) {
      order.push([index, value]);
      set.delete(value + 1);
      next();
    };
    async.mapLimit(set, 2, iterator, function(err) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(++called, 1);
      assert.deepStrictEqual(order, [[0, 1], [1, 3], [2, 5]]);
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
    async.mapLimit(map, 2, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 10, 6, 8, 4]);
      assert.deepStrictEqual(order, [['a', 1], ['c', 3], ['b', 5], ['e', 2], ['d', 4]]);
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
    async.mapLimit(map, 2, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 10, 6, 8, 4]);
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

  it('should execute iterator in limited by collection of object', function(done) {
    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 4,
      e: 2
    };
    async.mapLimit(collection, 2, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 10, 6, 8, 4]);
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
      d: 4,
      e: 2
    };
    async.mapLimit(collection, 2, mapIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 10, 6, 8, 4]);
      assert.deepStrictEqual(order, [[1, 'a'], [3, 'c'], [5, 'b'], [2, 'e'], [4, 'd']]);
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

    async.mapLimit(
      collection,
      2,
      mapIterator(order),
      function(err, res) {
        if (err) {
          return done(err);
        }
        assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
        assert.deepStrictEqual(res, [2.2, 7, 5.4]);
        assert.deepStrictEqual(order, [1.1, 3.5, 2.7]);
        done();
      },
      Math
    );
  });

  it('should execute like parallel if limit is Infinity', function(done) {
    var order = [];
    var collection = [1, 3, 4, 2, 3];

    async.mapLimit(collection, Infinity, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [2, 6, 8, 4, 6]);
      assert.deepStrictEqual(order, [1, 2, 3, 3, 4]);
      done();
    });
  });

  it('should execute on asynchronous', function(done) {
    var sync = true;
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 4,
      e: 2
    };
    var iterator = function(n, callback) {
      callback(null, n);
    };
    async.mapLimit(collection, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 5, 3, 4, 2]);
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {
    var order = [];
    var collection = [1, 3, 5, 2, 4, 2];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * delay);
    };

    async.mapLimit(collection, 4, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, undefined, undefined, 2, undefined, undefined]);
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

    domain
      .create()
      .on('error', util.errorChecker)
      .on('error', function() {
        errorCallCount++;
      })
      .run(function() {
        var collection = [1, 3, 2];
        var iterator = function(num, callback) {
          process.nextTick(function() {
            callback(null, num);
          });
          process.nextTick(function() {
            callback(null, num);
          });
        };
        async.mapLimit(collection, 2, iterator);
      });
  });

  it('should avoid double callback', function(done) {
    var called = false;
    async.mapLimit(
      [1, 2],
      2,
      function(item, callback) {
        try {
          callback(item);
        } catch (exception) {
          try {
            callback(exception);
          } catch (e) {
            assert.ok(e);
            util.errorChecker(e);
            done();
          }
        }
      },
      function(err) {
        assert.ok(err);
        assert.strictEqual(called, false);
        called = true;
        async.nothing();
      }
    );
  });

  it('should return response immediately if array is empty', function(done) {
    var order = [];
    var array = [];
    async.mapLimit(array, 3, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {
    var order = [];
    var object = {};
    async.mapLimit(object, 2, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {
    var order = [];
    async.mapLimit(function() {}, 3, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {
    var order = [];
    async.mapLimit(undefined, 3, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {
    var order = [];
    async.mapLimit(null, 3, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {
    var order = [];
    var collection = [1, 3, 2];
    async.mapLimit(collection, 0, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {
    var order = [];
    var collection = [1, 3, 2];
    async.mapLimit(collection, undefined, mapIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  /**
   * @see https://github.com/suguru03/neo-async/issues/69
   */
  it('should work with generator', function(done) {
    var limit = 2;
    var collection = ['abc', 'def', 'ghi', 'jkl'];
    var gen = util.makeGenerator(collection);

    async.mapLimit(
      gen,
      limit,
      function(v, cb) {
        setTimeout(cb, Math.random() * delay, null, v);
      },
      function(err, res) {
        if (err) {
          return done(err);
        }
        assert.deepStrictEqual(res, collection);
        done();
      }
    );
  });
});
