/* global it */
'use strict';

var assert = require('assert');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function someIterator(order) {

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

function someIteratorWithKey(order) {

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

parallel('#some', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.some(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [1]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.some(collection, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
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
    async.some(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
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
    async.some(collection, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
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
    async.some(set, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
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
    async.some(set, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [
        [2, 2],
        [3, 1]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 5);
    map.set('b', 3);
    map.set('c', 2);
    async.some(map, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
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
    async.some(map, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [
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
      c: 2.6
    };

    async.some(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [1.1]);
      done();
    }, Math);
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.some([], someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.some([1, 2, 3], function(item, callback) {
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
    async.some(function() {}, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.some(undefined, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.some(null, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return an error', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(value, key, callback) {
      callback('error');
    };
    async.some(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      done();
    });
  });

});

parallel('#someSeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.someSeries(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [1]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.someSeries(collection, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
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
    async.someSeries(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [5]);
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
    async.someSeries(collection, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [
        [5, 'a']
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
    async.someSeries(set, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [4, 3]);
      done();
    });
  });

  it('should execute iterator by collection of Set with passing key', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(4);
    set.add(3);
    set.add(2);
    async.someSeries(set, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [
        [4, 0],
        [3, 1]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 4);
    map.set('b', 3);
    map.set('c', 2);
    async.someSeries(map, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [
        ['a', 4],
        ['b', 3]
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
    async.someSeries(map, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [
        [['a', 4], 0],
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
      c: 2.6
    };

    async.someSeries(collection, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
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
    async.someSeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(res, true);
      done();
    });
    sync = false;
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.someSeries([1, 2, 3], function(item, callback) {
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

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.someSeries([], someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.someSeries(function() {}, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.someSeries(undefined, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.someSeries(null, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return an error', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(value, key, callback) {
      callback('error');
    };
    async.someSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      done();
    });
  });

});

parallel('#someLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [2, 4, 3, 2];

    async.someLimit(collection, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [2, 4, 3]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index', function(done) {

    var order = [];
    var collection = [2, 4, 3, 2];

    async.someLimit(collection, 2, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
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
    async.someLimit(collection, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
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
    async.someLimit(collection, 2, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
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
    async.someLimit(set, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
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
    async.someLimit(set, 2, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [
        [2, 0],
        [4, 1],
        [3, 2]
      ]);
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
    async.someLimit(map, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
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
    async.someLimit(map, 2, someIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [
        [['a', 2], 0],
        [['b', 4], 1],
        [['c', 3], 2]
      ]);
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

    async.someLimit(collection, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
      assert.deepStrictEqual(order, [1.1]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [2, 3, 1];

    async.someLimit(collection, Infinity, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, true);
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
    async.someLimit(collection, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(res, true);
      done();
    });
    sync = false;
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.someLimit([1, 2, 3], 2, function(item, callback) {
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

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.someLimit([], 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.someLimit(function() {}, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.someLimit(undefined, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.someLimit(null, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.someLimit(collection, 0, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.someLimit(collection, undefined, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, false);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return an error', function(done) {

    var collection = [1, 3, 2, 4];
    var iterator = function(value, key, callback) {
      callback('error');
    };
    async.someLimit(collection, 2, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(res, undefined);
      done();
    });
  });

  it('should stop execution', function(done) {

    var order = [];
    var collection = [2, 1, 3];
    async.someLimit(collection, 2, someIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      order.push('callback');
      assert.strictEqual(res, true);
    });
    setTimeout(function() {
      assert.deepStrictEqual(order, [1, 'callback', 2]);
      done();
    }, 10 * delay);
  });

});
