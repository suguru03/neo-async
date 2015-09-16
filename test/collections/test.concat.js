/* global it */
'use strict';

var domain = require('domain');

var assert = require('power-assert');
var parallel = require('mocha.parallel');

var config = require('../config');
var async = global.async || require('../../');
var delay = config.delay;
var util = require('../util');

function concatIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(num);
      var array = [];

      while (num > 0) {
        array.push(num--);
      }
      callback(null, array);
    }, num * delay);
  };
}

function concatIteratorWithKey(order) {

  return function(num, key, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push([num, key]);
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
      assert.deepEqual(res, [1, 2, 1, 3, 2, 1]);
      assert.deepEqual(order, [1, 2, 3]);
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
      assert.deepEqual(res, [1, 2, 1, 3, 2, 1]);
      assert.deepEqual(order, [
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
      assert.deepEqual(res, [1, 2, 1, 3, 2, 1]);
      assert.deepEqual(order, [1, 2, 3]);
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
      assert.deepEqual(res, [1, 2, 1, 3, 2, 1]);
      assert.deepEqual(order, [
        [1, 'a'],
        [2, 'c'],
        [3, 'b']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 3);
    collection.set('c', 2);
    async.concat(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 2, 1, 3, 2, 1]);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 3);
    collection.set('c', 2);
    async.concat(collection, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 2, 1, 3, 2, 1]);
      assert.deepEqual(order, [
        [1, 'a'],
        [2, 'c'],
        [3, 'b']
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
      assert.deepEqual(res, [1.5, 0.5, 2.5, 1.5, 0.5, 3.5, 2.5, 1.5, 0.5]);
      assert.deepEqual(order, [1.5, 2.5, 3.5]);
      done();
    }, Math);
  });

  it('should not concatenate with the result if iterator get the falsy value', function(done) {

    var collection = [2, 1, 3];
    var iterator = function(n, callback) {
      callback(null, 0);
    };
    async.concat(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
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
    async.concat(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 2, 3]);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, [1, 3, 2, 1, 2, 1]);
      assert.deepEqual(order, [1, 3, 2]);
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
      assert.deepEqual(res, [1, 3, 2, 1, 2, 1]);
      assert.deepEqual(order, [
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
      assert.deepEqual(res, [1, 3, 2, 1, 2, 1]);
      assert.deepEqual(order, [1, 3, 2]);
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
      assert.deepEqual(res, [1, 3, 2, 1, 2, 1]);
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'b'],
        [2, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 3);
    collection.set('c', 2);
    async.concatSeries(collection, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3, 2, 1, 2, 1]);
      assert.deepEqual(order, [1, 3, 2]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 3);
    collection.set('c', 2);
    async.concatSeries(collection, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3, 2, 1, 2, 1]);
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'b'],
        [2, 'c']
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
      assert.deepEqual(res, [1.5, 0.5, 3.5, 2.5, 1.5, 0.5, 2.5, 1.5, 0.5]);
      assert.deepEqual(order, [1.5, 3.5, 2.5]);
      done();
    }, Math);
  });

  it('should not concatenate with the result if iterator get the falsy value', function(done) {

    var collection = [2, 1, 3];
    var iterator = function(n, callback) {
      callback(null, 0);
    };
    async.concatSeries(collection, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
      done();
    });
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
      assert.deepEqual(result, [1, 3, 2]);
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
    async.concatSeries(collection, iterator, function(err, res) {
      assert.ok(err);
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3]);
      assert.deepEqual(order, [1, 3]);
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

  it('should return response immediately if array is empty', function(done) {

    var order = [];
    var array = {};
    async.concatSeries(array, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, [1, 3, 2, 1, 5, 4, 3, 2, 1, 2, 1, 4, 3, 2, 1]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
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
      assert.deepEqual(res, [1, 3, 2, 1, 5, 4, 3, 2, 1, 2, 1, 4, 3, 2, 1]);
      assert.deepEqual(order, [
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
      assert.deepEqual(res, [1, 3, 2, 1, 5, 4, 3, 2, 1, 2, 1, 4, 3, 2, 1]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
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
      assert.deepEqual(res, [1, 3, 2, 1, 5, 4, 3, 2, 1, 2, 1, 4, 3, 2, 1]);
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'c'],
        [5, 'b'],
        [2, 'e'],
        [4, 'd']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of Map', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 5);
    collection.set('c', 3);
    collection.set('d', 4);
    collection.set('e', 2);
    async.concatLimit(collection, 2, concatIterator(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3, 2, 1, 5, 4, 3, 2, 1, 2, 1, 4, 3, 2, 1]);
      assert.deepEqual(order, [1, 3, 5, 2, 4]);
      done();
    });
  });

  it('should execute iterator by collection of Map with passing key', function(done) {

    var order = [];
    var collection = new util.Map();
    collection.set('a', 1);
    collection.set('b', 5);
    collection.set('c', 3);
    collection.set('d', 4);
    collection.set('e', 2);
    async.concatLimit(collection, 2, concatIteratorWithKey(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepEqual(res, [1, 3, 2, 1, 5, 4, 3, 2, 1, 2, 1, 4, 3, 2, 1]);
      assert.deepEqual(order, [
        [1, 'a'],
        [3, 'c'],
        [5, 'b'],
        [2, 'e'],
        [4, 'd']
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
      assert.deepEqual(res, [1.5, 0.5, 3.5, 2.5, 1.5, 0.5, 2.5, 1.5, 0.5]);
      assert.deepEqual(order, [1.5, 3.5, 2.5]);
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
      assert.deepEqual(res, [1, 2, 1, 3, 2, 1]);
      assert.deepEqual(order, [1, 2, 3]);
      done();
    });
  });

  it('should not concatenate with the result if iterator get the falsy value', function(done) {

    var collection = [2, 1, 3];
    var iterator = function(n, callback) {
      callback(null, 0);
    };
    async.concatLimit(collection, 2, iterator, function(err, res) {
      if (err) {
        return done(err);
      }
      assert.deepEqual(res, []);
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
      assert.deepEqual(result, [1, 3, 2, 4, 5]);
      done();
    });
    sync = false;
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
      assert.deepEqual(res, [1, 2, 3]);
      assert.deepEqual(order, [1, 2, 3]);
      done();
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
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
      assert.deepEqual(res, []);
      assert.deepEqual(order, []);
      done();
    });
  });

});
