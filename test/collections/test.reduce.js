/* global it */
'use strict';

var assert = require('assert');
var domain = require('domain');

var _ = require('lodash');
var parallel = require('mocha.parallel');

var async = global.async || require('../../');
var delay = require('../config').delay;
var util = require('../util');

function reduceIterator(order) {

  return function(memo, value, callback) {

    var self = this;
    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      if (_.isArray(memo)) {
        memo.push(value);
      } else if (_.isNumber(memo)) {
        memo += num;
      } else {
        memo[num] = value;
      }
      order.push(value);
      callback(null, memo);
    }, num * delay);
  };
}

function reduceIteratorWithKey(order) {

  return function(memo, value, key, callback) {

    var self = this;
    var num = _.isArray(value) ? _.last(value) : value;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      if (_.isArray(memo)) {
        memo.push(value);
      } else if (_.isNumber(memo)) {
        memo += num;
      } else {
        memo[num] = value;
      }
      order.push([value, key]);
      callback(null, memo);
    }, num * delay);
  };
}

parallel('#reduce', function() {

  it('should sum number by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.reduce(collection, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 10);
      assert.deepStrictEqual(order, [1, 3, 2, 4]);
      done();
    });
  });

  it('should get array by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.reduce(collection, [], reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [1, 3, 2, 4]);
      assert.deepStrictEqual(order, [1, 3, 2, 4]);
      done();
    });
  });

  it('should sum number by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.reduce(collection, 0, reduceIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 10);
      assert.deepStrictEqual(order, [
        [1, 0],
        [3, 1],
        [2, 2],
        [4, 3]
      ]);
      done();
    });
  });

  it('should get object by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.reduce(collection, {}, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        2: 2,
        3: 3,
        5: 5
      });
      assert.deepStrictEqual(order, [5, 3, 2]);
      done();
    });
  });

  it('should get object by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.reduce(collection, {}, reduceIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        2: 2,
        3: 3,
        5: 5
      });
      assert.deepStrictEqual(order, [
        [5, 'a'],
        [3, 'b'],
        [2, 'c']
      ]);
      done();
    });
  });

  it('should get object by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(5);
    set.add(3);
    set.add(2);
    async.reduce(set, {}, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        2: 2,
        3: 3,
        5: 5
      });
      assert.deepStrictEqual(order, [5, 3, 2]);
      done();
    });
  });

  it('should get object by collection of Set with passing key', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(5);
    set.add(3);
    set.add(2);
    async.reduce(set, {}, reduceIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        2: 2,
        3: 3,
        5: 5
      });
      assert.deepStrictEqual(order, [
        [5, 0],
        [3, 1],
        [2, 2]
      ]);
      done();
    });
  });

  it('should get object by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 5);
    map.set('b', 3);
    map.set('c', 2);
    async.reduce(map, {}, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        2: ['c', 2],
        3: ['b', 3],
        5: ['a', 5]
      });
      assert.deepStrictEqual(order, [
        ['a', 5],
        ['b', 3],
        ['c', 2]
      ]);
      done();
    });
  });

  it('should get object by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 5);
    map.set('b', 3);
    map.set('c', 2);
    async.reduce(map, {}, reduceIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        2: ['c', 2],
        3: ['b', 3],
        5: ['a', 5]
      });
      assert.deepStrictEqual(order, [
        [['a', 5], 0],
        [['b', 3], 1],
        [['c', 2], 2]
      ]);
      done();
    });
  });

  it('should execute iterator to series with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.reduce(collection, {}, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        '1.1': 1.1,
        '2.6': 2.6,
        '3.5': 3.5
      });
      assert.deepStrictEqual(order, [1.1, 3.5, 2.6]);
      done();
    }, Math);
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
    var iterator = function(memo, num, key, callback) {
      callback(null, memo + num);
    };
    async.reduce(collection, 0, iterator, function(err, sum) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(sum, 15);
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(memo, num, callback) {
      setTimeout(function() {
        memo.push(num);
        order.push(num);
        callback(num === 3, memo);
      }, num * delay);
    };
    async.reduce(collection, [], iterator, function(err, res) {
      assert.ok(err);
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
        var iterator = function(memo, num, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.reduce(collection, [], iterator);
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.reduce([1, 2, 3], 0, function(memo, item, callback) {
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
    async.reduce(array, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.reduce(object, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.reduce(function() {}, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.reduce(undefined, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.reduce(null, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should work with generator', function(done) {
    var order = [];
    var collection = [1, 3, 2, 4];
    var gen = util.makeGenerator(collection);

    async.reduce(
      gen,
      0,
      reduceIterator(order),
      function(err, res) {
        if (err) {
          return done(err);
        }
        assert.deepStrictEqual(res, 10);
        done();
      }
    );
  });
});

parallel('#reduceRight', function() {

  it('should sum number by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.reduceRight(collection, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 10);
      assert.deepStrictEqual(order, [4, 2, 3, 1]);
      done();
    });
  });

  it('should get array by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.reduceRight(collection, [], reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [4, 2, 3, 1]);
      assert.deepStrictEqual(order, [4, 2, 3, 1]);
      done();
    });
  });

  it('should sum number by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.reduceRight(collection, 0, reduceIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 10);
      assert.deepStrictEqual(order, [
        [4, 3],
        [2, 2],
        [3, 1],
        [1, 0]
      ]);
      done();
    });
  });

  it('should get object by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.reduceRight(collection, {}, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        2: 2,
        3: 3,
        5: 5
      });
      assert.deepStrictEqual(order, [2, 3, 5]);
      done();
    });
  });

  it('should get object by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.reduceRight(collection, {}, reduceIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        2: 2,
        3: 3,
        5: 5
      });
      assert.deepStrictEqual(order, [
        [2, 'c'],
        [3, 'b'],
        [5, 'a']
      ]);
      done();
    });
  });

  it('should get object by collection of Set', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(5);
    set.add(3);
    set.add(2);
    async.reduceRight(set, {}, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        2: 2,
        3: 3,
        5: 5
      });
      assert.deepStrictEqual(order, [2, 3, 5]);
      done();
    });
  });

  it('should get object by collection of Set with passing key', function(done) {

    var order = [];
    var set = new util.Set();
    set.add(5);
    set.add(3);
    set.add(2);
    async.reduceRight(set, {}, reduceIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        2: 2,
        3: 3,
        5: 5
      });
      assert.deepStrictEqual(order, [
        [2, 2],
        [3, 1],
        [5, 0]
      ]);
      done();
    });
  });

  it('should get object by collection of Map', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 5);
    map.set('b', 3);
    map.set('c', 2);
    async.reduceRight(map, {}, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        2: ['c', 2],
        3: ['b', 3],
        5: ['a', 5]
      });
      assert.deepStrictEqual(order, [
        ['c', 2],
        ['b', 3],
        ['a', 5]
      ]);
      done();
    });
  });

  it('should get object by collection of Map with passing key', function(done) {

    var order = [];
    var map = new util.Map();
    map.set('a', 5);
    map.set('b', 3);
    map.set('c', 2);
    async.reduceRight(map, {}, reduceIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, {
        2: ['c', 2],
        3: ['b', 3],
        5: ['a', 5]
      });
      assert.deepStrictEqual(order, [
        [['c', 2], 2],
        [['b', 3], 1],
        [['a', 5], 0]
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

    async.reduceRight(collection, [], reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepStrictEqual(res, [2.6, 3.5, 1.1]);
      assert.deepStrictEqual(order, [2.6, 3.5, 1.1]);
      done();
    }, Math);
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
    var iterator = function(memo, num, key, callback) {
      callback(null, memo + num);
    };
    async.reduceRight(collection, 0, iterator, function(err, sum) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(sync, false);
      assert.strictEqual(sum, 15);
      done();
    });
    sync = false;
  });

  it('should throw error', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    var iterator = function(memo, num, callback) {
      setTimeout(function() {
        memo.push(num);
        order.push(num);
        callback(num === 3, memo);
      }, num * delay);
    };
    async.reduceRight(collection, [], iterator, function(err, res) {
      assert.ok(err);
      assert.deepStrictEqual(res, [4, 2, 3]);
      assert.deepStrictEqual(order, [4, 2, 3]);
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
        var iterator = function(memo, num, callback) {
          process.nextTick(callback);
          process.nextTick(callback);
        };
        async.reduceRight(collection, [], iterator);
      });
  });

  it('should avoid double callback', function(done) {

    var called = false;
    async.reduceRight([1, 2, 3], 0, function(memo, item, callback) {
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
    async.reduceRight(array, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if object is empty', function(done) {

    var order = [];
    var object = {};
    async.reduceRight(object, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.reduceRight(function() {}, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.reduceRight(undefined, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepStrictEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.reduceRight(null, 0, reduceIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(res, 0);
      assert.deepStrictEqual(order, []);
      done();
    });
  });
});
