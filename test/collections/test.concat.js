/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var config = require('../config');
var async = global.async || require('../../');
var delay = config.delay;
var util = require('../util');

function concatIterator(order) {

  return function(value, callback) {

    var self = this;
    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(value);
      var array = [];

      while (num > 0) {
        array.push(num--);
      }
      callback(null, array);
    }, num * delay);
  };
}

function concatIteratorWithKey(order) {

  return function(value, key, callback) {

    var self = this;
    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push([value, key]);
      var array = [];

      while (num > 0) {
        array.push(num--);
      }
      callback(null, array);
    }, num * delay);
  };
}

parallel('#concat', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.concat(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
      assert.deepStrictEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.concat(collection, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
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
    async.concat(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
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
    async.concat(collection, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
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
    async.concat(set, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
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
    async.concat(set, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
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
    async.concat(set, iterator, function(err) {
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
    async.concat(set, iterator, function(err) {
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
    async.concat(map, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
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
    async.concat(map, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
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
      a: 1.5,
      b: 3.5,
      c: 2.5
    };

    async.concat(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1.5, 0.5, 3.5, 2.5, 1.5, 0.5, 2.5, 1.5, 0.5]);
      assert.deepStrictEqual(order, [1.5, 2.5, 3.5]);
      done();
    }, Math);
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
    async.concat(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 2]);
      assert.deepStrictEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = {};
    async.concat(array, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should execute with an array of falthy', function(done) {

    var array = [null, undefined, 0, ''];
    async.concat(array, function(value, done) {
      done(null, value);
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, array);
      done();
    });
  });

  it('should return an empty array if iterator does not pass the second argument', function(done) {

    var array = [1, 2, 3];
    async.concat(array, function(value, done) {
      done();
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      done();
    });
  });

  it('should return an array of undefined if iterator passes the second argument', function(done) {

    var array = [1, 2, 3];
    async.concat(array, function(value, done) {
      done(null, undefined);
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [undefined, undefined, undefined]);
      done();
    });
  });

  it('should pass multiple arguments', function(done) {

    async.concat([1], function(value, done) {
      done(null, 1, 2, 3);
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3]);
      done();
    });
  });

  it('should not pass undefined if the second argument is empty', function(done) {

    async.concat([1, 2], function(value, done) {
      done();
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      done();
    });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.concat([1, 2], function(item, callback) {
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

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = [];
    async.concat(object, concatIterator(order), function(err, res) {
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
    async.concat(function() {}, concatIterator(order), function(err, res) {
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
    async.concat(undefined, concatIterator(order), function(err, res) {
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
    async.concat(null, concatIterator(order), function(err, res) {
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

parallel('#concatSeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.concatSeries(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
      assert.deepStrictEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.concatSeries(collection, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
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
    async.concatSeries(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
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
    async.concatSeries(collection, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
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
    async.concatSeries(set, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
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
    async.concatSeries(set, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
      assert.deepStrictEqual(order, [
        [1, 0],
        [3, 1],
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
      next();
    };
    async.concatSeries(set, iterator, function(err) {
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
    async.concatSeries(set, iterator, function(err) {
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
    async.concatSeries(map, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
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
    async.concatSeries(map, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
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
      a: 1.5,
      b: 3.5,
      c: 2.5
    };

    async.concatSeries(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1.5, 0.5, 3.5, 2.5, 1.5, 0.5, 2.5, 1.5, 0.5]);
      assert.deepStrictEqual(order, [1.5, 3.5, 2.5]);
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
      callback(null, n);
    };
    async.concatSeries(collection, iterator, function(err, result) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepStrictEqual(result, [1, 3, 2]);
      done();
    });
    sync = false;
  });

  it('should execute with an array of falthy', function(done) {

    var array = [null, undefined, 0, ''];
    async.concatSeries(array, function(value, done) {
      done(null, value);
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, array);
      done();
    });
  });

  it('should return an empty array if iterator does not pass the second argument', function(done) {

    var array = [1, 2, 3];
    async.concatSeries(array, function(value, done) {
      done();
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      done();
    });
  });

  it('should return an array of undefined if iterator passes the second argument', function(done) {

    var array = [1, 2, 3];
    async.concatSeries(array, function(value, done) {
      done(null, undefined);
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [undefined, undefined, undefined]);
      done();
    });
  });

  it('should pass multiple arguments', function(done) {

    async.concatSeries([1], function(value, done) {
      done(null, 1, 2, 3);
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3]);
      done();
    });
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
    async.concatSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3]);
      assert.deepStrictEqual(order, [1, 3]);
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
        async.concatSeries(collection, iterator);
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.concat([1, 2], function(item, callback) {
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
    var array = {};
    async.concatSeries(array, concatIterator(order), function(err, res) {
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
    var object = [];
    async.concatSeries(object, concatIterator(order), function(err, res) {
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
    async.concatSeries(function() {}, concatIterator(order), function(err, res) {
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
    async.concatSeries(undefined, concatIterator(order), function(err, res) {
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
    async.concatSeries(null, concatIterator(order), function(err, res) {
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

parallel('#concatLimit', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 5, 3, 4, 2];
    async.concatLimit(collection, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 5, 4, 3, 2, 1, 3, 2, 1, 4, 3, 2, 1, 2, 1]);
      assert.deepStrictEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 5, 3, 4, 2];
    async.concatLimit(collection, 2, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 5, 4, 3, 2, 1, 3, 2, 1, 4, 3, 2, 1, 2, 1]);
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

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 4,
      e: 2
    };
    async.concatLimit(collection, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 5, 4, 3, 2, 1, 3, 2, 1, 4, 3, 2, 1, 2, 1]);
      assert.deepStrictEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 1,
      b: 5,
      c: 3,
      d: 4,
      e: 2
    };
    async.concatLimit(collection, 2, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 5, 4, 3, 2, 1, 3, 2, 1, 4, 3, 2, 1, 2, 1]);
      assert.deepStrictEqual(order, [
        [1, 'a'],
        [3, 'c'],
        [5, 'b'],
        [2, 'e'],
        [4, 'd']
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
    async.concatLimit(set, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 5, 4, 3, 2, 1, 3, 2, 1, 4, 3, 2, 1, 2, 1]);
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
    async.concatLimit(set, 2, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 5, 4, 3, 2, 1, 3, 2, 1, 4, 3, 2, 1, 2, 1]);
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
    var iterator = function(value, next) {
      order.push(value);
      set.delete(value + 1);
      next();
    };
    async.concatLimit(set, 2, iterator, function(err) {
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
    async.concatLimit(set, 2, iterator, function(err) {
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
    async.concatLimit(set, 2, iterator, function(err) {
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
    async.concatLimit(map, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 5, 4, 3, 2, 1, 3, 2, 1, 4, 3, 2, 1, 2, 1]);
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
    async.concatLimit(map, 2, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 5, 4, 3, 2, 1, 3, 2, 1, 4, 3, 2, 1, 2, 1]);
      assert.deepStrictEqual(order, [
        [ ['a', 1], 0],
        [ ['c', 3], 2],
        [ ['b', 5], 1],
        [ ['e', 2], 4],
        [ ['d', 4], 3]
      ]);
      done();
    });
  });

  it('should execute iterator without binding', function(done) {

    var order = [];
    var collection = {
      a: 1.5,
      b: 3.5,
      c: 2.5
    };

    async.concatLimit(collection, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1.5, 0.5, 3.5, 2.5, 1.5, 0.5, 2.5, 1.5, 0.5]);
      assert.deepStrictEqual(order, [1.5, 3.5, 2.5]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.concatLimit(collection, Infinity, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 3, 2, 1, 2, 1]);
      assert.deepStrictEqual(order, [1, 2, 3]);
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
      callback(null, n);
    };
    async.concatLimit(collection, 2, iterator, function(err, result) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.deepStrictEqual(result, [1, 3, 2, 4, 5]);
      done();
    });
    sync = false;
  });

  it('should execute with an array of falthy', function(done) {

    var array = [null, undefined, 0, ''];
    async.concatLimit(array, 2, function(value, done) {
      done(null, value);
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, array);
      done();
    });
  });

  it('should return an empty array if iterator does not pass the second argument', function(done) {

    var array = [1, 2, 3];
    async.concatLimit(array, 2, function(value, done) {
      done();
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, []);
      done();
    });
  });

  it('should return an array of undefined if iterator passes the second argument', function(done) {

    var array = [1, 2, 3];
    async.concatLimit(array, 2, function(value, done) {
      done(null, undefined);
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [undefined, undefined, undefined]);
      done();
    });
  });

  it('should pass multiple arguments', function(done) {

    async.concatLimit([1], 2, function(value, done) {
      done(null, 1, 2, 3);
    }, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 2, 3]);
      done();
    });
  });


  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4, 5];
    var iterator = function(num, callback) {
      setTimeout(function() {
        order.push(num);
        callback(num === 3, num);
      }, num * delay);
    };
    async.concatLimit(collection, 5, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, [1, 2]);
      assert.deepStrictEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.concatLimit([1, 2], 2, function(item, callback) {
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
    var array = {};
    async.concatLimit(array, 2, concatIterator(order), function(err, res) {
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
    var object = [];
    async.concatLimit(object, 2, concatIterator(order), function(err, res) {
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
    async.concatLimit(function() {}, 2, concatIterator(order), function(err, res) {
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
    async.concatLimit(undefined, 2, concatIterator(order), function(err, res) {
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
    async.concatLimit(null, 2, concatIterator(order), function(err, res) {
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
    async.concatLimit(collection, 0, concatIterator(order), function(err, res) {
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
    async.concatLimit(collection, undefined, concatIterator(order), function(err, res) {
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
